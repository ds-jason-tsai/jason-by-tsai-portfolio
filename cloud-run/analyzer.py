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
    
    # Build past topics section to prevent duplicate content
    past_topics_block = ""
    if past_topics:
        topics_list = "\n".join([f"  - {t}" for t in past_topics])
        past_topics_block = f"""
    ### ⚠️ 嚴格禁止重複 — 過去已發佈的文章主題 ###
    以下是最近7篇已發佈文章的標題。你**絕對不能**以相同主題、角度或核心論點撰寫本次文章，必須選擇完全不同的切入點：
{topics_list}
    """
    
    prompt = f"""
    You are Jason Analytics (傑森數據), a world-class AI news analyst. 
    Create a professional MULTILINGUAL technical report (ZH, EN, JA).

    今日日期：{date_context}
    {past_topics_block}
    ### 原始新聞數據 (請嚴格鎖定此內容，連結必須原封不動使用) ###
    {text}
    
    ### 寫作指令 (嚴格執行) ###
    1. **延伸閱讀格式**：必須且只能使用 Markdown 超連結格式：`- [新聞標題](URL)`。
       URL 必須使用原始新聞數據中提供的連結，禁止修改、截斷或添加任何參數。
    2. **禁止行為**：禁止在 Markdown 正文中重複輸出 JSON 區塊，禁止編造連結。
    3. **品牌結語**：文末必須附上：
       "Jason Analytics (傑森數據) 堅信，以數據為核心，結合 Google DeepMind 的前沿 AI 技術，將是企業在全球市場中取得競爭優勢、實現永續成長的關鍵。歡迎轉載或洽詢合作，請聯繫 [傑森數據 (Jason Analytics)](https://jason-by-tsai-portfolio.vercel.app/zh/contact)。"
    4. **文章架構**：前言 -> 深度技術洞察與商業應用潛力 -> 數據策略與企業轉型 -> 結論與策略建議 -> 延伸閱讀。
    5. **多元角度**：本次文章的切入角度必須與上方禁止重複清單所列主題截然不同。

    ### 輸出格式 ###
    你必須先輸出一個 JSON 區塊，包含 title, description, tags, sentiment。
    (注意：title 與 description 必須包含 zh, en, ja 子欄位)
    (注意：tags 必須包含 zh, en, ja 子欄位，每個語言**恰好三個**關鍵字，不多不少)
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

    # 1. Extract JSON and Body separately using index to avoid 'replace' bugs
    metadata = {}
    body_content = full_text
    
    # 1. Extract JSON and Body separately using index logic
    try:
        # Priority 1: Markdown JSON block
        json_match = re.search(r'```json\s*(.*?)\s*```', full_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1).strip()
            metadata = json.loads(json_str)
            body_content = full_text[json_match.end():].strip()
        else:
            json_match = re.search(r'\{.*\}', full_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0).strip()
                metadata = json.loads(json_str)
                body_content = full_text[json_match.end():].strip()

        if body_content.startswith("---"):
            body_content = re.sub(r'^---+\s*', '', body_content).strip()

        # 2. Extract and sanitize fields
        def clean(s): return str(s).replace('"', "'").strip()
        
        title_zh = clean(get_lang_val(metadata, 'title', 'zh')) or f"[{date_context}] AI 趨勢分析"
        title_en = clean(get_lang_val(metadata, 'title', 'en')) or "AI Tech Insights"
        title_ja = clean(get_lang_val(metadata, 'title', 'ja')) or "AI 技術インサイト"
        
        desc_zh = clean(get_lang_val(metadata, 'description', 'zh'))
        desc_en = clean(get_lang_val(metadata, 'description', 'en'))
        desc_ja = clean(get_lang_val(metadata, 'description', 'ja'))

        def get_tags(lang):
            t = metadata.get('tags', {})
            if isinstance(t, dict):
                tag_list = t.get(lang, ["AI", "數據分析", "科技趨勢"])
            else:
                tag_list = ["AI", "數據分析", "科技趨勢"]
            # Enforce exactly 3 tags
            if len(tag_list) < 3:
                tag_list = (tag_list + ["AI", "科技", "數據"])[:3]
            return tag_list[:3]  # Hard cap at exactly 3

        tags_zh, tags_en, tags_ja = get_tags('zh'), get_tags('en'), get_tags('ja')

        # 3. Assemble and Return
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

    except Exception as e:
        logging.error(f"Final Parsing Stage Error: {e}")
        # Last resort: return original content wrapped in a generic metadata
        return full_text, metadata

    return None, None
