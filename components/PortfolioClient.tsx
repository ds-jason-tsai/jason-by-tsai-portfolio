'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function PortfolioClient({ projects, lang, t }: { projects: any[], lang: string, t: any }) {
  // Extract categories dynamic mapping based on t.type
  const categories = ['all', '0', '1', '2'];
  const catLabels: Record<string, string> = {
    'all': lang === 'zh' ? '全部內容' : (lang === 'ja' ? 'すべて' : 'All'),
    '0': t.type[0], // 儀表板
    '1': t.type[1], // 商業提案
    '2': t.type[2], // 技術研究
  };

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['all', '0', '1', '2'].includes(hash)) {
        setActiveCategory(hash);
      }
    }
  }, []);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    window.history.pushState(null, '', `#${cat}`);
    // Auto scroll to start when switching categories safely
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => String(p.type) === activeCategory);

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  return (
    <div className="portfolio-client-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {categories.map((cat, idx) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            style={{
              padding: '0.6rem 2rem',
              borderRadius: '50px',
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
            {catLabels[cat]}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', width: '100%', padding: '0 2rem' }}>
        {/* Navigation Buttons */}
        {filteredProjects.length > 1 && (
          <>
            <button onClick={scrollLeftBtn} className="carousel-nav-btn prev" aria-label="Previous">‹</button>
            <button onClick={scrollRightBtn} className="carousel-nav-btn next" aria-label="Next">›</button>
          </>
        )}

        <div className="carousel-grid" ref={scrollRef} style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          scrollSnapType: 'x mandatory', 
          gap: '3rem', 
          paddingBottom: '2rem',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none', 
        }}>
          {filteredProjects.map((proj, idx) => (
            <div className="service-card carousel-card" key={`${activeCategory}-${idx}`} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '0', 
              overflow: 'hidden',
              minWidth: '400px',
              maxWidth: '460px',
              flexShrink: 0,
              scrollSnapAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '24px',
              animation: `slideUp 0.6s ease forwards ${idx * 0.1}s`,
              opacity: 0,
            }}>
              <div className="portfolio-image-wrapper" style={{ width: '100%', height: '260px', position: 'relative', overflow: 'hidden' }}>
                {proj.image ? (
                   <Image src={proj.image} alt={proj.title[lang]} fill style={{ objectFit: 'cover', transition: 'transform 0.5s ease', cursor: 'pointer' }} className="portfolio-img-hover" />
                ) : (
                   <div style={{ width: '100%', height: '100%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No Preview Available</div>
                )}
              </div>
              
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{t.type[proj.type]}</span>
                <h3 className="service-title" style={{ marginTop: '0.5rem', marginBottom: '1.2rem', fontSize: '1.5rem', color: '#fff', fontWeight: '800' }}>{proj.title[lang]}</h3>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.8', flex: 1, marginBottom: '2rem', whiteSpace: 'normal' }}>
                  {proj.description[lang]}
                </p>

                <div className="tags-container" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                  {proj.tags[lang].map((tag: any, tIdx: number) => (
                    <span key={tIdx} className="tag" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px' }}>{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginTop: 'auto' }}>
                  {proj.url ? (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '1rem 1.5rem', fontSize: '1rem' }}>
                      {t.btn}
                    </a>
                  ) : (
                    <button className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '1rem 1.5rem', fontSize: '1rem', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                      {t.pending}
                    </button>
                  )}
                  <a href={`/${lang}/reports#data`} className="btn-secondary" style={{ display: 'block', textAlign: 'center', padding: '1rem 1.5rem', fontSize: '1rem' }}>
                    {lang === 'zh' ? '🛒 購買資料' : (lang === 'ja' ? '🛒 データ購入' : '🛒 Buy Data')}
                  </a>
                </div>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && (
             <div style={{ width: '100%', padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No projects matched this category.
             </div>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .service-card:hover .portfolio-img-hover {
          transform: scale(1.05);
        }
        .category-btn:hover {
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.2);
          transform: scale(1.05);
        }
        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(0, 242, 254, 0.3);
          color: #fff;
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 10;
        }
        .carousel-nav-btn:hover {
          background: var(--accent-color);
          color: #000;
          box-shadow: 0 0 25px rgba(0, 242, 254, 0.6);
        }
        .carousel-nav-btn.prev { left: -10px; }
        .carousel-nav-btn.next { right: -10px; }

        .carousel-grid::-webkit-scrollbar {
          height: 10px;
        }
        .carousel-grid::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 5px;
        }
        .carousel-grid::-webkit-scrollbar-thumb {
          background: var(--accent-color);
          border-radius: 5px;
        }
        .carousel-grid::-webkit-scrollbar-thumb:hover {
          background: #fff;
        }

        @media (max-width: 1024px) {
          .carousel-nav-btn { display: none; }
          .carousel-card { 
             min-width: 320px !important;
             max-width: 380px !important;
          }
          .portfolio-image-wrapper {
             height: 200px !important;
          }
        }
      `}} />
    </div>
  );
}
