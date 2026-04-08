import DashboardsClient from '../../../components/DashboardsClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "數據視覺化與 AI 搜尋監測儀表板 | 傑森數據 Jason Analytics", 
    en: "Data Dashboards & AI Search Monitoring | Jason Analytics", 
    ja: "データ可視化・AI検索モニタリングダッシュボード | ジェイソン・アナリティクス" 
  };
  const descriptions = {
    zh: "精選 Tableau 與 Looker Studio 商業儀表板作品。包含社群話題監測、GEO 生產式引擎優化監測等動態數據視覺化案例，搶佔 AI 時代數據先機。",
    en: "Selected Tableau & Looker Studio business dashboards. Featuring social listening and GEO (Generative Engine Optimization) monitoring to capture data opportunities in the AI era.",
    ja: "Tableau と Looker Studio を活用したビジネスダッシュボード集。ソーシャルリスニングや GEO (生成AI検索最適化) モニタリングなど、最先端のデータ活用事例を公開しています。"
  };
  return { 
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh']
  };
}

export default async function DashboardsPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  return <DashboardsClient lang={lang} />;
}
