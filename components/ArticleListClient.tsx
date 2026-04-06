'use client';

import React, { useState, useEffect } from 'react';

export default function ArticleListClient({ articles, lang, t }: { articles: any[], lang: string, t: any }) {
  // Extract unique tags for the category bar
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Extract all unique tags dynamically
  const uniqueTags = Array.from(new Set(
    articles.flatMap(art => art.tags ? art.tags[lang] : [])
  )).slice(0, 5); // Limit to top 5 tags to prevent crowding
  
  const categories = ['all', ...uniqueTags];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let hash = window.location.hash;
      if (hash) {
        try {
           const decodedHash = decodeURIComponent(hash.replace('#', ''));
           if (categories.includes(decodedHash)) {
             setActiveCategory(decodedHash);
           }
        } catch(e) {}
      }
    }
  }, []);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    window.history.pushState(null, '', `#${cat}`);
  };

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(art => art.tags?.[lang]?.includes(activeCategory));

  return (
    <div className="articles-client-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryClick(cat)}
            style={{
              padding: '0.6rem 1.8rem',
              borderRadius: '30px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: activeCategory === cat ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
              color: activeCategory === cat ? '#000' : '#fff',
              fontSize: '1rem',
              fontWeight: activeCategory === cat ? '800' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="category-btn fade-in"
          >
            {cat === 'all' ? (lang === 'zh' ? '全部文章' : (lang === 'ja' ? 'すべての記事' : 'All Articles')) : cat}
          </button>
        ))}
      </div>

      <div className="articles-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filteredArticles.map((art, idx) => (
          <article 
            key={art.id} 
            className="article-list-card fade-in" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '20px',
              padding: '2.5rem',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              animationDelay: `${idx * 0.1}s`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.6rem', lineHeight: '1.4', fontWeight: '800', margin: 0 }}>
                <a href={`/${lang}/articles/${art.id}`} style={{ color: '#fff', textDecoration: 'none' }} className="article-title-link">
                  {art.title[lang]}
                </a>
              </h3>
              <span style={{ fontSize: '0.9rem', color: 'var(--accent-color)', whiteSpace: 'nowrap', paddingTop: '0.4rem' }}>
                {art.date}
              </span>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '2rem' }}>
              {art.description[lang]}
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div className="tags-container" style={{ margin: 0, justifyContent: 'flex-start' }}>
                {art.tags?.[lang]?.map((tag: string, tIdx: number) => (
                  <span key={tIdx} className="tag" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px' }}>
                    {tag}
                  </span>
                ))}
              </div>
              
              <a href={`/${lang}/articles/${art.id}`} className="btn-secondary" style={{ 
                padding: '0.6rem 1.5rem', 
                fontSize: '0.95rem',
                whiteSpace: 'nowrap'
              }}>
                {t.readMore} →
              </a>
            </div>
          </article>
        ))}
        {filteredArticles.length === 0 && (
          <div style={{ width: '100%', padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
             No articles found for this category.
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .article-list-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          border-color: rgba(0, 242, 254, 0.3);
        }
        .article-title-link:hover {
          color: var(--accent-color) !important;
        }
        .category-btn:hover {
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
}
