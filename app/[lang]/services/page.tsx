import Link from 'next/link';
import type { Metadata } from 'next';

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

export default async function Services({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: {
      title: "專業服務",
      desc: "結合商業思維與深厚技術底蘊，為您提供專屬的數據驅動解決方案。",
      cta: "👉 立即預約諮詢",
      services: [
        { icon: <DataIcon />, name: "資料與商業分析", desc: "以嚴謹的統計分析與大數據探勘，找出隱藏的商業模式與潛在機會。", price: "請聯絡討論" },
        { icon: <IntegrationIcon />, name: "MarTech 技術導入", desc: "顧客資料平台 (CDP) 導入與數位行銷生態系 (GA4, Celebrus) 整合優化。", price: "請聯絡討論" },
        { icon: <ChartIcon />, name: "客製化儀表板建置", desc: "使用 Tableau 等工具建立互動式視覺化儀表板，將冰冷數據轉化為決策故事。", price: "請聯絡討論" },
        { icon: <EducationIcon />, name: "專案與自動化教學", desc: "提供 Tableau、Python 資料分析、自動化流程與 MarTech 工具的企業內訓或教學。", price: "1200 TWD / hr" }
      ]
    },
    en: {
      title: "Professional Services",
      desc: "Delivering data-driven solutions with a blend of business acumen and technical depth.",
      cta: "👉 Book a Consultation",
      services: [
        { icon: <DataIcon />, name: "Data & Business Analysis", desc: "Rigorous statistical analysis and data mining to uncover hidden business opportunities.", price: "Contact for Pricing" },
        { icon: <IntegrationIcon />, name: "MarTech Integration", desc: "CDP implementation and digital marketing ecosystem (GA4, Celebrus) technical optimization.", price: "Contact for Pricing" },
        { icon: <ChartIcon />, name: "Dashboard Architecture", desc: "Interactive Tableau dashboards that turn raw data into strategic storytelling for decision makers.", price: "Contact for Pricing" },
        { icon: <EducationIcon />, name: "Training & Enablement", desc: "Corporate training and workflow automation for Tableau, Python data analysis, and MarTech.", price: "1200 TWD / hr" }
      ]
    },
    ja: {
      title: "プロフェッショナルサービス",
      desc: "ビジネスの洞察力と深い技術力を融合させたデータ駆動型ソリューションを提供します。",
      cta: "👉 無料相談を予約",
      services: [
        { icon: <DataIcon />, name: "データ＆ビジネス分析", desc: "厳密な統計分析とデータマイニングによる、隠れたビジネス機会の発掘。", price: "要相談 (Contact)" },
        { icon: <IntegrationIcon />, name: "MarTech 導入", desc: "CDPの導入及びデジタルマーケティング・エコシステム(GA4, Celebrus)の技術的最適化。", price: "要相談 (Contact)" },
        { icon: <ChartIcon />, name: "カスタムダッシュボード", desc: "Tableauなどを使用したダッシュボード環境構築とデータからストーリーへの変換。", price: "要相談 (Contact)" },
        { icon: <EducationIcon />, name: "トレーニング・自動化指導", desc: "Tableau、Python分析、自動化ワークフローなどの企業向け研修や教育支援。", price: "1200 TWD / hr" }
      ]
    }
  };

  const t = content[lang];

  return (
    <section className="services fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      <div className="services-grid">
        {t.services.map((svc, idx) => (
          <Link href={`/${lang}/contact`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="service-card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                 <span className="btn-primary" style={{ display: 'inline-block', padding: '0.6rem 1.5rem', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '30px' }}>
                    {t.cta}
                 </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
