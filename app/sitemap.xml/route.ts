import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const baseUrl = 'https://jason-by-tsai-portfolio.vercel.app';
  
  const langs = ['zh', 'en', 'ja'];
  const pages = ['', '/services', '/portfolio', '/experience', '/contact', '/reports', '/articles'];
  
  const lastMod = new Date().toISOString();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const page of pages) {
    for (const lang of langs) {
      const url = `${baseUrl}/${lang}${page}`;
      
      xml += '  <url>\n';
      xml += `    <loc>${url}</loc>\n`;
      
      // Hreflang alternates
      for (const altLang of langs) {
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${baseUrl}/${altLang}${page}" />\n`;
      }
      
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
      xml += '  </url>\n';
    }
  }

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
