import { getSortedArticlesData } from '../../../lib/markdown';
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
    zh: "傑森數據 Jason Analytics 數據技術與商務部落格。由 Jason Tsai 主筆，分享包含 Python 數據處理秘訣、SQL 查詢優化、Tableau 視覺化技巧、MarTech 趨勢深入探討、AI 實戰應用方案以及數據分析師的職涯心法。我們致力於將複雜的技術概念轉化為易懂且具備高度行動價值的商業洞察，協助讀者持續提升數據思維與實戰競爭力。歡迎訂閱並查看最新文章。",
    en: "The Jason Analytics technical blog by Jason Tsai. We cover expert Python, SQL, and Tableau tutorials, plus MarTech insights and AI strategies. Our mission is to transform technical concepts into actionable business insights for data professionals. Explore our data analytics articles here.",
    ja: "Jason Analytics (ジェイソン・ツァイ) の技術ブログ。Python や SQL の高度な活用法、Tableau による視覚化、MarTech トレンド、AI の実務応用、そしてデータアナリストとしてのキャリア戦略まで幅広く公開。複雑な技術概念をわかりやすく、かつ実践的なビジネスインサイトへと変換してお届けします。最新の記事を今すぐチェック。"
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

  return (
    <section className="articles fade-in" style={{ padding: '0 1rem' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .articles { padding: 0 0.5rem !important; }
        }
      `}} />
      <h1 className="section-title">{t.title}</h1>
      <p style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
      <ArticleListClient articles={articles} lang={lang} t={t} />
    </section>
  );
}
