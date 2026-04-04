import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Link from 'next/link';
import { getDictionary } from '../dictionaries';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jason Tsai | Data Analyst",
  description: "Portfolio of Jason Tsai",
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
        <div className="main-container">
          {/* Global Navigation */}
          <nav className="nav">
            <div className="nav-logo">
              <Link href={`/${lang}`}>Jason Tsai.</Link>
            </div>
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Link href={`/${lang}/services`}>{dict.nav.services}</Link>
              <Link href={`/${lang}/portfolio`}>{dict.nav.portfolio}</Link>
              <Link href={`/${lang}/experience`}>{dict.nav.experience}</Link>
              <Link href={`/${lang}/contact`}>{dict.nav.contact}</Link>
              
              {/* Language Switcher */}
              <div 
                className="lang-switcher cursor-pointer ml-4 flex items-center bg-zinc-800 px-3 py-1 rounded"
                style={{ position: 'relative' }}
              >
                <div style={{ padding: '0 5px' }}>🌐 {lang.toUpperCase()} ▼</div>
                <div 
                   className="lang-dropdown"
                   style={{
                     position: 'absolute', top: '100%', right: 0, marginTop: '10px',
                     display: 'flex', flexDirection: 'column',
                     background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px',
                     width: '120px', zIndex: 50, overflow: 'hidden'
                   }}
                >
                  <a href="/zh" style={{ padding: '10px', color: '#fff', textDecoration: 'none' }}>繁體中文</a>
                  <a href="/en" style={{ padding: '10px', color: '#fff', textDecoration: 'none' }}>English</a>
                  <a href="/ja" style={{ padding: '10px', color: '#fff', textDecoration: 'none' }}>日本語</a>
                </div>
              </div>

              <style dangerouslySetInnerHTML={{__html: `
                .lang-switcher .lang-dropdown { display: none; }
                .lang-switcher:hover .lang-dropdown { display: flex; }
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
