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

@app.route("/", methods=["GET", "POST"])
def trigger_generation():
    """
    Endpoint triggered by Google Cloud Scheduler daily.
    """
    logging.info("Starting AI News generation process...")
    tw_now = get_tw_now()
    date_str = tw_now.strftime("%Y-%m-%d")
    slug = f"ai-news-{date_str}"
    
    try:
        # Step 0a: Get past article titles from BigQuery → feed into AI prompt to prevent topic repetition
        past_topics = []
        try:
            past_topics = bq.get_past_article_titles(days=21)
            logging.info(f"Step 0a: Loaded {len(past_topics)} past article titles from BigQuery")
        except Exception as e:
            logging.warning(f"Step 0a skipped (BQ unavailable): {e}")

        # Step 0b: Get already-crawled URLs from BigQuery → filter duplicates in crawler
        used_urls = set()
        try:
            used_urls = bq.get_past_headline_urls(days=7)
            logging.info(f"Step 0b: Loaded {len(used_urls)} already-used URLs from BigQuery")
        except Exception as e:
            logging.warning(f"Step 0b skipped (BQ unavailable): {e}")

        # Step 1: Crawl (with shuffle + URL dedup filter)
        logging.info("Step 1: Fetching latest AI news (shuffled sources, dedup filtered)...")
        raw_items = fetch_latest_ai_news(used_urls=used_urls)
        if not raw_items:
            return jsonify({"status": "error", "message": "Crawler failure: No fresh results found today."}), 500
        
        # Step 2: Save RAW to BigQuery
        bq_raw_data = []
        for item in raw_items:
            bq_raw_data.append({
                "publish_date": date_str,
                "slug": slug,
                "source_domain": item.get('source', 'Unknown'),
                "headline": item.get('title', 'No Title'),
                "url": item.get('link', ''),
                "crawled_at": tw_now.isoformat()
            })
        
        if bq_raw_data:
            try:
                bq.save_raw_headlines(bq_raw_data)
                logging.info(f"Step 2: Stored {len(bq_raw_data)} headlines to BQ.")
            except Exception as bqe:
                logging.warning(f"BQ Save Error (non-critical): {bqe}")

        # Step 3: AI Analysis (Top 3 items, NO UTM - use clean original URLs)
        logging.info("Step 3: AI Generation Starting...")
        top_items = raw_items[:3]
        raw_text_for_ai = ""
        for i in top_items:
            raw_text_for_ai += f"- {i['source']} ({i['link']}): {i['title']}\n"
            
        markdown_content, ai_metadata = analyze_and_summarize(raw_text_for_ai, past_topics=past_topics, current_date=date_str)
        
        if not markdown_content or not ai_metadata:
            logging.error("AI Generation Critical Failure: Empty content returned.")
            return jsonify({"status": "error", "message": "AI Engine failed (Quota or Parsing). Check analyzer logs."}), 500
        
        logging.info("AI Analysis completed successfully.")

        # Step 4: Metadata Store
        try:
            bq_meta = {
                "publish_date": date_str,
                "slug": slug,
                "title": ai_metadata.get("title", {}).get("zh", f"[{date_str}] AI 趨勢分析") if isinstance(ai_metadata.get("title"), dict) else ai_metadata.get("title", "AI News"),
                "description": str(ai_metadata.get("description", "")),
                "sentiment": ai_metadata.get("sentiment"),
                "tags": str(ai_metadata.get("tags", {})),
                "full_markdown": markdown_content
            }
            bq.save_article_metadata(bq_meta)
            logging.info("Step 4: Meta saved to BQ.")
        except Exception as bqe:
            logging.warning(f"BQ Meta Save Error (non-critical): {bqe}")

        # Step 5: GitHub Publishing
        logging.info("Step 5: Publishing to GitHub...")
        try:
            publish_to_github(markdown_content)
        except Exception as ghe:
            logging.error(f"GitHub Publish Error: {ghe}")
            return jsonify({"status": "error", "message": f"Article generated but GitHub deployment failed: {str(ghe)}"}), 500
        
        return jsonify({
            "status": "success",
            "message": f"Successfully completed pipeline for {date_str}.",
            "title": ai_metadata.get("title")
        }), 200
        
    except Exception as e:
        logging.critical(f"Critical error in orchestration: {e}")
        return jsonify({
            "status": "error",
            "message": f"Pipeline Orchestration Crash: {str(e)}"
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
