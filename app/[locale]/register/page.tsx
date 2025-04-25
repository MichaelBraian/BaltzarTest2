import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = {
  title: 'Register | Baltzar Tandvård',
  description: 'Create your Baltzar Tandvård account',
}

export default async function RegisterPage({
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
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {locale === 'sv' ? 'Skapa konto' : 'Create your account'}
          </h2>
        </div>
        <RegisterForm locale={locale} />
      </div>
    </div>
  )
} 