export default async function Articles({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  
  const content = {
    zh: {
      title: "文章專區",
      desc: "分享關於數據視覺化、InsurTech 與自動化分析的實務觀察與技術心得。",
      readMore: "閱讀更多",
      tags: "相關標籤"
    },
    en: {
      title: "Articles",
      desc: "Sharing insights on Data Visualization, InsurTech, and Automation Analytics.",
      readMore: "Read More",
      tags: "Tags"
    },
    ja: {
      title: "記事一覧",
      desc: "データ視覚化、InsurTech、自動化分析に関する実務的な洞察と技術的な知見を共有します。",
      readMore: "もっと読む",
      tags: "タグ"
    }
  };
  const t = content[lang];

  const articles = [
    {
      id: "chart-storytelling",
      title: {
        zh: "一張圖勝過千言萬語：從 40+ 款圖表探索數據敘事的力量",
        en: "Beyond Beauty: How to use 40+ Chart Types for Data Storytelling",
        ja: "百聞は一見に如かず：40以上のチャートから探るデータストーリーテリングの力"
      },
      date: "2026-04-01",
      description: {
        zh: "視覺化不只是美觀，更是為了精準溝通。本文介紹 40 多種商業常用圖表的選擇標準，幫助你為特定商業場景找到最直覺的解法。",
        en: "Visualization isn't just about aesthetics; it's about precise communication. This article introduces 40+ essential business charts and how to choose the right one for your specific scenario.",
        ja: "視覚化は単なる美しさではなく、正確なコミュニケーションのためのものです。本記事では、特定のビジネスシーンに最適な40以上のチャート選択基準を紹介します。"
      },
      tags: {
        zh: ["#數據視覺化", "#Tableau", "#敘事技巧"],
        en: ["#DataViz", "#Tableau", "#Storytelling"],
        ja: ["#データ視覚化", "#Tableau", "#ストーリーテリング"]
      },
      link: "https://www.instagram.com/p/CiPrb9nLhXF/" // Specific post: Chart Selection Guide
    },
    {
      id: "insurtech-transformation",
      title: {
        zh: "InsurTech 浪潮：數據分析如何驅動保險科技轉型",
        en: "The InsurTech Edge: How Data Analytics is Changing the Insurance Industry",
        ja: "InsurTechの波：データ分析がいかに保険テックの変革を推進するか"
      },
      date: "2026-03-15",
      description: {
        zh: "分享在國泰人壽的實務經驗。探討 AI 與大數據如何重新定義意外險與健康險市場，並透過數據模型提升客戶體驗與理賠效率。",
        en: "Insights from working at Cathay Life. Explore how AI and Big Data are redefining the supplemental insurance market and improving customer experience and claim efficiency.",
        ja: "國泰人寿（Cathay Life）での実務経験を共有。AIとビッグデータがどのように健康保険市場を再定義し、顧客体験と支払効率を向上させるかを探ります。"
      },
      tags: {
        zh: ["#保險科技", "#金融轉型", "#大數據"],
        en: ["#InsurTech", "#DigitalTransformation", "#BigData"],
        ja: ["#インシュアテック", "#デジタルトランスフォーメーション", "#ビッグデータ"]
      },
      link: "https://www.instagram.com/p/CgMT-RbJOM9/" // Specific post: Industry Analysis
    }
  ];

  return (
    <section className="articles fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      
      <div className="articles-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '3rem'
      }}>
        {articles.map((art, idx) => (
          <article key={idx} className="service-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>{art.date}</p>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', lineHeight: '1.4' }}>{art.title[lang]}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', flex: 1, marginBottom: '2rem' }}>
              {art.description[lang]}
            </p>
            
            <div className="tags-container" style={{ marginBottom: '2rem' }}>
              {art.tags[lang].map((tag, tIdx) => (
                <span key={tIdx} className="tag">{tag}</span>
              ))}
            </div>
            
            <a href={art.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ 
              textAlign: 'center', 
              padding: '0.8rem', 
              fontSize: '0.9rem',
              background: 'transparent',
              border: '1px solid var(--accent-color)',
              color: 'var(--accent-color)'
            }}>
              {t.readMore}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
