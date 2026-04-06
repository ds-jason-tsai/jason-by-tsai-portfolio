'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';

// Data definitions for the dashboards
const getDashboardData = (lang: string) => {
  const dashboards = [
    {
      id: 'sentiment_forum',
      url: 'https://lookerstudio.google.com/embed/reporting/c3e14281-a9c3-4276-bdc0-39f0635b740c/page/wEEvD',
      title: {
        zh: '保險論壇聲量與話題追蹤 (Social Listening)',
        en: 'Insurance Forum Sentiment & Topic Tracking',
        ja: '保険フォーラム・トレンド追跡ダッシュボード'
      },
      desc: {
        zh: '整合 PTT、Finfo、MY83 等各大論壇數據，即時監控保險品牌聲量、熱門險種話題與賠案討論。透過自動化數據分析，幫助品牌掌握社群趨勢並優化行銷決策。',
        en: 'Aggregates data from major forums like PTT, Finfo, and MY83 to monitor insurance brand mentions, trending insurance types, and claim discussions in real-time.',
        ja: 'PTT、Finfo、MY83などの主要フォーラムからデータを統合し、保険ブランドの露出やトレンドのトピックをリアルタイムで監視するダッシュボードです。'
      },
      tags: {
        zh: ['社群監測', '保險行銷', '輿情分析', 'Looker Studio'],
        en: ['Social Listening', 'Insurance Marketing', 'Sentiment Analysis', 'Looker Studio'],
        ja: ['ソーシャルリスニング', '保険マーケティング', '世論分析', 'Looker Studio']
      }
    },
    {
      id: 'geo_monitoring',
      url: 'https://lookerstudio.google.com/embed/reporting/50045546-8d2d-4989-8fa1-a7100a8d50c9/page/AIMgF',
      title: {
        zh: '保險業 GEO (生成式引擎優化) 監測儀表板',
        en: 'Insurance Industry GEO (Generative Engine Optimization) Monitoring',
        ja: '保険業界向け GEO (生成エンジン最適化) モニタリング'
      },
      desc: {
        zh: '專為 AI 時代設計的監測工具，追蹤保險品牌在生成式引擎（如 AI 搜索）中的曝光數、引用連結與關鍵字排名，搶佔未來搜索先機。',
        en: 'A monitoring tool designed for the AI era, tracking insurance brand impressions, citation links, and keyword rankings within generative engines (e.g., AI search).',
        ja: 'AI時代のマーケティングツールとして、生成エンジンにおける保険ブランドの露出、引用リンク、およびキーワード順位を追跡し、AI回答内の表示確率を最適化します。'
      },
      tags: {
        zh: ['GEO優化', 'AI搜索監測', '品牌曝光', '視覺化報表'],
        en: ['GEO', 'AI Search Monitoring', 'Brand Visibility', 'Looker Studio'],
        ja: ['GEO最適化', 'AI検索監視', 'ブランド露出', 'データ可視化']
      }
    }
  ];
  return dashboards;
};

export default function DashboardsPage({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = use(params);
  const lang = resolvedParams.lang as 'zh' | 'en' | 'ja';
  const [currentIndex, setCurrentIndex] = useState(0);
  const dashboards = getDashboardData(lang);
  const current = dashboards[currentIndex];

  const t = {
    zh: {
      mainTitle: "數據儀表板專區",
      desc: "透過直覺的視覺化界面，將枯燥的原始數據轉化為可隨時互動、過濾並挖掘深層商業策略的動態儀表板。",
      note: "※ 建議使用電腦瀏覽器以獲得最佳交互體驗",
      backToHome: "回到首頁",
      prev: "上一個",
      next: "下一個"
    },
    en: {
      mainTitle: "Data Dashboards",
      desc: "Transforming raw data into intuitive, dynamic dashboards. Interact, filter, and discover deep business strategies through a visual interface.",
      note: "※ Desktop browser recommended for the best experience.",
      backToHome: "Back to Home",
      prev: "Prev",
      next: "Next"
    },
    ja: {
      mainTitle: "データダッシュボード",
      desc: "生のデータを直感的な動的ダッシュボードに変換します。視覚的なインターフェースを通じて、データの操作、フィルタリング、深いビジネス戦略の発見が可能です。",
      note: "※ PCブラウザでの閲覧を推奨します。",
      backToHome: "ホームに戻る",
      prev: "前へ",
      next: "次へ"
    }
  }[lang];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? dashboards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === dashboards.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="dashboards-container" style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' }}>
      {/* Header */}
      <div className="dashboards-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '900' }}>{t.mainTitle}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
          {t.desc}
        </p>
        <span style={{ 
          display: 'inline-block',
          padding: '0.4rem 1rem', 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '50px', 
          fontSize: '0.85rem',
          color: 'var(--accent-color)',
          border: '1px solid rgba(0, 242, 254, 0.2)'
        }}>
          {t.note}
        </span>
      </div>

      {/* Carousel Section */}
      <div className="dashboard-carousel-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation Buttons Moved adjusted for better centering */}
        <button onClick={handlePrev} className="carousel-btn prev" aria-label={t.prev}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button onClick={handleNext} className="carousel-btn next" aria-label={t.next}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>

        {/* Dashboard Display Card */}
        <div className="dashboard-display-card" style={{ 
          background: 'var(--card-bg)', 
          borderRadius: '32px', 
          padding: '2rem',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}>
          {/* Info Area */}
          <div className="dashboard-info" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', color: '#fff' }}>
              {current.title[lang]}
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem', maxWidth: '900px', margin: '0 auto 1.5rem' }}>
              {current.desc[lang]}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              {current.tags[lang].map((tag, i) => (
                <span key={i} className="dashboard-tag">#{tag}</span>
              ))}
            </div>
            {/* Added Buy Data Button */}
            <div style={{ marginTop: '2rem' }}>
              <a href={`/${lang}/reports#data`} className="btn-secondary dashboard-buy-btn">
                {lang === 'zh' ? '🛒 購買相關數據' : (lang === 'ja' ? '🛒 関連データを購入' : '🛒 Buy Layout / Data')}
              </a>
            </div>
          </div>

          {/* Iframe Area */}
          <div className="iframe-container" style={{ 
            position: 'relative', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            background: '#0a0a0a',
            width: '100%',
            height: '1000px', // Increased height
            maxHeight: '85vh',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
          }}>
            <iframe 
              key={current.id}
              src={current.url}
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0, position: 'absolute', inset: 0, overflow: 'auto' }} 
              allowFullScreen 
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
          </div>

          {/* Pagination Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}>
            {dashboards.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: i === currentIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentIndex ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Partner Platforms Section */}
      <div className="trusted-by-section" style={{ marginTop: '5rem', marginBottom: '4rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '3.5rem', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '700', opacity: 0.8 }}>
           Partner Platforms & Multi-Brand Collaboration
        </h3>
        <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', maxWidth: '1000px', margin: '0 auto' }}>
          <a href="https://lookerstudio.google.com/" target="_blank" rel="noopener follow" className="partner-logo">
             Looker Studio
          </a>
          <a href="https://public.tableau.com/app/discover" target="_blank" rel="noopener follow" className="partner-logo">
             Tableau Public
          </a>
          <a href="https://www.microsoft.com/en-us/power-platform/products/power-bi" target="_blank" rel="noopener follow" className="partner-logo">
             Power BI 
          </a>
        </div>
      </div>

      {/* Footer Back Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link href={`/${lang}`} className="btn-primary" style={{ padding: '0.8rem 2.5rem' }}>
          {t.backToHome}
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-carousel-wrapper {
          padding: 0 4rem;
        }
        .carousel-btn {
          position: absolute;
          top: 60%; /* Adjusted to center more on the iframe content */
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(0, 242, 254, 0.3);
          color: #fff;
          font-size: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 10;
        }
        .carousel-btn:hover {
          background: var(--accent-color);
          color: #000;
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
        }
        .carousel-btn.prev { left: 0; }
        .carousel-btn.next { right: 0; }

        .dashboard-tag {
          padding: 0.3rem 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .partner-logo {
           font-size: 1.4rem;
           font-weight: 900;
           color: #fff;
           opacity: 0.4;
           text-decoration: none;
           transition: all 0.4s ease;
           letter-spacing: 1px;
           font-family: inherit;
        }
        .partner-logo:hover {
           opacity: 1;
           color: var(--accent-color);
           transform: translateY(-3px);
           text-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
        }

        @media (max-width: 1024px) {
          .dashboard-carousel-wrapper { padding: 0; }
          .carousel-btn {
            position: relative;
            top: auto;
            transform: none;
            display: inline-flex;
            margin: 1rem 0.5rem;
          }
          .dashboards-header { margin-bottom: 2rem; }
          .iframe-container { height: 700px !important; }
        }
        @media (max-width: 768px) {
          .section-title { font-size: 2.2rem !important; }
          .iframe-container { height: 500px !important; }
          .partner-logo { font-size: 1.1rem; }
        }
        .dashboard-buy-btn {
          display: inline-block;
          padding: 0.8rem 2.5rem;
          font-size: 1rem;
          transition: all 0.3s;
        }
        .dashboard-buy-btn:hover {
          background: var(--accent-color) !important;
          color: #000 !important;
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.5);
          transform: translateY(-2px);
        }
      `}}/>
    </div>
  );
}
