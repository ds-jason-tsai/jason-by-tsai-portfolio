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
    zh: "傑森數據付費專區。提供高品質電子書報告、Google NotebookLM AI 實戰課程、Salesforce 技術簡報框架與乾淨數據集。立即獲取專業商業洞察。",
    en: "Jason Analytics Premium. High-quality data reports, AI practical courses (NotebookLM), Salesforce pitch decks, and clean datasets for strategic business insights.",
    ja: "ジェイソン・アナリティクスのプレミアムエリア。高品質な分析レポート、Google NotebookLM 活用講座、Salesforce 技術プレゼン資料などを提供しています。"
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
