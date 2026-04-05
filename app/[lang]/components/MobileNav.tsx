'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav({ 
  lang, 
  dict 
}: { 
  lang: string; 
  dict: any 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu when the path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const navLinks = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/portfolio`, label: dict.nav.portfolio },
    { href: `/${lang}/reports`, label: lang === 'zh' ? '💎 付費報告' : lang === 'ja' ? '💎 プレミアム' : '💎 Reports' },
    { href: `/${lang}/articles`, label: dict.nav.articles },
    { href: `/${lang}/experience`, label: dict.nav.experience },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button 
        className={`mobile-menu-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
        <div className="hamburger-line"></div>
      </button>

      {/* Side Drawer Overlay */}
      <div 
        className={`mobile-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Side Drawer Content */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="nav-logo">
            <Link href={`/${lang}`} onClick={() => setIsOpen(false)}>{dict.brand?.logo || 'Jason Tsai'}</Link>
          </div>
        </div>

        <nav className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-lang-switcher">
          <p className="lang-title">Language</p>
          <div className="lang-options">
            <Link href="/zh" className={lang === 'zh' ? 'active' : ''}>繁體中文</Link>
            <Link href="/en" className={lang === 'en' ? 'active' : ''}>English</Link>
            <Link href="/ja" className={lang === 'ja' ? 'active' : ''}>日本語</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 1001;
          padding: 8px;
        }

        .hamburger-line {
          width: 28px;
          height: 2px;
          background-color: var(--text-primary);
          transition: all 0.3s ease;
        }

        .mobile-menu-toggle.open .hamburger-line:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .mobile-menu-toggle.open .hamburger-line:nth-child(2) {
          opacity: 0;
        }
        .mobile-menu-toggle.open .hamburger-line:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        .mobile-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 999;
        }

        .mobile-drawer-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-drawer {
          position: fixed;
          top: 0;
          right: -300px;
          width: 300px;
          height: 100%;
          background: #050505; /* Deep solid black */
          border-left: 1px solid var(--glass-border);
          padding: 2.5rem 1.5rem; /* Better internal padding */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0,0,0,0.5);
        }

        .mobile-drawer.open {
          right: 0;
        }

        .mobile-drawer-header {
          margin-bottom: 3rem;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .mobile-nav-links a, .mobile-nav-links a:visited {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-secondary) !important;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .mobile-nav-links a.active, .mobile-nav-links a.active:visited {
          color: var(--text-primary) !important;
          background: var(--accent-grad);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .mobile-lang-switcher {
          margin-top: auto;
          border-top: 1px solid var(--glass-border);
          padding-top: 2rem;
        }

        .lang-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #666;
          margin-bottom: 1rem;
        }

        .lang-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .lang-options a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 1rem;
        }

        .lang-options a.active {
          color: var(--accent-color);
          font-weight: 800;
        }

        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
