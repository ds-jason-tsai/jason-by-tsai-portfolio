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
    zh: "傑森數據 Jason Analytics 付費專區。提供 Google NotebookLM AI 實戰課程、專業數據分析報告、Salesforce 技術簡報框架與數據工程實務指南。立即獲取深度商業洞察。",
    en: "Jason Analytics Premium. Expert AI practical courses (NotebookLM), data analysis reports, Salesforce pitch decks, and data engineering guides for deep business insights.",
    ja: "Jason Analytics プレミアム。Google NotebookLM AI実務講座、データ分析レポート、Salesforce 技術プレゼン、データエンジニアリングガイドを公開中。"
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
