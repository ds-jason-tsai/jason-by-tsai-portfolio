import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { zh: "專案作品集 | Jason Tsai", en: "Portfolio | Jason Tsai", ja: "ポートフォリオ | Jason Tsai" };
  return { title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'] };
}

export default async function Portfolio({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: { title: "專案作品集", desc: "點擊預覽或下載我的過往專案與簡報文件：", type: ["儀表板", "商業提案", "技術研究"], btn: "線上預覽 / 下載", pending: "資料準備中" },
    en: { title: "Project Portfolio", desc: "Click to preview or download my past projects and presentation files:", type: ["Dashboard", "Business Proposal", "Tech Research"], btn: "Preview / Download", pending: "Coming Soon" },
    ja: { title: "ポートフォリオ", desc: "過去のプロジェクトやプレゼン資料をクリックしてプレビューまたはダウンロードできます：", type: ["ダッシュボード", "事業提案", "技術研究"], btn: "プレビュー / ダウンロード", pending: "準備中" }
  };
  const t = content[lang];

  const projects = [
    { 
      title: { zh: "保險公司研究 (Aflac)", en: "Aflac Insurance Research", ja: "Aflac 保険会社戦略研究" }, 
      type: 2, 
      url: "https://drive.google.com/file/d/1EQiMMQfrRplLjNljCLiQWHUxQ121xxDL/view?usp=drive_link",
      description: {
        zh: "深入研究 Aflac 在全球意外與健康險市場的成功要素。分析其獨特的代理商模式，並探討如何透過整合 NAYYA (AI 推薦)、SKYGEN 與 Empathy 等 InsurTech 合作夥伴來強化數位轉型與客戶體驗。",
        en: "In-depth research on Aflac's success in the global supplemental health insurance market. Analyzes its unique agency model and explores digital transformation through InsurTech partnerships like NAYYA (AI), SKYGEN, and Empathy.",
        ja: "グローバル補完的健康・生命保険市場におけるAflacの成功要因の徹底研究。独自の代理店モデルと、NAYYA（AIレコメンデーション）、SKYGEN、EmpathyなどのInsurTechパートナーとの統合によるデジタルトランスフォーメーションを分析。"
      },
      tags: {
        zh: ["#國泰人壽", "#InsurTech", "#保險科技", "#財務建模", "#CDP"],
        en: ["#CathayLife", "#InsurTech", "#InsuranceTech", "#FinancialModeling", "#CDP"],
        ja: ["#國泰人寿", "#インシュアテック", "#保険テック", "#財務モデリング", "#CDP"]
      }
    },
    { 
      title: { zh: "ChartBar 圖表分析懶人包", en: "ChartBar Analysis Cheat Sheet", ja: "ChartBar 分析チートシート" }, 
      type: 1, 
      url: "https://drive.google.com/file/d/1T2UfuswNYamtVFWASDgXwYsdXAQs8Uhl/view?usp=drive_link",
      description: {
        zh: "精選 40+ 款必學商業圖表，提供從基礎趨勢到進階技術控制圖的完整選擇標準。旨在優化視覺傳達效率，幫助數據分析師快速為特定商業情境選擇最合適的視覺化工具。",
        en: "A selected collection of 40+ essential business charts, providing clear selection criteria from basic trends to advanced technical control charts. Designed to optimize visual communication efficiency for data analysts.",
        ja: "ビジネス分析に不可欠な40以上のチャートを厳選。基本的なトレンドから高度な技術的管理図まで、データ分析者が即座に最適な視覚化ツールを選択するための明確な基準を提供します。"
      },
      tags: {
        zh: ["#ChartBar", "#數據視覺化", "#Tableau", "#視覺敘事", "#分析工具"],
        en: ["#ChartBar", "#DataViz", "#Tableau", "#VisualStorytelling", "#AnalyticsTool"],
        ja: ["#ChartBar", "#データ可視化", "#Tableau", "#ストーリーテリング", "#分析ツール"]
      }
    }
  ];

  return (
    <section className="portfolio fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        {projects.map((proj, idx) => (
          <div className="service-card" key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{t.type[proj.type]}</span>
            <h3 className="service-title" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: '1.3rem' }}>{proj.title[lang]}</h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', flex: 1, marginBottom: '1.5rem' }}>
              {proj.description[lang]}
            </p>

            <div className="tags-container" style={{ justifyContent: 'center' }}>
              {proj.tags[lang].map((tag, tIdx) => (
                <span key={tIdx} className="tag">{tag}</span>
              ))}
            </div>

            {/* Download Link pointing to Google Drive */}
            <div style={{ marginTop: '2rem' }}>
              {proj.url ? (
                <a href={proj.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                  {t.btn}
                </a>
              ) : (
                <button className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.9rem', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                  {t.pending}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
