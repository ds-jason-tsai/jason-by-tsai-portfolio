import Link from 'next/link';
import type { Metadata } from 'next';
// BuyButton is now on the /reports page itself

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { zh: "專業服務 | 傑森數據", en: "Services | Jason Tsai", ja: "サービス | ジェイソン・アナリティクス" };
  return { title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'] };
}

const DataIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const IntegrationIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const ChartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const EducationIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const ReportIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const CartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

export default async function Services({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: {
      title: "專業服務",
      desc: "結合商業思維與深厚技術底蘊，為您提供專屬的數據驅動解決方案。",
      cta: "👉 立即預約諮詢",
      services: [
        { icon: <CartIcon />, name: lang === 'zh' ? '付費數據洞察報告' : lang === 'ja' ? 'データ＆レポート販売' : 'Data & Reports Store', desc: lang === 'zh' ? '爬蟲乾淨資料、市場報告及 Solution Engineer 簡報。購買後立即下載，無需等待。' : lang === 'ja' ? 'スクレイピングデータや市場レポート。購入後すぐにダウンロード可能。' : 'Clean datasets, market reports & SE pitch decks. Download instantly after purchase.', price: lang === 'zh' ? '立即選購 →' : 'Shop Now →' },
        { icon: <DataIcon />, name: "數據諮詢", desc: "2B2C 皆可，包含資料處理、專案製作、家教、企業軟體導入等。", price: "請聯絡討論" },
        { icon: <ReportIcon />, name: "客製化分析報告", desc: "以嚴謹的商業思維，轉化冰冷數據為戰略級深入洞察報告。", price: "請聯絡討論" },
        { icon: <ChartIcon />, name: "客製化儀表板", desc: "使用 Tableau、Looker Studio 建立互動式視覺化架構，輔助決策。", price: "請聯絡討論" },
        { icon: <IntegrationIcon />, name: "MarTech 技術導入", desc: "包含 GA4 網站事件追蹤、CDP (如 Celebrus) 顧客數據平台生態組合。", price: "請聯絡討論" },
        { icon: <EducationIcon />, name: "專案指導", desc: "大學、研究所求職作品集 (Focus: 數據/商業分析師、資料科學、AI)。", price: "1,200 TWD / hr" },
      ]
    },
    en: {
      title: "Professional Services",
      desc: "Delivering data-driven solutions with a blend of business acumen and technical depth.",
      cta: "👉 Book a Consultation",
      services: [
        { icon: <CartIcon />, name: "Data & Reports Store", desc: "Clean scraped datasets and market reports. Online storefront coming soon.", price: "Coming Soon" },
        { icon: <DataIcon />, name: "Data Consulting", desc: "B2B/B2C data processing, project creation, tutoring, and software integration.", price: "Contact for Pricing" },
        { icon: <ReportIcon />, name: "Custom Analytics Reports", desc: "Transforming raw data into strategic, business-driven insight reports.", price: "Contact for Pricing" },
        { icon: <ChartIcon />, name: "Custom Dashboards", desc: "Interactive visualization using Tableau and Looker Studio tailored to your needs.", price: "Contact for Pricing" },
        { icon: <IntegrationIcon />, name: "MarTech Integration", desc: "Implementation of GA4 event tracking and CDP platforms (e.g. Celebrus).", price: "Contact for Pricing" },
        { icon: <EducationIcon />, name: "Mentorship & Guidance", desc: "Portfolio guidance for college/grad students (DA/BA/DS/AI Engineer).", price: "1,200 TWD / hr" },
      ]
    },
    ja: {
      title: "プロフェッショナルサービス",
      desc: "ビジネスの洞察力と深い技術力を融合させたデータ駆動型ソリューションを提供します。",
      cta: "👉 無料相談を予約",
      services: [
        { icon: <CartIcon />, name: "データ＆レポート販売", desc: "スクレイピングデータや市場レポート。オンライン決済ストア近日公開。", price: "まもなく公開" },
        { icon: <DataIcon />, name: "データコンサルティング", desc: "B2B/B2Cに対応。データ処理、プロジェクト制作、個別指導、導入支援等。", price: "要相談 (Contact)" },
        { icon: <ReportIcon />, name: "カスタム分析レポート", desc: "独自のビジネス思考を活用し、データを戦略レベルの洞察レポートへ変換。", price: "要相談 (Contact)" },
        { icon: <ChartIcon />, name: "カスタムダッシュボード", desc: "Tableau、Looker Studioを使用した対話型ダッシュボード環境の構築。", price: "要相談 (Contact)" },
        { icon: <IntegrationIcon />, name: "MarTech 導入", desc: "GA4イベントトラッキング、CDPなどのマーケティングエコシステム統合。", price: "要相談 (Contact)" },
        { icon: <EducationIcon />, name: "プロジェクトメンター", desc: "大学生・大学院生向けポートフォリオ作成指導（DA/BA/DS/AIエンジニア）。", price: "1,200 TWD / hr" }
      ]
    }
  };

  const t = content[lang];

  return (
    <section className="services fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      <div className="services-grid">
        {t.services.map((svc, idx) => {
          const isStore = svc.name.includes('Store') || svc.name.includes('販売') || svc.name.includes('報告');
          const cardContent = (
            <div className="service-card" style={{ cursor: isStore ? 'default' : 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="service-icon">{svc.icon}</div>
              <h3 className="service-title">{svc.name}</h3>
              <div className="service-price-tag" style={{
                 background: 'rgba(0, 242, 254, 0.1)',
                 color: 'var(--accent-color)',
                 padding: '0.3rem 0.8rem',
                 borderRadius: '20px',
                 fontSize: '0.85rem',
                 fontWeight: '800',
                 marginBottom: '1rem',
                 display: 'inline-block',
                 alignSelf: 'flex-start'
              }}> 💲 {svc.price || 'Contact for Pricing'} </div>
              <p className="service-desc" style={{ flexGrow: 1 }}>{svc.desc}</p>
              
              <div style={{ marginTop: '1.5rem', alignSelf: 'flex-start' }}>
                 {isStore ? (
                   <Link href={`/${lang}/reports?utm_source=internal&utm_medium=button&utm_campaign=services_card_reports`} className="btn-primary" style={{ display: 'inline-block', padding: '0.6rem 1.5rem', fontSize: '0.95rem', borderRadius: '30px', fontWeight: '800', textAlign: 'center' }}>
                      {lang === 'zh' ? '💎 前往報告區' : lang === 'ja' ? '💎 レポート一覧' : '💎 View Reports'}
                   </Link>
                 ) : (
                   <span className="btn-primary" style={{ display: 'inline-block', padding: '0.6rem 1.5rem', fontSize: '0.95rem', background: 'var(--accent-grad)', border: 'none', color: '#000', borderRadius: '30px', fontWeight: '800' }}>
                      {t.cta}
                   </span>
                 )}
              </div>
            </div>
          );

          if (isStore) {
            return <div key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>{cardContent}</div>;
          }

          return (
            <Link href={`/${lang}/contact?utm_source=internal&utm_medium=button&utm_campaign=services_card_contact`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
              {cardContent}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
