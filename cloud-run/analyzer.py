import os
import datetime
import logging
import google.generativeai as genai
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=10, max=30))
def _call_gemini_with_retry(model, prompt):
    return model.generate_content(prompt)

def analyze_and_summarize(text, past_topics=None, current_date=None):
    """
    Calls Gemini to summarize provided news text into a structured multilingual article.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logging.error("GEMINI_API_KEY not set.")
        return None, None
    
    genai.configure(api_key=api_key)
    
    # Strictly use Gemini 2.5 Flash in 'Savings Mode'
    target_models = [
        'models/gemini-2.5-flash'
    ]
    
    model = None
    for target in target_models:
        try:
            model = genai.GenerativeModel(target)
            # Test it briefly
            logging.info(f"Targeting model: {target}")
            break
        except:
            continue
            
    if not model:
        # Emergency backup: list models only if the above fails
        available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        model = genai.GenerativeModel(available_models[0])
    
    if not model:
        logging.error("Critical: No Gemini models could be initialized.")
        return None, None

    date_context = current_date if current_date else "today"
    
    prompt = f"""
    You are an expert AI & Data Science professional analyst. Your job is to create a high-quality, professional technical newsletter article based on the provided news snippet.
    
    今天日期是：{date_context}。
    
    請嚴格遵守以下事實與品質規範：
    1. **限用新聞來源**：僅能根據我提供的新聞標題與內容進行分析，禁止捏造新聞或參考連結。
    2. **連結嚴謹性**：文末延伸閱讀的連結必須「完全等同」於我提供給你的原始 URL，禁止修改或自創連結，否則會導致 404 報錯。
    3. **時效正確性**：若文章提到「今日」或「最新」，必須確保該新聞是在 {date_context} 附近發布的事實，專注於事實敘述。
    
    要求 (SEO & 內容品質核心規範碼)：
    1. **標題格式**：`[{date_context}] <吸引人的技術主題>`。
    2. **內文長度**：中文主體約 500-700 字即可，需精煉且具備高度技術含金量。
    3. **Tags 標籤**：必須且只能產出 3 個最具代表性的技術標籤。
    4. **個人品牌結詞**：每篇文章結尾必須使用以下「正確品牌名」結語：
       "Jason Analytics (傑森數據) 堅信，以數據為核心，結合 Google DeepMind 的前沿 AI 技術，將是企業在全球市場中取得競爭優勢、實現永續成長的關鍵。歡迎轉載或洽詢合作，請聯繫 [傑森數據 (Jason Analytics)](/zh/contact)。"
    5. **SEO 限制**：
       - Meta Description: 中文 150 字內，英文/日文 160 個字元內。
    
    內容架構必須包含：
    - 前言 (取代原本的執行摘要)
    - 深度技術洞察與商業應用潛力
    - 數據策略與企業轉型
    - 結論與策略建議
    - 延伸閱讀 (取代原本的參考資料，內容必須是條列式 [標題](URL))

    JSON 標籤輸出格式：
    請在 JSON 的 `tags` 欄位中，確保每個語言都只有 3 個最精準的關鍵字標籤。
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
