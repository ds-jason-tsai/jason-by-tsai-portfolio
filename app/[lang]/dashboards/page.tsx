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
    zh: "傑森數據 Jason Analytics 專業數據視覺化服務。精通 Tableau 與 Looker Studio 商業儀表板設計，將複雜數據轉化為直覺且具備行動價值的決策圖表。我們能協助企業透過互動式監控面板掌握銷售趨勢、市場變化與營運效能。立即探索如何透過數據視覺化打造資訊領先優勢，將原始資料轉化為清晰的成長指南。點擊查看完整互動範例。",
    en: "Jason Analytics specializes in professional data visualization services. We design interactive Tableau and Looker Studio dashboards that transform complex raw data into intuitive, actionable business insights. Optimize your decision-making with custom sales monitoring, market analysis, and operational tracking. View our interactive dashboard gallery today.",
    ja: "Jason Analytics (ジェイソン・ツァイ) が提供するデータ視覚化。TableauやLooker Studioを用いたビジネスダッシュボード設計に精通。複雑なデータを直感的な意思決定チャートに変換し、販売監視や市場分析の実績も豊富。データの視覚化を通じて、情報優位性を築き、ビジネスを加速させるお手伝いをします。"
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
