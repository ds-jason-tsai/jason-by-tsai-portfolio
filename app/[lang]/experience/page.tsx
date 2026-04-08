import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "數據分析師職涯經歷 | 傑森數據 - Python, SQL 與數據工程實務", 
    en: "Professional Experience | Jason Analytics - Python, SQL & Data Engineering", 
    ja: "実務経験 | ジェイソン・アナリティクス - Python, SQL とデータエンジニアリングの実績" 
  };
  const descriptions = {
    zh: "深入了解傑森數據 Jason Analytics 的專業職涯實績。累積多年數據分析與數據工程開發經驗，深耕 FinTech 金融科技、AI 建模與 MarTech 顧問領域。具備豐富的大數據教學經驗與企業端專案實務，協助您掌握數據職涯脈動，立即點擊查看完整履歷。",
    en: "Explore the professional career of Jason Analytics (Jason Tsai). Over a decade of experience in data analysis, data engineering, FinTech, and MarTech. Discover my journey from practitioner to consultant and instructor. Click to learn more about my career highlights.",
    ja: "Jason Analytics (ジェイソン・ツァイ) の職歴と実績をご紹介します。データ分析、データエンジニアリング、FinTech、MarTechの分野で長年の経験があります。実務から教育まで、データ活用の最前線での歩みをご覧ください。詳細はこちら。"
  };
  return { 
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh']
  };
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
              desc: "協助近 100 位學員完成 Python 資料分析、AI 建模、n8n 自動化等專案。" 
            },
            { date: "2024.08 - 至今", role: "合作講師", company: "聯成電腦 (菜鳥救星)", url: "https://live.rookiesavior.net/", logo: "/assets/icons/菜鳥救星.png", desc: "開發從零到一的 Tableau 完整課程；累積 300+ 小時教學，培訓超過 150 位業界人士。成功協助多位學員轉職商業分析師(BA)、數據分析師(DA)，並獲得學員們的高滿意度回饋。" },
            { date: "2023.07 - 至今", role: "資料分析師(Data Analyst)", company: "國泰人壽 (Cathay Life Insurance)", url: "", logo: "/assets/icons/國泰人壽.png", desc: "負責數位軌跡系統建置(GA4)、客戶標籤設計、客戶資料平台(CDP)評估、導入以及保單貸款資料分析等專案。" },
            { date: "2023.03 - 2023.06", role: "資料分析師 (Data Analyst)", company: "iKala Interactive Media Inc.", url: "", logo: "/assets/icons/iKala.png", desc: "參與 KOL 網紅影響力分析專案，量化行銷效益並優化網紅選擇策略。優化 Tableau 儀表板並實作自動化排程寄送系統，提升整體營運效率 200% 以上。" },
            { date: "2023.01", role: "企業專案 | 蝦皮店到店擴張策略", company: "NTUDAC 臺大資料分析社 x 蝦皮 (Shopee Xpress)", url: "", logo: "/assets/icons/Shopee.png", desc: "負責空間智能與策略規劃，拆解物流痛點並追蹤設點關鍵指標。結合爬蟲、分群與地理空間分析建立互動式儀表板，優化整體營運網點評估規劃。" },
            { date: "2022.10", role: "數發部 Data Station 數據競賽 | 冠軍", company: "家樂福 (Carrefour)", url: "", logo: "/assets/icons/Carrefour.png", desc: "透過分群、關聯式演算法和其他機器學習演算法開發顧客購買預測模型，並深入規劃商品搭售策略。在規模龐大的全國專案競賽中脫穎而出，贏得冠軍與最佳模型獎。" },
            { date: "2022.01 - 2023.01", role: "資料工程師 (Data Engineer)", company: "零壹科技 (Zero One Technology)", url: "", logo: "/assets/icons/zerone.png", desc: "擔任技術培訓講師，累積 30+ 場次企業授課。為財政部、台灣證交所等高階政經單位提供架構建議與數據視覺化儀表板設計。" },
            { date: "2021.09 - 2023.06", role: "企業管理碩士 (MBA)", company: "國立陽明交通大學 (NYCU)", url: "", logo: "/assets/icons/陽明交通大學.png", desc: "專注於商業管理、數據決策與營運策略分析等進階領域。" },
            { date: "2019.09 - 2021.06", role: "企業管理理學士 (BBA)", company: "國立臺北商業大學 (NTUB)", url: "", logo: "/assets/icons/NTUB.png", desc: "奠定商業分析基礎。期間取得 TOEIC 金色證書、JLPT N3 日語檢定、GA 認證以及 ERP 專業證照。" }
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
              desc: "Assisted nearly 100 students in completing Python data analysis, AI modeling, and n8n automation projects." 
            },
            { date: "2024.08 - Present", role: "Partner Instructor", company: "Lien Cheng Computer", url: "https://live.rookiesavior.net/", logo: "/assets/icons/菜鳥救星.png", desc: "Developed end-to-end Tableau curriculum. Accumulated 300+ teaching hours, empowering 150+ professionals to transition into BA/DA roles." },
            { date: "2023.07 - Present", role: "Data Analyst", company: "Cathay Life Insurance", url: "", logo: "/assets/icons/國泰人壽.png", desc: "Responsible for GA4 implementation, tag design, CDP evaluation/integration, and insurance loan data analysis projects." },
            { date: "2023.03 - 2023.06", role: "Data Analyst", company: "iKala Interactive Media Inc.", url: "", logo: "/assets/icons/iKala.png", desc: "KOL influence analysis. Optimized Tableau dashboards and implemented automated scheduling systems, increasing operational efficiency by 200%." },
            { date: "2023.01", role: "Corporate Project | Shopee Xpress Expansion Strategy", company: "NTUDAC x Shopee Xpress", url: "", logo: "/assets/icons/Shopee.png", desc: "Specialized in Location Intelligence & Strategic Planning. Built interactive dashboards using scraping and geospatial analysis." },
            { date: "2022.10", role: "Data Station Data Competition | Champion", company: "Carrefour", url: "", logo: "/assets/icons/Carrefour.png", desc: "Developed customer purchase prediction models using clustering and associative algorithms. Won National Championship." },
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
              desc: "100名近い受講生のPythonデータ分析、AIモデリング、n8n自動化などのプロジェクトを支援。" 
            },
            { date: "2024.08 - 現在", role: "パートナー講師", company: "聯成電腦 (Rookie Savior)", url: "https://live.rookiesavior.net/", logo: "/assets/icons/菜鳥救星.png", desc: "Tableau総合カリキュラムを開発。300時間以上の指導を通じて150名以上の専門家を育成し、BA/DAへの転職を支援。" },
            { date: "2023.07 - 現在", role: "資料分析師", company: "國泰人壽 (Cathay Life Insurance)", url: "", logo: "/assets/icons/國泰人壽.png", desc: "GA4導入、タグ設計、CDP評価・導入、および保険融資データ分析プロジェクトを担当。" },
            { date: "2023.03 - 2023.06", role: "データアナリスト", company: "iKala Interactive Media Inc.", url: "", logo: "/assets/icons/iKala.png", desc: "KOLインフルエンサーの影響力分析。Tableauダッシュボードの最適化と自動レポート送信システムを構築し、運営効率を200%向上。" },
            { date: "2023.01", role: "企業プロジェクト | 蝦皮 (Shopee) 店舗拡大戦略", company: "NTUDAC x Shopee Xpress", url: "", logo: "/assets/icons/Shopee.png", desc: "位置情報インテリジェンスと戦略立案を担当。スクレイピングと空間分析でダッシュボードを構築。" },
            { date: "2022.10", role: "数位発展部 Data Station データコンテスト | 優勝", company: "Carrefour (家樂福)", url: "", logo: "/assets/icons/Carrefour.png", desc: "クラスタリング、レコメンデーション、およびその他の機械学習アルゴリズムを用いた顧客購買予測モデルの開発。全国コンテストで優勝。" },
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
                      <a href={`${c.url}${c.url.includes('?') ? '&' : '?'}utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_timeline_partner`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px dotted var(--accent-color)', paddingBottom: '1px' }}>
                        {c.name}
                      </a>
                      {cIdx < item.companies.length - 1 && " / "}
                    </span>
                  ))
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    {item.logo && <img src={item.logo} alt="logo" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'contain', background: 'white', padding: '1px' }} />}
                    {item.url ? (
                      <a href={`${item.url}${item.url.includes('?') ? '&' : '?'}utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_timeline_partner`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px dotted var(--accent-color)', paddingBottom: '1px' }}>
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
          <a href="https://kkschool.kolable.app/?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner" target="_blank" rel="noopener follow" className="partner-logo">
             <img src="/assets/icons/nSchool.png" alt="" style={{ width: 24, height: 24, marginRight: 8, borderRadius: 4, background: 'transparent' }} /> nSchool
          </a>
          <a href="https://www.xplatform.world/?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner" target="_blank" rel="noopener follow" className="partner-logo">
             <img src="/assets/icons/XPlatform.png" alt="" style={{ width: 24, height: 24, marginRight: 8, borderRadius: 4, background: 'transparent' }} /> X Platform
          </a>
          <a href="https://www.ooschool.cc/?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner" target="_blank" rel="noopener follow" className="partner-logo">
             <img src="/assets/icons/無限學院.png" alt="" style={{ width: 24, height: 24, marginRight: 8, borderRadius: 4, background: 'transparent' }} /> 無限學院
          </a>
          <a href={`https://live.rookiesavior.net/?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner`} target="_blank" rel="noopener follow" className="partner-logo">
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
