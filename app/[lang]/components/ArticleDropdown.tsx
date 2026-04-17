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
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {dict.nav.articles}
        <span style={{ fontSize: '0.7rem', opacity: 0.5, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>▼</span>
      </Link>

      {/* Mega Menu Panel */}
      <div 
        className={`mega-menu ${isOpen ? 'visible' : ''}`}
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: `translateX(-50%) translateY(${isOpen ? '10px' : '20px'})`,
          width: '850px',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr) 1.5fr',
          gap: '2.5rem',
          zIndex: 100
        }}
      >
        {/* Category Columns */}
        {Object.entries(categories).map(([key, cat]) => (
          <div key={key} className="mega-menu-col">
            <h4 style={{ 
              color: 'var(--accent-color)', 
              fontSize: '0.85rem', 
              textTransform: 'uppercase', 
              letterSpacing: '1.5px',
              marginBottom: '1.2rem',
              fontWeight: '800'
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
                      fontSize: '0.95rem',
                      transition: 'color 0.2s ease',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Featured Article Card */}
        {latestArticle && (
          <div 
            className="mega-menu-featured"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              padding: '1.2rem',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              animation: isOpen ? 'slideInRight 0.5s ease forwards' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>LATEST PICK</span>
               <span style={{ fontSize: '0.7rem', color: '#666' }}>{latestArticle.date}</span>
            </div>
            
            <h5 style={{ fontSize: '1.1rem', lineHeight: '1.4', margin: 0, color: '#fff' }}>
              {latestArticle.title[lang]}
            </h5>
            
            <p style={{ fontSize: '0.85rem', color: '#888', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {latestArticle.description[lang]}
            </p>

            <Link 
              href={`/${lang}/articles/${latestArticle.id}`}
              className="btn-secondary"
              style={{
                width: '100%',
                textAlign: 'center',
                padding: '0.6rem',
                fontSize: '0.85rem'
              }}
            >
              Read Article →
            </Link>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .mega-menu::before {
          content: '';
          position: absolute;
          top: -20px;
          left: 0;
          width: 100%;
          height: 20px;
          background: transparent;
        }
        .nav-link:hover { color: var(--accent-color) !important; }
      `}} />
    </div>
  );
}
