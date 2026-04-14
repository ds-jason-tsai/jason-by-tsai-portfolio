import feedparser
import requests
from bs4 import BeautifulSoup
import logging

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

def fetch_latest_ai_news():
    """
    Crawls the specified sources and returns a list of recent headlines and summaries.
    """
    articles = []
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    for source in SOURCES:
        logging.info(f"Crawling {source['name']}...")
        try:
            res = requests.get(source['url'], headers=headers, timeout=15)
            soup = BeautifulSoup(res.text, 'html.parser')
            
            found_titles = set()
            links = soup.find_all('a')
            
            for link in links:
                title = link.get_text(strip=True)
                href = link.get('href', '')
                
                # Heuristic: A headline usually has > 4 words and is reasonably long.
                word_count = len(title.split())
                if word_count > 4 and len(title) > 20 and href:
                    if title not in found_titles:
                        found_titles.add(title)
                        full_url = href if href.startswith('http') else source['url'].rstrip('/') + '/' + href.lstrip('/')
                        articles.append(f"Source: {source['name']} | Title: {title} | Link: {full_url}")
                
                if len(found_titles) >= 5: # limit 5 headlines per source
                    break
                    
        except Exception as e:
            logging.error(f"Failed to crawl {source['name']}: {e}")
            
    return "\n".join(articles)
