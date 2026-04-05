import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { zh: "完整職涯經歷 | 傑森數據", en: "Experience | Jason Tsai", ja: "経歴 | ジェイソン・アナリティクス" };
  return { title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'] };
}

export default async function Experience({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const content = {
    zh: { title: "完整職涯經歷", 
          desc: "從技術實作到高階戰略規劃，持續創造數據價值。",
          exp: [
            { 
              date: "2026.01 - 至今", 
              role: "合作講師", 
              companies: [
                { name: "nSchool (Kolable)", url: "https://kkschool.kolable.app/" },
                { name: "X Platform", url: "https://www.xplatform.world/" },
                { name: "無限學院 (OOSchool)", url: "https://www.ooschool.cc/" }
              ],
              desc: "客製化設計 Python 與 AI 學習路徑，及 AI 應用實作課程，打造輕量高效的端到端數據學習體驗。" 
            },
            { date: "2024.08 - 至今", role: "合作講師", company: "聯成電腦 (菜鳥救星)", url: "https://live.rookiesavior.net/", desc: "開發從零到一的 Tableau 完整資料生命週期課程；累積 200+ 教學小時，培訓超過 150 位專業人士。成功協助多位學員轉職數據分析師，並獲得 4.8/5.0 的學員滿意度回饋。" },
            { date: "2023.07 - 至今", role: "資料分析師", company: "國泰人壽 (Cathay Life)", url: "", desc: "負責 Cloud CDP 選商、建置與標籤工程 (Celebrus to GA4)。主導 Agentic AI 導入，將 29 個破碎資料表收斂為 10 個核心 Data Mart。幫助兩萬名業務員提升保單貸款表現，數位轉換率顯著提升。" },
            { date: "2023 - 2024", role: "企業專案：儀表板戰略分析師", company: "NTUDAC 臺大資料分析社 x 蝦皮 (Shopee Xpress)", url: "", desc: "負責空間智能與策略規劃，拆解物流痛點並追蹤設點關鍵指標。結合爬蟲、分群與地理空間分析建立互動式儀表板，優化整體營運網點評估規劃。" },
            { date: "2023.03 - 2023.06", role: "資料分析師 (Data Analyst)", company: "iKala", url: "", desc: "參與 KOL 網紅影響力分析專案，量化行銷效益並優化網紅選擇策略。優化內部儀表板並實作自動化排程派報系統，整體營運效率提升 5 倍。" },
            { date: "2023", role: "AI 預測競賽全國冠軍", company: "家樂福 (Carrefour)", url: "", desc: "運用集成分群分析與 XGBoost 等機器學習演算法開發顧客購買預測模型，並深入規劃商品搭售策略。在萬人規模的全國專案競賽中脫穎而出，最終贏得全國冠軍與最佳模型獎。" },
            { date: "2022.01 - 2023.01", role: "資料工程師 (Data Engineer)", company: "零壹科技 (Zero One Technology)", url: "", desc: "擔任技術培訓講師，累積 30+ 場次企業授課。為財政部、台灣證交所等高階政經單位提供架構建議與數據視覺化儀表板設計。" },
            { date: "2021.09 - 2023.06", role: "企業管理碩士 (MBA)", company: "國立陽明交通大學 (NYCU)", url: "", desc: "專注於商業管理、數據決策與營運策略分析等進階領域。" },
            { date: "2019.09 - 2021.06", role: "企業管理理學士 (BBA)", company: "國立臺北商業大學 (NTUB)", url: "", desc: "奠定商業分析基礎。期間取得 TOEIC 金色證書 (860)、JLPT N3 日語檢定、GA 認證以及 ERP 相關專業證照。" }
          ]
    },
    en: { title: "Experience", 
          desc: "From technical implementations to high-level strategic planning, driving data impact.",
          exp: [
            { 
              date: "2026.01 - Present", 
              role: "Partner Instructor", 
              companies: [
                { name: "nSchool (Kolable)", url: "https://kkschool.kolable.app/" },
                { name: "X Platform", url: "https://www.xplatform.world/" },
                { name: "OOSchool", url: "https://www.ooschool.cc/" }
              ],
              desc: "Customized Python & AI learning paths and end-to-end project implementation, delivering a lightweight and efficient data learning experience." 
            },
            { date: "2024.08 - Present", role: "Partner Instructor", company: "Lien Cheng Computer (Rookie Savior)", url: "https://live.rookiesavior.net/", desc: "Developed comprehensive Tableau data lifecycle curriculum. Accumulated 200+ teaching hours, empowering 150+ professionals." },
            { date: "2023.07 - Present", role: "Data Analyst Specialist", company: "Cathay Life Insurance", url: "", desc: "Led Cloud CDP selection and tagging engineering. Orchestrated Agentic AI implementations and streamlined 29 legacy tables into 10 refined Data Marts." },
            { date: "2023 - 2024", role: "Corporate Project: Dashboard Strategist", company: "NTUDAC x Shopee Xpress", url: "", desc: "Specialized in Location Intelligence & Strategic Planning. Built interactive dashboards using scraping and geospatial analysis." },
            { date: "2023", role: "AI Forecasting Champion", company: "Carrefour", url: "", desc: "Developed a customer purchase prediction model using advanced ensemble learning. Secured the National Championship." },
            { date: "2021.09 - 2023.06", role: "Master of Business Administration (MBA)", company: "NYCU", url: "", desc: "Focused on business management, data-driven decision making, and operational strategy analysis." }
          ]
    },
    ja: { title: "完全な職歴", 
          desc: "技術的な実装から高度な戦略立案まで、常にデータの価値を最大化し続けています。",
          exp: [
            { 
              date: "2026.01 - 現在", 
              role: "パートナー講師", 
              companies: [
                { name: "nSchool (Kolable)", url: "https://kkschool.kolable.app/" },
                { name: "X Platform", url: "https://www.xplatform.world/" },
                { name: "無限学院 (OOSchool)", url: "https://www.ooschool.cc/" }
              ],
              desc: "PythonとAIの学習パスをカスタマイズ設計し、エンドツーエンドのプロジェクト実践を重視した、軽量で効率的なデータ学習体験を提供します。" 
            },
            { date: "2024.08 - 現在", role: "パートナー講師", company: "聯成電腦 (Rookie Savior)", url: "https://live.rookiesavior.net/", desc: "Tableau総合カリキュラムを開発。200時間以上の指導を通じて150名以上の専門家を育成。" },
            { date: "2023.07 - 現在", role: "資料分析師", company: "國泰人壽 (Cathay Life)", url: "", desc: "クラウドCDPの選定と導入を主導。AIエージェントの導入と2万人の営業員向けデータマート構築を支援。" }
          ]
    }
  };

  const t = content[lang];

  return (
    <section className="experience fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      <div className="timeline">
        {(t.exp as any[]).map((item, idx) => (
          <div className="timeline-item" key={idx}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-date">{item.date}</div>
              <h3 className="timeline-role">{item.role}</h3>
              <div className="timeline-company">
                {item.companies ? (
                  item.companies.map((c: any, cIdx: number) => (
                    <span key={cIdx}>
                      <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px dotted var(--accent-color)', paddingBottom: '1px' }}>
                        {c.name}
                      </a>
                      {cIdx < item.companies.length - 1 && " / "}
                    </span>
                  ))
                ) : item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px dotted var(--accent-color)', paddingBottom: '1px' }}>
                    {item.company} ↗
                  </a>
                ) : (
                  item.company
                )}
              </div>
              <p className="service-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="trusted-by-section" style={{ marginTop: '5rem', marginBottom: '4rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
           Partner Platforms & Multi-Brand Collaboration
        </h3>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <a href="https://kkschool.kolable.app/" target="_blank" rel="noopener follow" className="partner-logo">
             nSchool
          </a>
          <a href="https://www.xplatform.world/" target="_blank" rel="noopener follow" className="partner-logo">
             X Platform
          </a>
          <a href="https://www.ooschool.cc/" target="_blank" rel="noopener follow" className="partner-logo">
             無限學院
          </a>
          <a href="https://live.rookiesavior.net/" target="_blank" rel="noopener follow" className="partner-logo">
             {lang === 'zh' ? '聯成電腦(菜鳥救星)' : (lang === 'ja' ? '聯成電腦' : 'Lien Cheng (Rookie Savior)')}
          </a>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .partner-logo {
             font-size: 1.4rem;
             font-weight: 900;
             color: #fff;
             opacity: 0.5;
             text-decoration: none;
             transition: all 0.3s ease;
             letter-spacing: 1px;
             font-family: var(--font-geist-sans), sans-serif;
             display: flex;
             align-items: center;
          }
          .partner-logo:hover {
             opacity: 1;
             color: var(--accent-color);
             transform: translateY(-2px);
          }
        `}} />
      </div>
    </section>
  );
}
