import { getSortedArticlesData } from '../../../lib/markdown';
import ArticleListClient from '../../../components/ArticleListClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const titles = { 
    zh: "數據分析觀點與 AI、MarTech 技術部落格 | 傑森數據", 
    en: "Data Insights, AI & MarTech Technical Blog | Jason Analytics", 
    ja: "データ分析・AI・MarTech 技術ブログ | ジェイソン・アナリティクス" 
  };
  const descriptions = {
    zh: "傑森數據 Jason Tsai 的數據部落格。深入探討 AI 應用、MarTech 技術實操、數據視覺化技巧與 FinTech 產業洞察。分享數據分析師的實戰心得與職涯成長。",
    en: "Technical blog by Jason Tsai. Deep dives into AI applications, MarTech implementations, data visualization tips, and FinTech insights. Sharing practical experience for data professionals.",
    ja: "Jason Tsai による技術ブログ。AIの活用、MarTechの実装、データ可視化のコツ、FinTechの動向など、データアナリストとしての実務経験と知見を共有します。"
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
