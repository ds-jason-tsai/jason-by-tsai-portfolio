import os
from google import genai
import datetime

def analyze_and_summarize(articles, past_topics=None):
    """
    Takes raw articles layout, queries Gemini for summaries, translations, 
    and returns a structured Markdown string with frontmatter.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set.")
        
    client = genai.Client(api_key=api_key)
    
    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
    
    past_topics_str = f"\n過去一週已寫過的主題（請避開重複內容）：\n{past_topics}" if past_topics else ""
    
    prompt = f"""
    你是 Jason Tsai (傑森數據)，一位資深 Data Analyst 兼 Solution Engineer。
    你的文筆風格：專業、客觀、充滿實務洞察，但語氣平易近人（有「人味」），善於將複雜技術轉化為商業價值。
    
    任務：根據今日 ({date_str}) 來自各大 AI 機構的最新新聞與技術數據，撰寫一篇深度的技術觀察報告。
    {past_topics_str}

    輸入數據：
    {articles}

    文章規格與要求：
    1. **標題格式**：必須為 `[{date_str}] <一個吸引人的技術趨勢主題標題>`。
    2. **長度與結構**：總字數約 1200 字以上，內容必須充實：
       - **[今日 AI 趨勢分析]**：以 Solution Engineer 視角開場，綜觀今日 AI 界的變動。
       - **[核心技術深度解析]**：挑選 3-5 則最重要的新聞，每則需包含「技術要點」與「市場/開發者影響力分析」。
       - **[數據觀點與情緒分析]**：評斷今日 AI 發展趨勢（積極、防禦或突破性），並給出 Data Analyst 的預測。
       - **[結語與建議]**：給讀者的實務建議。
    3. **引用權限 (References)**：每則新聞結尾必須明確附上詳細的來源網址 (URLs)。
    4. **標籤收斂**：只能從以下名單中挑選 2-4 個 Tags：["Tech Trends", "AI News", "Generative AI", "Data Analysis", "MarTech", "Industry Insights"]。
    5. **嚴格不重複**：請絕對避開過去一週已涵蓋的細節，專注於「今日最新」的進展。

    請直接輸出純 Markdown 格式，並在最開頭包含以下 FrontMatter (請將標題/摘要填入)：
    ---
    title: "[{date_str}] <你的標題>"
    description: "<簡潔 50-80 字描述今日精華>"
    date: "{date_str}"
    tags: ["Tech Trends", "AI News"]
    published: true
    ---
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    return response.text
