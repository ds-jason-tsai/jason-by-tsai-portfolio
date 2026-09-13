/**
 * 🛑 SEO CRITICAL - DO NOT MODIFY WITHOUT PERMISSION
 * This middleware handles the root domain redirection (e.g., / -> /zh).
 * It is essential for Google Search Console (GSC) indexing.
 * ⚠️ 未經使用者明確要求，請勿修改此檔案的重定向邏輯。
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['zh', 'en', 'ja'];
const defaultLocale = 'zh';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Prioritize Traditional Chinese for the target audience
  if (acceptLanguage.includes('zh')) return 'zh';
  if (acceptLanguage.includes('ja')) return 'ja';
  if (acceptLanguage.includes('en')) return 'en';
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname is missing any locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming is /products -> new URL is /zh/products
    // Root path is a special case: pathname is "/", so naively appending it
    // (e.g. `/${locale}${pathname}`) produced "/zh/" with a trailing slash,
    // which Next.js then had to redirect again to "/zh" (an extra hop).
    // Building the root case explicitly collapses this to a single redirect.
    const newPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|_next/static|_next/image|assets|images|logo.png|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
