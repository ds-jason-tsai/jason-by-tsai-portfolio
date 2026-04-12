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
    zh: "傑森數據 Jason Analytics 提供專業的 Tableau 與 Looker Studio 數據視覺化服務。我們精通商業儀表板設計，能將複雜的原始數據轉化為具備行動價值的直覺決策圖表，協助企業透過互動式監控面板掌握銷售趨勢、市場變化與營運效能。立即探索如何透過數據視覺化打造資訊領先優勢，將資料轉化為清晰的成長指南。點擊查看完整互動範例。",
    en: "Jason Analytics specializes in professional data visualization services. We design interactive Tableau and Looker Studio dashboards that transform complex data into actionable business insights. Optimize your business decision-making with our operational tracking solutions.",
    ja: "ジェイソン・アナリティクス (Jason Analytics) が提供するデータダッシュボード (Dashboards)。TableauやLooker Studioを用いたビジネスデータ可視化、販売監視や市場分析の設計に精通。データの力を引き出し、最先端のビジュアル分析で意思決定を最適化しましょう。"
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
      },
    }
  };
}

export default async function DashboardsPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  return <DashboardsClient lang={lang} />;
}
