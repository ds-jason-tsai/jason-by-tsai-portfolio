import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = {
    zh: "職涯經歷｜數據/AI/CRM顧問 Jason Analytics",
    en: "Experience | Data/AI/CRM Consultant - Jason Analytics",
    ja: "職務経歴｜データ/AI/CRM コンサルタント Jason Analytics"
  };
  const descriptions = {
    zh: "探索 Jason Tsai 的顧問職涯實績：從資料分析、CDP 導入到 Salesforce CRM 解決方案設計，橫跨金融、科技與零售產業。具備豐富企業端教學經驗，立即查看完整資歷軌跡與專業證照。",
    en: "Explore Jason Tsai's consulting career: from data analysis and CDP implementation to Salesforce CRM solution design, across finance, tech, and retail. View the full career timeline and certifications.",
    ja: "Jason Tsai の職務経歴：データ分析・CDP導入から Salesforce CRM ソリューション設計まで、金融・テクノロジー・小売業界を横断。豊富な企業研修経験も。詳しい経歴と資格をご紹介します。"
  };
  return { 
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh'],
    alternates: {
      canonical: `https://jason-by-tsai-portfolio.vercel.app/${lang}/experience`,
      languages: {
        'zh': 'https://jason-by-tsai-portfolio.vercel.app/zh/experience',
        'en': 'https://jason-by-tsai-portfolio.vercel.app/en/experience',
        'ja': 'https://jason-by-tsai-portfolio.vercel.app/ja/experience',
      },
    }
  };
}

export default async function Experience({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const content = {
    zh: { title: "完整經歷", 
          desc: "從技術實作到高階戰略規劃，持續創造數據價值。",
          certsTitle: "專業證照",
          viewCert: "顯示證照",
          issuedBy: "頒發單位",
          exp: [
            { date: "2026.06 - 至今", role: "資深解決方案工程師 (Senior Solution Engineer)", company: "Salesforce", url: "https://www.salesforce.com/", logo: "/assets/icons/Salesforce.png", desc: "主導 20+ 企業客戶(涵蓋金融、製造、科技、零售)的解決方案顧問與技術探索，將業務需求轉化為 Sales Cloud、Service Cloud、Data 360、Marketing Cloud、Slack 與 Agentforce 的導入方案；負責產業客製化 Demo 與價值故事設計，並打造 AI 賦能的售前顧問流程，協助業務團隊建置客製化展示環境。" },
            { date: "2023.07 - 2026.06", role: "資料分析師(襄理)", company: "國泰人壽 (Cathay Life Insurance)", url: "", logo: "/assets/icons/國泰人壽.png", desc: "主導跨部門策略盤點，將 800 萬+ 保戶生態圈需求轉化為三年數位藍圖；主導企業級 CDP 供應商評估與導入(比較 Appier、beBit、Insider、Salesforce)，將行銷活動執行時間從 7 天縮短至 1 天；主導 Celebrus Exit 專案，以 GA4/GCP 重構 30+ 數位平台的數據蒐集架構；協助 2 萬+ 保險業務員，推動線上保單貸款成效成長 20%+。" },
            {
              date: "2026.01 - 至今",
              role: "合作講師",
              companies: [
                { name: "nSchool", url: "https://kkschool.kolable.app/", logo: "/assets/icons/nSchool.png" },
                { name: "無限學院", url: "https://www.ooschool.cc/", logo: "/assets/icons/無限學院.png" },
                { name: "X Platform", url: "https://www.xplatform.world/", logo: "/assets/icons/XPlatform.png" }
              ],
              desc: "協助近 100 位學員完成 Python 資料分析、AI 建模、n8n 自動化等專案。"
            },
            { date: "2024.08 - 2026.05", role: "合作講師", company: "聯成電腦 (菜鳥救星)", url: "https://live.rookiesavior.net/", logo: "/assets/icons/菜鳥救星.png", desc: "開發從零到一的 Tableau 完整課程；累積 300+ 小時教學，培訓超過 150 位業界人士。成功協助多位學員轉職商業分析師(BA)、數據分析師(DA)，並獲得學員們的高滿意度回饋。" },
            { date: "2023.03 - 2023.06", role: "資料分析師 (Data Analyst)", company: "iKala Interactive Media Inc.", url: "", logo: "/assets/icons/iKala.png", desc: "參與 KOL 網紅影響力分析專案，量化行銷效益並優化網紅選擇策略。優化 Tableau 儀表板並實作自動化排程寄送系統，提升整體營運效率 5 倍以上(500%)。" },
            { date: "2023.01", role: "企業專案 | 蝦皮店到店擴張策略", company: "NTUDAC 臺大資料分析社 x 蝦皮 (Shopee Xpress)", url: "", logo: "/assets/icons/Shopee.png", desc: "負責空間智能與策略規劃，拆解物流痛點並追蹤設點關鍵指標。結合爬蟲、分群與地理空間分析建立互動式儀表板，優化整體營運網點評估規劃。" },
            { date: "2022.10", role: "數發部 Data Station 數據競賽 | 冠軍", company: "家樂福 (Carrefour)", url: "", logo: "/assets/icons/Carrefour.png", desc: "透過分群、關聯式演算法和其他機器學習演算法開發顧客購買預測模型，並深入規劃商品搭售策略。在規模龐大的全國專案競賽中脫穎而出，贏得冠軍與最佳模型獎。" },
            { date: "2022.01 - 2023.01", role: "資料工程師 (Data Engineer)", company: "零壹科技 (Zero One Technology)", url: "", logo: "/assets/icons/zerone.png", desc: "擔任技術培訓講師，累積 30+ 場次企業授課。為財政部、台灣證交所等高階政經單位提供架構建議與數據視覺化儀表板設計。" },
            { date: "2021.09 - 2023.06", role: "企業管理碩士 (MBA)", company: "國立陽明交通大學 (NYCU)", url: "", logo: "/assets/icons/陽明交通大學.png", desc: "專注於商業管理、數據決策與營運策略分析等進階領域。" },
            { date: "2019.09 - 2021.06", role: "企業管理理學士 (BBA)", company: "國立臺北商業大學 (NTUB)", url: "", logo: "/assets/icons/NTUB.png", desc: "奠定商業分析基礎。期間取得 TOEIC 金色證書、JLPT N3 日語檢定、GA 認證以及 ERP 專業證照。" }
          ],
          certs: [
            {
              title: "Salesforce 平台管理員認證 (Platform Administrator)",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "Marketing Cloud Engagement Foundations",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "Platform Foundations",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "Agentblazer Innovator",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "ChatGPT 教育者基礎認證",
              issuer: "OpenAI",
              date: "2025年12月",
              logo: "/assets/icons/openai_logo.png",
              url: "https://www.credly.com/badges/95a39d40-346f-4e1a-9090-f8aaf729a1b0/linked_in_profile"
            },
            {
              title: "Gemini 認證教育者",
              issuer: "Google",
              date: "2025年9月",
              id: "160793457",
              logo: "/assets/icons/google_logo.png",
              url: "https://edu.google.accredible.com/344a67ad-adf1-4366-9d3e-337dc26e3ff5#acc.QnLCxWVD"
            }
          ]
    },
    en: { title: "Experience", 
          desc: "From technical implementations to high-level strategic planning, driving data impact.",
          certsTitle: "Certifications",
          viewCert: "View Certificate",
          issuedBy: "Issued by",
          exp: [
            { date: "2026.06 - Present", role: "Senior Solution Engineer", company: "Salesforce", url: "https://www.salesforce.com/", logo: "/assets/icons/Salesforce.png", desc: "Supported opportunities across 20+ enterprise accounts spanning financial services, manufacturing, technology, and retail, translating requirements into Salesforce solutions across Sales Cloud, Service Cloud, Data 360, Marketing Cloud, Slack, and Agentforce. Led industry-specific solution design and customer-facing demos, and pioneered AI-powered presales workflows enabling AEs to build customized demo environments." },
            { date: "2023.07 - 2026.06", role: "Data Analyst (Assistant Manager)", company: "Cathay Life Insurance", url: "", logo: "/assets/icons/國泰人壽.png", desc: "Led cross-functional discovery translating requirements for an 8M+ policyholder ecosystem into a 3-year digital roadmap. Led enterprise CDP vendor evaluation and implementation (Appier, beBit, Insider, Salesforce), reducing marketing campaign execution time from 7 days to 1 day. Spearheaded the Celebrus Exit Project re-architecting data collection across 30+ digital platforms with GA4/GCP, and drove 20%+ growth in online policy loan performance." },
            {
              date: "2026.01 - Present",
              role: "Partner Instructor",
              companies: [
                { name: "nSchool", url: "https://kkschool.kolable.app/", logo: "/assets/icons/nSchool.png" },
                { name: "無限學院", url: "https://www.ooschool.cc/", logo: "/assets/icons/無限學院.png" },
                { name: "X Platform", url: "https://www.xplatform.world/", logo: "/assets/icons/XPlatform.png" }
              ],
              desc: "Assisted nearly 100 students in completing Python data analysis, AI modeling, and n8n automation projects."
            },
            { date: "2024.08 - 2026.05", role: "Partner Instructor", company: "Lien Cheng Computer", url: "https://live.rookiesavior.net/", logo: "/assets/icons/菜鳥救星.png", desc: "Developed end-to-end Tableau curriculum. Accumulated 300+ teaching hours, empowering 150+ professionals to transition into BA/DA roles." },
            { date: "2023.03 - 2023.06", role: "Data Analyst", company: "iKala Interactive Media Inc.", url: "", logo: "/assets/icons/iKala.png", desc: "KOL influence analysis. Optimized Tableau dashboards and implemented automated scheduling systems, achieving a 5x (500%) improvement in operational efficiency." },
            { date: "2023.01", role: "Corporate Project | Shopee Xpress Expansion Strategy", company: "NTUDAC x Shopee Xpress", url: "", logo: "/assets/icons/Shopee.png", desc: "Specialized in Location Intelligence & Strategic Planning. Built interactive dashboards using scraping and geospatial analysis." },
            { date: "2022.10", role: "Data Station Data Competition | Champion", company: "Carrefour", url: "", logo: "/assets/icons/Carrefour.png", desc: "Developed customer purchase prediction models using clustering and associative algorithms. Won National Championship." },
            { date: "2022.01 - 2023.01", role: "Data Engineer", company: "Zero One Technology", url: "", logo: "/assets/icons/zerone.png", desc: "Served as technical trainer for 30+ corporate sessions. Delivered architecture advice and dashboards for high-level government & financial institutions." },
            { date: "2021.09 - 2023.06", role: "Master of Business Administration (MBA)", company: "NYCU", url: "", logo: "/assets/icons/陽明交通大學.png", desc: "Focused on business management, data-driven decision making, and operational strategy analysis." },
            { date: "2019.09 - 2021.06", role: "Bachelor of Business Administration (BBA)", company: "NTUB", url: "", logo: "/assets/icons/NTUB.png", desc: "Obtained TOEIC Gold (860), JLPT N3, GA Certification, and ERP professional licenses." }
          ],
          certs: [
            {
              title: "Salesforce Certified Platform Administrator",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "Marketing Cloud Engagement Foundations",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "Platform Foundations",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "Agentblazer Innovator",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "ChatGPT Foundations for Teachers",
              issuer: "OpenAI",
              date: "Dec 2025",
              logo: "/assets/icons/openai_logo.png",
              url: "https://www.credly.com/badges/95a39d40-346f-4e1a-9090-f8aaf729a1b0/linked_in_profile"
            },
            {
              title: "Gemini Certified Educator",
              issuer: "Google",
              date: "Sep 2025",
              id: "160793457",
              logo: "/assets/icons/google_logo.png",
              url: "https://edu.google.accredible.com/344a67ad-adf1-4366-9d3e-337dc26e3ff5#acc.QnLCxWVD"
            }
          ]
    },
    ja: { title: "職歴",
          desc: "技術的な実装から高度な戦略立案まで、常にデータの価値を最大化し続けています。",
          certsTitle: "専門資格・認定",
          viewCert: "認定証を表示",
          issuedBy: "発行元",
          exp: [
            { date: "2026.06 - 現在", role: "シニア・ソリューションエンジニア (Senior Solution Engineer)", company: "Salesforce", url: "https://www.salesforce.com/", logo: "/assets/icons/Salesforce.png", desc: "金融・製造・テクノロジー・小売業界にまたがる20社以上のエンタープライズ案件を担当し、Sales Cloud、Service Cloud、Data 360、Marketing Cloud、Slack、Agentforce のソリューション設計を主導。業界特化型デモとAI活用のプリセールス業務を推進。" },
            { date: "2023.07 - 2026.06", role: "資料分析師(襄理)", company: "國泰人壽 (Cathay Life Insurance)", url: "", logo: "/assets/icons/國泰人壽.png", desc: "800万+の保険契約者エコシステムに向けた3年間のデジタルロードマップを策定。CDPベンダー評価・導入(Appier、beBit、Insider、Salesforce)を主導し、マーケティング施行時間を7日から1日に短縮。GA4/GCPによる30以上のプラットフォームのデータ基盤刷新、オンライン保険契約者向けローン実績20%+成長にも貢献。" },
            {
              date: "2026.01 - 現在",
              role: "パートナー講師",
              companies: [
                { name: "nSchool", url: "https://kkschool.kolable.app/", logo: "/assets/icons/nSchool.png" },
                { name: "無限學院", url: "https://www.ooschool.cc/", logo: "/assets/icons/無限學院.png" },
                { name: "X Platform", url: "https://www.xplatform.world/", logo: "/assets/icons/XPlatform.png" }
              ],
              desc: "100名近い受講生のPythonデータ分析、AIモデリング、n8n自動化などのプロジェクトを支援。"
            },
            { date: "2024.08 - 2026.05", role: "パートナー講師", company: "聯成電腦 (Rookie Savior)", url: "https://live.rookiesavior.net/", logo: "/assets/icons/菜鳥救星.png", desc: "Tableau総合カリキュラムを開発。300時間以上の指導を通じて150名以上の専門家を育成し、BA/DAへの転職を支援。" },
            { date: "2023.03 - 2023.06", role: "データアナリスト", company: "iKala Interactive Media Inc.", url: "", logo: "/assets/icons/iKala.png", desc: "KOLインフルエンサーの影響力分析。Tableauダッシュボードの最適化と自動レポート送信システムを構築し、運用効率を5倍(500%)向上。" },
            { date: "2023.01", role: "企業プロジェクト | 蝦皮 (Shopee) 店舗拡大戦略", company: "NTUDAC x Shopee Xpress", url: "", logo: "/assets/icons/Shopee.png", desc: "位置情報インテリジェンスと戦略立案を担当。スクレイピングと空間分析でダッシュボードを構築。" },
            { date: "2022.10", role: "数位発展部 Data Station データコンテスト | 優勝", company: "Carrefour (家樂福)", url: "", logo: "/assets/icons/Carrefour.png", desc: "クラスタリング、レコメンデーション、およびその他の機械学習アルゴリズムを用いた顧客購買予測モデルの開発。全国コンテストで優勝。" },
            { date: "2022.01 - 2023.01", role: "データエンジニア", company: "Zero One Technology (零壹科技)", url: "", logo: "/assets/icons/zerone.png", desc: "技術研修講師として30回以上の法人向けセッションを実施。政府機関等にアーキテクチャ提案を提供。" },
            { date: "2021.09 - 2023.06", role: "経営学修士 (MBA)", company: "国立陽明交通大学 (NYCU)", url: "", logo: "/assets/icons/陽明交通大學.png", desc: "経営管理、データドリブンな意思決定、運営戦略分析を専攻。" },
            { date: "2019.09 - 2021.06", role: "経営学学士 (BBA)", company: "国立台北商業大学 (NTUB)", url: "", logo: "/assets/icons/NTUB.png", desc: "TOEIC Gold (860)、JLPT N3、GA認定、ERP専門資格を取得。" }
          ],
          certs: [
            {
              title: "Salesforce 認定プラットフォーム管理者 (Platform Administrator)",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "Marketing Cloud Engagement Foundations",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "Platform Foundations",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "Agentblazer Innovator",
              issuer: "Salesforce",
              logo: "/assets/icons/Salesforce.png",
              url: "https://www.salesforce.com/trailblazer/jason-tsai"
            },
            {
              title: "ChatGPT 教育者向け基礎認證",
              issuer: "OpenAI",
              date: "2025年12月",
              logo: "/assets/icons/openai_logo.png",
              url: "https://www.credly.com/badges/95a39d40-346f-4e1a-9090-f8aaf729a1b0/linked_in_profile"
            },
            {
              title: "Gemini 認定教育者",
              issuer: "Google",
              date: "2025年9月",
              id: "160793457",
              logo: "/assets/icons/google_logo.png",
              url: "https://edu.google.accredible.com/344a67ad-adf1-4366-9d3e-337dc26e3ff5#acc.QnLCxWVD"
            }
          ]
    }
  };

  const t = content[lang];
  const certsList = (t as any).certs || [];

  return (
    <section className="experience fade-in" style={{ padding: '0 2rem' }}>
      <h1 className="section-title">{t.title}</h1>
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
                      {c.logo && <Image src={c.logo} alt={`${c.name} Logo`} width={28} height={28} style={{ borderRadius: '4px', objectFit: 'contain', background: 'white', padding: '1px' }} />}
                      <a href={`${c.url}${c.url.includes('?') ? '&' : '?'}utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_timeline_partner`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px dotted var(--accent-color)', paddingBottom: '1px' }}>
                        {c.name}
                      </a>
                      {cIdx < item.companies.length - 1 && " / "}
                    </span>
                  ))
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    {item.logo && <Image src={item.logo} alt={`${item.company} Logo`} width={28} height={28} style={{ borderRadius: '4px', objectFit: 'contain', background: 'white', padding: '1px' }} />}
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

      {/* Certifications Section */}
      <div className="certifications-section" style={{ marginTop: '6rem', marginBottom: '4rem' }}>
        <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '3.5rem' }}>{t.certsTitle}</h2>
        <div className="certs-carousel-container">
          <div className="certs-carousel-track">
          {[...certsList, ...certsList].map((cert: any, idx: number) => (
            <div key={idx} className="cert-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <Image src={cert.logo} alt={`${cert.issuer} Logo`} width={48} height={48} style={{ borderRadius: '10px', objectFit: 'contain', background: 'white', padding: '5px' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', lineHeight: '1.3' }}>{cert.title}</h3>
                  <p style={{ color: 'var(--accent-color)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{cert.issuer}</p>
                </div>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '1.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.6rem' }}>
                  <span>{t.issuedBy}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{cert.issuer}</span>
                </div>
                {cert.date && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: cert.id ? '0.6rem' : '0', borderBottom: cert.id ? '1px solid var(--glass-border)' : 'none', paddingBottom: cert.id ? '0.6rem' : '0' }}>
                    <span>{lang === 'zh' ? '頒發日期' : (lang === 'ja' ? '発行日' : 'Issued Date')}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{cert.date}</span>
                  </div>
                )}
                {cert.id && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem' }}>
                    <span>{lang === 'zh' ? '證照編號' : (lang === 'ja' ? '認定番号' : 'Credential ID')}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.85rem' }}>{cert.id}</span>
                  </div>
                )}
              </div>
              <a href={cert.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ 
                textAlign: 'center', 
                padding: '0.8rem', 
                fontSize: '0.95rem',
                marginTop: 'auto',
                width: '100%',
                borderRadius: '12px'
              }}>
                {t.viewCert}
              </a>
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className="trusted-by-section" style={{ marginTop: '5rem', marginBottom: '4rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
           Partner Platforms & Multi-Brand Collaboration
        </h3>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <a href="https://kkschool.kolable.app/?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner" target="_blank" rel="noopener follow" className="partner-logo">
             <Image src="/assets/icons/nSchool.png" alt="nSchool Logo - Data Analysis & AI Education Partner" width={24} height={24} style={{ marginRight: '8px', borderRadius: '4px', background: 'transparent' }} /> nSchool
          </a>
          <a href="https://www.xplatform.world/?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner" target="_blank" rel="noopener follow" className="partner-logo">
             <Image src="/assets/icons/XPlatform.png" alt="X Platform Logo - Global Web3 Collaboration" width={24} height={24} style={{ marginRight: '8px', borderRadius: '4px', background: 'transparent' }} /> X Platform
          </a>
          <a href="https://www.ooschool.cc/?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner" target="_blank" rel="noopener follow" className="partner-logo">
             <Image src="/assets/icons/無限學院.png" alt="OOSchool (無限學院) Logo - Professional Skills Training" width={24} height={24} style={{ marginRight: '8px', borderRadius: '4px', background: 'transparent' }} /> 無限學院
          </a>
          <a href={`https://live.rookiesavior.net/?utm_source=jason-by-tsai-portfolio.vercel.app&utm_medium=referral&utm_campaign=exp_footer_partner`} target="_blank" rel="noopener follow" className="partner-logo">
             <Image src="/assets/icons/菜鳥救星.png" alt="Rookie Savior (菜鳥救星) Logo - IT Career Training" width={24} height={24} style={{ marginRight: '8px', borderRadius: '4px', background: 'transparent' }} />
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
          .certs-carousel-container {
             width: 100%;
             overflow: hidden;
             position: relative;
             padding: 1rem 0;
          }
          .certs-carousel-track {
             display: flex;
             width: max-content;
             gap: 2rem;
             animation: certsScroll 36s linear infinite;
          }
          @keyframes certsScroll {
             0% { transform: translateX(0); }
             100% { transform: translateX(calc(-50% - 1rem)); }
          }
          .cert-card {
             background: var(--glass-bg);
             border: 1px solid var(--glass-border);
             border-radius: 24px;
             padding: 2rem;
             width: 320px;
             flex-shrink: 0;
             display: flex;
             flex-direction: column;
             transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .cert-card:hover {
             transform: translateY(-10px) scale(1.02);
             border-color: var(--accent-color);
             box-shadow: 0 20px 40px rgba(0, 242, 254, 0.1);
          }
          @media (max-width: 768px) {
            .certs-grid {
              grid-template-columns: 1fr !important;
            }
            .cert-card {
              padding: 1.5rem;
            }
          }
        `}} />
      </div>
    </section>
  );
}
