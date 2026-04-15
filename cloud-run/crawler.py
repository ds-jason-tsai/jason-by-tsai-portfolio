import requests
from bs4 import BeautifulSoup
import logging
import random

SOURCES = [
    {"name": "OpenAI News", "url": "https://openai.com/zh-Hant/news/", "type": "web"},
    {"name": "Google DeepMind", "url": "https://deepmind.google/blog/", "type": "web"},
    {"name": "Google Technology", "url": "http://blog.google/innovation-and-ai/technology/ai/", "type": "web"},
    {"name": "Anthropic News", "url": "https://www.anthropic.com/news", "type": "web"},
    {"name": "Meta AI Blog", "url": "https://ai.meta.com/blog/", "type": "web"},
    {"name": "Microsoft Research", "url": "https://www.microsoft.com/en-us/research/", "type": "web"},
    {"name": "MIT AI News", "url": "https://news.mit.edu/topic/artificial-intelligence2", "type": "web"},
    {"name": "ScienceDaily", "url": "https://www.sciencedaily.com/", "type": "web"},
    {"name": "Technology Review", "url": "https://www.technologyreview.com/", "type": "web"},
    {"name": "The Verge AI", "url": "https://www.theverge.com/", "type": "web"},
    {"name": "VentureBeat AI", "url": "https://venturebeat.com/category/ai", "type": "web"},
    {"name": "Wired AI", "url": "https://www.wired.com/tag/artificial-intelligence/", "type": "web"},
    {"name": "Ars Technica", "url": "https://arstechnica.com/", "type": "web"},
    {"name": "AI Weekly", "url": "https://ai-weekly.ai/", "type": "web"}
]

def fetch_latest_ai_news(used_urls: set = None):
    """
    Crawls the specified sources and returns a list of recent headlines.
    - Shuffles sources each run so different sources get prioritized.
    - Filters out URLs already stored in BigQuery (used_urls) to avoid repeats.
    """
    if used_urls is None:
        used_urls = set()

    articles = []
    seen_titles = set()
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

    # Shuffle sources so each run picks a different starting point
    shuffled_sources = random.sample(SOURCES, len(SOURCES))

    for source in shuffled_sources:
        logging.info(f"Crawling {source['name']}...")
        try:
            res = requests.get(source['url'], headers=headers, timeout=15)
            soup = BeautifulSoup(res.text, 'html.parser')

            found_count = 0
            for link in soup.find_all('a'):
                title = link.get_text(strip=True)
                href = link.get('href', '')

                if not href or len(title.split()) <= 4 or len(title) <= 20:
                    continue

                full_url = href if href.startswith('http') else source['url'].rstrip('/') + '/' + href.lstrip('/')

                # Skip already-processed URLs (from BigQuery history)
                if full_url in used_urls:
                    logging.debug(f"  Skipping already-used URL: {full_url[:80]}")
                    continue

                if title not in seen_titles:
                    seen_titles.add(title)
                    articles.append({
                        "source": source['name'],
                        "title": title,
                        "link": full_url
                    })
                    found_count += 1

                if found_count >= 5:  # max 5 headlines per source
                    break

        except Exception as e:
            logging.error(f"Failed to crawl {source['name']}: {e}")

    logging.info(f"Crawler total: {len(articles)} unique new articles after dedup filter")
    return articles

