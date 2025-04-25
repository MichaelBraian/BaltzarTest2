import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import RegistrationForm from './RegistrationForm'

export const metadata: Metadata = {
  title: 'Register | Baltzar Tandvård',
  description: 'Register for a Baltzar Tandvård account',
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RegisterPage({ params, searchParams }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  const resolvedSearchParams = await searchParams
  const email = resolvedSearchParams.email as string || ''
  const verified = resolvedSearchParams.verified === 'true'
  
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
            {locale === 'sv' ? 'Skapa ett konto' : 'Create an account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {locale === 'sv' 
              ? 'Registrera dig för att få tillgång till din patientportal' 
              : 'Register to access your patient portal'}
          </p>
        </div>
        <RegistrationForm locale={locale} prefilledEmail={email} verified={verified} />
      </div>
    </div>
  )
} 