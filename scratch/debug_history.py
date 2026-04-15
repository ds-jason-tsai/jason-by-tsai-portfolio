import os
import logging
from github import Github
import re
from dotenv import load_dotenv

load_dotenv()

def debug_get_titles():
    token = os.environ.get("GITHUB_PAT")
    repo_name = "ds-jason-tsai/jason-by-tsai-portfolio"
    if not token:
        print("Error: No GITHUB_PAT")
        return
        
    g = Github(token)
    repo = g.get_repo(repo_name)
    
    titles = []
    try:
        contents = repo.get_contents("content/articles")
        files = sorted([c for c in contents if c.name.endswith(".md")], key=lambda x: x.name, reverse=True)[:7]
        print(f"Found {len(files)} recent files.")
        for file in files:
            content = file.decoded_content.decode("utf-8")
            match = re.search(r'zh:\s*"(.*?)"', content)
            if match:
                t = match.group(1).strip()
                print(f"Captured ZH Title: {t}")
                titles.append(t)
            else:
                print(f"Regex failed for {file.name}, trying fallback...")
                for line in content.splitlines():
                    if line.startswith("title:"):
                        titles.append(line.replace("title:", "").strip().strip('"').strip("'"))
                        break
    except Exception as e:
        print(f"Error: {e}")
    return titles

if __name__ == "__main__":
    t = debug_get_titles()
    print("Final Titles List for AI:", t)
