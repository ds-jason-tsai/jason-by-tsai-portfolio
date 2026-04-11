'use client';

import React, { useState, useEffect } from 'react';

export default function ArticleListClient({ articles, lang, t }: { articles: any[], lang: string, t: any }) {
  // Extract unique tags for the category bar
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Extract all unique tags dynamically
  const uniqueTags = Array.from(new Set(
    articles.flatMap(art => art.tags ? art.tags[lang] : [])
  ));
  
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
  }, [categories]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    window.history.pushState(null, '', `#${cat}`);
  };

  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(art => art.tags?.[lang]?.includes(activeCategory));

  return (
    <div className="articles-client-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Category Tabs with Infinite Carousel for Mobile */}
      <div className="category-scroll-wrapper" style={{ marginBottom: '3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div className="category-marquee-track" style={{ 
          display: 'flex', 
          gap: '0.8rem', 
          width: 'max-content',
          padding: '0.5rem 0 1.5rem',
        }}>
          {/* Render categories twice for seamless infinite scrolling on mobile */}
          {[...categories, ...categories].map((cat, idx) => (
            <button
              key={`${cat}-${idx}`}
              onClick={() => handleCategoryClick(cat)}
              style={{
                padding: '0.5rem 1.4rem',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: activeCategory === cat ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                color: activeCategory === cat ? '#000' : '#fff',
                fontSize: '0.9rem',
                fontWeight: activeCategory === cat ? '800' : '500',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              className="category-btn fade-in"
            >
              {cat === 'all' ? (lang === 'zh' ? '全部文章' : (lang === 'ja' ? 'すべての記事' : 'All Articles')) : cat}
            </button>
          ))}
        </div>
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
        /* Desktop: Center tags and hide duplicates used for marquee */
        @media (min-width: 769px) {
          .category-marquee-track {
            justify-content: center !important;
            width: 100% !important;
            animation: none !important;
          }
          /* Hide the second half of tags on desktop (only used for mobile loop) */
          .category-btn:nth-child(n+${categories.length + 1}) {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .category-marquee-track {
            animation: marquee-scroll 25s linear infinite;
          }
          .category-marquee-track:active,
          .category-marquee-track:hover {
            animation-play-state: paused;
          }
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 0.4rem)); }
          }
          .category-scroll-wrapper::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 40px;
            background: linear-gradient(to left, var(--bg-color, #0a0a0a), transparent);
            pointer-events: none;
            z-index: 2;
          }
          .articles-client-container { padding: 0 !important; }
          .article-list-card { 
            padding: 1.5rem !important; 
            border-radius: 12px !important; 
            margin: 0 -0.5rem;
          }
          .article-list-card h3 { font-size: 1.3rem !important; }
          .article-list-card p { font-size: 0.95rem !important; margin-bottom: 1.5rem !important; }
          .category-btn { padding: 0.45rem 1.1rem !important; font-size: 0.85rem !important; }
        }
      `}} />
    </div>
  );
}
