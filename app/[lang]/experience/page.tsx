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
    zh: { title: "完整經歷", 
          desc: "從技術實作到高階戰略規劃，持續創造數據價值。",
          exp: [
            { 
              date: "2026.01 - 至今", 
              role: "合作講師", 
              companies: [
                { name: "nSchool", url: "https://kkschool.kolable.app/", logo: "/assets/icons/nSchool.png" },
                { name: "X Platform", url: "https://www.xplatform.world/", logo: "/assets/icons/XPlatform.png" },
                { name: "無限學院", url: "https://www.ooschool.cc/", logo: "/assets/icons/無限學院.png" }
              ],
              desc: "輔導學員完成Python視覺化、建模、資料分析、n8n自動化等專案。超過50位學員。" 
            },
            { date: "2024.08 - 至今", role: "合作講師", company: "聯成電腦 (菜鳥救星)", url: "https://live.rookiesavior.net/", logo: "/assets/icons/菜鳥救星.png", desc: "開發從零到一的 Tableau 完整資料生命週期課程；累積 200+ 教學小時，培訓超過 150 位專業人士。成功協助多位學員轉職數據分析師，並獲得 4.8/5.0 的學員滿意度回饋。" },
            { date: "2023.07 - 至今", role: "資料分析師", company: "國泰人壽 (Cathay Life Insurance)", url: "", logo: "/assets/icons/國泰人壽.png", desc: "負責 Cloud CDP 選商、建置與標籤工程 (Celebrus to GA4)。主導 Agentic AI 導入，將 29 個破碎資料表收斂為 10 個核心 Data Mart。幫助兩萬名業務員提升保單貸款表現，數位轉換率顯著提升。" },
            { date: "2023.03 - 2023.06", role: "資料分析師 (Data Analyst)", company: "iKala Interactive Media Inc.", url: "", logo: "/assets/icons/iKala.png", desc: "參與 KOL 網紅影響力分析專案，量化行銷效益並優化網紅選擇策略。優化內部儀表板並實作自動化排程派報系統，整體營運效率提升 5 倍。" },
            { date: "2023.02", role: "數發部 Data Station 數據競賽 | 冠軍", company: "家樂福 (Carrefour)", url: "", logo: "/assets/icons/Carrefour.png", desc: "運用集成分群分析與 XGBoost 等機器學習演算法開發顧客購買預測模型，並深入規劃商品搭售策略。在萬人規模的全國專案競賽中脫穎而出，最終贏得全國冠軍與最佳模型獎。" },
            { date: "2023.01", role: "企業專案 | 蝦皮店到店擴張策略", company: "NTUDAC 臺大資料分析社 x 蝦皮 (Shopee Xpress)", url: "", logo: "/assets/icons/Shopee.png", desc: "負責空間智能與策略規劃，拆解物流痛點並追蹤設點關鍵指標。結合爬蟲、分群與地理空間分析建立互動式儀表板，優化整體營運網點評估規劃。" },
            { date: "2022.01 - 2023.01", role: "資料工程師 (Data Engineer)", company: "零壹科技 (Zero One Technology)", url: "", logo: "/assets/icons/zerone.png", desc: "擔任技術培訓講師，累積 30+ 場次企業授課。為財政部、台灣證交所等高階政經單位提供架構建議與數據視覺化儀表板設計。" },
            { date: "2021.09 - 2023.06", role: "企業管理碩士 (MBA)", company: "國立陽明交通大學 (NYCU)", url: "", logo: "/assets/icons/陽明交通大學.png", desc: "專注於商業管理、數據決策與營運策略分析等進階領域。" },
            { date: "2019.09 - 2021.06", role: "企業管理理學士 (BBA)", company: "國立臺北商業大學 (NTUB)", url: "", logo: "/assets/icons/NTUB.png", desc: "奠定商業分析基礎。期間取得 TOEIC 金色證書 (860)、JLPT N3 日語檢定、GA 認證以及 ERP 相關專業證照。" }
          ]
    },
    en: { title: "Experience", 
          desc: "From technical implementations to high-level strategic planning, driving data impact.",
          exp: [
            { 
              date: "2026.01 - Present", 
              role: "Partner Instructor", 
              companies: [
                { name: "nSchool", url: "https://kkschool.kolable.app/", logo: "/assets/icons/nSchool.png" },
                { name: "X Platform", url: "https://www.xplatform.world/", logo: "/assets/icons/XPlatform.png" },
                { name: "無限學院", url: "https://www.ooschool.cc/", logo: "/assets/icons/無限學院.png" }
              ],
              desc: "Guided students to complete projects in Python visualization, modeling, data analysis, and n8n automation. Mentored over 50 students." 
            },
            { date: "2024.08 - Present", role: "Partner Instructor", company: "Lien Cheng Computer", url: "https://live.rookiesavior.net/", logo: "/assets/icons/菜鳥救星.png", desc: "Developed comprehensive Tableau data lifecycle curriculum. Accumulated 200+ teaching hours, empowering 150+ professionals." },
            { date: "2023.07 - Present", role: "Data Analyst", company: "Cathay Life Insurance", url: "", logo: "/assets/icons/國泰人壽.png", desc: "Led Cloud CDP selection and tagging engineering. Orchestrated Agentic AI implementations and streamlined 29 legacy tables into 10 refined Data Marts." },
            { date: "2023.03 - 2023.06", role: "Data Analyst", company: "iKala Interactive Media Inc.", url: "", logo: "/assets/icons/iKala.png", desc: "Quantitative influencer marketing analysis. Built internal dashboards and automated email reports, boosting efficiency by 5x." },
            { date: "2023.02", role: "Data Station Data Competition | Champion", company: "Carrefour", url: "", logo: "/assets/icons/Carrefour.png", desc: "Developed a customer purchase prediction model using advanced ensemble learning. Secured the National Championship." },
            { date: "2023.01", role: "Corporate Project | Shopee Xpress Expansion Strategy", company: "NTUDAC x Shopee Xpress", url: "", logo: "/assets/icons/Shopee.png", desc: "Specialized in Location Intelligence & Strategic Planning. Built interactive dashboards using scraping and geospatial analysis." },
            { date: "2022.01 - 2023.01", role: "Data Engineer", company: "Zero One Technology", url: "", logo: "/assets/icons/zerone.png", desc: "Served as technical trainer for 30+ corporate sessions. Delivered architecture advice and dashboards for high-level government & financial institutions." },
            { date: "2021.09 - 2023.06", role: "Master of Business Administration (MBA)", company: "NYCU", url: "", logo: "/assets/icons/陽明交通大學.png", desc: "Focused on business management, data-driven decision making, and operational strategy analysis." },
            { date: "2019.09 - 2021.06", role: "Bachelor of Business Administration (BBA)", company: "NTUB", url: "", logo: "/assets/icons/NTUB.png", desc: "Obtained TOEIC Gold (860), JLPT N3, GA Certification, and ERP professional licenses." }
          ]
    },
    ja: { title: "職歴", 
          desc: "技術的な実装から高度な戦略立案まで、常にデータの価値を最大化し続けています。",
          exp: [
            { 
              date: "2026.01 - 現在", 
              role: "パートナー講師", 
              companies: [
                { name: "nSchool", url: "https://kkschool.kolable.app/", logo: "/assets/icons/nSchool.png" },
                { name: "X Platform", url: "https://www.xplatform.world/", logo: "/assets/icons/XPlatform.png" },
                { name: "無限學院", url: "https://www.ooschool.cc/", logo: "/assets/icons/無限學院.png" }
              ],
              desc: "Pythonによる可視化、モデリング、データ分析、n8n自動化などのプロジェクトを指導。50名以上の受講生をサポートしました。" 
            },
            { date: "2024.08 - 現在", role: "パートナー講師", company: "聯成電腦 (Rookie Savior)", url: "https://live.rookiesavior.net/", logo: "/assets/icons/菜鳥救星.png", desc: "Tableau総合カリキュラムを開発。200時間以上の指導を通じて150名以上の専門家を育成。" },
            { date: "2023.07 - 現在", role: "資料分析師", company: "國泰人壽 (Cathay Life Insurance)", url: "", logo: "/assets/icons/國泰人壽.png", desc: "クラウドCDPの選定と導入を主導。AIエージェントの導入と2万人の営業員向けデータマート構築を支援。" },
            { date: "2023.03 - 2023.06", role: "データアナリスト", company: "iKala Interactive Media Inc.", url: "", logo: "/assets/icons/iKala.png", desc: "KOLインフルエンサーの影響力分析プロジェクトに参加。社内ダッシュボードと自動レポートシステムを構築し、運営効率を5倍向上。" },
            { date: "2023.02", role: "数位発展部 Data Station データコンテスト | 優勝", company: "Carrefour (家樂福)", url: "", logo: "/assets/icons/Carrefour.png", desc: "機械学習を用いた顧客購買予測モデルの開発。1万人規模の全国コンテストで優勝。" },
            { date: "2023.01", role: "企業プロジェクト | 蝦皮 (Shopee) 店舗拡大戦略", company: "NTUDAC x Shopee Xpress", url: "", logo: "/assets/icons/Shopee.png", desc: "位置情報インテリジェンスと戦略立案を担当。スクレイピングと空間分析でダッシュボードを構築。" },
            { date: "2022.01 - 2023.01", role: "データエンジニア", company: "Zero One Technology (零壹科技)", url: "", logo: "/assets/icons/zerone.png", desc: "技術研修講師として30回以上の法人向けセッションを実施。政府機関等にアーキテクチャ提案を提供。" },
            { date: "2021.09 - 2023.06", role: "経営学修士 (MBA)", company: "国立陽明交通大学 (NYCU)", url: "", logo: "/assets/icons/陽明交通大學.png", desc: "経営管理、データドリブンな意思決定、運営戦略分析を専攻。" },
            { date: "2019.09 - 2021.06", role: "経営学学士 (BBA)", company: "国立台北商業大学 (NTUB)", url: "", logo: "/assets/icons/NTUB.png", desc: "TOEIC Gold (860)、JLPT N3、GA認定、ERP専門資格を取得。" }
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
              <div className="timeline-company" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {item.companies ? (
                  item.companies.map((c: any, cIdx: number) => (
                    <span key={cIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      {c.logo && <img src={c.logo} alt="logo" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'contain', background: 'white', padding: '1px' }} />}
                      <a href={`${c.url}${c.url.includes('?') ? '&' : '?'}utm_source=jason-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_timeline_partner`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px dotted var(--accent-color)', paddingBottom: '1px' }}>
                        {c.name}
                      </a>
                      {cIdx < item.companies.length - 1 && " / "}
                    </span>
                  ))
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    {item.logo && <img src={item.logo} alt="logo" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'contain', background: 'white', padding: '1px' }} />}
                    {item.url ? (
                      <a href={`${item.url}${item.url.includes('?') ? '&' : '?'}utm_source=jason-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_timeline_partner`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px dotted var(--accent-color)', paddingBottom: '1px' }}>
                        {item.company}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--accent-color)' }}>{item.company}</span>
                    )}
                  </span>
                )}
              </div>
              <p className="service-desc" style={{ marginTop: '1rem' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="trusted-by-section" style={{ marginTop: '5rem', marginBottom: '4rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
           Partner Platforms & Multi-Brand Collaboration
        </h3>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <a href="https://kkschool.kolable.app/?utm_source=jason-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner" target="_blank" rel="noopener follow" className="partner-logo">
             <img src="/assets/icons/nSchool.png" alt="" style={{ width: 24, height: 24, marginRight: 8, borderRadius: 4, background: 'transparent' }} /> nSchool
          </a>
          <a href="https://www.xplatform.world/?utm_source=jason-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner" target="_blank" rel="noopener follow" className="partner-logo">
             <img src="/assets/icons/XPlatform.png" alt="" style={{ width: 24, height: 24, marginRight: 8, borderRadius: 4, background: 'transparent' }} /> X Platform
          </a>
          <a href="https://www.ooschool.cc/?utm_source=jason-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner" target="_blank" rel="noopener follow" className="partner-logo">
             <img src="/assets/icons/無限學院.png" alt="" style={{ width: 24, height: 24, marginRight: 8, borderRadius: 4, background: 'transparent' }} /> 無限學院
          </a>
          <a href={`https://live.rookiesavior.net/?utm_source=jason-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner`} target="_blank" rel="noopener follow" className="partner-logo">
             <img src="/assets/icons/菜鳥救星.png" alt="" style={{ width: 24, height: 24, marginRight: 8, borderRadius: 4, background: 'transparent' }} />
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
