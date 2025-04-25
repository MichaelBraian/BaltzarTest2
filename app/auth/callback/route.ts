import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Force dynamic route handling to ensure this always runs at request time
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  console.log('[Auth Callback] Processing callback request:', request.url);
  
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  // Get base URL from environment or fallback to current origin
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  // Handle error cases from Supabase auth
  if (error) {
    console.log(`[Auth Callback] Received error: ${error}, description: ${errorDescription}`);
    // Redirect to login page with error
    return NextResponse.redirect(
      `${baseUrl}/sv/login?error=${error}&error_description=${encodeURIComponent(errorDescription || '')}`
    )
  }

  if (code) {
    console.log('[Auth Callback] Received auth code, exchanging for session');
    try {
      const supabase = createRouteHandlerClient({ cookies })
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.log('[Auth Callback] Error exchanging code for session:', error);
        // Redirect to login page with error
        return NextResponse.redirect(
          `${baseUrl}/sv/login?error=auth_exchange_failed&error_description=${encodeURIComponent(error.message)}`
        )
      }

      if (!session) {
        console.log('[Auth Callback] No session received after code exchange');
        return NextResponse.redirect(
          `${baseUrl}/sv/login?error=no_session`
        )
      }

      console.log('[Auth Callback] Session created successfully for user:', session.user.id);
      
      // Get the user's locale preference or default to 'sv'
      const locale = session.user?.user_metadata?.locale || 'sv'
      console.log(`[Auth Callback] Using locale: ${locale} for redirection`);

      // Redirect to dashboard with the correct locale
      const dashboardUrl = `${baseUrl}/${locale}/dashboard`;
      console.log(`[Auth Callback] Redirecting to: ${dashboardUrl}`);
      return NextResponse.redirect(dashboardUrl)
    } catch (err) {
      console.log('[Auth Callback] Unexpected error processing auth code:', err);
      return NextResponse.redirect(
        `${baseUrl}/sv/login?error=unexpected_error`
      )
    }
  }

  console.log('[Auth Callback] No auth code found in request, redirecting to login');
  // If no code is present, redirect to login
  return NextResponse.redirect(
    `${baseUrl}/sv/login`
  )
} 