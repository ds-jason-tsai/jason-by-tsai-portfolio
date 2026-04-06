import Image from 'next/image';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { zh: "專案作品集 | 傑森數據", en: "Portfolio | Jason Tsai", ja: "ポートフォリオ | ジェイソン・アナリティクス" };
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
      image: "/images/aflac_cover.png",
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
      image: "/images/chartbar_cover.png",
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
    },
    { 
      title: { zh: "商品組合與免運門檻分析 (鮮乳坊)", en: "Product Mix & Free-Shipping Threshold Analysis (Milkshop)", ja: "商品組み合わせと送料無料ライン分析（鮮乳坊）" }, 
      type: 1, 
      image: "",
      url: "https://drive.google.com/file/d/1cGR32HLVWr6BvoH2qHlXOpzP6tsFF5Gw/view?usp=sharing",
      description: {
        zh: "透過機器學習與關聯規則探勘（Association Rules），分析鮮乳坊顧客購買行為與商品組合關係。進一步依據顧客終身價值（LTV）與利潤結構，精算並建議最佳的免運門檻，以極大化客單價與整體營收。",
        en: "Analyzed customer purchasing behavior and product bundling using Machine Learning and Association Rules for a dairy brand. Calculated optimal free-shipping thresholds based on LTV and profit structures to maximize AOV and overall revenue.",
        ja: "機械学習とアソシエーション分析を用いて、顧客の購買行動と商品組み合わせを分析。LTVと利益構造に基づき、客単価と全体収益を最大化する最適な送料無料ラインを算出・提案しました。"
      },
      tags: {
        zh: ["#鮮乳坊", "#購物籃分析", "#關聯規則", "#營銷策略", "#營收優化"],
        en: ["#RetailAnalytics", "#MarketBasket", "#AssociationRules", "#PricingStrategy", "#RevenueOptimization"],
        ja: ["#小売分析", "#バスケット分析", "#アソシエーション", "#価格戦略", "#収益最適化"]
      }
    },
    { 
      title: { zh: "共享單車需求分析 (Bike Share)", en: "Bike Share Demand Analysis", ja: "シェアサイクル需要分析 (Bike Share)" }, 
      type: 2, 
      image: "",
      url: "https://drive.google.com/file/d/1D21Q1mPeowc0JAJsPZl9PGdTLxqxN_XD/view?usp=sharing",
      description: {
        zh: "基於時空數據與天氣變數，建立共享單車的需求預測模型。深度剖析各站點的尖離峰借還車模式，為營運團隊提供精準的車輛調度策略（Rebalancing）與站點擴張建議。",
        en: "Built a bike-sharing demand forecasting model based on spatial-temporal and weather data. Analyzed peak/off-peak usage patterns to provide operational teams with precise fleet rebalancing strategies and station expansion recommendations.",
        ja: "時空間データと気象変数に基づき、シェアサイクルの需要予測モデルを構築。ピーク時・オフピーク時の利用パターンを分析し、運営チームへ車両の最適な再配置（リバランス）やステーション拡張案を提案しました。"
      },
      tags: {
        zh: ["#共享單車", "#需求預測", "#時空分析", "#營運優化", "#機器學習"],
        en: ["#BikeShare", "#DemandForecasting", "#SpatialAnalysis", "#OperationsOptimization", "#MachineLearning"],
        ja: ["#シェアサイクル", "#需要予測", "#時空間分析", "#オペレーション最適化", "#機械学習"]
      }
    }
  ];

  return (
    <section className="portfolio fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      <div className="carousel-grid" style={{ 
        display: 'flex', 
        overflowX: 'auto', 
        scrollSnapType: 'x mandatory', 
        gap: '2rem', 
        paddingBottom: '2rem',
        WebkitOverflowScrolling: 'touch' 
      }}>
        {projects.map((proj, idx) => (
          <div className="service-card carousel-card" key={idx} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '0', 
            overflow: 'hidden',
            minWidth: '320px',
            maxWidth: '380px',
            flexShrink: 0,
            scrollSnapAlign: 'center',
            margin: '0 auto'
          }}>
            {/* Image Preview Area */}
            <div className="portfolio-image-wrapper" style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden' }}>
              {proj.image ? (
                 <Image src={proj.image} alt={proj.title[lang]} fill style={{ objectFit: 'cover', transition: 'transform 0.5s ease', cursor: 'pointer' }} className="portfolio-img-hover" />
              ) : (
                 <div style={{ width: '100%', height: '100%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No Preview Available</div>
              )}
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
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

            {/* Action Buttons */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              {proj.url ? (
                <a href={proj.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                  {t.btn}
                </a>
              ) : (
                <button className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.9rem', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                  {t.pending}
                </button>
              )}
              <a href={`/${lang}/reports#data`} className="btn-secondary" style={{ display: 'block', textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                {lang === 'zh' ? '🛒 購買資料' : (lang === 'ja' ? '🛒 データ購入' : '🛒 Buy Data')}
              </a>
            </div>
            </div>
            {/* End Content Wrapper */}
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .service-card:hover .portfolio-img-hover {
          transform: scale(1.05);
        }
        .carousel-grid::-webkit-scrollbar {
          height: 10px;
        }
        .carousel-grid::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
        }
        .carousel-grid::-webkit-scrollbar-thumb {
          background: var(--accent-color);
          border-radius: 5px;
        }
        .carousel-grid::-webkit-scrollbar-thumb:hover {
          background: #fff;
        }
      `}} />
    </section>
  );
}
