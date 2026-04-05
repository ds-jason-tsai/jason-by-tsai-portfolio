import { getSortedArticlesData } from '../../../lib/markdown';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { zh: "文章專區 | Jason Tsai", en: "Articles | Jason Tsai", ja: "記事一覧 | Jason Tsai" };
  return { title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'] };
}

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
  const articles = getSortedArticlesData();

  return (
    <section className="articles fade-in" style={{ padding: '0 2rem' }}>
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      
      <div className="services-grid" style={{ gap: '3rem' }}>
        {articles.map((art) => (
          <article key={art.id} className="service-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>{art.date}</p>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', lineHeight: '1.4' }}>{art.title[lang]}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', flex: 1, marginBottom: '2rem' }}>
              {art.description[lang]}
            </p>
            
            <div className="tags-container" style={{ marginTop: 'auto', marginBottom: '2rem', justifyContent: 'center' }}>
              {Array.from({ length: 3 }).map((_, tIdx) => {
                 const tag = art.tags[lang][tIdx];
                 return tag ? (
                   <span key={tIdx} className="tag" style={{ flex: '1 1 0', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tag}</span>
                 ) : (
                   <span key={tIdx} className="tag" style={{ flex: '1 1 0', visibility: 'hidden' }}>&nbsp;</span>
                 );
              })}
            </div>
            
            <a href={`/${lang}/articles/${art.id}`} className="btn-primary" style={{ 
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
