import ReportsClient from '../../../components/ReportsClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "專業數據報告、AI 實戰課程與自動化方案 | 傑森數據 Jason Analytics", 
    en: "Premium Data Reports & AI Courses | Jason Analytics", 
    ja: "分析レポート (Reports) ・ AI講座 (AI) | ジェイソン・アナリティクス" 
  };
  const descriptions = {
    zh: "傑森數據精選進階數據報告、市場研究與 Solution Engineer 簡報範例，購買後即可立即下載，賦能商業決策。",
    en: "Explore premium data reports and presentation templates at Jason Analytics. We provide market research, cleaned datasets, and Solution Engineer decks. Instantly download these resources to empower your decision-making and save time.",
    ja: "Jason Analytics が提供する分析レポート、AI実務講座、自動化ソリューション。購入後すぐにダウンロード可能です。"
  };
  return {
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh'],
    alternates: {
      canonical: `https://jason-by-tsai-portfolio.vercel.app/${lang}/reports`,
      languages: {
        'zh': 'https://jason-by-tsai-portfolio.vercel.app/zh/reports',
        'en': 'https://jason-by-tsai-portfolio.vercel.app/en/reports',
        'ja': 'https://jason-by-tsai-portfolio.vercel.app/ja/reports',
        'x-default': 'https://jason-by-tsai-portfolio.vercel.app/zh/reports',
      },
    }
  };
}

export default async function ReportsPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  return <ReportsClient lang={lang} />;
}
