import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileEditForm from './ProfileEditForm'

export const metadata: Metadata = {
  title: 'Edit Profile | Baltzar Tandvård',
  description: 'Update your patient profile information',
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
}

export default async function EditProfilePage({ params }: Props) {
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
  
  // Fetch user profile data
  try {
    const response = await fetch(`${siteUrl}/api/patients/profile`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      next: { revalidate: 0 } // Don't cache this request
    })

    if (!response.ok) {
      throw new Error('Failed to fetch patient data')
    }

    const patientData = await response.json()
    const patientInfo = patientData?.patient || {}

    // Translations
    const labels = {
      editProfile: locale === 'sv' ? 'Redigera Profil' : 'Edit Profile',
      error: locale === 'sv' 
        ? 'Det gick inte att hämta dina patientuppgifter. Försök igen senare.' 
        : 'Failed to load patient data. Please try again later.'
    }

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">
          {labels.editProfile}
        </h1>
        
        <ProfileEditForm 
          user={user} 
          patientInfo={patientInfo} 
          locale={locale} 
        />
      </div>
    )
  } catch (error) {
    console.error('Error fetching patient data:', error)
    
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">
          {locale === 'sv' ? 'Redigera Profil' : 'Edit Profile'}
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