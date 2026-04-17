'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CategoryData {
  label: string;
  tags: string[];
}

interface ArticleDropdownProps {
  lang: string;
  dict: any;
  categories: Record<string, CategoryData>;
  latestArticle: any;
}

export default function ArticleDropdown({ lang, dict, categories, latestArticle }: ArticleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="nav-item-dropdown" 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
    >
      <Link 
        href={`/${lang}/articles`} 
        className={`nav-link ${isOpen ? 'active' : ''}`}
        style={{
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '0.95rem',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          display: 'inline-block',
          position: 'relative',
          paddingLeft: '1rem' // Reserve space for front-side arrow
        }}
      >
        <span style={{ 
          fontSize: '0.6rem', 
          opacity: 0.5, 
          transform: `translateY(-50%) ${isOpen ? 'rotate(180deg)' : ''}`, 
          transition: 'transform 0.3s ease', 
          position: 'absolute',
          left: 0,
          top: '50%',
          display: 'inline-block',
          lineHeight: '1'
        }}>▼</span>
        {dict.nav.articles}
      </Link>
 
       {/* Mega Menu Panel */}
       <div 
         className={`mega-menu ${isOpen ? 'visible' : ''}`}
         style={{
           position: 'absolute',
           top: '100%',
           left: '50%',
           transform: `translateX(-50%) translateY(${isOpen ? '15px' : '25px'})`,
           width: '550px', // Reduced from 700px
           background: 'rgba(10, 10, 10, 0.98)',
           backdropFilter: 'blur(30px)',
           WebkitBackdropFilter: 'blur(30px)',
           border: '1px solid rgba(255, 255, 255, 0.08)',
           borderRadius: '24px',
           padding: '1.5rem 2rem', // Reduced from 2.5rem 3rem
           boxShadow: '0 40px 100px rgba(0,0,0,0.9)',
           opacity: isOpen ? 1 : 0,
           pointerEvents: isOpen ? 'auto' : 'none',
           transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
           display: 'grid',
           gridTemplateColumns: 'repeat(3, 1fr)',
           gap: '2rem', // Reduced from 3rem
           zIndex: 100
         }}
       >
        {/* Category Columns */}
        {Object.entries(categories).map(([key, cat]) => (
          <div key={key} className="mega-menu-col">
            <h4 style={{ 
              color: 'var(--accent-color)', 
              fontSize: '0.75rem', // Slightly smaller
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              marginBottom: '1rem', // Reduced from 1.5rem
              fontWeight: '800',
              borderLeft: '2px solid var(--accent-color)',
              paddingLeft: '10px'
            }}>
              {cat.label}
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {cat.tags.map((tag) => (
                <li key={tag}>
                  <Link 
                    href={`/${lang}/articles#${tag}`}
                    style={{
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      fontSize: '0.9rem', // Slightly smaller
                      transition: 'all 0.2s ease',
                      display: 'block'
                    }}
                    className="mega-menu-tag"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mega-menu-tag:hover {
          color: #fff !important;
          transform: translateX(5px);
        }
        .mega-menu::before {
          content: '';
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px; /* Bridge only the area between trigger and panel */
          height: 30px;
          background: transparent;
        }
        .nav-link:hover { color: var(--text-primary) !important; }
        .nav-link.active::after {
           content: '';
           position: absolute;
           bottom: -4px;
           left: 0;
           width: 100%;
           height: 2px;
           background: var(--accent-grad);
        }
      `}} />
    </div>
  );
}
