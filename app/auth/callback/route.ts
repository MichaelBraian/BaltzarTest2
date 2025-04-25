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
  const errorCode = requestUrl.searchParams.get('error_code')
  const errorDescription = requestUrl.searchParams.get('error_description')
  
  // Debug all parameters
  console.log('[Auth Callback] Request parameters:', {
    code,
    error,
    errorCode,
    errorDescription,
    hash: requestUrl.hash,
    fullUrl: request.url
  });
  
  // Get base URL from environment or fallback to current origin
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin
  console.log('[Auth Callback] Using base URL:', baseUrl);

  // Handle error cases from Supabase auth, including expired OTPs
  if (error || errorCode === 'otp_expired') {
    console.log(`[Auth Callback] Received error: ${error}, code: ${errorCode}, description: ${errorDescription}`);
    
    // For expired OTP specifically provide a better message
    const redirectUrl = `${baseUrl}/sv/login?error=${error || 'access_denied'}&error_description=${
      errorCode === 'otp_expired' 
        ? encodeURIComponent('Your magic link has expired. Please request a new one.') 
        : encodeURIComponent(errorDescription || 'Authentication failed')
    }`;
    
    console.log(`[Auth Callback] Redirecting to: ${redirectUrl}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (code) {
    console.log('[Auth Callback] Received auth code, exchanging for session');
    try {
      const supabase = createRouteHandlerClient({ cookies })
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.log('[Auth Callback] Error exchanging code for session:', error);
        // Redirect to login page with error
        const redirectUrl = `${baseUrl}/sv/login?error=auth_exchange_failed&error_description=${encodeURIComponent(error.message)}`;
        console.log(`[Auth Callback] Redirecting to: ${redirectUrl}`);
        return NextResponse.redirect(redirectUrl);
      }

      if (!session) {
        console.log('[Auth Callback] No session received after code exchange');
        const redirectUrl = `${baseUrl}/sv/login?error=no_session`;
        console.log(`[Auth Callback] Redirecting to: ${redirectUrl}`);
        return NextResponse.redirect(redirectUrl);
      }

      console.log('[Auth Callback] Session created successfully for user:', session.user.id);
      
      // Get the user's locale preference or default to 'sv'
      const locale = session.user?.user_metadata?.locale || 'sv'
      console.log(`[Auth Callback] Using locale: ${locale} for redirection`);

      // Redirect to dashboard with the correct locale
      const dashboardUrl = `${baseUrl}/${locale}/dashboard`;
      console.log(`[Auth Callback] Redirecting to: ${dashboardUrl}`);
      return NextResponse.redirect(dashboardUrl);
    } catch (err) {
      console.log('[Auth Callback] Unexpected error processing auth code:', err);
      const redirectUrl = `${baseUrl}/sv/login?error=unexpected_error`;
      console.log(`[Auth Callback] Redirecting to: ${redirectUrl}`);
      return NextResponse.redirect(redirectUrl);
    }
  }

  console.log('[Auth Callback] No auth code found in request, redirecting to login');
  // If no code is present, redirect to login
  const redirectUrl = `${baseUrl}/sv/login`;
  console.log(`[Auth Callback] Redirecting to: ${redirectUrl}`);
  return NextResponse.redirect(redirectUrl);
} 