import type { Metadata } from 'next';
import PortfolioClient from '../../../components/PortfolioClient';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "數據專案作品集 | 傑森數據 - Tableau, AI 與 FinTech 實務案例", 
    en: "Portfolio | Jason Analytics - Tableau, AI & FinTech", 
    ja: "分析プロジェクト集 | ジェイソン・アナリティクス - Tableau, AI と FinTech の実績" 
  };
  const descriptions = {
    zh: "傑森數據 Jason Analytics 精選數據分析作品集。由 Jason Tsai 主導，涵蓋 Python 進階數據建模、Tableau 商業動態視覺化儀表板、NotebookLM 與多種 AI 技術應用實績。深耕大型數據工程開發與 MarTech 技術架構，展示多元產業的數據決策透明化與流程自動化成果，協助您深度理解數據在商業實務中的關鍵價值。立即點擊看更多專案詳情。",
    en: "Explore Jason Analytics' data portfolio. Projects include Python modeling, Tableau dashboards, and AI applications. We transform raw data into strategic value through advanced engineering and visualization. See our latest analytics cases here.",
    ja: "Jason Analytics のデータ分析ポートフォリオ。Python データモデリング、動的な Tableau ダッシュボード、AI（NotebookLM）のビジネス活用、大規模データエンジニアリングの実績を公開。多角的な視点から産業データの可視化と自動化を推進し、データがビジネスに不可欠な価値を生むプロセスを紹介します。詳細なプロジェクト一覧はこちら。"
  };
  return { 
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh'],
    alternates: {
      canonical: `https://jason-by-tsai-portfolio.vercel.app/${lang}/portfolio`,
      languages: {
        'zh': 'https://jason-by-tsai-portfolio.vercel.app/zh/portfolio',
        'en': 'https://jason-by-tsai-portfolio.vercel.app/en/portfolio',
        'ja': 'https://jason-by-tsai-portfolio.vercel.app/ja/portfolio',
      },
    }
  };
}

export default async function Portfolio({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: { title: "專案作品集", desc: "點擊預覽或下載我的過往專案與簡報文件：", type: ["數據分析", "商業提案", "技術研究"], btn: "線上預覽 / 下載", pending: "資料準備中" },
    en: { title: "Project Portfolio", desc: "Click to preview or download my past projects and presentation files:", type: ["Dashboard", "Business Proposal", "Tech Research"], btn: "Preview / Download", pending: "Coming Soon" },
    ja: { title: "ポートフォリオ", desc: "過去のプロジェクトやプレゼン資料をクリックしてプレビューまたはダウンロードできます：", type: ["ダッシュボード", "事業提案", "技術研究"], btn: "プレビュー / ダウンロード", pending: "準備中" }
  };
  const t = content[lang];

  const projects = [
    { 
      title: { zh: "行銷科技 | MarTech | 技術精華", en: "MarTech Mastery: Technical Essence", ja: "MarTech ｜ マーケティングテクノロジー ｜ 技術精華" }, 
      type: 2, 
      image: "/images/martech_cover.webp",
      url: "https://drive.google.com/file/d/1Em8A5DdZS5jiLyRMvyIDSfSD-aIr83kj/view?usp=sharing",
      description: {
        zh: "匯集橫跨 CDP、行銷自動化與 AI 驅動轉型的技術精華。深入分析 MarTech 產業地圖與數位工具整合架構，旨在協助企業從數據採集到自動化應用建立完整的增長引擎。",
        en: "A comprehensive essence of MarTech, covering CDP, marketing automation, and AI-driven growth models. Detailed analysis of digital tool integration and technical architectures to build complete data engines.",
        ja: "CDP、マーケティングオートメーション、AI主導の変革を網羅した技術の精華。データ収集から自動化まで、企業が完全な成長エンジンを構築するためのデジタルツール統合アーキテクチャを詳説。"
      },
      tags: {
        zh: ["#MarTech", "#CDP", "#技術架構"],
        en: ["#MarTech", "#CDP", "#Architecture"],
        ja: ["#MarTech", "#CDP", "#技術構成"]
      }
    },
    { 
      title: { zh: "保險公司研究 (Aflac)", en: "Aflac Insurance Research", ja: "Aflac 保険会社戦略研究" }, 
      type: 1, 
      image: "/images/aflac_cover.jpg",
      url: "https://drive.google.com/file/d/1EQiMMQfrRplLjNljCLiQWHUxQ121xxDL/view?usp=drive_link",
      description: {
        zh: "深入研究 Aflac 在全球意外與健康險市場的成功要素。分析其獨特的代理商模式，並探討如何透過整合 NAYYA (AI 推薦)、SKYGEN 與 Empathy 等 InsurTech 合作夥伴來強化數位轉型與客戶體驗。",
        en: "In-depth research on Aflac's success in the global supplemental health insurance market. Analyzes its unique agency model and explores digital transformation through InsurTech partnerships like NAYYA (AI), SKYGEN, and Empathy.",
        ja: "グローバル補完的健康・生命保険市場におけるAflacの成功要因の徹底研究。独自の代理店モデルと、NAYYA（AIレコメンデーション）、SKYGEN、EmpathyなどのInsurTechパートナーとの統合によるデジタルトランスフォーメーションを分析。"
      },
      tags: {
        zh: ["#InsurTech", "#財務建模", "#CDP"],
        en: ["#InsurTech", "#FinancialModeling", "#CDP"],
        ja: ["#インシュアテック", "#財務モデリング", "#CDP"]
      }
    },
    { 
      title: { zh: "ChartBar 圖表分析懶人包", en: "ChartBar Analysis Cheat Sheet", ja: "ChartBar 分析チートシート" }, 
      type: 2, 
      image: "/images/chartbar_cover.png",
      url: "https://drive.google.com/file/d/1T2UfuswNYamtVFWASDgXwYsdXAQs8Uhl/view?usp=drive_link",
      description: {
        zh: "精選 40+ 款必學商業圖表，提供從基礎趨勢到進階技術控制圖的完整選擇標準。旨在優化視覺傳達效率，幫助數據分析師快速為特定商業情境選擇最合適的視覺化工具。",
        en: "A selected collection of 40+ essential business charts, providing clear selection criteria from basic trends to advanced technical control charts. Designed to optimize visual communication efficiency for data analysts.",
        ja: "ビジネス分析に不可欠な40以上のチャートを厳選。基本的なトレンドから高度な技術的管理図まで、データ分析者が即座に最適な視覚化ツールを選択するための明確な基準を提供します。"
      },
      tags: {
        zh: ["#數據視覺化", "#Tableau", "#分析工具"],
        en: ["#DataViz", "#Tableau", "#AnalyticsTool"],
        ja: ["#データ可視化", "#Tableau", "#分析ツール"]
      }
    },
    { 
      title: { zh: "商品組合與免運門檻分析 (鮮乳坊)", en: "Product Mix & Free-Shipping Threshold Analysis (Milkshop)", ja: "商品組み合わせと送料無料ライン分析（鮮乳坊）" }, 
      type: 0, 
      image: "/images/milkshop_cover.png",
      url: "https://drive.google.com/file/d/1cGR32HLVWr6BvoH2qHlXOpzP6tsFF5Gw/view?usp=sharing",
      description: {
        zh: "透過機器學習與關聯規則探勘（Association Rules），分析鮮乳坊顧客購買行為與商品組合關係。進一步依據顧客終身價值（LTV）與利潤結構，精算並建議最佳的免運門檻，以極大化客單價與整體營收。",
        en: "Analyzed customer purchasing behavior and product bundling using Machine Learning and Association Rules for a dairy brand. Calculated optimal free-shipping thresholds based on LTV and profit structures to maximize AOV and overall revenue.",
        ja: "機械学習とアソシエーション分析を用いて、顧客の購買行動と商品組み合わせを分析。LTVと利益構造に基づき、客単価と全体収益を最大化する最適な送料無料ラインを算出・提案しました。"
      },
      tags: {
        zh: ["#購物籃分析", "#關聯規則", "#營收優化"],
        en: ["#RetailAnalytics", "#AssociationRules", "#RevenueOptimization"],
        ja: ["#小売分析", "#アソシエーション", "#収益最適化"]
      }
    },
    { 
      title: { zh: "共享單車需求分析 (Bike Share)", en: "Bike Share Demand Analysis", ja: "シェアサイクル需要分析 (Bike Share)" }, 
      type: 0, 
      image: "/images/bike_share_cover.png",
      url: "https://drive.google.com/file/d/1D21Q1mPeowc0JAJsPZl9PGdTLxqxN_XD/view?usp=sharing",
      description: {
        zh: "基於時空數據與天氣變數，建立共享單車的需求預測模型。深度剖析各站點的尖離峰借還車模式，為營運團隊提供精準的車輛調度策略（Rebalancing）與站點擴張建議。",
        en: "Built a bike-sharing demand forecasting model based on spatial-temporal and weather data. Analyzed peak/off-peak usage patterns to provide operational teams with precise fleet rebalancing strategies and station expansion recommendations.",
        ja: "時空間データと気象変数に基づき、シェアサイクルの需要予測モデルを構築。ピーク時・オフピーク時の利用パターンを分析し、運営チームへ車両の最適な再配置（リバランス）やステーション拡張案を提案しました。"
      },
      tags: {
        zh: ["#需求預測", "#營運優化", "#機器學習"],
        en: ["#DemandForecasting", "#OperationsOptimization", "#MachineLearning"],
        ja: ["#需要予測", "#オペレーション最適化", "#機械學習"]
      }
    }
  ];

  return (
    <section className="portfolio fade-in" style={{ padding: '0 1rem' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .portfolio { padding: 0 0.5rem !important; }
        }
      `}} />
      <h1 className="section-title">{t.title}</h1>
      <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      
      <PortfolioClient projects={projects} lang={lang} t={t} />
      
    </section>
  );
}
