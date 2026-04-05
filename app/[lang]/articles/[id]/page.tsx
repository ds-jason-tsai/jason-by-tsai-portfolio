import { getArticleData, getSortedArticlesData } from '../../../../lib/markdown';
import Link from 'next/link';

export async function generateStaticParams() {
  const articles = getSortedArticlesData();
  const langs = ['zh', 'en', 'ja'];
  
  const params: { lang: string; id: string }[] = [];
  
  for (const lang of langs) {
    for (const article of articles) {
      params.push({ lang, id: article.id });
    }
  }
  
  return params;
}

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string, id: string }> }): Promise<Metadata> {
  const { lang, id } = await params;
  const articleData = await getArticleData(id);
  if (!articleData) return { title: "Not Found | Jason Tsai" };
  const title = articleData.title[lang as 'zh'|'en'|'ja'] || articleData.title['zh'];
  return { title: `${title} | Jason Tsai` };
}

export default async function ArticlePage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await params;
  const articleData = await getArticleData(id);

  if (!articleData) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '5rem' }}>Article not found / 找不到文章</div>;
  }

  const title = articleData.title[lang as 'zh'|'en'|'ja'] || articleData.title['zh'];
  const tags = articleData.tags[lang as 'zh'|'en'|'ja'] || articleData.tags['zh'];

  return (
    <article className="article-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <Link href={`/${lang}/articles`} style={{ color: 'var(--accent-color)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back
      </Link>
      
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>{articleData.date}</p>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>{title}</h1>
        <div className="tags-container" style={{ justifyContent: 'center' }}>
          {tags.map((tag: string, idx: number) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
      </header>

      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: articleData.contentHtml || "" }} 
      />

      <style dangerouslySetInnerHTML={{__html: `
        .markdown-content {
          line-height: 1.8;
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        .markdown-content h1 {
          font-size: 2.2rem;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          color: var(--accent-color);
        }
        .markdown-content h2 {
          font-size: 1.8rem;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 0.5rem;
        }
        .markdown-content h3 {
          font-size: 1.4rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .markdown-content p {
          margin-bottom: 1.5rem;
        }
        .markdown-content ul, .markdown-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .markdown-content li {
          margin-bottom: 0.5rem;
        }
        .markdown-content pre {
          background: #1a1a1a;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 1.5rem;
          border: 1px solid var(--glass-border);
        }
        .markdown-content code {
          font-family: monospace;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }
        .markdown-content pre code {
          background: transparent;
          padding: 0;
          color: #ff7b72;
        }
        .markdown-content blockquote {
          border-left: 4px solid var(--accent-color);
          padding-left: 1rem;
          margin-left: 0;
          color: var(--text-secondary);
          font-style: italic;
          background: rgba(0, 242, 254, 0.05);
          padding: 1rem;
          border-radius: 0 8px 8px 0;
        }
      `}}/>
    </article>
  );
}
