import os
import logging
from flask import Flask, jsonify
from crawler import fetch_latest_ai_news
from analyzer import analyze_and_summarize
from publisher import publish_to_github, get_recent_article_titles
from database import BigQueryManager
from dotenv import load_dotenv
import datetime

load_dotenv()
import datetime
from datetime import timezone, timedelta

# Taiwan Time Utility
def get_tw_now():
    return datetime.datetime.now(timezone(timedelta(hours=8)))

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Initialize BigQuery Manager
bq = BigQueryManager()
try:
    bq.init_db()
except Exception as e:
    logging.error(f"BigQuery initialization failed at startup: {e}. The service will continue to run, but BQ features may fail.")

@app.route("/", methods=["GET", "POST"])
def trigger_generation():
    """
    Endpoint triggered by Google Cloud Scheduler daily.
    """
    logging.info("Starting AI News generation process...")
    
    try:
        # Step 0: Get history to avoid duplicate topics
        past_topics = get_recent_article_titles()
        logging.info(f"Step 0: Past topics: {past_topics}")

        # Step 1: Crawl
        logging.info("Step 1: Fetching latest AI news...")
        raw_items = fetch_latest_ai_news() 
        if not raw_items:
            return jsonify({"status": "error", "message": "Crawler returned no results."}), 500
        
        # Step 2: Save RAW to BigQuery (Taiwan Time)
        tw_now = get_tw_now()
        date_str = tw_now.strftime("%Y-%m-%d")
        slug = f"ai-news-{date_str}"
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
                logging.warning(f"BQ Save Error: {bqe}")

        # Step 3: AI Analysis (Limit to Top 3 items + UTM tags)
        logging.info("Step 3: AI Generation Starting (with UTM injection)...")
        top_items = raw_items[:3]
        
        # Inject UTM to ensure references link back correctly with attribution
        utm_suffix = "?utm_source=jasonanalytics&utm_medium=ai-news"
        raw_text_for_ai = ""
        for i in top_items:
            # Check if URL already has query params
            clean_url = i['link']
            final_url = f"{clean_url}{utm_suffix}" if "?" not in clean_url else f"{clean_url}&{utm_suffix.replace('?', '')}"
            raw_text_for_ai += f"- {i['source']} ({final_url}): {i['title']}\n"
            
        markdown_content, ai_metadata = analyze_and_summarize(raw_text_for_ai, past_topics=past_topics, current_date=date_str)
        
        if not markdown_content or not ai_metadata:
            logging.error("AI Generation failed (Empty result).")
            return jsonify({"status": "error", "message": "AI failed to generate content. Check API quota/logs."}), 500
        
        logging.info("AI Analysis completed successfully.")

        # Step 4: Metadata Store
        try:
            bq_meta = {
                "publish_date": date_str,
                "slug": slug,
                "title": ai_metadata.get("title", {}).get("zh", "AI 新聞摘要"),
                "description": ai_metadata.get("description", {}).get("zh", ""),
                "sentiment": ai_metadata.get("sentiment"),
                "tags": str(ai_metadata.get("tags", {}).get("zh", [])),
                "full_markdown": markdown_content
            }
            bq.save_article_metadata(bq_meta)
            logging.info("Step 4: Meta saved to BQ.")
        except Exception as bqe:
            logging.warning(f"BQ Meta Save Error: {bqe}")

        # Step 5: GitHub Publishing
        logging.info("Step 5: Publishing to GitHub...")
        try:
            publish_to_github(markdown_content)
        except Exception as ghe:
            logging.error(f"GitHub Publish Error: {ghe}")
            return jsonify({"status": "error", "message": f"Generated but GitHub failed: {str(ghe)}"}), 500
        
        return jsonify({
            "status": "success",
            "message": f"Successfully completed pipeline for {date_str}.",
            "title": ai_metadata.get("title", {}).get("zh")
        }), 200
        
    except Exception as e:
        logging.critical(f"Critical error: {e}")
        return jsonify({
            "status": "error",
            "message": f"Pipeline Crash: {str(e)}"
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
