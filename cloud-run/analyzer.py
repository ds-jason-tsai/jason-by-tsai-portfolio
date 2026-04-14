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
        # Reduced safety settings to prevent "Empty Result" due to safety blocks
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
    You are an expert AI & Data Science professional analyst named Jason Analytics (傑森數據). 
    Your job is to create a professional technical newsletter article based on the provided data.
    
    今日日期：{date_context}
    
    分析指南：
    1. 僅基於下方數據進行事實敘述。
    2. 標題格式：[{date_context}] <標題>。
    3. 每個主題必須包含：前言、深度技術洞察、數據策略、結論、延伸閱讀。
    4. 結尾必須附上品牌結語：
       "Jason Analytics (傑森數據) 堅信，以數據為核心，結合 Google DeepMind 的前沿 AI 技術，將是企業在全球市場中取得競爭優勢、實現永續成長的關鍵。歡迎轉載或洽詢合作，請聯繫 [傑森數據 (Jason Analytics)](/zh/contact)。"
    
    輸出格式要求：你必須先輸出一段含有 JSON 的內容，JSON 必須包含 title, description, tags, sentiment。
    JSON 完畢後，使用 --- 分隔線，接著輸出 Markdown 內文。
    繁體中文內容後，請使用 <!-- en --> 引導英文版，再使用 <!-- ja --> 引導日文版。

    ### 原始新聞數據 ###
    {text}
    """
    
    try:
        response = _call_gemini_with_retry(model, prompt)
        if not response or not response.candidates:
            logging.error("AI returned NO candidates. Possible safety block.")
            return None, None
            
        full_text = response.text
        if not full_text:
            logging.error(f"AI returned Empty text. Prompt Feedback: {response.prompt_feedback}")
            return None, None
            
    except Exception as e:
        logging.error(f"AI Generation Critical Error: {e}")
        return None, None
    
    import json
    import re
    
    # Robust Meta-Data Extraction (Try multiple patterns)
    metadata = {}
    try:
        # Pattern 1: JSON block with backticks
        mj = re.search(r'\{.*\}', full_text, re.DOTALL)
        if mj:
            metadata = json.loads(mj.group(0))
        else:
            raise ValueError("No JSON-like structure found")
    except Exception as je:
        logging.warning(f"Metadata JSON parsing failed: {je}. Attempting legacy extraction.")
        metadata = {
            "title": {"zh": f"[{date_context}] AI 趨勢快報"},
            "description": {"zh": "專業 AI 與數據分析報告"},
            "tags": {"zh": ["AI", "Data", "Tech"]},
            "sentiment": "Neutral"
        }

    # Robust Body Extraction
    try:
        # Everything after the JSON block or the first separator
        if "---" in full_text:
            body_content = full_text.split("---", 1)[1].strip()
        else:
            # Fallback: remove the JSON part and take the rest
            body_content = re.sub(r'\{.*\}', '', full_text, flags=re.DOTALL).strip()
            
        if len(body_content) < 100:
             logging.warning("Extracted body too short, using full response.")
             body_content = full_text

        # Generate Frontmatter
        frontmatter = f"""---
title:
  zh: "{metadata.get('title', {}).get('zh', '').replace('"', "'")}"
  en: "{metadata.get('title', {}).get('en', '').replace('"', "'")}"
  ja: "{metadata.get('title', {}).get('ja', '').replace('"', "'")}"
description:
  zh: "{metadata.get('description', {}).get('zh', '').replace('"', "'")}"
  en: "{metadata.get('description', {}).get('en', '').replace('"', "'")}"
  ja: "{metadata.get('description', {}).get('ja', '').replace('"', "'")}"
date: "{date_context}"
tags:
  zh: {json.dumps(metadata.get('tags', {}).get('zh', ['Tech']), ensure_ascii=False)}
  en: {json.dumps(metadata.get('tags', {}).get('en', ['Tech']))}
  ja: {json.dumps(metadata.get('tags', {}).get('ja', ['Tech']), ensure_ascii=False)}
published: true
---

"""
        return frontmatter + body_content, metadata

    except Exception as be:
        logging.error(f"Body Formatting Error: {be}")
        return full_text, metadata
            frontmatter = f"""---
title:
  zh: "{metadata.get('title', {}).get('zh', 'AI 新聞')}"
  en: "{metadata.get('title', {}).get('en', 'AI News')}"
  ja: "{metadata.get('title', {}).get('ja', 'AIニュース')}"
description:
  zh: "{metadata.get('description', {}).get('zh', '').replace('"', "'")}"
  en: "{metadata.get('description', {}).get('en', '').replace('"', "'")}"
  ja: "{metadata.get('description', {}).get('ja', '').replace('"', "'")}"
date: "{date_context}"
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
