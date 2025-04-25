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

  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => 
    req.nextUrl.pathname === path || 
    req.nextUrl.pathname.startsWith(`${path}/`)
  )

  // If user is not signed in and the current path is not a public path,
  // redirect the user to /login
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If user is signed in and the current path is /login or /register,
  // redirect the user to /dashboard
  if (session && ['/login', '/register'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

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
