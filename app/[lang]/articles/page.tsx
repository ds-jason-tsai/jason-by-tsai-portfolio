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
    zh: "傑森數據 Jason Analytics 技術部落格。提供專業數據分析師轉職導引、Python 與 SQL 實戰教學、AI 自動化技術與 MarTech 趨勢解析。累積豐富的實務心得與職涯建議，協助數據愛好者從基礎邁向專家職涯，立即訂閱並開始學習最新的數據分析與自動化技術。",
    en: "The Jason Analytics technical blog. We provide expert advice on data analyst career transitions, practical Python and SQL tutorials, AI automation tips, and MarTech trend analysis. Gain valuable professional insights and career guidance to help you advance in the data industry. Start learning today.",
    ja: "Jason Analytics (ジェイソン・ツァイ) の技術ブログです。データアナリストのキャリア転換ガイド、PythonやSQLの実践、AI自動化技術、MarTechのトレンド分析まで。実務経験に基づいた知見とキャリアアドバイスで、あなたのデータスキルの向上を支援します。今すぐ学びを始めましょう。"
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
