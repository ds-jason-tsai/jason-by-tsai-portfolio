import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Link from 'next/link';
import { getDictionary } from '../dictionaries';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const baseUrl = 'https://jason-by-tsai-portfolio.vercel.app';
  
  const titles = {
    zh: "傑森數據 Jason Analytics | 數據分析、AI 與 MarTech 專家",
    en: "Jason Analytics | Data Analysis, AI & MarTech Expert",
    ja: "ジェイソン・アナリティクス | データ分析・AI・MarTech エキスパート"
  };

  const descriptions = {
    zh: "傑森數據 Jason Analytics 的官方作品集，由數據專家 Jason Tsai (蔡傑森) 創立。提供全方位專業數據分析、商業分析、AI 機器學習建模、MarTech 數位行銷科技導入、數據工程優化與自動化解決方案。協助企業從原始數據中挖掘商業價值，透過數據驅動決策提升競爭力與營運效率。",
    en: "Official portfolio of Jason Analytics, founded by data expert Jason Tsai. We provide comprehensive solutions in Data Analysis, AI/ML Modeling, MarTech implementation, and Data Engineering. Our mission is to help businesses unlock data value through automated workflows and data-driven insights to drive growth.",
    ja: "データ専門家 Jason Tsai が率いる Jason Analytics の公式ポートフォリオ。高度なデータ分析、ビジネスインテリジェンス、AI機械学習モデリング、MarTech 導入、データエンジニアリング、自動化ソリューションを包括的に提供します。企業のデータを価値あるインサイトに変え、意思決定を通じて成長を支援します。"
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.zh,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.zh,
    verification: {
      google: "QTIRGrJx67BIEr6FwZpodhAMNjYA01zw2g5-zE7GzNQ",
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'zh-Hant': `${baseUrl}/zh`,
        'en': `${baseUrl}/en`,
        'ja': `${baseUrl}/ja`,
        'x-default': `${baseUrl}/zh`,
      },
    },
  };
}

export async function generateStaticParams() {
   return [{ lang: 'zh' }, { lang: 'en' }, { lang: 'ja' }];
}

import NavLink from './components/NavLink';
import MobileNav from './components/MobileNav';
import ShareButton from './components/ShareButton';

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const lang = (await params).lang as 'zh' | 'en' | 'ja';
  const dict = await getDictionary(lang);
  const baseUrl = 'https://jason-by-tsai-portfolio.vercel.app';
  
  const descriptions = {
    zh: "傑森數據 Jason Analytics 的官方作品集，由數據專家 Jason Tsai (蔡傑森) 創立。提供全方位專業數據分析、商業分析、AI 機器學習建模、MarTech 數位行銷科技導入、數據工程優化與自動化解決方案。協助企業從原始數據中挖掘商業價值，透過數據驅動決策提升競爭力與營運效率。",
    en: "Official portfolio of Jason Analytics, founded by data expert Jason Tsai. We provide comprehensive solutions in Data Analysis, AI/ML Modeling, MarTech implementation, and Data Engineering. Our mission is to help businesses unlock data value through automated workflows and data-driven insights to drive growth.",
    ja: "データ専門家 Jason Tsai が率いる Jason Analytics の公式ポートフォリオ。高度なデータ分析、ビジネスインテリジェンス、AI機械学習モデリング、MarTech 導入、データエンジニアリング、自動化ソリューションを包括的に提供します。企業のデータを価値あるインサイトに変え、意思決定を通じて成長を支援します。"
  };

  return (
    <html lang={lang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* TTFB & Performance Optimization: Resource Hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://jason-by-tsai-portfolio.vercel.app" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />

        <style dangerouslySetInnerHTML={{ __html: `
          .mobile-drawer {
            background-color: #000000 !important;
            background: #000000 !important;
            opacity: 1 !important;
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
            -webkit-transform: translate3d(0,0,0) !important;
            box-shadow: -20px 0 50px rgba(0,0,0,1) !important;
          }
          .mobile-drawer-overlay {
            background-color: rgba(0,0,0,0.9) !important;
            -webkit-backdrop-filter: none !important;
            backdrop-filter: none !important;
          }
        `}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${baseUrl}/${lang}/#website`,
                  "url": `${baseUrl}/${lang}/`,
                  "name": "傑森數據 Jason Analytics",
                  "description": descriptions[lang as keyof typeof descriptions] || descriptions.zh,
                  "publisher": { "@id": `${baseUrl}/${lang}/#person` },
                  "inLanguage": lang
                },
                {
                  "@type": "Person",
                  "id": `${baseUrl}/${lang}/#person`,
                  "name": "Jason Tsai (蔡傑森)",
                  "alternateName": "Jason Analytics",
                  "jobTitle": "Data Analyst & AI/MarTech Consultant",
                  "description": descriptions[lang as keyof typeof descriptions] || descriptions.zh,
                  "url": baseUrl,
                  "image": `${baseUrl}/profile.jpg`, // Adjust if a standard profile image exists
                  "knowsAbout": ["Data Analysis", "AI Modeling", "MarTech", "FinTech", "Tableau", "Python", "SQL", "n8n"]
                }
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-WH682R80NK" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WH682R80NK');
          `}
        </Script>
        <nav className="nav">
          <div className="nav-logo">
            <Link href={`/${lang}`} style={{ textDecoration: 'none', borderBottom: 'none' }}>{dict.brand?.logo || 'Jason Tsai'}</Link>
          </div>
          
          <div className="desktop-only">
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <NavLink lang={lang} href={`/${lang}`}>{dict.nav.home}</NavLink>
              <NavLink lang={lang} href={`/${lang}/professional-experience`}>{dict.nav.experience}</NavLink>
              <NavLink lang={lang} href={`/${lang}/portfolio`}>{dict.nav.portfolio}</NavLink>
              <NavLink lang={lang} href={`/${lang}/dashboards`}>{dict.nav.dashboards || 'Dashboards'}</NavLink>
              <NavLink lang={lang} href={`/${lang}/services`}>{dict.nav.services}</NavLink>
              <NavLink lang={lang} href={`/${lang}/articles`}>{dict.nav.articles}</NavLink>
              <NavLink lang={lang} href={`/${lang}/reports`}>{dict.nav.reports || 'Premium Access'}</NavLink>
              <NavLink lang={lang} href={`/${lang}/contact`}>{dict.nav.contact}</NavLink>
              
              {/* Share Button */}
              <div className="ml-4">
                <ShareButton lang={lang} />
              </div>
              
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

        <div className="main-container">
          {/* Main content shifted down slightly if needed, though globals.css handles it */}
          
          <main className="page-content" style={{ minHeight: '80vh', paddingBottom: '5rem', paddingTop: '2rem' }}>
            {children}
            <Analytics />
            <SpeedInsights />
          </main>

          <footer className="footer" style={{ borderTop: '1px solid var(--glass-border)', padding: '4rem 2rem 2rem 2rem', background: '#0a0a0a', textAlign: 'center', marginTop: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'var(--accent-grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {dict.brand?.logo || '傑森數據 Jason Analytics'}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: '1.6' }}>
                 Empowering decisions through data. <br/> 結合商業思維與深厚技術底蘊，持續在第一線創造數據影響力。
              </p>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }} className="footer-links">
                 <Link href={`/${lang}/portfolio?utm_source=internal&utm_medium=button&utm_campaign=footer_nav_portfolio`} className="footer-link">Portfolio</Link>
                 <Link href={`/${lang}/services?utm_source=internal&utm_medium=button&utm_campaign=footer_nav_services`} className="footer-link">Services</Link>
                 <Link href={`/${lang}/professional-experience?utm_source=internal&utm_medium=button&utm_campaign=footer_nav_experience`} className="footer-link">Experience</Link>
                 <Link href={`/${lang}/contact?utm_source=internal&utm_medium=button&utm_campaign=footer_nav_contact`} className="footer-link">Contact</Link>
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
