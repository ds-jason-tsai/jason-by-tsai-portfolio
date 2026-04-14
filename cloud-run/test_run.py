from crawler import fetch_latest_ai_news
from analyzer import analyze_and_summarize
from dotenv import load_dotenv

load_dotenv()

print("1. Fetching news...")
articles = fetch_latest_ai_news()
print(f"Extracted {len(articles.splitlines())} potential headlines.")

print("\n2. Sending to Gemini for analysis...")
result = analyze_and_summarize(articles)

print("\n=== AI GENERATED ARTICLE ===\n")
print(result)
print("\n============================")
