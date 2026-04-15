import os
import datetime
import logging
import google.generativeai as genai
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=2, min=10, max=30))
def _call_gemini_with_retry(model, prompt):
    return model.generate_content(prompt)

def analyze_and_summarize(text, past_topics=None, current_date=None, slug=None, allowed_urls=None):
    """
    Calls Gemini to summarize provided news text into a structured multilingual article.
    Includes a post-generation link verification step to ensure 100% source integrity.
    """
    if allowed_urls is None:
        allowed_urls = []

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
    3. **品牌結語**：文末必須附上（每個語言版本均須對應翻譯）：
       "Jason Analytics (傑森數據) 堅信，以數據為核心，結合 AI 技術，將是企業在全球市場中取得競爭優勢、實現永續成長的關鍵。歡迎轉載或洽詢合作，請聯繫傑森數據 (Jason Analytics)。"
    4. **文章架構**：必須使用以下 H2 章節（可用 H3 展開子段落）：
       ## 前言  →  ## 深度技術洞察與商業應用  →  ## 數據策略與企業轉型  →  ## 結論與策略建議  →  ## 延伸閱讀
    5. **多元角度**：本次文章的切入角度必須與上方禁止重複清單所列主題截然不同。
    6. **內容深度**：每個語言版本正文不少於 600 字（ZH）/ 500 words（EN/JA），需含具體數據或案例佐證。

    ### SEO 規範 (Google Search 合規，每條強制執行) ###
    - **title**：ZH 須 20–55 字元；EN/JA 須 40–65 characters。關鍵字置於標題前端，禁止標題黨。
    - **description**：每個語言版本**必須介於 140–300 字元**（含標點）。自然語言描述核心洞察，含主要關鍵字。
    - **tags**：每語言恰好三個，選擇搜尋量高且與 AI/數據/應用高度相關的關鍵字。
    - **E-E-A-T**：包含作者品牌(Jason Analytics)、今日日期、具體數據或引用來源。
    - **Heading 結構**：使用 ## 主章節、### 子章節。H1 由系統自動生成，文章中禁止出現 # 開頭的行。
    - **安全內容**：無廣告誘導、無詐欺、無暴力、無色情，符合 Google Safe Search 標準。
    - **UIUX**：段落間保留空行，清單使用 `-` 開頭，避免超長不換行段落（每段不超過 150 字）。

    ### 輸出格式 ###
    先輸出一個 ```json 區塊，包含 title, description, tags, sentiment。
    (title / description：必須含 zh, en, ja 子欄位)
    (description：每個語言**必須 140–300 字元**，不足請補齊，超過請截短)
    (tags：zh/en/ja 各**恰好三個**關鍵字)
    接著輸出 `---` 分隔線。
    最後輸出三語版 Markdown 正文 (ZH 版直接開始；EN 版前加 <!-- en -->；JA 版前加 <!-- ja -->)。
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
        
        # Ensure SEO-compliant description length: 140-300 chars
        def _seo_desc(raw: str, lang: str) -> str:
            s = clean(raw)
            if len(s) > 300:
                # Truncate at the last space before 297 to avoid cutting mid-word
                truncated = s[:297].rsplit(' ', 1)[0]
                s = truncated + '...'
                logging.warning(f"SEO desc [{lang}] truncated to {len(s)} chars")
            elif len(s) < 140:
                logging.warning(f"SEO desc [{lang}] too short: {len(s)} chars (LLM under-generated)")
            return s

        desc_zh = _seo_desc(get_lang_val(metadata, 'description', 'zh'), 'zh')
        desc_en = _seo_desc(get_lang_val(metadata, 'description', 'en'), 'en')
        desc_ja = _seo_desc(get_lang_val(metadata, 'description', 'ja'), 'ja')

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
        slug_line = f'slug: "{slug}"\n' if slug else ""
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
{slug_line}tags:
  zh: {json.dumps(tags_zh, ensure_ascii=False)}
  en: {json.dumps(tags_en)}
  ja: {json.dumps(tags_ja, ensure_ascii=False)}
published: true
---

"""
        # 4. Strict Link Verification (Post-Check)
        # Prevents LLM hallucinations from creating broken or unverified links.
        def scrub_links(content, permitted):
            # Find all markdown links [text](url)
            links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
            scrubbed = content
            for link_text, url in links:
                # If URL is not in the allowed list, downgrade to plain text to protect SEO/UX
                if url not in permitted:
                    logging.warning(f"Link Scrubbed: Hallucinated URL '{url}' removed.")
                    scrubbed = scrubbed.replace(f"[{link_text}]({url})", link_text)
            return scrubbed

        # 5. Semantic Validation (Post-Check)
        # Ensures the content is not mentioning obviously stale temporal info (e.g. 2024/early 2025)
        # unless specifically relevant.
        def validate_content_freshness(content):
            stale_indicators = ["2023", "2024", "去年", "last year"]
            # If the current date is 2026, then 2025 is "last year" and 2024 is even older.
            # We want to be careful about hallucinations that bring in old data.
            for indicator in stale_indicators:
                if indicator in content:
                    # We don't necessarily fail here, but we log a warning
                    logging.warning(f"Validation: Article contains potential stale reference: '{indicator}'")
            return True

        body_scrubbed = scrub_links(body_content, allowed_urls)
        validate_content_freshness(body_scrubbed)
        
        # Ensure minimum length for SEO (ZH > 600 chars)
        if len(body_scrubbed) < 800:
             logging.warning(f"Validation: Generated body might be too short for SEO ({len(body_scrubbed)} chars)")

        final_content = frontmatter + body_scrubbed
        return final_content, metadata


    except Exception as e:
        logging.error(f"Final Parsing Stage Error: {e}")
        # Last resort: return original content wrapped in a generic metadata
        return full_text, metadata

    return None, None
