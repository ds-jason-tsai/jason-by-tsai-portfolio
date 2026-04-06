'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

export default function PortfolioCarousel({ projects, lang, t }: { projects: any[], lang: string, t: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startAutoPlay = () => {
      intervalId = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          let nextScroll = scrollLeft + 360; // Approximated card width + gap
          if (nextScroll >= scrollWidth - clientWidth + 10) {
            nextScroll = 0; // Reset to beginning
          }
          scrollRef.current.scrollTo({ left: nextScroll, behavior: 'smooth' });
        }
      }, 4000); // Scroll every 4 seconds
    };

    startAutoPlay();

    const handleMouseEnter = () => clearInterval(intervalId);
    const handleMouseLeave = () => startAutoPlay();

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('mouseenter', handleMouseEnter);
      currentRef.addEventListener('mouseleave', handleMouseLeave);
      currentRef.addEventListener('touchstart', handleMouseEnter, { passive: true });
      currentRef.addEventListener('touchend', handleMouseLeave, { passive: true });
    }

    return () => {
      clearInterval(intervalId);
      if (currentRef) {
        currentRef.removeEventListener('mouseenter', handleMouseEnter);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
        currentRef.removeEventListener('touchstart', handleMouseEnter);
        currentRef.removeEventListener('touchend', handleMouseLeave);
      }
    };
  }, []);

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
      <button onClick={scrollLeftBtn} className="carousel-nav-btn prev" aria-label="Previous">‹</button>
      <button onClick={scrollRightBtn} className="carousel-nav-btn next" aria-label="Next">›</button>

      <div className="carousel-grid" ref={scrollRef} style={{ 
        display: 'flex', 
        overflowX: 'auto', 
        scrollSnapType: 'x mandatory', 
        gap: '2rem', 
        paddingBottom: '2rem',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', // Hide standard scrollbar for slickness, arrows provide navigation
      }}>
        {projects.map((proj, idx) => (
          <div className="service-card carousel-card" key={idx} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '0', 
            overflow: 'hidden',
            minWidth: '320px',
            maxWidth: '380px',
            flexShrink: 0,
            scrollSnapAlign: 'center',
            margin: '0 auto',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '24px'
          }}>
            <div className="portfolio-image-wrapper" style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden' }}>
              {proj.image ? (
                 <Image src={proj.image} alt={proj.title[lang]} fill style={{ objectFit: 'cover', transition: 'transform 0.5s ease', cursor: 'pointer' }} className="portfolio-img-hover" />
              ) : (
                 <div style={{ width: '100%', height: '100%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No Preview Available</div>
              )}
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{t.type[proj.type]}</span>
              <h3 className="service-title" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: '1.3rem', color: '#fff' }}>{proj.title[lang]}</h3>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', flex: 1, marginBottom: '1.5rem' }}>
                {proj.description[lang]}
              </p>

              <div className="tags-container" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
                {proj.tags[lang].map((tag: any, tIdx: number) => (
                  <span key={tIdx} className="tag" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', padding: '0.2rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}>{tag}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginTop: 'auto' }}>
                {proj.url ? (
                  <a href={proj.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                    {t.btn}
                  </a>
                ) : (
                  <button className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.9rem', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                    {t.pending}
                  </button>
                )}
                <a href={`/${lang}/reports#data`} className="btn-secondary" style={{ display: 'block', textAlign: 'center', padding: '0.75rem 1rem', fontSize: '0.9rem' }}>
                  {lang === 'zh' ? '🛒 購買資料' : (lang === 'ja' ? '🛒 データ購入' : '🛒 Buy Data')}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .service-card:hover .portfolio-img-hover {
          transform: scale(1.05);
        }
        .carousel-grid::-webkit-scrollbar {
          display: none;
        }
        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          font-size: 1.5rem;
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
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
        }
        .carousel-nav-btn.prev { left: -25px; }
        .carousel-nav-btn.next { right: -25px; }
        @media (max-width: 1024px) {
          .carousel-nav-btn { display: none; }
        }
      `}} />
    </div>
  );
}
