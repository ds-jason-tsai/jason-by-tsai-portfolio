'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ArticleListClient({ articles, lang, t }: { articles: any[], lang: string, t: any }) {
  // States for search and pagination
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);
  const pathname = usePathname();
  
  // Extract all unique tags dynamically
  const uniqueTags = Array.from(new Set(
    articles.flatMap(art => art.tags ? art.tags[lang] : [])
  ));
  
  const categories = ['all', ...uniqueTags];

  // Robust Hash & URL detection (Fixed: "點擊後無反應" & "多重標籤解析")
  useEffect(() => {
    const handleNavigationChange = () => {
      if (typeof window === 'undefined') return;
      
      const hash = window.location.hash;
      if (hash) {
        try {
          // Fix: Handle multiple hashes or tailing strings
          const lastTag = hash.split('#').filter(Boolean).pop();
          const decodedHash = decodeURIComponent(lastTag || '');
          
          if (categories.includes(decodedHash)) {
            setActiveCategory(decodedHash);
            setVisibleCount(8);
          }
        } catch(e) {}
      } else {
        setActiveCategory('all');
      }
    };

    handleNavigationChange();
    
    window.addEventListener('hashchange', handleNavigationChange);
    window.addEventListener('popstate', handleNavigationChange);
    
    return () => {
      window.removeEventListener('hashchange', handleNavigationChange);
      window.removeEventListener('popstate', handleNavigationChange);
    };
  }, [categories, pathname]);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(8);
    // Use location.hash to ensure a single, clean replacement
    window.location.hash = cat;
  };

  // Multiple Filter Logic: Category + Search (Fixed: "真的有標籤才出現")
  let processedArticles = articles.filter(art => {
    // Precise string matching for tags array
    const matchesCategory = activeCategory === 'all' || (art.tags?.[lang] || []).some((t: string) => t === activeCategory);
    
    const matchesSearch = 
      art.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.description[lang].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sorting Logic (Fixed: "只在全部文章置頂")
  processedArticles = [...processedArticles].sort((a, b) => {
    if (activeCategory === 'all' && searchQuery === '') {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const displayedArticles = processedArticles.slice(0, visibleCount);
  const hasMore = processedArticles.length > visibleCount;

  return (
    <div className="articles-client-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* 2. Search Bar Component */}
      <div className="search-bar-container" style={{ marginBottom: '2rem', position: 'relative' }}>
        <input
          type="text"
          placeholder={lang === 'zh' ? '搜尋文章關鍵字...' : (lang === 'ja' ? '記事を検索...' : 'Search articles...')}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setVisibleCount(8); // Reset pagination on search
          }}
          style={{
            width: '100%',
            padding: '1.2rem 1.5rem 1.2rem 3.5rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          className="search-input"
        />
        <span style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: '1.2rem' }}>🔍</span>
      </div>

      {/* Category Tabs */}
      <div className="category-bar-wrapper" style={{ marginBottom: '3.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <button
          onClick={() => handleCategoryClick('all')}
          style={{
            padding: '0.6rem 2rem', // Sync with Reports
            borderRadius: '50px', // Sync with Reports
            border: '1px solid rgba(255,255,255,0.1)',
            background: activeCategory === 'all' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
            color: activeCategory === 'all' ? '#000' : '#fff',
            fontSize: '0.9rem',
            fontWeight: activeCategory === 'all' ? '800' : '500',
            lineHeight: '1',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            zIndex: 3
          }}
          className="category-btn"
        >
          {lang === 'zh' ? '全部文章' : (lang === 'ja' ? 'すべての記事' : 'All Articles')}
        </button>

        <div className="category-scroll-wrapper" style={{ position: 'relative', overflow: 'hidden', flex: 1, display: 'flex', alignItems: 'center' }}>
          <div className="category-marquee-track" style={{ display: 'flex', gap: '0.8rem', width: 'max-content', alignItems: 'center' }}>
            {[...uniqueTags, ...uniqueTags].map((cat, idx) => (
              <button
                key={`${cat}-${idx}`}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  padding: '0.6rem 2rem', // Sync with Reports
                  borderRadius: '50px', // Sync with Reports
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: activeCategory === cat ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat ? '#000' : '#fff',
                  fontSize: '0.9rem',
                  fontWeight: activeCategory === cat ? '800' : '500',
                  lineHeight: '1',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                className="category-btn"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="articles-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {displayedArticles.map((art, idx) => (
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
              animationDelay: `${idx % 8 * 0.1}s`
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ 
                display: 'inline-block', 
                fontSize: '0.85rem', 
                color: 'var(--accent-color)', 
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '0.8rem',
                padding: '0.2rem 0.6rem',
                background: 'rgba(0, 242, 254, 0.1)',
                borderRadius: '4px'
              }}>
                {(activeCategory === 'all' && art.pinned) ? (
                  lang === 'zh' ? '📌 置頂' : (lang === 'ja' ? '📌 固定' : '📌 Featured')
                ) : art.date}
              </span>
              <h3 style={{ fontSize: '1.8rem', lineHeight: '1.3', fontWeight: '800', margin: 0 }}>
                <a href={`/${lang}/articles/${art.id}`} style={{ color: '#fff', textDecoration: 'none' }} className="article-title-link">
                  {art.title[lang]}
                </a>
              </h3>
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
              
              <a href={`/${lang}/articles/${art.id}`} className="btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                {t.readMore} →
              </a>
            </div>
          </article>
        ))}

        {/* 1. Load More Button */}
        {hasMore && (
           <div style={{ textAlign: 'center', marginTop: '3rem' }}>
             <button 
               onClick={() => setVisibleCount(prev => prev + 8)}
               className="load-more-btn"
               style={{
                 padding: '1rem 3rem',
                 background: 'transparent',
                 border: '1px solid var(--accent-color)',
                 color: 'var(--accent-color)',
                 borderRadius: '30px',
                 fontSize: '1rem',
                 fontWeight: '800',
                 cursor: 'pointer',
                 transition: 'all 0.3s ease'
               }}
             >
               {lang === 'zh' ? '載入更多文章' : (lang === 'ja' ? 'もっと見る' : 'Load More')}
             </button>
           </div>
        )}

        {processedArticles.length === 0 && (
          <div style={{ width: '100%', padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
             {lang === 'zh' ? '找不到相關關鍵字的文章' : (lang === 'ja' ? '該当する記事が見つかりません' : 'No articles found matching your criteria.')}
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
        /* Unified Marquee Animation for all screens if needed */
        .category-marquee-track {
          animation: marquee-scroll 40s linear infinite;
        }
        .category-marquee-track:active,
        .category-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 0.4rem)); }
        }

        .search-input:focus {
          border-color: var(--accent-color) !important;
          background: rgba(255,255,255,0.06) !important;
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.15);
        }

        .load-more-btn:hover {
          background: var(--accent-color) !important;
          color: #000 !important;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 242, 254, 0.3);
        }




        @media (max-width: 768px) {
          .category-marquee-track {
            animation-duration: 25s; /* Faster on mobile */
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
