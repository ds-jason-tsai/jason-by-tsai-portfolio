import requests
from bs4 import BeautifulSoup
import logging
import random
from urllib.parse import urljoin, urlparse

SOURCES = [
    {"name": "OpenAI News",       "url": "https://openai.com/zh-Hant/news/",                          "type": "web"},
    {"name": "Google DeepMind",   "url": "https://deepmind.google/blog/",                              "type": "web"},
    {"name": "Google AI Blog",    "url": "https://blog.google/technology/ai/",                         "type": "web"},
    {"name": "Anthropic News",    "url": "https://www.anthropic.com/news",                             "type": "web"},
    {"name": "Meta AI Blog",      "url": "https://ai.meta.com/blog/",                                  "type": "web"},
    {"name": "Microsoft Research","url": "https://www.microsoft.com/en-us/research/",                  "type": "web"},
    {"name": "MIT AI News",       "url": "https://news.mit.edu/topic/artificial-intelligence2",        "type": "web"},
    {"name": "Technology Review", "url": "https://www.technologyreview.com/",                          "type": "web"},
    {"name": "The Verge AI",      "url": "https://www.theverge.com/",                                  "type": "web"},
    {"name": "VentureBeat AI",    "url": "https://venturebeat.com/category/ai/",                       "type": "web"},
    {"name": "Wired AI",          "url": "https://www.wired.com/tag/artificial-intelligence/",         "type": "web"},
    {"name": "Ars Technica",      "url": "https://arstechnica.com/",                                   "type": "web"},
    {"name": "AI Weekly",         "url": "https://ai-weekly.ai/",                                      "type": "web"},
]

# Keywords to prefer AI/data/application related articles
AI_KEYWORDS = [
    "ai", "artificial intelligence", "machine learning", "deep learning", "llm",
    "large language model", "gpt", "gemini", "claude", "chatgpt", "generative",
    "neural", "data", "analytics", "automation", "algorithm", "model",
    "dataset", "compute", "benchmark", "inference", "training", "transformer",
    "robot", "agent", "rag", "vector", "embedding", "foundation model",
    "multimodal", "openai", "deepmind", "anthropic", "meta ai", "microsoft ai",
    "big data", "python", "sql", "cloud", "martech", "insight",
    "數據", "人工智慧", "機器學習", "自動化", "模型", "分析",
]

def _is_ai_related(title: str) -> bool:
    """Returns True if the title is likely AI/data/application related."""
    lower = title.lower()
    return any(kw in lower for kw in AI_KEYWORDS)

def _build_full_url(href: str, source_url: str) -> str:
    """
    Robustly resolve a potentially relative URL against the source page URL.
    Uses urllib.parse.urljoin which handles all edge cases correctly.
    """
    if not href:
        return ""
    # Strip anchors and query strings that cause 404s
    href = href.split('#')[0]
    if not href:
        return source_url
    # urljoin handles absolute, protocol-relative, and relative hrefs
    full = urljoin(source_url, href)
    # Validate the resulting URL has a proper scheme and netloc
    parsed = urlparse(full)
    if parsed.scheme in ("http", "https") and parsed.netloc:
        return full
    return ""


def fetch_latest_ai_news(used_urls: set = None):
    """
    Crawls sources and returns exactly one fresh AI/data-related headline per source.
    - Shuffles sources each run so different sources get prioritized.
    - Filters out URLs already stored in BigQuery (used_urls) to avoid repeats.
    - Skips common stale patterns (archive, old years) to ensure freshness.
    """
    if used_urls is None:
        used_urls = set()

    # Common stale patterns to skip (especially things from previous years)
    STALE_PATTERNS = ["/2021/", "/2022/", "/2023/", "/2024/", "/archive/", "/tags/", "/category/"]
    # We are currently in 2026, so anything before 2025/2026 should be treated with caution
    # However, to be safe and "Fresh", we prefer 2026 content.
    
    ai_articles = []    # AI/data-related (preferred)
    other_articles = [] # non-AI fallback
    seen_urls = set()
    seen_titles = set()
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/123.0.0.0 Safari/537.36"
        )
    }

    # Shuffle sources so each run picks a different starting point
    shuffled_sources = random.sample(SOURCES, len(SOURCES))

    for source in shuffled_sources:
        logging.info(f"Crawling {source['name']}...")
        try:
            res = requests.get(source["url"], headers=headers, timeout=15)
            res.raise_for_status()
            soup = BeautifulSoup(res.text, "html.parser")

            found_count = 0
            # Search for the first valid link in the page
            # Usually the most recent news appears first in the DOM
            for link in soup.find_all("a"):
                title = link.get_text(strip=True)
                href = link.get("href", "")

                # 1. Quality & Length filters
                if not href or len(title.split()) <= 4 or len(title) <= 20:
                    continue

                full_url = _build_full_url(href, source["url"])
                if not full_url:
                    continue

                # 2. Freshness check: skip older years or archive links
                url_lower = full_url.lower()
                if any(p in url_lower for p in STALE_PATTERNS):
                    continue
                
                # Especially if it's 2025 and we are in 2026, be careful, but the user said "去年初"
                # so we definitely skip 2025 if possible, or at least older ones.
                if "/2025/" in url_lower and "2026" not in url_lower:
                     # This might be too aggressive if it's early 2026, 
                     # but the user explicitly complained about 2025 content.
                     logging.debug(f"  Skipping likely stale URL: {full_url[:80]}")
                     continue

                # 3. Dedup: Skip already-processed URLs
                if full_url in used_urls or full_url in seen_urls:
                    logging.debug(f"  Skipping duplicate URL: {full_url[:80]}")
                    continue

                # 4. Dedup: Skip duplicate titles within this crawl run
                if title in seen_titles:
                    continue

                seen_urls.add(full_url)
                seen_titles.add(title)

                item = {
                    "source": source["name"],
                    "title": title,
                    "link": full_url,
                }

                if _is_ai_related(title):
                    ai_articles.append(item)
                else:
                    other_articles.append(item)

                found_count += 1
                if found_count >= 1:  # STRICT: only one latest article per source
                    logging.info(f"  Picked latest from {source['name']}: {title[:50]}...")
                    break

        except Exception as e:
            logging.error(f"Failed to crawl {source['name']}: {e}")

    # Combine: AI-related first, then others as fallback
    all_articles = ai_articles + other_articles
    logging.info(
        f"Crawler: {len(ai_articles)} AI-related + {len(other_articles)} other "
        f"= {len(all_articles)} total unique new articles"
    )
    return all_articles
