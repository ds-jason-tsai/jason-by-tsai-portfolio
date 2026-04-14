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
    logging.info("Starting AI News generation process (Vertex AI + BQ)...")
    
    try:
        # Step 0: Get history to avoid duplicate topics
        past_topics = get_recent_article_titles()
        logging.info(f"Past topics found: {past_topics}")

        # Step 1: Crawl
        raw_items = fetch_latest_ai_news() 
        
        # Step 2: Save RAW to BigQuery (Split into columns)
        date_str = datetime.datetime.now().strftime("%Y-%m-%d")
        slug = f"ai-news-{date_str}"
        
        bq_raw_data = []
        for item in raw_items:
            bq_raw_data.append({
                "publish_date": date_str,
                "slug": slug,
                "source_domain": item.get('source', 'Unknown'),
                "headline": item.get('title', 'No Title'),
                "url": item.get('link', ''),
                "crawled_at": datetime.datetime.now().isoformat()
            })
        
        if bq_raw_data:
            bq.save_raw_headlines(bq_raw_data)
            logging.info(f"Stored {len(bq_raw_data)} raw headlines to BigQuery.")

        # Step 3: AI Analysis (Vertex AI / Pro Model)
        # Convert list to string for AI context (Including links for citations)
        raw_text_for_ai = "\n".join([f"- {i['source']} ({i['link']}): {i['title']}" for i in raw_items])
        markdown_content, ai_metadata = analyze_and_summarize(raw_text_for_ai, past_topics=past_topics)
        
        # Step 4: Guard and Save AI Metadata to BQ
        if ai_metadata and markdown_content:
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
            logging.info("Stored article metadata to BigQuery.")
            
            # Step 5: Publish to GitHub (ONLY IF AI SUCCEEDED)
            publish_to_github(markdown_content)
        else:
            logging.error("AI Generation failed to produce valid content. Skipping GitHub publish.")
        
        return jsonify({
            "status": "success",
            "message": f"Successfully published new article for {date_str} to GitHub and BQ."
        }), 200
        
    except Exception as e:
        logging.error(f"Error during generation: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
