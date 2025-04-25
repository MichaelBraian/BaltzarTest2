import { Metadata, Viewport } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Patient Profile | Baltzar Tandvård',
  description: 'View and manage your patient profile',
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
}

export default async function PatientProfilePage({ params }: Props) {
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  try {
    const response = await fetch(`${siteUrl}/api/patients/profile`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      next: { revalidate: 60 } // Revalidate every minute
    })

    if (!response.ok) {
      throw new Error('Failed to fetch patient data')
    }

    const patientData = await response.json()
    const patientInfo = patientData?.patient || {}

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">
          {locale === 'sv' ? 'Din Profil' : 'Your Profile'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {locale === 'sv' ? 'Personlig Information' : 'Personal Information'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {locale === 'sv' ? 'E-post' : 'Email'}
                </label>
                <p className="mt-1 text-white">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {locale === 'sv' ? 'Namn' : 'Name'}
                </label>
                <p className="mt-1 text-white">{patientInfo.name || user.user_metadata?.full_name || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {locale === 'sv' ? 'Telefon' : 'Phone'}
                </label>
                <p className="mt-1 text-white">{patientInfo.phone || user.phone || '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">
              {locale === 'sv' ? 'Tandvårdsinformation' : 'Dental Care Information'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {locale === 'sv' ? 'Nästa besök' : 'Next Appointment'}
                </label>
                <p className="mt-1 text-white">
                  {patientInfo.nextAppointment || 
                    (locale === 'sv' ? 'Inga kommande besök' : 'No upcoming appointments')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {locale === 'sv' ? 'Senaste besök' : 'Last Visit'}
                </label>
                <p className="mt-1 text-white">
                  {patientInfo.lastVisit || 
                    (locale === 'sv' ? 'Inga tidigare besök' : 'No previous visits')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching patient data:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">
          {locale === 'sv' ? 'Din Profil' : 'Your Profile'}
        </h1>
        <div className="bg-red-900/30 border border-red-700 p-6 rounded-lg">
          <p className="text-red-400">
            {locale === 'sv' 
              ? 'Det gick inte att hämta dina patientuppgifter. Försök igen senare.' 
              : 'Failed to load patient data. Please try again later.'}
          </p>
        </div>
      </div>
    )
  }
} 