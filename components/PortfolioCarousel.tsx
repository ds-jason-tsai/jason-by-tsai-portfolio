import React from 'react';
import Image from 'next/image';

export default function PortfolioCarousel({ projects, lang, t }: { projects: any[], lang: string, t: any }) {
  // 複製陣列以達到無縫無限輪播
  const infiniteProjects = [...projects, ...projects];

  return (
    <div className="portfolio-carousel-container">
      <div className="portfolio-carousel-track">
        {infiniteProjects.map((proj, idx) => (
          <div className="service-card portfolio-carousel-card" key={idx} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '0', 
            overflow: 'hidden',
            minWidth: '320px',
            maxWidth: '380px',
            flexShrink: 0,
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
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', flex: 1, marginBottom: '1.5rem', whiteSpace: 'normal' }}>
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
        .portfolio-carousel-container {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          overflow: hidden;
          position: relative;
          padding: 2rem 0;
        }
        .portfolio-carousel-track {
          display: flex;
          width: max-content;
          gap: 2rem;
          animation: marquee 30s linear infinite;
        }
        .portfolio-carousel-track:hover {
          animation-play-state: paused;
        }
        .service-card:hover .portfolio-img-hover {
          transform: scale(1.05);
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
      `}} />
    </div>
  );
}
