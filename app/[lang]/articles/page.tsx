import { getSortedArticlesData } from '../../../lib/markdown';
import ArticleListClient from '../../../components/ArticleListClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { zh: "文章專區 | 傑森數據", en: "Articles | Jason Tsai", ja: "記事一覧 | ジェイソン・アナリティクス" };
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
    <section className="articles fade-in" style={{ padding: '0 1rem' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .articles { padding: 0 0.5rem !important; }
        }
      `}} />
      <h2 className="section-title">{t.title}</h2>
      <p style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      <ArticleListClient articles={articles} lang={lang} t={t} />
    </section>
  );
}
