'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const supabase = createClient()
  // Use a relative URL to avoid build-time URL validation issues
  const authRedirectPath = '/auth/callback'

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="light"
      providers={['google']}
      redirectTo={authRedirectPath}
    />
  )
} 