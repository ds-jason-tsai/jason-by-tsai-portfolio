import os
import re
import json
import time
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables (ensure GEMINI_API_KEY is available)
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Robust Model Selection for Migration
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    try:
        model = genai.GenerativeModel('gemini-pro')
    except:
        model = genai.GenerativeModel('models/gemini-1.5-flash')

ARTICLES_DIR = Path("content/articles")

def migrate_article(file_path):
    print(f"Processing {file_path.name}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip if already migrated
    if "<!-- en -->" in content:
        print(f"  Skipping {file_path.name} (already migrated)")
        return

    # Extract FrontMatter and Body
    match = re.search(r'^---\s*(.*?)\s*---\s*(.*)$', content, re.DOTALL)
    if not match:
        print(f"  Skipping {file_path.name} (no frontmatter)")
        return

    frontmatter_raw = match.group(1)
    body_zh = match.group(2).strip()

    prompt = f"""
    You are a professional translator and SEO expert. 
    I have a blog post in Traditional Chinese. I need you to translate the ENTIRE body content into English and Japanese.
    
    Requirements:
    1. Maintain all Markdown formatting (headings, code blocks, links).
    2. The English translation should be professional and technical.
    3. The Japanese translation should use polite (Desu/Masu) style.
    4. Provide the result in this exact format:
    
    [English Title]
    Full English content here...
    
    <!-- ja -->
    [Japanese Title]
    Full Japanese content here...
    
    Content to translate:
    {body_zh}
    """

    # Try multiple model names for generation using the STABLE v1 API
    model_names = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro']
    translated_text = None
    
    for m_name in model_names:
        try:
            print(f"    Trying {m_name}...")
            # Some versions of the library respond better to this initialization
            model = genai.GenerativeModel(m_name)
            response = model.generate_content(prompt)
            translated_text = response.text.strip()
            if translated_text:
                break
        except Exception as e:
            print(f"    {m_name} failed: {e}")
            # If it's a 404, we continue to the next model name
            continue

    if not translated_text:
        print(f"  FAILED to translate {file_path.name} after trying all models.")
        return

    # New multi-lingual content structure
    new_content = f"""---
{frontmatter_raw}
---

{body_zh}

<!-- en -->
{translated_text}
"""
    # Save back
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"  Successfully migrated {file_path.name}")
        
    print(f"  Successfully migrated {file_path.name}")

def main():
    if not ARTICLES_DIR.exists():
        print("Articles directory not found.")
        return

    for file_path in ARTICLES_DIR.glob("*.md"):
        migrate_article(file_path)
        # Small delay to avoid rate limits on free tier
        time.sleep(2)

if __name__ == "__main__":
    main()
