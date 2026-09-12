import DashboardsClient from '../../../components/DashboardsClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "Tableau 與 Looker Studio 數據視覺化儀表板 | 傑森數據 Jason Analytics", 
    en: "Data Dashboards | Tableau & Looker Studio | Jason Analytics", 
    ja: "データダッシュボード (Dashboards) | Tableau | ジェイソン・アナリティクス" 
  };
  const descriptions = {
    zh: "傑森數據提供 Tableau 與 Looker Studio 數據視覺化服務，將複雜數據轉化為具行動價值的互動儀表板。",
    en: "Jason Analytics specializes in professional data visualization services. We design interactive Tableau and Looker Studio dashboards that transform complex data into actionable business insights. Optimize your business decision-making with our operational tracking solutions.",
    ja: "Jason Analytics は Tableau・Looker Studio を用いたデータ可視化サービスを提供し、意思決定を最適化します。"
  };
  return {
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh'],
    alternates: {
      canonical: `https://jason-by-tsai-portfolio.vercel.app/${lang}/dashboards`,
      languages: {
        'zh': 'https://jason-by-tsai-portfolio.vercel.app/zh/dashboards',
        'en': 'https://jason-by-tsai-portfolio.vercel.app/en/dashboards',
        'ja': 'https://jason-by-tsai-portfolio.vercel.app/ja/dashboards',
        'x-default': 'https://jason-by-tsai-portfolio.vercel.app/zh/dashboards',
      },
    }
  };
}

export default async function DashboardsPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  return <DashboardsClient lang={lang} />;
}
