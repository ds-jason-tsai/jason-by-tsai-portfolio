import { getDictionary } from '../../dictionaries';

export default async function DashboardsPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const dict = await getDictionary(lang);

  const t = {
    zh: {
      title: "數據儀表板專區",
      subtitle: "交互式數據洞察與商業展示",
      desc: "透過直覺的視覺化界面，將枯燥的原始數據轉化為可隨時互動、過濾並挖掘深層商業策略的動態儀表板。",
      note: "※ 建議使用電腦瀏覽器以獲得最佳交互體驗",
      backToHome: "回到首頁"
    },
    en: {
      title: "Data Dashboards",
      subtitle: "Interactive Data Insights & Business Demos",
      desc: "Transforming raw data into intuitive, dynamic dashboards. Interact, filter, and discover deep business strategies through a visual interface.",
      note: "※ Desktop browser recommended for the best experience.",
      backToHome: "Back to Home"
    },
    ja: {
      title: "データダッシュボード",
      subtitle: "インタラクティブな分析とビジネスデモ",
      desc: "生のデータを直感的な動的ダッシュボードに変換します。視覚的なインターフェースを通じて、データの操作、フィルタリング、深いビジネス戦略の発見が可能です。",
      note: "※ 最適な体験のために、PCブラウザでの閲覧を推奨します。",
      backToHome: "ホームに戻る"
    }
  }[lang];

  return (
    <div className="dashboards-container" style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="dashboards-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '900' }}>{t.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 1.5rem' }}>
          {t.desc}
        </p>
        <span style={{ 
          display: 'inline-block',
          padding: '0.4rem 1rem', 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '50px', 
          fontSize: '0.9rem',
          color: 'var(--accent-color)',
          border: '1px solid rgba(0, 242, 254, 0.2)'
        }}>
          {t.note}
        </span>
      </div>

      <div className="dashboard-wrapper" style={{ 
        position: 'relative', 
        width: '100%', 
        background: '#000', 
        borderRadius: '24px', 
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        minHeight: '800px'
      }}>
        {/* Looker Studio Iframe */}
        <iframe 
          src="https://lookerstudio.google.com/embed/reporting/c3e14281-a9c3-4276-bdc0-39f0635b740c/page/wEEvD"
          width="100%" 
          height="800px" 
          frameBorder="0" 
          style={{ border: 0 }} 
          allowFullScreen 
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
      </div>

      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <a href={`/${lang}`} className="btn-primary" style={{ padding: '0.8rem 2.5rem' }}>{t.backToHome}</a>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .dashboard-wrapper {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dashboard-wrapper:hover {
          border-color: var(--accent-color);
          box-shadow: 0 0 30px rgba(0, 242, 254, 0.1);
        }
        @media (max-width: 768px) {
          .section-title {
            font-size: 2.2rem !important;
          }
          .dashboard-wrapper {
            min-height: 500px;
          }
          .dashboard-wrapper iframe {
            height: 500px !important;
          }
        }
      `}}/>
    </div>
  );
}
