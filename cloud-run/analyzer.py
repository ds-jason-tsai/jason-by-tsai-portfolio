import os
import datetime
import logging
import google.generativeai as genai
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=10, max=30))
def _call_gemini_with_retry(model, prompt):
    return model.generate_content(prompt)

def analyze_and_summarize(articles, past_topics=None):
    """
    Uses Gemini to analyze the crawled news and generate a high-quality article.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set.")
    
    genai.configure(api_key=api_key)
    
    # Dynamic Model Discovery to avoid NotFound errors
    try:
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        logging.info(f"Available Gemini models: {available_models}")
        
        # Priority mapping (1.5-flash is more stable for free tier quotas)
        target_models = [
            'models/gemini-1.5-flash-latest',
            'models/gemini-1.5-flash',
            'models/gemini-2.0-flash', 
            'models/gemini-pro'
        ]
        
        model = None
        for target in target_models:
            if target in available_models:
                model = genai.GenerativeModel(target)
                logging.info(f"Successfully selected dynamic model: {target}")
                break
        
        if not model and available_models:
            model = genai.GenerativeModel(available_models[0])
            logging.info(f"Selecting fallback model: {available_models[0]}")
            
    except Exception as e:
        logging.warning(f"Dynamic model discovery failed: {e}. Falling back to hardcoded list.")
        # Fallback to a hardcoded list with explicit prefixes as a last resort
        model = None
        for m in ['models/gemini-1.5-flash', 'models/gemini-1.5-flash-latest', 'models/gemini-2.0-flash']:
            try:
                model = genai.GenerativeModel(m)
                break
            except:
                continue
    
    if not model:
        logging.error("Critical: No Gemini models could be initialized.")
        return None, None

    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    past_topics_str = f"\n過去一週已寫過的主題（請避開重複內容）：\n{past_topics}" if past_topics else ""
    
    prompt = f"""
    你是 Jason Tsai (傑森數據)，資深 Data Analyst 兼 Senior Solution Engineer。
    文筆風格：極度專業、數據驅動、充滿商業洞察，語氣如同寫給客戶的「技術策略報告」 (Technical Strategy Report)。
    
    任務：根據今日 ({date_str}) 最新 AI 新聞撰寫一份深度觀察報告。
    {past_topics_str}

    待處理新聞數據 (包含標題、來源與連結)：
    {articles}

    要求 (SEO & 內容品質核心規範碼)：
    1. **標題格式**：`[{date_str}] <吸引人的技術主題>`。
    2. **內文長度**：中文主體約 600-800 字即可，需精煉且具備深度技術分析。
    3. **引用規範 (重要)**：每一項新聞觀點必須附上原始連結，格式為 `[標題](URL)`。
    4. **SEO 結構**：必須使用 H1, H2, H3 層級標籤，並在開頭包含技術洞察總結 (Executive Summary)。
    5. **關鍵字優化**：自然地融入 AI, Data, BigQuery, MarTech 等高流量技術關鍵字。
    6. **全方位翻譯 (核心)**：你必須提供「繁體中文」、「英文」、「日文」三種語言的完整分析內容。


    輸出格式：請嚴格遵守以下範例，先輸出一段 JSON 元數據，接著是三個語言區塊，中間用指定的標記隔開。

    ```json
    {{
      "title": {{ "zh": "...", "en": "...", "ja": "..." }},
      "description": {{ "zh": "...", "en": "...", "ja": "..." }},
      "sentiment": "...",
      "tags": {{ "zh": ["..."], "en": ["..."], "ja": ["..."] }}
    }}
    ```

    ---
    (這是 JSON 結束後的內容區塊)
    這裏是繁體中文的完整 1500 字深度分析內容...
    
    <!-- en -->
    # English Title
    Full 1500-word English translation and analysis here...

    <!-- ja -->
    # 日本語タイトル
    Full 1500-word Japanese translation and analysis here...
    """
    
    try:
        response = _call_gemini_with_retry(model, prompt)
        full_text = response.text
        
        if "---" not in full_text and "```json" not in full_text:
             logging.error(f"AI returned invalid format: {full_text[:100]}")
             return None, None
             
    except Exception as e:
        logging.error(f"AI Generation Failed after retries: {e}")
        return None, None
    
    import json
    import re
    
    try:
        json_match = re.search(r'```json\s*(.*?)\s*```', full_text, re.DOTALL)
        if json_match:
            metadata = json.loads(json_match.group(1))
            
            # More robust body extraction: everything after the first "---" that is NOT part of the JSON block
            # We look for the first "---" that appears after the closing ``` of the JSON block
            body_start = full_text.find("---", json_match.end())
            if body_start != -1:
                body_content = full_text[body_start+3:].strip()
            else:
                # Fallback: take everything after the JSON block
                body_content = full_text[json_match.end():].strip()
            
            frontmatter = f"""---
title:
  zh: "{metadata.get('title', {}).get('zh', 'AI 新聞')}"
  en: "{metadata.get('title', {}).get('en', 'AI News')}"
  ja: "{metadata.get('title', {}).get('ja', 'AIニュース')}"
description:
  zh: "{metadata.get('description', {}).get('zh', '').replace('"', "'")}"
  en: "{metadata.get('description', {}).get('en', '').replace('"', "'")}"
  ja: "{metadata.get('description', {}).get('ja', '').replace('"', "'")}"
date: "{date_str}"
tags:
  zh: {json.dumps(metadata.get('tags', {}).get('zh', ['Tech Trends']), ensure_ascii=False)}
  en: {json.dumps(metadata.get('tags', {}).get('en', ['Tech Trends']))}
  ja: {json.dumps(metadata.get('tags', {}).get('ja', ['Tech Trends']), ensure_ascii=False)}
published: true
---

"""
            full_markdown = frontmatter + body_content
            return full_markdown, metadata

    except Exception as e:
        logging.error(f"Failed to parse AI output JSON: {e}")
        
    return None, None
