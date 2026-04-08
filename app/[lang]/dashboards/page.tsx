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
    zh: "傑森數據 Jason Analytics 專業數據視覺化服務。精通 Tableau 與 Looker Studio 商業儀表板設計，將複雜數據轉化為直覺、具行動價值的決策圖表。涵蓋多種產業銷售監控、市場分析與營運效能分析案例。立即點擊查看互動式視覺化範例，打造您的數據競爭優勢。",
    en: "Jason Analytics (Jason Tsai) provides expert data visualization services. We specialize in designing Tableau and Looker Studio business dashboards that turn complex data into intuitive, actionable insights. Explore our industry-specific visualization cases and see how we create data-driven advantages. View interactive dashboards now.",
    ja: "Jason Analytics (ジェイソン・ツァイ) が提供する専門的なデータ視覚化サービス。TableauやLooker Studioを用いたビジネスダッシュボード設計に精通。複雑なデータを直感的な意思決定用チャートに変換し、販売監視や市場・運営分析の実績が豊富です。インタラクティブなダッシュボード例を今すぐご覧ください。"
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
