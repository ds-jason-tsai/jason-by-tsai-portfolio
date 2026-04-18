import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Link from 'next/link';
import { getDictionary } from '../dictionaries';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Image from 'next/image';
import NavLink from './components/NavLink';
import MobileNav from './components/MobileNav';
import ShareButton from './components/ShareButton';
import { getLatestArticle } from '@/lib/markdown';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang;
  const baseUrl = 'https://jason-by-tsai-portfolio.vercel.app';
  
  const titles = {
    zh: "傑森數據 Jason Analytics | 資料分析教學、商業儀表板與 MarTech 轉型專家",
    en: "Jason Analytics | Data Analysis Teaching, Business Dashboards & MarTech Consultant",
    ja: "ジェイソン・アナリティクス | データ分析教育、ビジネスダッシュボード、MarTech 導入エキスパート"
  };

  const descriptions = {
    zh: "傑森數據 Jason Analytics 官方作品集。由數據專家 Jason Tsai 創立，提供專業資料分析教學、客製商業報告與各類 BI 儀表板建置、作品集與專案深度指導，以及 MarTech 數位行銷科技與自動化技術導入解決方案。致力於協助個人與企業從海量數據中挖掘最高商業價值，透過數據驅動決策提升整體營運效率與競爭力。",
    en: "Official portfolio of Jason Analytics by Jason Tsai. We provide professional Data Analysis teaching, customized business reports and BI dashboard construction, in-depth portfolio/project guidance, and MarTech digital marketing automation solutions. We empower individuals and businesses to uncover maximum value from data and improve operational efficiency through data-driven decisions.",
    ja: "データ専門家 Jason Tsai が率いる Jason Analytics の公式ポートフォリオ。高度なデータ分析教育、カスタムビジネスレポート、BIダッシュボード構築、ポートフォリオ・プロジェクト指導、MarTech 導入、自動化ソリューションを包括的に提供します。企業のデータを価値あるインサイトに変え、データ駆動型の意思決定を通じて成長と競争力強化を支援します。"
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
    icons: {
      icon: [
        { url: '/logo.png', sizes: '32x32', type: 'image/png' },
        { url: '/logo.png', sizes: '192x192', type: 'image/png' },
        { url: '/logo.png', sizes: '512x512', type: 'image/png' },
      ],
      shortcut: '/logo.png',
      apple: [
        { url: '/logo.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export async function generateStaticParams() {
   return [{ lang: 'zh' }, { lang: 'en' }, { lang: 'ja' }];
}



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
    zh: "傑森數據 Jason Analytics 官方作品集。由數據專家 Jason Tsai 創立，提供專業資料分析教學、客製商業報告與各類 BI 儀表板建置、作品集與專案深度指導，以及 MarTech 數位行銷科技與自動化技術導入解決方案。致力於協助個人與企業從海量數據中挖掘最高商業價值。",
    en: "Official portfolio of Jason Analytics by Jason Tsai. Providing professional Data Analysis teaching, customized BI dashboards, project guidance, and MarTech automation solutions to unlock maximum value from data.",
    ja: "データ専門家 Jason Tsai が率いる Jason Analytics の公式ポートフォリオ。高度なデータ分析教育、カスタム BI ダッシュボード構築、プロジェクト指導、MarTech 導入ソリューションを提供し、データの価値を最大化します。"
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
        <link rel="icon" href="/logo.png" sizes="any" />

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
            <Link href={`/${lang}`} style={{ textDecoration: 'none', borderBottom: 'none', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Image src="/logo.png" alt="Logo" width={45} height={45} style={{ borderRadius: '8px' }} />
              <span>{dict.brand?.logo || '傑森數據 Jason Analytics'}</span>
            </Link>
          </div>
          
          <div className="desktop-only">
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <NavLink lang={lang} href={`/${lang}`}>{dict.nav.home}</NavLink>
              <NavLink lang={lang} href={`/${lang}/experience`}>{dict.nav.experience}</NavLink>
              <NavLink lang={lang} href={`/${lang}/portfolio`}>{dict.nav.portfolio}</NavLink>
              <NavLink lang={lang} href={`/${lang}/services`}>{dict.nav.services}</NavLink>
              
              <NavLink lang={lang} href={`/${lang}/articles`}>{dict.nav.articles}</NavLink>
              
              <NavLink lang={lang} href={`/${lang}/reports`}>{dict.nav.reports || 'Premium Access'}</NavLink>
              <NavLink lang={lang} href={`/${lang}/dashboards`}>{dict.nav.dashboards || 'Dashboards'}</NavLink>
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
            <MobileNav 
              lang={lang} 
              dict={dict} 
              categories={getCategorizedTags(lang)} 
            />
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
              <Link href={`/${lang}`} style={{ textDecoration: 'none', borderBottom: 'none', marginBottom: '0.5rem' }}>
                <Image src="/logo.png" alt="Logo" width={90} height={90} style={{ borderRadius: '16px', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.15))' }} />
              </Link>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'var(--accent-grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {dict.brand?.logo || '傑森數據 Jason Analytics'}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: '1.6' }}>
                 Empowering decisions through data. <br/> 結合商業思維與深厚技術底蘊，持續在第一線創造數據影響力。
              </p>
              <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                <a href="mailto:jason.tsai.0604@gmail.com" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>
                  jason.tsai.0604@gmail.com
                </a>
                <span style={{ fontSize: '0.8rem', color: '#666' }}>Official Contact Email</span>
              </div>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }} className="footer-links">
                 <Link href={`/${lang}/portfolio?utm_source=internal&utm_medium=button&utm_campaign=footer_nav_portfolio`} className="footer-link">Portfolio</Link>
                 <Link href={`/${lang}/services?utm_source=internal&utm_medium=button&utm_campaign=footer_nav_services`} className="footer-link">Services</Link>
                 <Link href={`/${lang}/experience?utm_source=internal&utm_medium=button&utm_campaign=footer_nav_experience`} className="footer-link">Experience</Link>
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
                position: relative;
              }
              .footer-link:hover { color: var(--text-primary); }
              .footer-link::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 0;
                width: 0;
                height: 2px;
                background: var(--accent-grad);
                transition: width 0.3s ease;
              }
              .footer-link:hover::after {
                width: 100%;
              }
              @media (max-width: 640px) {
                .footer-links {
                  gap: 1rem !important;
                  flex-wrap: wrap;
                  justify-content: center;
                }
                .footer-link {
                  font-size: 0.85rem;
                }
              }
            `}} />
          </footer>
        </div>
      </body>
    </html>
  );
}
