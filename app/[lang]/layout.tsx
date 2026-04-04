import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Link from 'next/link';
import { getDictionary } from '../dictionaries';
import Script from 'next/script';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jason Tsai | Data Analyst",
  description: "Portfolio of Jason Tsai",
  verification: {
    google: "QTIRGrJx67BIEr6FwZpodhAMNjYA01zw2g5-zE7GzNQ",
  },
};

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
              <Link href={`/${lang}`}>Jason Tsai.</Link>
            </div>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Link href={`/${lang}`}>{dict.nav.home}</Link>
              <Link href={`/${lang}/services`}>{dict.nav.services}</Link>
              <Link href={`/${lang}/portfolio`}>{dict.nav.portfolio}</Link>
              <Link href={`/${lang}/articles`}>{dict.nav.articles}</Link>
              <Link href={`/${lang}/experience`}>{dict.nav.experience}</Link>
              <Link href={`/${lang}/contact`}>{dict.nav.contact}</Link>
              
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
          </nav>
          
          <main className="page-content" style={{ minHeight: '80vh', paddingBottom: '5rem', paddingTop: '2rem' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
