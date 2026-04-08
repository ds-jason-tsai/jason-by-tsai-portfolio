import ReportsClient from '../../../components/ReportsClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "專業數據報告、AI 實戰課程與自動化方案 | 傑森數據 Jason Analytics", 
    en: "Premium Data Reports & AI Practical Courses | Jason Analytics", 
    ja: "分析レポート・AI実務講座・自動化ソリューション | ジェイソン・アナリティクス" 
  };
  const descriptions = {
    zh: "傑森數據 Jason Analytics 數據專題深入報導。運用 NotebookLM 與先進 AI 技術，針對數據分析趨勢、AI 實戰應用與 MarTech 顧問洞察進行深度解析。提供專業且具行動導向的數據專案建議，協助個人與企業掌握未來數據趨勢，立即獲取最新專題報導並看更多專業建議。",
    en: "In-depth data reports by Jason Analytics (Jason Tsai). We use NotebookLM and advanced AI to analyze data trends, AI applications, and MarTech insights. Our actionable professional reports help individuals and businesses master future data trends. Get the latest insights and expert advice now.",
    ja: "Jason Analytics (ジェイソン・ツァイ) によるデータレポートの深掘り。NotebookLMと高度なAIを駆使し、データ分析トレンド、AI実務、MarTechの知見を徹底解説。個人や企業のデータ活用を支援する実践的なアドバイスを掲載。最新のデータレポートを今すぐチェック。"
  };
  return { 
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh']
  };
}

export default async function ReportsPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  return <ReportsClient lang={lang} />;
}
