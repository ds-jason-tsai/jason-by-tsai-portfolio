import os
import logging
from github import Github
import datetime
from datetime import timezone, timedelta
from tenacity import retry, stop_after_attempt, wait_exponential

# Taiwan Time Utility
def get_tw_now():
    return datetime.datetime.now(timezone(timedelta(hours=8)))

def get_recent_article_titles():
    """
    Fetches the zh-titles of the most recent articles from the repository
    to help the AI avoid repeating topics.
    """
    token = os.environ.get("GITHUB_PAT")
    repo_name = "ds-jason-tsai/jason-by-tsai-portfolio"
    if not token:
        logging.error("GITHUB_PAT not found.")
        return []
        
    g = Github(token)
    repo = g.get_repo(repo_name)
    
    titles = []
    import re
    try:
        contents = repo.get_contents("content/articles")
        # Sort by name descending and take last 7
        files = sorted([c for c in contents if c.name.endswith(".md")], key=lambda x: x.name, reverse=True)[:7]
        for file in files:
            content = file.decoded_content.decode("utf-8")
            # Robust YAML extraction for zh title
            # Matches 'zh: "Title Content"'
            match = re.search(r'zh:\s*"(.*?)"', content)
            if match:
                titles.append(match.group(1).strip())
            else:
                # Legacy fallback
                for line in content.splitlines():
                    if line.startswith("title:"):
                        titles.append(line.replace("title:", "").strip().strip('"').strip("'"))
                        break
    except Exception as e:
        logging.error(f"Error fetching history: {e}")
    return titles

def update_sitemap(repo, new_article_slug):
    """
    Safely injects the new article into the sitemap.xml file.
    """
    sitemap_path = "public/sitemap.xml"
    try:
        file_content = repo.get_contents(sitemap_path)
        content = file_content.decoded_content.decode("utf-8")
        
        # Avoid duplication
        if f"/articles/{new_article_slug}" in content:
            logging.info(f"Article {new_article_slug} already in sitemap.")
            return None
            
        new_entries = f"""
  <!-- {new_article_slug} -->
  <url>
    <loc>https://jason-by-tsai-portfolio.vercel.app/zh/articles/{new_article_slug}</loc>
    <xhtml:link rel="alternate" hreflang="zh" href="https://jason-by-tsai-portfolio.vercel.app/zh/articles/{new_article_slug}" />
    <xhtml:link rel="alternate" hreflang="en" href="https://jason-by-tsai-portfolio.vercel.app/en/articles/{new_article_slug}" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://jason-by-tsai-portfolio.vercel.app/ja/articles/{new_article_slug}" />
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://jason-by-tsai-portfolio.vercel.app/en/articles/{new_article_slug}</loc>
    <xhtml:link rel="alternate" hreflang="zh" href="https://jason-by-tsai-portfolio.vercel.app/zh/articles/{new_article_slug}" />
    <xhtml:link rel="alternate" hreflang="en" href="https://jason-by-tsai-portfolio.vercel.app/en/articles/{new_article_slug}" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://jason-by-tsai-portfolio.vercel.app/ja/articles/{new_article_slug}" />
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://jason-by-tsai-portfolio.vercel.app/ja/articles/{new_article_slug}</loc>
    <xhtml:link rel="alternate" hreflang="zh" href="https://jason-by-tsai-portfolio.vercel.app/zh/articles/{new_article_slug}" />
    <xhtml:link rel="alternate" hreflang="en" href="https://jason-by-tsai-portfolio.vercel.app/en/articles/{new_article_slug}" />
    <xhtml:link rel="alternate" hreflang="ja" href="https://jason-by-tsai-portfolio.vercel.app/ja/articles/{new_article_slug}" />
    <priority>0.7</priority>
  </url>"""
        
        updated_content = content.replace("</urlset>", f"{new_entries}\n</urlset>")
        return {"path": sitemap_path, "content": updated_content, "sha": file_content.sha}
    except Exception as e:
        logging.error(f"Sitemap update failed: {e}")
        return None

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=5, max=20))
def publish_to_github(markdown_content):
    """
    Pushes the generated markdown file and updates sitemap.xml with retries.
    """
    token = os.environ.get("GITHUB_PAT")
    repo_name = "ds-jason-tsai/jason-by-tsai-portfolio"
    g = Github(token)
    repo = g.get_repo(repo_name)
    
    tw_now = get_tw_now()
    date_str = tw_now.strftime("%Y-%m-%d")
    slug = f"ai-news-{date_str}"
    file_path = f"content/articles/{slug}.md"
    commit_message = f"auto(ai): publish daily AI news {date_str} (TW Time)"
    
    try:
        # 1. Commit/Update article
        try:
            contents = repo.get_contents(file_path)
            repo.update_file(contents.path, commit_message, markdown_content, contents.sha)
        except:
            repo.create_file(file_path, commit_message, markdown_content)
        
        # 2. Update sitemap
        sitemap_update = update_sitemap(repo, slug)
        if sitemap_update:
            repo.update_file(sitemap_update["path"], f"seo: update sitemap for {slug}", sitemap_update["content"], sitemap_update["sha"])
            
    except Exception as e:
        logging.error(f"GitHub publishing failed: {e}")
        raise e

