'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const supabase = createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baltzartandvardcursor.netlify.app'

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="light"
      providers={['google']}
      redirectTo={`${siteUrl}/auth/callback`}
    />
  )
} 