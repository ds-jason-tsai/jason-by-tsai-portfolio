import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { zh: "專業服務 | Jason Tsai", en: "Services | Jason Tsai", ja: "サービス | Jason Tsai" };
  return { title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'] };
}

export default async function Services({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: {
      title: "專業服務",
      services: [
        { icon: "📊", name: "數據分析", desc: "以嚴謹的統計分析與大數據探勘，找出隱藏的商業模式與潛在機會。" },
        { icon: "💡", name: "MarTech 諮詢", desc: "顧客資料平台 (CDP) 導入與數位行銷生態系 (GA4, Celebrus) 整合優化。" },
        { icon: "📈", name: "客製化儀表板報告", desc: "使用 Tableau 等工具建立互動式視覺化儀表板，將冰冷數據轉化為決策故事。" },
        { icon: "🎓", name: "數據分析教學", desc: "提供 Tableau、Python 資料分析與 MarTech 工具的企業內訓或一對一指導教學。" }
      ]
    },
    en: {
      title: "Professional Services",
      services: [
        { icon: "📊", name: "Data Analysis", desc: "Rigorous statistical analysis and data mining to uncover hidden business opportunities." },
        { icon: "💡", name: "MarTech Consultation", desc: "CDP implementation and digital marketing ecosystem (GA4, Celebrus) optimization." },
        { icon: "📈", name: "Custom Reporting", desc: "Interactive Tableau dashboards that turn raw data into strategic storytelling for decision makers." },
        { icon: "🎓", name: "Training & Teaching", desc: "Corporate training and 1-on-1 tutoring for Tableau, Python data analysis, and MarTech tools." }
      ]
    },
    ja: {
      title: "プロフェッショナルサービス",
      services: [
        { icon: "📊", name: "データ分析", desc: "厳密な統計分析とデータマイニングによる、隠れたビジネス機会の発掘。" },
        { icon: "💡", name: "MarTech コンサルティング", desc: "CDPの導入及びデジタルマーケティング・エコシステム(GA4, Celebrus)の最適化。" },
        { icon: "📈", name: "カスタムレポート", desc: "Tableauなどを使用した対話型ダッシュボードによる、データから意思決定ストーリーへの変換。" },
        { icon: "🎓", name: "トレーニング・教育", desc: "Tableau、Pythonデータ分析、MarTechツールの企業向け研修や個別指導。" }
      ]
    }
  };

  const t = content[lang];

  return (
    <section className="services fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {t.services.map((svc, idx) => (
          <Link href={`/${lang}/contact`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="service-card" style={{ cursor: 'pointer', height: '100%' }}>
              <div className="service-icon">{svc.icon}</div>
              <h3 className="service-title">{svc.name}</h3>
              <p className="service-desc">{svc.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
