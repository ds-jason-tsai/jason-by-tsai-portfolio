import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['zh', 'en', 'ja'];
const defaultLocale = 'zh';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Simple locale detection based on accept-language header
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

    // e.g. incoming is /products
    // The new URL is now /zh/products
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    '/((?!api|_next/static|_next/image|assets|images|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
