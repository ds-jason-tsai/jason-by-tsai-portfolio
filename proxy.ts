import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['zh', 'en', 'ja']
const defaultLocale = 'zh'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request) ?? defaultLocale
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return 'zh'
  if (acceptLanguage.includes('zh')) return 'zh'
  if (acceptLanguage.includes('ja')) return 'ja'
  if (acceptLanguage.includes('en')) return 'en'
  return 'zh'
}

export const config = {
  matcher: [
    // Skip internal paths, api, and static files
    '/((?!api|_next/static|_next/image|favicon.ico|profile.jpg|.*\\..*).*)',
  ],
}
