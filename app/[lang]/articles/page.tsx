import { getSortedArticlesData, getCategorizedTags } from '../../../lib/markdown';
import ArticleListClient from '../../../components/ArticleListClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "數據分析與專案分享部落格 | 傑森數據 - Python, SQL 與 AI 實戰", 
    en: "Data Blog | Jason Analytics - AI, MarTech, Python & SQL", 
    ja: "データ分析ブログ | ジェイソン・アナリティクス - Python, SQL と AI 実戦" 
  };
  const descriptions = {
    zh: "傑森數據技術部落格，分享 Python、SQL、Tableau 與 MarTech 實戰心法，協助讀者提升數據思維與競爭力。",
    en: "The Jason Analytics technical blog by Jason Tsai. We cover expert Python, SQL, and Tableau tutorials, plus MarTech insights and AI strategies. Our mission is to transform technical concepts into actionable business insights for data professionals. Explore our data analytics articles here.",
    ja: "Jason Analytics の技術ブログ。Python、SQL、Tableau、MarTech、AI の実務応用について幅広く発信しています。"
  };
  return {
    title: titles[lang as 'zh'|'en'|'ja'] || titles['zh'],
    description: descriptions[lang as 'zh'|'en'|'ja'] || descriptions['zh'],
    alternates: {
      canonical: `https://jason-by-tsai-portfolio.vercel.app/${lang}/articles`,
      languages: {
        'zh': 'https://jason-by-tsai-portfolio.vercel.app/zh/articles',
        'en': 'https://jason-by-tsai-portfolio.vercel.app/en/articles',
        'ja': 'https://jason-by-tsai-portfolio.vercel.app/ja/articles',
        'x-default': 'https://jason-by-tsai-portfolio.vercel.app/zh/articles',
      },
    }
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
  const categories = getCategorizedTags(lang);

  return (
    <section className="articles fade-in" style={{ padding: '0 1rem' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .articles { 
            padding: 1.5rem 0.8rem !important; 
          }
        }
      `}} />
      <h1 className="section-title">{t.title}</h1>
      <p style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      <ArticleListClient articles={articles} lang={lang} t={t} categories={categories} />
    </section>
  );
}
