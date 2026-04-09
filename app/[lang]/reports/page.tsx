import ReportsClient from '../../../components/ReportsClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "專業數據報告、AI 實戰課程與自動化方案 | 傑森數據 Jason Analytics", 
    en: "Premium Data Reports & AI Courses | Jason Analytics", 
    ja: "分析レポート・AI実務講座・自動化ソリューション | ジェイソン・アナリティクス" 
  };
  const descriptions = {
    zh: "傑森數據 Jason Analytics 精選進階數據報告與專業簡報範例。我們提供高品質的市場研究報告、清洗過的乾淨資料集，以及專為解決企業問題設計的 Solution Engineer 簡報模板。透過最前線的觀察與嚴謹的數據分析，協助您快速掌握產業競爭態勢與技術實作解決方案。購買後即可立即下載，省去冗長的數據收集整理時間，賦能您的商業決策。",
    en: "Explore premium data reports and presentation templates at Jason Analytics. We provide market research, cleaned datasets, and Solution Engineer decks. Instantly download these resources to empower your decision-making and save time.",
    ja: "ジェイソン・アナリティクス (Jason Analytics) が提供する、分析レポート、AI実務講座、自動化ソリューション。企業の課題解決に特化した高品質な市場動向、クレンジング済みデータセット、エンジニア向け提案資料などの限定コンテンツを揃えています。最新のデータ分析に基づいた洞察を今すぐ手に入れ、ビジネスの意思決定を最適化しましょう。"
  };
  return { 
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh'],
    alternates: {
      canonical: `https://jason-by-tsai-portfolio.vercel.app/${lang}/reports`,
    }
  };
}

export default async function ReportsPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  return <ReportsClient lang={lang} />;
}
