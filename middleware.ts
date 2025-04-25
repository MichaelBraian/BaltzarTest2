import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from "./lib/i18n-config"

// Paths that should bypass middleware
const BYPASS_PATHS = [
  '/api/',             // API routes
  '/_next',            // Next.js internals
  '/auth/callback',    // Auth callback
  '/favicon.ico',      // Favicon
  '/robots.txt',       // Robots.txt
  '/sitemap.xml',      // Sitemap
  '/public/'           // Public files
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Check if the current path should bypass middleware
  const shouldBypass = BYPASS_PATHS.some(path => 
    pathname.startsWith(path) || pathname.includes('.')
  )
  
  if (shouldBypass) {
    console.log(`[Middleware] Bypassing middleware for path: ${pathname}`)
    return NextResponse.next()
  }

  // Initialize the Supabase client
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  // Handle root path redirect to default locale
  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = `/${i18n.defaultLocale}`
    return NextResponse.redirect(url)
  }

  // Handle missing locale prefix
  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
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

// Use a matcher that applies middleware to all routes except specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - static files, images, etc
     * - api routes
     * - auth callback paths
     */
    '/((?!_next/static|_next/image|api/|auth/callback|favicon.ico).+)',
  ],
};
