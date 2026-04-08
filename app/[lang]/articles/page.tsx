import { getSortedArticlesData } from '../../../lib/markdown';
import ArticleListClient from '../../../components/ArticleListClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "數據分析與專案分享部落格 | 傑森數據 - Python, SQL 與 AI 實戰", 
    en: "Data Insights Blog | Jason Analytics - Python, SQL & AI Practical", 
    ja: "データ分析ブログ | ジェイソン・アナリティクス - Python, SQL と AI 実戦" 
  };
  const descriptions = {
    zh: "傑森數據 Jason Analytics 的技術部落格。分享數據分析師轉職經驗、Python 與 SQL 技術實戰、AI 應用趨勢及跨產業商業分析觀點。",
    en: "Technical blog of Jason Analytics. Sharing data analyst career transition tips, Python & SQL practicals, AI trends, and cross-industry business analytics insights.",
    ja: "Jason Analytics の技術ブログ。データアナリストのキャリア転換、Python と SQL の実戦テクニック、AI活用トレンド、ビジネス分析の知見を共有します。"
  };
  return { 
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh']
  };
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
