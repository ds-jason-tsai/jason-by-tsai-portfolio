import os
import logging
from flask import Flask, jsonify
from crawler import fetch_latest_ai_news
from analyzer import analyze_and_summarize
from publisher import publish_to_github, get_recent_article_titles
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

@app.route("/", methods=["GET", "POST"])
def trigger_generation():
    """
    Endpoint triggered by Google Cloud Scheduler daily.
    """
    logging.info("Starting AI News generation process...")
    
    try:
        # Step 0: Get history to avoid duplicate topics
        past_topics = get_recent_article_titles()
        logging.info(f"Past topics found: {past_topics}")

        # Step 1: Crawl
        raw_articles = fetch_latest_ai_news()
        
        # Step 2: Analyze & Format (with memory)
        markdown_content = analyze_and_summarize(raw_articles, past_topics=past_topics)
        
        # Step 3: Publish to GitHub (includes sitemap update)
        publish_to_github(markdown_content)
        
        return jsonify({
            "status": "success",
            "message": "AI News successfully fetched, analyzed, and published."
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
