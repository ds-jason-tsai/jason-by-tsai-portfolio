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
    
    # Strictly use Gemini 2.5 Flash
    target_model = 'models/gemini-2.5-flash'
    
    try:
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        ]
        model = genai.GenerativeModel(target_model, safety_settings=safety_settings)
        logging.info(f"Targeting model: {target_model}")
    except Exception as e:
        logging.error(f"Model initialization failed: {e}")
        return None, None

    date_context = current_date if current_date else "today"
    
    prompt = f"""
    You are Jason Analytics (傑森數據), a world-class AI news analyst. 
    Create a professional MULTILINGUAL technical report (ZH, EN, JA).

    今日日期：{date_context}
    
    ### 原始新聞數據 (請嚴格鎖定此內容) ###
    {text}
    
    ### 寫作指令 (嚴格執行) ###
    1. **延伸閱讀格式**：必須且只能使用 Markdown 超連結格式：`- [新聞標題](URL)`。
    2. **禁止行為**：禁止在 Markdown 正文中重複輸出 JSON 區塊，禁止編造連結。
    3. **品牌結語**：文末必須附上：
       "Jason Analytics (傑森數據) 堅信，以數據為核心，結合 Google DeepMind 的前沿 AI 技術，將是企業在全球市場中取得競爭優勢、實現永續成長的關鍵。歡迎轉載或洽詢合作，請聯繫 [傑森數據 (Jason Analytics)](/zh/contact)。"
    4. **文章架構**：前言 -> 深度技術洞察與商業應用潛力 -> 數據策略與企業轉型 -> 結論與策略建議 -> 延伸閱讀。

    ### 輸出格式 ###
    你必須先輸出一個 JSON 區塊，包含 title, description, tags, sentiment。
    (注意：title 與 description 必須包含 zh, en, ja 子欄位)
    接著輸入 `---` 分隔線。
    最後輸出三語版 Markdown 正文 (ZH, EN, JA 分別用 <!-- en --> 與 <!-- ja --> 標註)。
    """
    
    try:
        response = _call_gemini_with_retry(model, prompt)
        full_text = response.text
        if not full_text:
            return None, None
    except Exception as e:
        logging.error(f"AI Generation Error: {e}")
        return None, None
    
    import json
    import re

    # Helper to handle both string and dict response for multilingual fields
    def get_lang_val(obj, key, lang='zh'):
        field = obj.get(key, {})
        if isinstance(field, dict):
            return field.get(lang, "")
        return field if isinstance(field, str) and lang == 'zh' else ""

    # 1. Extract JSON
    metadata = {}
    body_content = full_text
    try:
        json_match = re.search(r'\{(?:[^{}]|(?R))*\}', full_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            metadata = json.loads(json_str)
            # Remove JSON from body to prevent double output
            body_content = full_text.replace(json_str, "", 1).strip()
            # Remove the separator if it exists
            if body_content.startswith("---"):
                body_content = body_content[3:].strip()

        # 2. Extract specific fields safely
        title_zh = get_lang_val(metadata, 'title', 'zh').replace('"', "'") or f"[{date_context}] AI 趨勢分析"
        title_en = get_lang_val(metadata, 'title', 'en').replace('"', "'") or "AI Trends Analysis"
        title_ja = get_lang_val(metadata, 'title', 'ja').replace('"', "'") or "AIトレンド分析"
        
        desc_zh = get_lang_val(metadata, 'description', 'zh').replace('"', "'")
        desc_en = get_lang_val(metadata, 'description', 'en').replace('"', "'")
        desc_ja = get_lang_val(metadata, 'description', 'ja').replace('"', "'")

        tags_zh = metadata.get('tags', {}).get('zh', ['AI']) if isinstance(metadata.get('tags'), dict) else ["AI"]
        tags_en = metadata.get('tags', {}).get('en', ['AI']) if isinstance(metadata.get('tags'), dict) else ["AI"]
        tags_ja = metadata.get('tags', {}).get('ja', ['AI']) if isinstance(metadata.get('tags'), dict) else ["AI"]

        # 3. Final Formatting
        frontmatter = f"""---
title:
  zh: "{title_zh}"
  en: "{title_en}"
  ja: "{title_ja}"
description:
  zh: "{desc_zh}"
  en: "{desc_en}"
  ja: "{desc_ja}"
date: "{date_context}"
tags:
  zh: {json.dumps(tags_zh, ensure_ascii=False)}
  en: {json.dumps(tags_en)}
  ja: {json.dumps(tags_ja, ensure_ascii=False)}
published: true
---

"""
        return frontmatter + body_content, metadata

    except Exception as be:
        logging.error(f"Body Formatting Error: {be}")
        return full_text, metadata

    return None, None
