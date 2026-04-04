export default async function Portfolio({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: { title: "專案作品集", desc: "點擊預覽或下載我的過往專案與簡報文件 (支援 PDF / Tableau 等)：", type: ["儀表板", "商業提案", "技術研究"] },
    en: { title: "Project Portfolio", desc: "Click to preview or download my past projects and presentation files:", type: ["Dashboard", "Business Proposal", "Tech Research"] },
    ja: { title: "ポートフォリオ", desc: "過去のプロジェクトやプレゼン資料をクリックしてプレビューまたはダウンロードできます：", type: ["ダッシュボード", "事業提案", "技術研究"] }
  };
  const t = content[lang];

  const projects = [
    { title: "KOL Radar Dashboard", type: 0, file: "KOL_Radar_Demo.twbx" },
    { title: "Shopee Performance Dashboard", type: 0, file: "蝦皮儀表板.twbx" },
    { title: "Carrefour Forecasting Champion (家樂福)", type: 1, file: "202302 家樂福預測冠軍.pdf" },
    { title: "Cloud CDP Selection Strategy", type: 2, file: "20260129 CDP選商報告.pptx" },
    { title: "Cross-platform Digital Footprint", type: 2, file: "202408_跨數位平台客戶軌跡.pdf" },
    { title: "MarTech Business Strategy", type: 1, file: "202506_MarTech 業務介紹.pdf" }
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
            {/* Download Link pointing to static files or dummy route */}
            <a href={`/pdfs/${proj.file}`} className="btn-primary" style={{ textAlign: 'center', padding: '0.5rem 1rem', marginTop: '1.5rem', fontSize: '0.9rem' }} download>
              View Document
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
