import DashboardsClient from '../../../components/DashboardsClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "Tableau 與 Looker Studio 數據視覺化儀表板 | 傑森數據", 
    en: "Data Dashboards | Tableau, Looker Studio & Viz | Jason Analytics", 
    ja: "データダッシュボード | Tableau, Looker Studio & 可視化 | ジェイソン・アナリティクス" 
  };
  const descriptions = {
    zh: "傑森數據 Jason Analytics 的商業儀表板作品集。展示 Tableau、Looker Studio 與 Power BI 數據視覺化實務，包含 AI 搜尋監測與社群輿情分析儀表板。",
    en: "Business dashboard portfolio of Jason Analytics. Showcasing Tableau, Looker Studio, and Power BI visualization projects, including AI monitoring and social listening.",
    ja: "Jason Analytics のビジネスダッシュボード集。Tableau、Looker Studio、Power BI によるデータ可視化、AI検索監視、SNS分析の実績を公開中。"
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
