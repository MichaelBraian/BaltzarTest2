import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Change to dynamic route handling
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      // Redirect to login page with error
      return NextResponse.redirect(
        new URL('/login?error=auth_callback_failed', request.url)
      )
    }

    // Get the user's locale preference or default to 'sv'
    const locale = session?.user?.user_metadata?.locale || 'sv'

    // Redirect to dashboard with the correct locale
    return NextResponse.redirect(
      new URL(`/${locale}/dashboard`, request.url)
    )
  }

  // If no code is present, redirect to login
  return NextResponse.redirect(
    new URL('/login', request.url)
  )
} 