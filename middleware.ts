import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from "./lib/i18n-config"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define public paths that don't require authentication
  const publicPaths = [
    '/', 
    '/login', 
    '/register', 
    '/auth/callback',
    '/about',
    '/services',
    '/contact',
    '/privacy-policy',
    '/terms-of-service'
  ]

  const pathname = req.nextUrl.pathname
  
  // Check if the pathname is missing a locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // If it's missing a locale, redirect to the default locale
  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale

    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`, req.url),
    )
  }

  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => 
    pathname === path || 
    pathname.startsWith(`${path}/`) ||
    // Also check for localized paths
    i18n.locales.some(locale => 
      pathname === `/${locale}${path}` || 
      pathname.startsWith(`/${locale}${path}/`)
    )
  )

  // If user is not signed in and the current path is not a public path,
  // redirect the user to /login
  if (!session && !isPublicPath) {
    // Get the current locale from the pathname
    const currentLocale = pathname.split('/')[1]
    return NextResponse.redirect(new URL(`/${currentLocale}/login`, req.url))
  }

  // If user is signed in and the current path is /login or /register,
  // redirect the user to /dashboard
  if (session && (
    pathname.endsWith('/login') || 
    pathname.endsWith('/register') ||
    i18n.locales.some(locale => 
      pathname === `/${locale}/login` || 
      pathname === `/${locale}/register`
    )
  )) {
    // Get the current locale from the pathname
    const currentLocale = pathname.split('/')[1]
    return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, req.url))
  }

  return res
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
