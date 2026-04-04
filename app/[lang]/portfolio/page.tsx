export default async function Portfolio({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: { title: "專案作品集", desc: "點擊預覽或下載我的過往專案與簡報文件：", type: ["儀表板", "商業提案", "技術研究"], btn: "線上預覽 / 下載", pending: "資料準備中" },
    en: { title: "Project Portfolio", desc: "Click to preview or download my past projects and presentation files:", type: ["Dashboard", "Business Proposal", "Tech Research"], btn: "Preview / Download", pending: "Coming Soon" },
    ja: { title: "ポートフォリオ", desc: "過去のプロジェクトやプレゼン資料をクリックしてプレビューまたはダウンロードできます：", type: ["ダッシュボード", "事業提案", "技術研究"], btn: "プレビュー / ダウンロード", pending: "準備中" }
  };
  const t = content[lang];

  const projects = [
    { title: "KOL Radar Dashboard", type: 0, url: "" },
    { title: "Shopee Performance Dashboard", type: 0, url: "" },
    { title: "Carrefour Forecasting Champion (家樂福)", type: 1, url: "" },
    { title: "Cloud CDP Selection Strategy", type: 2, url: "" },
    { title: "Cross-platform Digital Footprint", type: 2, url: "" },
    { title: "MarTech Business Strategy", type: 1, url: "" }
  ];

  return (
    <section className="portfolio fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {projects.map((proj, idx) => (
          <div className="service-card" key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{t.type[proj.type]}</span>
            <h3 className="service-title" style={{ marginTop: '0.5rem', flex: 1, fontSize: '1.2rem' }}>{proj.title}</h3>
            {/* Download Link pointing to Google Drive */}
            {proj.url ? (
              <a href={proj.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textAlign: 'center', padding: '0.5rem 1rem', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                {t.btn}
              </a>
            ) : (
               <button className="btn-primary" style={{ textAlign: 'center', padding: '0.5rem 1rem', marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                 {t.pending}
               </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
