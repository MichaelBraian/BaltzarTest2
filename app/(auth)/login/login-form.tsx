'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const supabase = createClient()
  // Get the site URL from env var or use the Netlify URL as fallback
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baltzartandvardcursor.netlify.app'
  // Construct the full redirect URL
  const redirectUrl = `${siteUrl}/auth/callback`
  
  console.log("[Auth] Redirect URL:", redirectUrl)

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="light"
      providers={['google']}
      redirectTo={redirectUrl}
    />
  )
} 