import os
import logging
from flask import Flask, jsonify
from crawler import fetch_latest_ai_news
from analyzer import analyze_and_summarize
from publisher import publish_to_github, get_tw_now
from database import BigQueryManager
from dotenv import load_dotenv
import datetime

load_dotenv()

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Initialize BigQuery Manager
bq = BigQueryManager()
try:
    bq.init_db()
except Exception as e:
    logging.error(f"BigQuery initialization failed at startup: {e}.")

# Number of top AI-related items to feed the LLM each run
TOP_ITEMS_FOR_LLM = 5

# Keywords used to prioritise AI / data / application news for the LLM
_AI_PRIORITY_KW = [
    "ai", "artificial intelligence", "machine learning", "deep learning", "llm",
    "large language model", "gpt", "gemini", "claude", "generative", "neural",
    "data", "analytics", "automation", "algorithm", "model", "dataset",
    "benchmark", "inference", "transformer", "agent", "rag", "embedding",
    "multimodal", "openai", "deepmind", "anthropic", "foundation model",
    "數據", "人工智慧", "機器學習", "自動化", "模型", "分析",
]


@app.route("/", methods=["GET", "POST"])
def trigger_generation():
    """
    Endpoint triggered by Google Cloud Scheduler daily.
    Supports multiple articles per day — each triggered run produces one article
    with a unique slug: ai-news-{date}-{n}
    """
    logging.info("Starting AI News generation process...")
    tw_now = get_tw_now()
    date_str = tw_now.strftime("%Y-%m-%d")

    try:
        # ── Step 0a: Slug index (no daily cap — each trigger = 1 article) ───
        todays_count = bq.get_todays_article_count(date_str)
        article_index = todays_count + 1
        slug = f"ai-news-{date_str}-{article_index}"
        logging.info(f"Generating article #{article_index} today → slug: {slug}")

        # ── Step 0b: Load past topics → prevent topic repetition in LLM ────
        past_topics = []
        try:
            past_topics = bq.get_past_article_titles(days=21)
            logging.info(f"Step 0b: Loaded {len(past_topics)} past article titles")
        except Exception as e:
            logging.warning(f"Step 0b skipped (BQ unavailable): {e}")

        # ── Step 0c: Load already-crawled URLs → dedup in crawler ───────────
        used_urls = set()
        try:
            used_urls = bq.get_past_headline_urls(days=14)
            logging.info(f"Step 0c: Loaded {len(used_urls)} already-used URLs")
        except Exception as e:
            logging.warning(f"Step 0c skipped (BQ unavailable): {e}")

        # ── Step 1: Crawl (shuffled sources, URL + AI-keyword filter) ────────
        logging.info("Step 1: Fetching latest AI news...")
        raw_items = fetch_latest_ai_news(used_urls=used_urls)
        if not raw_items:
            return jsonify({"status": "error", "message": "Crawler failure: No fresh results found today."}), 500

        # ── Step 2: Save RAW headlines to BigQuery (deduped internally) ──────
        bq_raw_data = []
        for item in raw_items:
            bq_raw_data.append({
                "publish_date": date_str,
                "slug": slug,
                "source_domain": item.get("source", "Unknown"),
                "headline": item.get("title", "No Title"),
                "url": item.get("link", ""),
                "crawled_at": tw_now.isoformat(),
            })

        if bq_raw_data:
            try:
                bq.save_raw_headlines(bq_raw_data)
                logging.info(f"Step 2: Stored up to {len(bq_raw_data)} headlines to BQ.")
            except Exception as bqe:
                logging.warning(f"BQ Save Error (non-critical): {bqe}")

        # ── Step 1.5: Explicit AI / Data / Application priority filter ────────
        ai_first = [
            i for i in raw_items
            if any(kw in i.get("title", "").lower() for kw in _AI_PRIORITY_KW)
        ]
        ai_urls = {i["link"] for i in ai_first}
        non_ai   = [i for i in raw_items if i["link"] not in ai_urls]
        prioritized = ai_first + non_ai
        logging.info(
            f"Step 1.5: {len(ai_first)} AI/data items + {len(non_ai)} other "
            f"→ feeding top {TOP_ITEMS_FOR_LLM} to LLM"
        )

        # ── Step 3: AI Analysis ───────────────────────────────────────────────
        top_items = prioritized[:TOP_ITEMS_FOR_LLM]
        logging.info(f"Step 3: AI Generation Starting (slug={slug})...")
        raw_text_for_ai = ""
        for i in top_items:
            raw_text_for_ai += f"- {i['source']} ({i['link']}): {i['title']}\n"

        markdown_content, ai_metadata = analyze_and_summarize(
            raw_text_for_ai,
            past_topics=past_topics,
            current_date=date_str,
            slug=slug,
        )

        if not markdown_content or not ai_metadata:
            logging.error("AI Generation Critical Failure: Empty content returned.")
            return jsonify({"status": "error", "message": "AI Engine failed (Quota or Parsing). Check analyzer logs."}), 500

        logging.info("AI Analysis completed successfully.")

        # ── Step 4: Save metadata to BigQuery (slug-deduped internally) ──────
        try:
            bq_meta = {
                "publish_date": date_str,
                "slug": slug,
                "title": (
                    ai_metadata.get("title", {}).get("zh", f"[{date_str}] AI 趨勢分析")
                    if isinstance(ai_metadata.get("title"), dict)
                    else ai_metadata.get("title", "AI News")
                ),
                "description": str(ai_metadata.get("description", "")),
                "sentiment":   ai_metadata.get("sentiment"),
                "tags":        str(ai_metadata.get("tags", {})),
                "full_markdown": markdown_content,
            }
            inserted = bq.save_article_metadata(bq_meta)
            if inserted:
                logging.info(f"Step 4: Metadata saved to BQ for slug '{slug}'.")
            else:
                logging.warning(f"Step 4: Metadata for '{slug}' already existed — skipped BQ insert.")
        except Exception as bqe:
            logging.warning(f"BQ Meta Save Error (non-critical): {bqe}")

        # ── Step 5: GitHub Publishing ─────────────────────────────────────────
        logging.info(f"Step 5: Publishing '{slug}' to GitHub...")
        try:
            publish_to_github(markdown_content, slug=slug)
        except Exception as ghe:
            logging.error(f"GitHub Publish Error: {ghe}")
            return jsonify({"status": "error", "message": f"Article generated but GitHub deployment failed: {str(ghe)}"}), 500

        return jsonify({
            "status": "success",
            "message": f"Successfully completed pipeline for {date_str} (article #{article_index}).",
            "slug": slug,
            "title": ai_metadata.get("title"),
        }), 200

    except Exception as e:
        logging.critical(f"Critical error in orchestration: {e}")
        return jsonify({
            "status": "error",
            "message": f"Pipeline Orchestration Crash: {str(e)}",
        }), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
