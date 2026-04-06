'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PortfolioClient({ projects, lang, t }: { projects: any[], lang: string, t: any }) {
  const categories = ['all', '0', '1', '2'];
  const catLabels: Record<string, string> = {
    'all': lang === 'zh' ? '全部內容' : (lang === 'ja' ? 'すべて' : 'All'),
    '0': t.type[0], // 儀表板
    '1': t.type[1], // 商業提案
    '2': t.type[2], // 技術研究
  };

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

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
    setCurrentIndex(0);
    window.history.pushState(null, '', `#${cat}`);
  };

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter((p) => String(p.type) === activeCategory);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredProjects.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === filteredProjects.length - 1 ? 0 : prev + 1));
  };

  // Calculate the second item if there are enough projects & NOT on mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentProj = filteredProjects[currentIndex];
  // Only show next if not mobile and not the only project
  const nextProj = (!isMobile && filteredProjects.length > 1)
    ? filteredProjects[(currentIndex + 1) % filteredProjects.length] 
    : null;

  return (
    <div className="portfolio-client-container" style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: isMobile ? '2rem' : '4rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            style={{
              padding: '0.8rem 2rem',
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

      {/* Mobile Navigation Buttons Moved to Top Area */}
      {isMobile && filteredProjects.length > 1 && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
          <button onClick={handlePrev} className="carousel-nav-btn" style={{ position: 'static', transform: 'none', width: '50px', height: '50px' }}>‹</button>
          <button onClick={handleNext} className="carousel-nav-btn" style={{ position: 'static', transform: 'none', width: '50px', height: '50px' }}>›</button>
        </div>
      )}

      <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', padding: isMobile ? '0' : '0 2rem' }}>
        {/* Desktop Navigation Buttons */}
        {!isMobile && filteredProjects.length > 1 && (
          <>
            <button onClick={handlePrev} className="carousel-nav-btn prev" aria-label="Previous">‹</button>
            <button onClick={handleNext} className="carousel-nav-btn next" aria-label="Next">›</button>
          </>
        )}

        {/* Display Wrapper: Shows 2 projects side by side if possible */}
        <div className="portfolio-carousel-wrapper" style={{ minHeight: '600px', display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: '2rem' }}>
          {currentProj ? (
             [currentProj, nextProj].filter(Boolean).map((proj, arrIdx) => (
              <div className="service-card carousel-card fade-in-fast" key={`${activeCategory}-${currentIndex}-${arrIdx}`} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                padding: '0', 
                overflow: 'hidden',
                width: '100%',
                maxWidth: '430px', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                animation: 'slideUp 0.4s ease forwards'
              }}>
                <div className="portfolio-image-wrapper" style={{ width: '100%', height: '260px', position: 'relative', overflow: 'hidden' }}>
                  {proj.image ? (
                    <Image 
                      src={proj.image} 
                      alt={proj.title[lang]} 
                      fill 
                      priority={arrIdx < 2}
                      style={{ objectFit: 'cover', transition: 'transform 0.5s ease', cursor: 'pointer' }} 
                      className="portfolio-img-hover" 
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No Preview Available</div>
                  )}
                </div>
                
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, background: 'rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{t.type[proj.type]}</span>
                  <h3 className="service-title" style={{ marginTop: '0.6rem', marginBottom: '1rem', fontSize: '1.4rem', color: '#fff', fontWeight: '800' }}>{proj.title[lang]}</h3>
                  
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', flex: 1, marginBottom: '2rem', whiteSpace: 'normal' }}>
                    {proj.description[lang]}
                  </p>

                  <div className="tags-container" style={{ justifyContent: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {proj.tags[lang].map((tag: any, tIdx: number) => (
                      <span key={tIdx} className="tag" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.8rem', fontSize: '0.85rem', borderRadius: '6px' }}>{tag}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginTop: 'auto' }}>
                    {proj.url ? (
                      <a href={proj.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '0.8rem 1rem', fontSize: '1rem' }}>
                        {t.btn}
                      </a>
                    ) : (
                      <button className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.8rem 1rem', fontSize: '1rem', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                        {t.pending}
                      </button>
                    )}
                    <a href={`/${lang}/reports#data`} className="btn-secondary pulse-animation" style={{ display: 'block', textAlign: 'center', padding: '0.8rem 1rem', fontSize: '1rem' }}>
                      {lang === 'zh' ? '🛒 購買資料' : (lang === 'ja' ? '🛒 データ購入' : '🛒 Buy Data')}
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ width: '100%', padding: '4rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No projects matched this category.
            </div>
          )}
        </div>

        {/* Pagination Dots */}
        {filteredProjects.length > 1 && (
           <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2rem' }}>
              {filteredProjects.map((_, i) => (
                 <div 
                   key={i} 
                   onClick={() => setCurrentIndex(i)}
                   style={{
                     width: i === currentIndex ? '30px' : '10px',
                     height: '10px',
                     borderRadius: '5px',
                     background: i === currentIndex ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)',
                     cursor: 'pointer',
                     transition: 'all 0.3s'
                   }}
                 />
              ))}
           </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
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
          top: 40%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(0, 242, 254, 0.3);
          color: #fff;
          font-size: 2.2rem;
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
        .carousel-nav-btn.prev { left: -60px; }
        .carousel-nav-btn.next { right: -60px; }

        @media (max-width: 1024px) {
          .carousel-nav-btn { 
            display: flex !important; 
            background: rgba(255, 255, 255, 0.1) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: #fff !important;
          }
          
          .portfolio-image-wrapper { height: 180px !important; }
          .portfolio-carousel-wrapper { 
            flex-direction: column !important; 
            align-items: center !important; 
            gap: 1rem !important;
            padding: 0;
            min-height: auto !important;
          }
          .carousel-card { 
            width: 98% !important;
            max-width: 100% !important; 
            margin-bottom: 0.5rem;
            padding: 0 !important;
            border-radius: 16px !important;
          }
          .service-title { font-size: 1.2rem !important; }
          .category-btn { padding: 0.6rem 1.5rem !important; font-size: 0.9rem !important; }
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 242, 254, 0.4); }
          70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(0, 242, 254, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 242, 254, 0); }
        }
        .pulse-animation {
          animation: pulse 2s infinite;
          border-color: var(--accent-color) !important;
        }
      `}} />
    </div>
  );
}
