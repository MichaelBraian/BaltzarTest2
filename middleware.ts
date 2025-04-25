import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from "./lib/i18n-config"

// List of paths to explicitly ignore in the middleware
const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // 1. Skip middleware for public files, API routes, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') || // Match all _next paths
    pathname.includes('.') // More robust check for file extensions
  ) {
    return NextResponse.next(); // Skip middleware processing
  }

  // --- The rest of your existing middleware logic --- 
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // 2. Handle root path redirect to default locale
  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = `/${i18n.defaultLocale}`
    return NextResponse.redirect(url)
  }

  // 3. Handle missing locale prefix
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale
    const url = req.nextUrl.clone()
    url.pathname = `/${locale}${pathname}` 
    return NextResponse.redirect(url)
  }

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
  const isPublicPath = publicPaths.some(path => {
    // Check exact match for root path with locale
    if (path === '/' && i18n.locales.some(locale => pathname === `/${locale}`)) {
      return true
    }
    
    // Check other public paths
    return pathname === path || 
           pathname.startsWith(`${path}/`) ||
           i18n.locales.some(locale => 
             pathname === `/${locale}${path}` || 
             pathname.startsWith(`/${locale}${path}/`)
           )
  })

  // If user is not signed in and the current path is not a public path,
  // redirect the user to /login
  if (!session && !isPublicPath) {
    // Get the current locale from the pathname
    const currentLocale = pathname.split('/')[1]
    const url = req.nextUrl.clone()
    url.pathname = `/${currentLocale}/login`
    return NextResponse.redirect(url)
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
    const url = req.nextUrl.clone()
    url.pathname = `/${currentLocale}/dashboard`
    return NextResponse.redirect(url)
  }

  return res
}

// Use a very broad matcher and rely on the function logic for exclusion
export const config = {
  matcher: [
    /*
     * Match all paths except for static assets directly under /public
     * The function itself handles API, _next, and specific file exclusions.
     */
    '/((?!public/).*)', // Matches everything except paths starting with /public/
  ],
};
