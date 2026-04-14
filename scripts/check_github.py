import os
from github import Github
from dotenv import load_dotenv

load_dotenv("cloud-run/.env")
token = os.getenv("GITHUB_PAT")
repo_name = "ds-jason-tsai/jason-by-tsai-portfolio"

def check_github():
    if not token:
        print("GITHUB_PAT not found in env")
        return
    
    g = Github(token)
    try:
        user = g.get_user()
        print(f"Authenticated as: {user.login}")
        repo = g.get_repo(repo_name)
        print(f"Access to repo {repo_name} verified.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_github()
