export default async function Experience({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: { title: "完整職涯經歷", 
          exp: [
            { date: "2024 - Present", role: "資料分析管理師 (Data Analyst Specialist)", company: "國泰人壽 (Cathay Life)", desc: "負責高階 CDP 選商、建置與導入。執行網路投保客戶經營、數位軌跡客戶標籤工程 (Celebrus to GA4)。另外專注於家庭客群經營優化與保單貸款客群分析。" },
            { date: "2023 - 2024", role: "儀表板戰略分析師 (Dashboard Strategist)", company: "蝦皮 (Shopee)", desc: "維護與擴建蝦皮內部營運儀表板，主導結案簡報產出，並追蹤核心商業關鍵指標 (KPI)。" },
            { date: "2023", role: "AI 預測競賽冠軍", company: "家樂福 (Carrefour)", desc: "參與商業供需預測競賽，運用進階數據分析框架研發模型，最終榮獲全國冠軍。" },
            { date: "2019 - 2020", role: "軟硬體技術與檢定認證", company: "Self-driven", desc: "取得 TOEIC 金色證書 (2019)、JLPT 日文檢定 (2020)、Google Analytics 認證 (2020) 以及 ERP 證書。" }
          ]
    },
    en: { title: "Complete Experience", 
          exp: [
            { date: "2024 - Present", role: "Data Analyst Specialist", company: "Cathay Life", desc: "Led Cloud CDP selection and implementation. Executed digital footprint tagging operations (Celebrus to GA4), customer relationship optimization for families, and policy loan analysis." },
            { date: "2023 - 2024", role: "Dashboard Strategist", company: "Shopee", desc: "Maintained critical data dashboards and generated comprehensive campaign reports tracking KPIs across the business." },
            { date: "2023", role: "Forecasting Champion", company: "Carrefour", desc: "Won first place in the forecasting competition by employing advanced data analysis and machine learning models on retail transactions." },
            { date: "2019 - 2020", role: "Certifications", company: "Self-driven", desc: "Achieved TOEIC Gold (2019), JLPT (2020), GA Certification (2020), and ERP Certification." }
          ]
    },
    ja: { title: "完全な職歴", 
          exp: [
            { date: "2024 - 現在", role: "データアナリスト・スペシャリスト", company: "國泰人壽 (Cathay Life)", desc: "CDPの選定と導入の責任者。デジタルの足跡へのタグ付与(CelebrusからGA4への移行)、ファミリー層の顧客関係の最適化、保険ローン分析を実行。" },
            { date: "2023 - 2024", role: "ダッシュボード戦略アナリスト", company: "Shopee", desc: "重要なデータダッシュボードの保守、および主要業績評価指標(KPI)を追跡する包括的なキャンペーンレポートの作成を担当。" },
            { date: "2023", role: "予測コンペティション優勝", company: "Carrefour", desc: "高度なデータ分析モデルと機械学習を使用し、需要予測コンペティションで第一位を獲得。" },
            { date: "2019 - 2020", role: "資格・認定", company: "自己啓発", desc: "TOEIC金賞(2019)、JLPT(2020)、Google Analytics認定(2020)、ERP認定を取得。" }
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
    </section>
  );
}
