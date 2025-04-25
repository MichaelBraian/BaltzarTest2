import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from "./lib/i18n-config"

// List of paths to explicitly ignore in the middleware
const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // 1. Check if the path is for a public file (asset) or API route
  // Skip middleware processing for these paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') || // _next/static, _next/image, etc.
    PUBLIC_FILE.test(pathname) || // Matches files with extensions (e.g., .ico, .png)
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next() // Let the request proceed without modification
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
    url.pathname = `/${locale}${pathname}` // Simplification: pathname already includes leading /
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

// Update matcher to be simpler - let the function logic handle exclusions
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * --- Let the function handle these exclusions explicitly ---
     */
    '/((?!_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ],
}
