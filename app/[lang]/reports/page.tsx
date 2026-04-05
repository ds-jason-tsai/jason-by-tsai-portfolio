import Image from 'next/image';
import type { Metadata } from 'next';
import BuyButton from '../components/BuyButton';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { zh: "付費數據洞察報告 | 傑森數據", en: "Premium Data Reports | Jason Tsai", ja: "プレミアムレポート | ジェイソン・アナリティクス" };
  return { title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'] };
}

export default async function Reports({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';

  const content = {
    zh: {
      title: "付費數據洞察報告",
      desc: "由資深數據分析師 Jason Tsai 操刀的獨家分析報告，提供高品質的商業洞察與策略框架，購買後可立即下載。",
      badge: "限量獨家",
      buyBtn: "💳 立即購買",
      downloadLabel: "購買後可立即下載",
    },
    en: {
      title: "Premium Data Reports",
      desc: "Exclusive analytical reports by senior data analyst Jason Tsai. High-quality business insights and strategic frameworks ready to download after purchase.",
      badge: "Exclusive",
      buyBtn: "💳 Buy Now",
      downloadLabel: "Instant download after purchase",
    },
    ja: {
      title: "プレミアムデータレポート",
      desc: "シニアデータアナリスト Jason Tsai による独占分析レポート。購入後すぐにダウンロード可能な高品質なビジネスインサイトと戦略フレームワーク。",
      badge: "独占限定",
      buyBtn: "💳 今すぐ購入",
      downloadLabel: "購入後すぐにダウンロード",
    },
  };

  const t = content[lang];

  const reports = [
    {
      id: 'salesforce_se',
      image: '/images/salesforce_cover.png',
      title: {
        zh: 'Case Study：Salesforce Solution Engineer',
        en: 'Case Study: Salesforce Solution Engineer Pitch',
        ja: 'ケーススタディ：Salesforce SE プレゼン',
      },
      description: {
        zh: 'Solution Engineer pitch C-level 專業簡報。涵蓋執行摘要、企業痛點分析、解決方案設計、技術架構（Einstein AI & Agentforce），以及完整的 Next Step 行動計畫。適合數據分析師、BD、技術顧問研讀參考。',
        en: 'A professional C-level pitch deck by a Solution Engineer. Covers executive summary, business pain points, solution design, tech architecture (Einstein AI & Agentforce), and action plan. Great reference for data analysts, BDs, and tech consultants.',
        ja: 'ソリューションエンジニアによるCレベル向けプロのピッチデッキ。エグゼクティブサマリー、ビジネス課題、ソリューション設計、技術アーキテクチャ（Einstein AI & Agentforce）、アクションプランを網羅。',
      },
      price: 498,
      currency: 'TWD',
      tags: ['#Salesforce', '#SolutionEngineer', '#C-Level', '#EinsteinAI', '#商業簡報'],
    },
  ];

  return (
    <section className="fade-in" style={{ padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="section-title">{t.title}</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', lineHeight: '1.8' }}>
          {t.desc}
        </p>
      </div>

      <div className="services-grid">
        {reports.map((report) => (
          <div
            key={report.id}
            className="service-card"
            style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}
          >
            {/* Cover Image */}
            <div style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden' }}>
              <Image
                src={report.image}
                alt={report.title[lang]}
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                className="portfolio-img-hover"
              />
              {/* Exclusive Badge */}
              <div style={{
                position: 'absolute', top: '12px', right: '12px',
                background: 'var(--accent-grad)', color: '#000',
                padding: '0.25rem 0.75rem', borderRadius: '20px',
                fontSize: '0.75rem', fontWeight: '800',
              }}>
                {t.badge}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: '1.4' }}>
                {report.title[lang]}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7', flex: 1 }}>
                {report.description[lang]}
              </p>

              <div className="tags-container" style={{ justifyContent: 'flex-start' }}>
                {report.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>

              {/* Price + Buy */}
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(0,242,254,0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(0,242,254,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
              }}>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-color)' }}>
                    NT${report.price}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    📥 {t.downloadLabel}
                  </div>
                </div>
                <BuyButton
                  reportId={report.id}
                  lang={lang}
                  buttonText={t.buyBtn}
                  price={report.price}
                  productName={report.title[lang]}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .service-card:hover .portfolio-img-hover {
          transform: scale(1.05);
        }
      `}} />
    </section>
  );
}
