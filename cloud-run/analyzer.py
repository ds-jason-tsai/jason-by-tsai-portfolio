import os
import logging
import datetime
import google.generativeai as genai
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Configure Retry logic for 503 Service Unavailable
@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=10, max=60),
    reraise=True
)
def _call_gemini_with_retry(model, prompt):
    return model.generate_content(prompt)

def analyze_and_summarize(articles, past_topics=None):
    """
    Takes raw articles list, queries Gemini for summaries, translations, 
    and returns a structured data object + Markdown string.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set.")
    
    genai.configure(api_key=api_key)
    
    # Force use of gemini-1.5-flash for maximum stability with Free API keys
    # and highest generation speed.
    model_name = 'gemini-1.5-flash'
    model = genai.GenerativeModel(model_name)

    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    past_topics_str = f"\n過去一週已寫過的主題（請避開重複內容）：\n{past_topics}" if past_topics else ""
    
    prompt = f"""
    你是 Jason Tsai (傑森數據)，資深 Data Analyst 兼 Solution Engineer。
    文筆風格：專業、客觀、充滿實務洞察，語氣平易近人（有「人味」），善於將技術轉化為商業價值。
    
    任務：根據今日 ({date_str}) 最新 AI 新聞撰寫觀察報告。
    {past_topics_str}

    數據：
    {articles}

    要求：
    1. **標題格式**：`[{date_str}] <吸引人的技術主題>`。
    2. **長度**：1200 字以上。
    3. **Tags**：從 ["Tech Trends", "AI News", "Generative AI", "Data Analysis", "MarTech", "Industry Insights"] 挑選。
    4. **輸出格式**：先輸出一段 JSON 格式的元數據，接著是正式的 Markdown 内容。

    JSON 格式範例 (請放在內容最前方，用 ```json 標記，並確保 title/description/tags 都是包含 zh/en/ja 的物件)：
    {{
      "title": {{ "zh": "...", "en": "...", "ja": "..." }},
      "description": {{ "zh": "...", "en": "...", "ja": "..." }},
      "sentiment": "...",
      "tags": {{ "zh": ["..."], "en": ["..."], "ja": ["..."] }}
    }}

    請直接輸出內容，不要多餘的解釋。
    Markdown 內容需包含 FrontMatter (這裡暫時只放日期與發布狀態，多語內容會從上面的 JSON 提取)：
    ---
    date: "{date_str}"
    published: true
    ---
    """
    
    try:
        response = _call_gemini_with_retry(model, prompt)
        full_text = response.text
        
        # Validation: If output doesn't contain FrontMatter markers or JSON, it might be an error string
        if "---" not in full_text and "```json" not in full_text:
             logging.error(f"AI returned invalid format: {full_text[:100]}")
             return None, None
             
    except Exception as e:
        logging.error(f"AI Generation Failed after retries: {e}")
        return None, None
    
    # Simple extraction of JSON and Markdown
    import json
    import re
    
    try:
        json_match = re.search(r'```json\s*(.*?)\s*```', full_text, re.DOTALL)
        if json_match:
            metadata = json.loads(json_match.group(1))
            markdown = full_text.replace(json_match.group(0), "").strip()
            
            # Reconstruct correct title/description/tags into the markdown frontmatter for the site
            # This ensures the generated file is actually valid for the frontend
            frontmatter = f"""---
title:
  zh: "{metadata.get('title', {}).get('zh', 'AI 新聞')}"
  en: "{metadata.get('title', {}).get('en', 'AI News')}"
  ja: "{metadata.get('title', {}).get('ja', 'AIニュース')}"
description:
  zh: "{metadata.get('description', {}).get('zh', '')}"
  en: "{metadata.get('description', {}).get('en', '')}"
  ja: "{metadata.get('description', {}).get('ja', '')}"
date: "{date_str}"
tags:
  zh: {json.dumps(metadata.get('tags', {}).get('zh', ['Tech Trends']))}
  en: {json.dumps(metadata.get('tags', {}).get('en', ['Tech Trends']))}
  ja: {json.dumps(metadata.get('tags', {}).get('ja', ['Tech Trends']))}
published: true
---

"""
            full_markdown = frontmatter + markdown.replace("---", "").strip()
            return full_markdown, metadata
    except Exception as e:
        logging.error(f"Failed to parse AI output JSON: {e}")
        
    return None, None
