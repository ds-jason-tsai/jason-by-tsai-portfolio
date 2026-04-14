import os
import logging
from github import Github
import datetime

def get_recent_article_titles():
    """
    Fetches the titles of the most recent articles from the repository
    to help the AI avoid repeating topics.
    """
    token = os.environ.get("GITHUB_PAT")
    repo_name = "ds-jason-tsai/jason-by-tsai-portfolio"
    g = Github(token)
    repo = g.get_repo(repo_name)
    
    titles = []
    try:
        contents = repo.get_contents("content/articles")
        # Sort by name descending (most recent date first) and take last 7
        files = sorted([c for c in contents if c.name.endswith(".md")], key=lambda x: x.name, reverse=True)[:7]
        for file in files:
            content = file.decoded_content.decode("utf-8")
            # Simple frontmatter title extraction
            for line in content.splitlines():
                if line.startswith("title:"):
                    titles.append(line.replace("title:", "").strip().strip('"'))
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
        
        # Simple string insertion before the closing </urlset>
        # We create entries for zh, en, ja as per current site structure
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

        
        if f"/articles/{new_article_slug}" in content:
            logging.info(f"Article {new_article_slug} already in sitemap.")
            return None # Skip update if already exists
            
        updated_content = content.replace("</urlset>", f"{new_entries}\n</urlset>")
        return {"path": sitemap_path, "content": updated_content, "sha": file_content.sha}
    except Exception as e:
        logging.error(f"Sitemap update failed: {e}")
        return None

def publish_to_github(markdown_content):
    """
    Pushes the generated markdown file and updates sitemap.xml.
    """
    token = os.environ.get("GITHUB_PAT")
    repo_name = "ds-jason-tsai/jason-by-tsai-portfolio"
    g = Github(token)
    repo = g.get_repo(repo_name)
    
    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    slug = f"ai-news-{date_str}"
    file_path = f"content/articles/{slug}.md"
    commit_message = f"auto(ai): publish daily AI news {date_str}"
    
    # Check if article exists
    try:
        # Commit article
        try:
            contents = repo.get_contents(file_path)
            repo.update_file(contents.path, commit_message, markdown_content, contents.sha)
        except:
            repo.create_file(file_path, commit_message, markdown_content)
        
        # Update sitemap
        sitemap_update = update_sitemap(repo, slug)
        if sitemap_update:
            repo.update_file(sitemap_update["path"], f"seo: update sitemap for {slug}", sitemap_update["content"], sitemap_update["sha"])
            
    except Exception as e:
        logging.error(f"GitHub publishing failed: {e}")
        raise e

