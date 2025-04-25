import { Metadata, Viewport } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/dashboard/logout-button'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Dashboard | Baltzar Tandvård',
  description: 'Your patient dashboard',
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
}

export default async function DashboardPage({ params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  // Server-side auth check
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    // If no session, redirect to login
    redirect(`/${locale}/login`)
  }
  
  // User is authenticated
  const { user } = session
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {locale === 'sv' ? 'Välkommen till din dashboard' : 'Welcome to your dashboard'}
        </h1>
        <LogoutButton locale={locale} variant="outline" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {locale === 'sv' ? 'Din profil' : 'Your Profile'}
          </h2>
          <p className="text-gray-300 mb-4">
            {locale === 'sv' 
              ? 'Se och hantera din patientinformation.' 
              : 'View and manage your patient information.'}
          </p>
          <Link
            href={`/${locale}/dashboard/profile`}
            className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {locale === 'sv' ? 'Gå till profil' : 'Go to profile'}
          </Link>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {locale === 'sv' ? 'Dina bokningar' : 'Your Appointments'}
          </h2>
          <p className="text-gray-300 mb-4">
            {locale === 'sv'
              ? 'Se dina kommande och tidigare bokningar.'
              : 'View your upcoming and past appointments.'}
          </p>
          <Link
            href={`/${locale}/dashboard/appointments`}
            className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {locale === 'sv' ? 'Visa bokningar' : 'View Appointments'}
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>
          {locale === 'sv' 
            ? `Inloggad som: ${user.email}`
            : `Logged in as: ${user.email}`}
        </p>
      </div>
    </div>
  )
} 