import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Link from 'next/link';
import { getDictionary } from '../dictionaries';
import Script from 'next/script';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "傑森數據 | 數據分析",
  description: "Portfolio of Jason Tsai",
  verification: {
    google: "QTIRGrJx67BIEr6FwZpodhAMNjYA01zw2g5-zE7GzNQ",
  },
};

export async function generateStaticParams() {
   return [{ lang: 'zh' }, { lang: 'en' }, { lang: 'ja' }];
}

import NavLink from './components/NavLink';
import MobileNav from './components/MobileNav';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-WH682R80NK" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WH682R80NK');
          `}
        </Script>
        <div className="main-container">
          {/* Global Navigation */}
          <nav className="nav">
            <div className="nav-logo">
              <Link href={`/${lang}`} style={{ textDecoration: 'none', borderBottom: 'none' }}>{dict.brand?.logo || 'Jason Tsai'}</Link>
            </div>
            
            <div className="desktop-only">
              <div className="nav-links" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <NavLink lang={lang} href={`/${lang}`}>{dict.nav.home}</NavLink>
                <NavLink lang={lang} href={`/${lang}/services`}>{dict.nav.services}</NavLink>
                <NavLink lang={lang} href={`/${lang}/portfolio`}>{dict.nav.portfolio}</NavLink>
                <NavLink lang={lang} href={`/${lang}/articles`}>{dict.nav.articles}</NavLink>
                <NavLink lang={lang} href={`/${lang}/experience`}>{dict.nav.experience}</NavLink>
                <NavLink lang={lang} href={`/${lang}/contact`}>{dict.nav.contact}</NavLink>
                
                {/* Language Switcher */}
                <details 
                  className="lang-switcher ml-4"
                  style={{ position: 'relative', cursor: 'pointer' }}
                >
                  <summary className="bg-zinc-800 px-3 py-1 rounded flex items-center" style={{ listStyle: 'none', outline: 'none' }}>
                    <div style={{ padding: '0 5px' }}>🌐 {lang.toUpperCase()} ▼</div>
                  </summary>
                  <div 
                     className="lang-dropdown"
                     style={{
                       position: 'absolute', top: '100%', right: 0, marginTop: '10px',
                       background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px',
                       width: '120px', zIndex: 50, overflow: 'hidden'
                     }}
                  >
                    <a href="/zh" style={{ display: 'block', padding: '10px', color: '#fff', textDecoration: 'none' }}>繁體中文</a>
                    <a href="/en" style={{ display: 'block', padding: '10px', color: '#fff', textDecoration: 'none' }}>English</a>
                    <a href="/ja" style={{ display: 'block', padding: '10px', color: '#fff', textDecoration: 'none' }}>日本語</a>
                  </div>
                </details>

                <style dangerouslySetInnerHTML={{__html: `
                  details.lang-switcher > summary::-webkit-details-marker { display: none; }
                  .lang-dropdown a:hover { background: #333; }
                `}}/>
              </div>
            </div>

            <div className="mobile-only">
              <MobileNav lang={lang} dict={dict} />
            </div>
          </nav>
          
          <main className="page-content" style={{ minHeight: '80vh', paddingBottom: '5rem', paddingTop: '2rem' }}>
            {children}
          </main>

          <footer className="footer" style={{ borderTop: '1px solid var(--glass-border)', padding: '4rem 2rem 2rem 2rem', background: '#0a0a0a', textAlign: 'center', marginTop: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'var(--accent-grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {dict.brand?.logo || '傑森數據 Jason Analytics'}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '400px', lineHeight: '1.6' }}>
                 Empowering decisions through data. <br/> 結合商業思維與深厚技術底蘊，持續在第一線創造數據影響力。
              </p>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }} className="footer-links">
                 <Link href={`/${lang}/portfolio`} className="footer-link">Portfolio</Link>
                 <Link href={`/${lang}/services`} className="footer-link">Services</Link>
                 <Link href={`/${lang}/experience`} className="footer-link">Experience</Link>
                 <Link href={`/${lang}/contact`} className="footer-link">Contact</Link>
              </div>
              <div style={{ borderTop: '1px solid #222', width: '100%', marginTop: '2rem', paddingTop: '2rem', fontSize: '0.85rem', color: '#555', letterSpacing: '1px' }}>
                © {new Date().getFullYear()} Jason Tsai. All rights reserved.
              </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              .footer-link {
                color: var(--text-secondary);
                text-decoration: none;
                transition: color 0.3s ease;
                font-size: 0.95rem;
                font-weight: 600;
              }
              .footer-link:hover { color: var(--text-primary); }
            `}} />
          </footer>
        </div>
      </body>
    </html>
  );
}
