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
      title: "付費專區",
      desc: "由資深數據分析師 Jason Tsai 操刀的獨家分析報告與實戰課程影片，提供高品質的商業洞察與策略框架。購買後可透過專屬連結下載或觀賞。",
      badge: "限量獨家",
      buyBtn: "💳 立即購買",
      downloadLabel: "購買後可立即獲得存取權",
    },
    en: {
      title: "Premium Section",
      desc: "Exclusive analytical reports and hands-on video courses by senior analyst Jason Tsai. Get high-quality business insights and strategic frameworks via instant access after purchase.",
      badge: "Exclusive",
      buyBtn: "💳 Buy Now",
      downloadLabel: "Instant access after purchase",
    },
    ja: {
      title: "プレミアム専有エリア",
      desc: "シニアアナリスト Jason Tsai による独占分析レポートと実践的な動画講座。購入後、高品質なビジネスインサイトと戦略フレームワークにすぐにアクセスできます。",
      badge: "独占限定",
      buyBtn: "💳 今すぐ購入",
      downloadLabel: "購入後に即座にアクセス可能",
    },
  };

  const t = content[lang];

  const reports = [
    {
      id: 'notebooklm_intro',
      image: '/images/notebooklm_cover.jpg',
      title: {
        zh: 'Google NotebookLM：AI 個人筆記與介面教學 (影片課程)',
        en: 'Google NotebookLM: AI Personal Notes & UI Tutorial (Video)',
        ja: 'Google NotebookLM：AI個人ノート＆UI チュートリアル (動画)',
      },
      description: {
        zh: '這是一份約 25 分鐘的 Google NotebookLM 深度介面教學影片。快速掌握如何運用 AI 整理個人知識庫、自動生成專屬摘要，以及高效管理複雜資訊的實戰技巧。適合所有高效筆記愛好者與分析師。',
        en: 'A 25-minute deep dive into Google NotebookLM. Master how to organize personal knowledge bases, auto-generate summaries, and efficiently manage complex information using AI.',
        ja: '約25分の Google NotebookLM 徹底解説動画。AIを活用した個人のナレッジベース構築、自動要約生成、複雑な情報の効率的な管理スキルを素早く習得できます。',
      },
      price: 49,
      currency: 'TWD',
      tags: ['#NotebookLM', '#GoogleAI', '#VideoCourse', '#Productivity', '#不公開影片'],
    },
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
    <section className="fade-in" style={{ padding: '0 2rem', position: 'relative' }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px', background: 'var(--accent-color)',
        borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1, zIndex: -1
      }}></div>

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="section-title" style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1px' }}>{t.title}</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto', lineHeight: '1.8', fontSize: '1.1rem' }}>
          {t.desc}
        </p>
      </div>

      <div className="reports-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 420px))', 
        gap: '2.5rem', 
        justifyContent: 'center', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        {reports.map((report, idx) => (
          <div
            key={report.id}
            className="report-card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '0', 
              overflow: 'hidden', 
              animation: `slideUp 0.6s ease forwards ${idx * 0.1}s`,
              opacity: 0,
              transform: 'translateY(20px)'
            }}
          >
            {/* Cover Image — fixed aspect ratio, no stretching */}
            <div className="report-image-wrapper" style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', background: '#0a0a0f' }}>
              <Image
                src={report.image}
                alt={report.title[lang]}
                fill
                style={{ objectFit: 'contain', objectPosition: 'center', transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)', padding: '0.75rem' }}
                className="report-img"
              />
              {/* Exclusive Badge */}
              <div className="premium-badge">
                {t.badge}
              </div>
              <div className="image-overlay"></div>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', lineHeight: '1.3', background: 'linear-gradient(to right, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {report.title[lang]}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', flex: 1 }}>
                {report.description[lang]}
              </p>

              <div className="tags-container" style={{ justifyContent: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                {report.tags.map((tag, i) => (
                  <span key={i} className="tag" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>{tag}</span>
                ))}
              </div>

              {/* Price + Buy */}
              <div className="price-action-container">
                <div className="price-info">
                  <div className="price-label">EST. VALUE</div>
                  <div className="price-val">NT${report.price}</div>
                  <div className="status-label">📥 {t.downloadLabel}</div>
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
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .report-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.33, 1, 0.68, 1);
          position: relative;
          z-index: 1;
        }

        .report-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.04);
          border-color: var(--accent-color);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 242, 254, 0.1);
        }

        .report-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 1px;
          background: linear-gradient(45deg, transparent, rgba(0, 242, 254, 0.3), transparent);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s;
          pointer-events: none;
        }

        .report-card:hover::before {
          opacity: 1;
        }

        .report-card:hover .report-img {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #000, transparent);
          opacity: 0.3;
        }

        .premium-badge {
          position: absolute; 
          top: 16px; 
          right: 16px;
          background: var(--accent-grad); 
          color: #000;
          padding: 0.35rem 1rem; 
          border-radius: 50px;
          font-size: 0.7rem; 
          font-weight: 900;
          z-index: 2;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          text-transform: uppercase;
        }

        .price-action-container {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .price-label {
          font-size: 0.6rem;
          color: var(--text-secondary);
          letter-spacing: 1px;
          margin-bottom: 2px;
        }

        .price-val {
          font-size: 1.7rem; 
          font-weight: 900; 
          color: var(--accent-color);
          line-height: 1;
        }

        .status-label {
          font-size: 0.7rem; 
          color: var(--text-secondary); 
          margin-top: 4px;
        }

        @media (max-width: 480px) {
          .price-action-container {
            flex-direction: column;
            align-items: flex-start;
          }
          .price-action-container > div:last-child {
            width: 100%;
          }
        }
      `}} />
    </section>
  );
}
