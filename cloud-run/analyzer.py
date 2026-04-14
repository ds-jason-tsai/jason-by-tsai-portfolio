import os
from google import genai
import datetime
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from google.genai import errors

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=4, max=60),
    retry=retry_if_exception_type(errors.ClientError),
    reraise=True
)
def _call_gemini_with_retry(client, model, contents):
    return client.models.generate_content(model=model, contents=contents)

def analyze_and_summarize(articles, past_topics=None):
    """
    Takes raw articles layout, queries Gemini on Vertex AI for summaries, translations, 
    and returns a structured data object + Markdown string.
    """
    project_id = "personal-site-492809"
    location = "asia-east1"
    
    # Vertex AI Client
    client = genai.Client(vertexai=True, project=project_id, location=location)
    
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

    JSON 格式範例 (請放在內容最前方，用 ```json 標記)：
    {{
      "title": "...",
      "description": "...",
      "sentiment": "...",
      "tags": "..."
    }}

    請直接輸出內容，不要多餘的解釋。
    Markdown 內容需包含 FrontMatter：
    ---
    title: "[{date_str}] <你的標題>"
    description: "<摘要>"
    date: "{date_str}"
    tags: ["Tech Trends", "AI News"]
    published: true
    ---
    """
    
    # Use Pro model for higher stability and quality on Vertex AI
    response = _call_gemini_with_retry(
        client=client,
        model='gemini-1.5-pro',
        contents=prompt
    )
    
    full_text = response.text
    
    # Simple extraction of JSON and Markdown
    import json
    import re
    
    try:
        json_match = re.search(r'```json\s*(.*?)\s*```', full_text, re.DOTALL)
        if json_match:
            metadata = json.loads(json_match.group(1))
            markdown = full_text.replace(json_match.group(0), "").strip()
            return markdown, metadata
    except Exception as e:
        logging.error(f"Failed to parse AI output JSON: {e}")
        
    return full_text, None
