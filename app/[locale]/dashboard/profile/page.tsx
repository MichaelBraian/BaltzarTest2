import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Bell, Settings, Shield, Calendar } from 'lucide-react'

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

    // Translations
    const translations = {
      backToDashboard: locale === 'sv' ? 'Tillbaka till dashboard' : 'Back to dashboard',
      yourProfile: locale === 'sv' ? 'Din Profil' : 'Your Profile',
      personalInfo: locale === 'sv' ? 'Personlig Information' : 'Personal Information',
      email: locale === 'sv' ? 'E-post' : 'Email',
      name: locale === 'sv' ? 'Namn' : 'Name',
      phone: locale === 'sv' ? 'Telefon' : 'Phone',
      dentalInfo: locale === 'sv' ? 'Tandvårdsinformation' : 'Dental Care Information',
      nextAppointment: locale === 'sv' ? 'Nästa besök' : 'Next Appointment',
      noUpcomingAppointments: locale === 'sv' ? 'Inga kommande besök' : 'No upcoming appointments',
      lastVisit: locale === 'sv' ? 'Senaste besök' : 'Last Visit',
      noPreviousVisits: locale === 'sv' ? 'Inga tidigare besök' : 'No previous visits',
      preferences: locale === 'sv' ? 'Preferenser' : 'Preferences',
      communications: locale === 'sv' ? 'Kommunikation' : 'Communications',
      allowEmailNotifications: locale === 'sv' ? 'Tillåt e-postnotifieringar' : 'Allow email notifications',
      allowSmsNotifications: locale === 'sv' ? 'Tillåt SMS-notifieringar' : 'Allow SMS notifications',
      language: locale === 'sv' ? 'Språk' : 'Language',
      editProfile: locale === 'sv' ? 'Redigera profil' : 'Edit Profile',
      dataPrivacy: locale === 'sv' ? 'Dataskydd & Integritet' : 'Data Privacy',
      upcomingAppointments: locale === 'sv' ? 'Kommande besök' : 'Upcoming Appointments',
      scheduleAppointment: locale === 'sv' ? 'Boka tid' : 'Schedule Appointment',
      comingSoon: locale === 'sv' ? 'Kommer snart' : 'Coming soon',
    }

    return (
      <div className="space-y-8">
        {/* Back button */}
        <div>
          <Link 
            href={`/${locale}/dashboard`} 
            className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {translations.backToDashboard}
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold text-white">
            {translations.yourProfile}
          </h1>
          <div className="mt-4 md:mt-0">
            <Link 
              href={`/${locale}/dashboard/profile/edit`} 
              className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {translations.editProfile}
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Personal Info Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-orange-500 mr-2" />
              <h2 className="text-xl font-semibold text-white">
                {translations.personalInfo}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {translations.email}
                </label>
                <p className="mt-1 text-white">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {translations.name}
                </label>
                <p className="mt-1 text-white">{patientInfo.name || user.user_metadata?.full_name || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {translations.phone}
                </label>
                <p className="mt-1 text-white">{patientInfo.phone || user.phone || '-'}</p>
              </div>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-orange-500 mr-2" />
              <h2 className="text-xl font-semibold text-white">
                {translations.upcomingAppointments}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {translations.nextAppointment}
                </label>
                <p className="mt-1 text-white">
                  {patientInfo.nextAppointment || translations.noUpcomingAppointments}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {translations.lastVisit}
                </label>
                <p className="mt-1 text-white">
                  {patientInfo.lastVisit || translations.noPreviousVisits}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="text-yellow-500 text-sm flex items-center">
                  <span className="mr-2">{translations.scheduleAppointment}:</span>
                  <span className="text-xs">{translations.comingSoon}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences & Notifications Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <div className="flex items-center mb-4">
              <Settings className="h-5 w-5 text-orange-500 mr-2" />
              <h2 className="text-xl font-semibold text-white">
                {translations.preferences}
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {translations.language}
                </label>
                <div className="mt-1 flex space-x-2">
                  <Link 
                    href={`/sv/dashboard/profile`} 
                    className={`px-3 py-1 rounded-md text-sm ${locale === 'sv' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                    Svenska
                  </Link>
                  <Link 
                    href={`/en/dashboard/profile`} 
                    className={`px-3 py-1 rounded-md text-sm ${locale === 'en' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  >
                    English
                  </Link>
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-gray-700">
                <div className="flex items-center mb-4">
                  <Bell className="h-4 w-4 text-orange-500 mr-2" />
                  <h3 className="text-md font-medium text-white">
                    {translations.communications}
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{translations.allowEmailNotifications}</span>
                    <div className="h-4 w-8 bg-orange-500 rounded-full relative">
                      <div className="absolute right-0 top-0 bg-white rounded-full h-4 w-4 shadow"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">{translations.allowSmsNotifications}</span>
                    <div className="h-4 w-8 bg-gray-600 rounded-full relative">
                      <div className="absolute left-0 top-0 bg-white rounded-full h-4 w-4 shadow"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-gray-700">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-orange-500 mr-2" />
                  <Link href={`/${locale}/privacy-policy`} className="text-sm text-gray-300 hover:text-white">
                    {translations.dataPrivacy}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching patient data:', error)
    return (
      <div>
        <Link 
          href={`/${locale}/dashboard`} 
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {locale === 'sv' ? 'Tillbaka till dashboard' : 'Back to dashboard'}
        </Link>

        <h1 className="text-3xl font-bold my-8 text-white">
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