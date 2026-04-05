import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { zh: "完整經歷 | Jason Tsai", en: "Experience | Jason Tsai", ja: "経歴 | Jason Tsai" };
  return { title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'] };
}

export default async function Experience({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: { title: "完整職涯經歷", 
          exp: [
            { date: "2026.01 - Present", role: "特約講師 (Partner Instructor)", company: "X Platform", desc: "客製化設計 Python 與 AI 學習路徑，提供端到端專案實作的技術諮詢。首月即透過展現技術價值，成功招募 35+ 位付費學員。" },
            { date: "2024.08 - Present", role: "特約講師 (Partner Instructor)", company: "聯成電腦 (菜鳥救星)", desc: "開發從零到一的 Tableau 完整資料生命週期課程；累積 200+ 教學小時，培訓超過 150 位專業人士，獲得 4.8/5.0 的極高滿意度。同時建構基於 NotebookLM 的 AI 生產力工作流架構。" },
            { date: "2023.07 - Present", role: "資料分析管理師 (Data Analyst Specialist)", company: "國泰人壽 (Cathay Life)", desc: "負責高階 Cloud CDP 選商、建置與導入。執行數位軌跡客戶標籤工程 (Celebrus to GA4)，將 29 個破碎資料表收斂為 10 個核心 Data Mart。主導 AI 代理人導入，幫助兩萬多名業務員提升保單貸款表現，數位轉換率卓越。" },
            { date: "2023 - 2024", role: "儀表板戰略分析師 (Dashboard Strategist)", company: "蝦皮 (Shopee Xpress)", desc: "負責空間智能與策略規劃，拆解物流痛點並追蹤設點關鍵指標。結合爬蟲、分群與地理空間分析建立互動式儀表板，優化整體營運網點評估規劃。" },
            { date: "2023.03 - 2023.06", role: "資料分析師 (Data Analyst)", company: "iKala", desc: "參與 KOL 網紅影響力分析專案，量化行銷效益並優化網紅選擇策略。優化內部儀表板並實作自動化排程派報系統，整體營運效率提升 5 倍。" },
            { date: "2023", role: "AI 預測競賽全國冠軍", company: "家樂福 (Carrefour)", desc: "運用 RFM 分配分析與 Apriori 演算法開發顧客購買預測模型。整合 Tableau 實時洞察儀表板，最終贏得全國競賽冠軍與最佳模型獎 (Best Model Award)。" },
            { date: "2022.01 - 2023.01", role: "資料工程師 (Data Engineer)", company: "零壹科技 (Zero One Technology)", desc: "擔任技術培訓講師，累積 30+ 場次企業授課，賦能企業客戶具備高階資料視覺化能力。為財政部、台灣證交所等高階政經單位提供架構建議與儀表板設計。" },
            { date: "2021.09 - 2023.06", role: "企業管理碩士 (MBA)", company: "國立陽明交通大學 (NYCU)", desc: "專注於商業管理、數據決策與營運策略分析等進階領域。" },
            { date: "2019.09 - 2021.06", role: "企業管理理學士 (BBA)", company: "國立臺北商業大學 (NTUB)", desc: "奠定商業分析基礎。期間取得 TOEIC 金色證書 (860)、JLPT N3 日語檢定、GA 認證以及 ERP 相關專業證照。" }
          ]
    },
    en: { title: "Complete Experience", 
          exp: [
            { date: "2026.01 - Present", role: "Partner Instructor", company: "X Platform", desc: "Designed personalized Python and AI learning roadmaps, providing technical consulting for end-to-end project implementations. Attracted 35+ paid students within the first month by translating complex technical value into high-demand career solutions." },
            { date: "2024.08 - Present", role: "Partner Instructor", company: "Lien Cheng Computer Inc.", desc: "Developed a comprehensive 'Zero-to-One' Tableau curriculum. Accumulated 200+ teaching hours, empowering 150+ professionals with data-driven decision-making skills (4.8/5.0 rating). Architected 'AI Productivity Hacks' using NotebookLM." },
            { date: "2023.07 - Present", role: "Data Analyst Specialist", company: "Cathay Life", desc: "Led Cloud CDP selection and implementation. Executed digital footprint tagging operations (Celebrus to GA4), streamlining 29 legacy tables into 10 refined Data Marts. Orchestrated CDP POC and Agentic AI implementation, enabling 23,000+ agents to drive a >25% uplift in online policy loan performance." },
            { date: "2023 - 2024", role: "Dashboard Strategist", company: "Shopee Xpress", desc: "Specialized in Location Intelligence & Strategic Planning. Leveraged Web Scraping, Cluster Analysis, and Geospatial Analysis to build an interactive dashboard enabling stakeholders to conduct comparative evaluations for optimized operational footprints." },
            { date: "2023.03 - 2023.06", role: "Data Analyst", company: "iKala", desc: "Engaged in influencer analytics to quantify marketing impact. Optimized internal BI dashboards, achieving a 5x improvement in operational efficiency. Supported automated data pipeline and reporting system delivery." },
            { date: "2023", role: "Forecasting Champion", company: "Carrefour", desc: "Engineered a customer purchase prediction model using RFM Analysis and Apriori algorithms. Developed an integrated Tableau dashboard, securing the Competition Championship and 'Best Model' Award." },
            { date: "2022.01 - 2023.01", role: "Data Engineer", company: "Zero One Technology", desc: "Delivered Tableau-related courses (30+ teaching sessions) to empower enterprise clients. Assisted high-profile units like the Ministry of Finance and Taiwan Stock Exchange in strategic dashboard design and AI insights architecture." },
            { date: "2021.09 - 2023.06", role: "Master of Business Administration (MBA)", company: "National Yang Ming Chiao Tung University (NYCU)", desc: "Focused on business management, data-driven decision making, and operational strategy analysis." },
            { date: "2019.09 - 2021.06", role: "Bachelor of Business Administration (BBA)", company: "National Taipei University of Business (NTUB)", desc: "Built a solid foundation in business analytics. Achieved TOEIC Gold (860), JLPT N3, Google Analytics Certification, and multiple ERP professional certificates during this period." }
          ]
    },
    ja: { title: "完全な職歴", 
          exp: [
            { date: "2026.01 - 現在", role: "パートナー講師", company: "X Platform", desc: "個別化されたPython・AI学習ロードマップを設計し、プロジェクト実装の技術コンサルティングを提供。初月で35人以上の有料受講生を獲得。" },
            { date: "2024.08 - 現在", role: "パートナー講師", company: "Lien Cheng Computer Inc.", desc: "「ゼロからイチへ」のTableau総合カリキュラムを開発。200時間以上の指導を通じて150名以上の専門家を育成（満足度4.8/5.0）。また、NotebookLMベースの「AI生産性ハック」ワークフローを構築。" },
            { date: "2023.07 - 現在", role: "データアナリスト・スペシャリスト", company: "國泰人壽 (Cathay Life)", desc: "クラウドCDPの選定と導入を主導。デジタルの足跡へのタグ付与（CelebrusからGA4への移行）を実行し、29のデータテーブルを10の洗練されたData Martに統合。AIエージェントの導入を主導し、2万3千人以上のエージェントの保険ローン業績アップを実現。" },
            { date: "2023 - 2024", role: "ダッシュボード戦略アナリスト", company: "Shopee Xpress", desc: "ロケーションインテリジェンスと戦略計画を担当。Webスクレイピング、クラスター分析、地理空間分析を活用し、運用最適化のための対話型ダッシュボードを構築。" },
            { date: "2023.03 - 2023.06", role: "データアナリスト", company: "iKala", desc: "インフルエンサーのパフォーマンス分析に従事し、マーケティング効果を定量化。社内ダッシュボードを最適化し、業務効率を5倍向上。" },
            { date: "2023", role: "予測コンペティション全国優勝", company: "Carrefour", desc: "RFM分析とAprioriアルゴリズムを使用し、購買予測モデルを開発。Tableauダッシュボードと統合し、コンペ優勝と「ベストモデル賞」を獲得。" },
            { date: "2022.01 - 2023.01", role: "データ・エンジニア", company: "Zero One Technology", desc: "法人顧客向けにTableau技術トレーニングを30回以上実施。台湾財政部や台湾証券取引所などの高度なダッシュボード設計と戦略分析を支援。" },
            { date: "2021.09 - 2023.06", role: "経営学修士 (MBA)", company: "國立陽明交通大學 (NYCU)", desc: "ビジネス管理、データ駆動型の意思決定、運用戦略分析を専攻。" },
            { date: "2019.09 - 2021.06", role: "経営学士 (BBA)", company: "國立臺北商業大學 (NTUB)", desc: "ビジネス分析の基礎を構築。在学中にTOEIC金賞（860点）、JLPT N3、Google Analytics認定、ERP資格を取得。" }
          ]
    }
  };

  const t = content[lang];

  return (
    <section className="experience fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <div className="timeline">
        {t.exp.map((item, idx) => (
          <div className="timeline-item" key={idx}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-date">{item.date}</div>
              <h3 className="timeline-role">{item.role}</h3>
              <div className="timeline-company">{item.company}</div>
              <p className="service-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="trusted-by-section" style={{ marginTop: '5rem', marginBottom: '2rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
           Partner Platforms & Featured On
        </h3>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://www.xplatform.world/" target="_blank" rel="noopener follow" className="btn-primary" style={{ background: 'var(--glass-bg)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '0.8rem 2rem', borderRadius: '30px', textDecoration: 'none', fontWeight: '800' }}>
             X Platform
          </a>
          <a href="https://live.rookiesavior.net/" target="_blank" rel="noopener follow" className="btn-primary" style={{ background: 'var(--glass-bg)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '0.8rem 2rem', borderRadius: '30px', textDecoration: 'none', fontWeight: '800' }}>
             菜鳥救星 Rookie Savior
          </a>
        </div>
      </div>
    </section>
  );
}
