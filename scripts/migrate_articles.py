import os
import re
import json
import time
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
# 1. Try cloud-run/.env (where the main API keys are stored)
load_dotenv("cloud-run/.env")
api_key = os.getenv("GEMINI_API_KEY")

# 2. Try .env.local if not found (with encoding protection)
if not api_key:
    try:
        load_dotenv(".env.local")
        api_key = os.getenv("GEMINI_API_KEY")
    except UnicodeDecodeError:
        # Fallback for Big5 or other encodings
        pass

if not api_key:
    print("WARNING: GEMINI_API_KEY not found in cloud-run/.env or .env.local")

genai.configure(api_key=api_key)


ARTICLES_DIR = Path("content/articles")

def migrate_article(file_path):
    print(f"Processing {file_path.name}...")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip if already fully migrated (checking for multi-lingual title structure)
    if "title:" in content and "zh:" in content and "en:" in content and "<!-- en -->" in content:
        print(f"  Skipping {file_path.name} (already fully migrated)")
        return

    # Extract FrontMatter and Body
    match = re.search(r'^---\s*(.*?)\s*---\s*(.*)$', content, re.DOTALL)
    if not match:
        print(f"  Skipping {file_path.name} (no frontmatter)")
        return

    frontmatter_raw = match.group(1)
    body_zh = match.group(2).strip()
    
    # Extract date from frontmatter_raw
    date_match = re.search(r'date:\s*["\']?([\d-]+)["\']?', frontmatter_raw)
    date_str = date_match.group(1) if date_match else "2026-04-14"

    prompt = f"""
    You are a professional technical writer and SEO expert. 
    I have a blog post in Traditional Chinese. I need you to:
    1. Translate the ENTIRE body content into professional English and polite Japanese.
    2. Provide localized metadata (Title, Description, Tags) in JSON format.
    
    Context: {body_zh[:1000]}... (Content truncated if too long)
    
    Requirements:
    - Maintain all Markdown formatting.
    - Provide the metadata in this JSON structure:
    ```json
    {{
      "title": {{ "zh": "...", "en": "...", "ja": "..." }},
      "description": {{ "zh": "...", "en": "...", "ja": "..." }},
      "tags": {{ "zh": ["..."], "en": ["..."], "ja": ["..."] }}
    }}
    ```
    
    After the JSON, provide the content in this format:
    ---
    (Traditional Chinese body - use the original provided)
    
    <!-- en -->
    # English Title
    Full English content...
    
    <!-- ja -->
    # 日本語タイトル
    Full Japanese content...
    
    Content to translate:
    {body_zh}
    """

    model_names = ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-1.5-pro']

    translated_text = None
    
    for m_name in model_names:
        try:
            print(f"    Trying {m_name}...")
            model = genai.GenerativeModel(m_name)
            response = model.generate_content(prompt)
            translated_text = response.text.strip()
            if translated_text:
                break
        except Exception as e:
            print(f"    {m_name} failed: {e}")
            continue

    if not translated_text:
        print(f"  FAILED to translate {file_path.name}")
        return

    try:
        # Parse JSON and Body
        json_match = re.search(r'```json\s*(.*?)\s*```', translated_text, re.DOTALL)
        if not json_match:
            print(f"  Could not find JSON in response for {file_path.name}")
            return
            
        metadata = json.loads(json_match.group(1))
        
        # Extract everything after the first --- (which separates JSON from content)
        body_parts = translated_text.split("---")
        if len(body_parts) > 1:
            full_body = body_parts[-1].strip()
        else:
            # Fallback if AI didn't include --- separator
            full_body = translated_text.split("```")[-1].strip()

        # Reconstruct Frontmatter
        new_frontmatter = f"""title:
  zh: "{metadata['title']['zh']}"
  en: "{metadata['title']['en']}"
  ja: "{metadata['title']['ja']}"
description:
  zh: "{metadata['description']['zh'].replace('"', "'")}"
  en: "{metadata['description']['en'].replace('"', "'")}"
  ja: "{metadata['description']['ja'].replace('"', "'")}"
date: "{date_str}"
tags:
  zh: {json.dumps(metadata['tags']['zh'], ensure_ascii=False)}
  en: {json.dumps(metadata['tags']['en'])}
  ja: {json.dumps(metadata['tags']['ja'], ensure_ascii=False)}
published: true"""

        new_content = f"""---
{new_frontmatter}
---

{full_body}
"""
        # Save back
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"  Successfully migrated {file_path.name}")
        
    except Exception as e:
        print(f"  Error parsing response for {file_path.name}: {e}")

def main():
    if not ARTICLES_DIR.exists():
        print("Articles directory not found.")
        return

    # Specifically migrate existing files
    for file_path in ARTICLES_DIR.glob("*.md"):
        # This will skip already migrated files due to the check at the start of migrate_article
        migrate_article(file_path)
        time.sleep(3)


if __name__ == "__main__":
    main()
