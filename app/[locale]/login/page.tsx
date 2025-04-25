import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Login | Baltzar Tandvård',
  description: 'Log in to your Baltzar Tandvård account',
}

export default async function LoginPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {locale === 'sv' ? 'Logga in' : 'Sign in to your account'}
          </h2>
        </div>
        <LoginForm locale={locale} />
      </div>
    </div>
  )
} 