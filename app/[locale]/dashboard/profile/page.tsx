import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Patient Profile | Baltzar Tandvård',
  description: 'View and manage your patient profile',
}

export default async function PatientProfilePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${locale}/login`)
  }

  // Fetch patient data from our API
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/patients`, {
    headers: {
      'Cookie': cookies().toString(),
    },
  })

  if (!response.ok) {
    // Handle error
    console.error('Failed to fetch patient data')
    // For now, we'll use mock data if the API call fails
    const patientData = {
      name: 'John Doe',
      socialSecurityNumber: '19810811-1496',
      email: session.user.email,
      phone: '+46 70 123 45 67',
      address: 'Example Street 123, 12345 Stockholm',
      nextAppointment: '2023-05-15 10:00',
      lastVisit: '2023-01-10',
    }
    
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {locale === 'sv' ? 'Min Profil' : 'My Profile'}
          </h1>
          
          <div className="bg-red-900/50 p-4 rounded-lg mb-8">
            <p className="text-red-200">
              {locale === 'sv' 
                ? 'Kunde inte hämta patientdata. Visar exempeldata istället.' 
                : 'Could not fetch patient data. Showing example data instead.'}
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {locale === 'sv' ? 'Personlig Information' : 'Personal Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">
                  {locale === 'sv' ? 'Namn' : 'Name'}
                </p>
                <p className="font-medium">{patientData.name}</p>
              </div>
              <div>
                <p className="text-gray-400">
                  {locale === 'sv' ? 'Personnummer' : 'Social Security Number'}
                </p>
                <p className="font-medium">{patientData.socialSecurityNumber}</p>
              </div>
              <div>
                <p className="text-gray-400">
                  {locale === 'sv' ? 'E-post' : 'Email'}
                </p>
                <p className="font-medium">{patientData.email}</p>
              </div>
              <div>
                <p className="text-gray-400">
                  {locale === 'sv' ? 'Telefon' : 'Phone'}
                </p>
                <p className="font-medium">{patientData.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400">
                  {locale === 'sv' ? 'Adress' : 'Address'}
                </p>
                <p className="font-medium">{patientData.address}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {locale === 'sv' ? 'Tandvårdsinformation' : 'Dental Care Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">
                  {locale === 'sv' ? 'Nästa Besök' : 'Next Appointment'}
                </p>
                <p className="font-medium">{patientData.nextAppointment}</p>
              </div>
              <div>
                <p className="text-gray-400">
                  {locale === 'sv' ? 'Senaste Besök' : 'Last Visit'}
                </p>
                <p className="font-medium">{patientData.lastVisit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const patientData = await response.json()

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {locale === 'sv' ? 'Min Profil' : 'My Profile'}
        </h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'sv' ? 'Personlig Information' : 'Personal Information'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">
                {locale === 'sv' ? 'Namn' : 'Name'}
              </p>
              <p className="font-medium">{patientData.name}</p>
            </div>
            <div>
              <p className="text-gray-400">
                {locale === 'sv' ? 'Personnummer' : 'Social Security Number'}
              </p>
              <p className="font-medium">{patientData.socialSecurityNumber}</p>
            </div>
            <div>
              <p className="text-gray-400">
                {locale === 'sv' ? 'E-post' : 'Email'}
              </p>
              <p className="font-medium">{patientData.email}</p>
            </div>
            <div>
              <p className="text-gray-400">
                {locale === 'sv' ? 'Telefon' : 'Phone'}
              </p>
              <p className="font-medium">{patientData.phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400">
                {locale === 'sv' ? 'Adress' : 'Address'}
              </p>
              <p className="font-medium">{patientData.address}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {locale === 'sv' ? 'Tandvårdsinformation' : 'Dental Care Information'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">
                {locale === 'sv' ? 'Nästa Besök' : 'Next Appointment'}
              </p>
              <p className="font-medium">{patientData.nextAppointment}</p>
            </div>
            <div>
              <p className="text-gray-400">
                {locale === 'sv' ? 'Senaste Besök' : 'Last Visit'}
              </p>
              <p className="font-medium">{patientData.lastVisit}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 