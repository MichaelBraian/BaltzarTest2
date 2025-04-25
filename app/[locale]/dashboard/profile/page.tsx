import { Metadata, Viewport } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Patient Profile | Baltzar Tandvård',
  description: 'View and manage your patient profile',
}

export default async function PatientProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return null // Will be redirected by middleware
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  try {
    const response = await fetch(`${siteUrl}/api/patients`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch patient data')
    }

    const patientData = await response.json()

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Patient Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <p className="mt-1">{patientData.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Social Security Number</label>
                <p className="mt-1">{patientData.socialSecurityNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1">{patientData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone</label>
                <p className="mt-1">{patientData.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Address</label>
                <p className="mt-1">{patientData.address}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Dental Care Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Next Appointment</label>
                <p className="mt-1">{patientData.nextAppointment || 'No upcoming appointments'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Last Visit</label>
                <p className="mt-1">{patientData.lastVisit || 'No previous visits'}</p>
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
        <h1 className="text-3xl font-bold mb-8">Patient Profile</h1>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">Failed to load patient data. Please try again later.</p>
        </div>
      </div>
    )
  }
} 