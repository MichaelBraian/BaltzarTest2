import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Bell, Settings, Shield, Calendar, ArrowRight } from 'lucide-react'
import { muntraService } from '@/lib/api/services/muntraService'

export const metadata: Metadata = {
  title: 'Patient Profile | Baltzar Tandvård',
  description: 'View and manage your patient profile',
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
}

interface DebugInfo {
  verificationResult: {
    exists: boolean;
    patientId?: string;
    hasPatient: boolean;
  } | null;
  muntraPatientData: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  } | null;
  mergedData: {
    finalAddress: string;
    finalPostalCode: string;
    finalCity: string;
    finalCountry: string;
    muntraAddress?: string;
    muntraPostalCode?: string;
    supabaseAddress: string;
    supabasePostalCode: string;
  } | null;
  errors: Array<{
    message: string;
    error: string;
  }>;
}

function DebugPanel({ debug }: { debug: DebugInfo }) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg text-xs">
      <h3 className="text-white font-bold mb-4">Debug Information</h3>
      <pre className="text-green-400 whitespace-pre-wrap">
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  );
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
  
  // Translations
  const translations = {
    backToDashboard: locale === 'sv' ? 'Tillbaka till dashboard' : 'Back to dashboard',
    yourProfile: locale === 'sv' ? 'Din Profil' : 'Your Profile',
    personalInfo: locale === 'sv' ? 'Personlig Information' : 'Personal Information',
    email: locale === 'sv' ? 'E-post' : 'Email',
    name: locale === 'sv' ? 'Namn' : 'Name',
    phone: locale === 'sv' ? 'Telefon' : 'Phone',
    address: locale === 'sv' ? 'Adress' : 'Address',
    postalCode: locale === 'sv' ? 'Postnummer' : 'Postal Code',
    city: locale === 'sv' ? 'Stad' : 'City',
    country: locale === 'sv' ? 'Land' : 'Country',
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
    errorTitle: locale === 'sv' ? 'Ett fel uppstod' : 'An error occurred',
    errorLoadingProfile: locale === 'sv' 
      ? 'Det gick inte att hämta dina patientuppgifter. Försök igen senare.' 
      : 'Failed to load patient data. Please try again later.',
    refreshButton: locale === 'sv' ? 'Uppdatera sidan' : 'Refresh Page',
    tryAgain: locale === 'sv' ? 'Försök igen' : 'Try Again',
    appointmentDate: locale === 'sv' ? 'Datum' : 'Date',
    appointmentTime: locale === 'sv' ? 'Tid' : 'Time',
    appointmentClinic: locale === 'sv' ? 'Klinik' : 'Clinic',
    appointmentClinician: locale === 'sv' ? 'Tandläkare' : 'Clinician',
    appointmentType: locale === 'sv' ? 'Typ' : 'Type',
    appointmentStatus: locale === 'sv' ? 'Status' : 'Status',
    allAppointments: locale === 'sv' ? 'Alla besök' : 'All Appointments',
  }
  
  // Always provide basic profile data first from metadata
  const userData = user.user_metadata || {}
  
  let patientInfo: any = {
    name: userData.full_name || user.email?.split('@')[0] || '',
    email: user.email || '',
    phone: userData.phone || '-',
    address: userData.address || '-',
    postalCode: userData.postal_code || '-',
    city: userData.city || '-',
    country: userData.country || '-',
    // Add other fields from user metadata as needed
  }
  
  let hasError = false
  let errorMessage = '';
  let appointments: any[] = [];
  
  try {
    // Try to get patient data from Muntra
    // Try to get patient info directly from Muntra service
    // First verify if the patient exists in Muntra
    const userEmail = user.email
    
    if (userEmail) {
      try {
        // First try using the API endpoint which has the enhanced appointment fetching
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const response = await fetch(`${siteUrl}/api/patients/profile`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          },
          next: { revalidate: 0 } // Don't cache this request
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.patient) {
            // Add visible debug section at the top level
            const debugInfo = {
              apiResponse: data,
              patientData: data.patient,
              debug: data.debug
            };
            
            // Log to browser console
            console.log('=== CLIENT DEBUG INFO ===');
            console.log('API Response:', debugInfo);
            
            // Update patient info with data from API
            patientInfo = {
              ...patientInfo,
              ...data.patient,
              _debug: debugInfo // Store debug info
            }
            
            // Extract appointments
            if (data.patient.appointments && data.patient.appointments.length > 0) {
              appointments = [...data.patient.appointments]
            }
          }
        } else {
          const errorText = await response.text();
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
        }
        
        // If no appointments were loaded from the API, try direct method
        if (!appointments || appointments.length === 0) {
          console.log('No appointments from API, trying appointments endpoint');
          
          // Try the dedicated appointments endpoint
          try {
            const appointmentsResponse = await fetch(`${siteUrl}/api/patients/appointments`, {
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              },
              next: { revalidate: 0 } // Don't cache this request
            });
            
            if (appointmentsResponse.ok) {
              const appointmentsData = await appointmentsResponse.json();
              if (appointmentsData.success && appointmentsData.appointments && appointmentsData.appointments.length > 0) {
                console.log(`Loaded ${appointmentsData.appointments.length} appointments from dedicated endpoint`);
                appointments = [...appointmentsData.appointments];
              } else {
                console.log('No appointments from dedicated endpoint, trying direct Muntra service call');
              }
            } else {
              console.log('Appointments endpoint failed with status:', appointmentsResponse.status);
            }
          } catch (appointmentsErr) {
            console.error('Error fetching from appointments endpoint:', appointmentsErr);
          }
          
          // If still no appointments, try the Muntra service directly
          if (!appointments || appointments.length === 0) {
            console.log('Trying direct Muntra service call for appointments');
            const verificationResult = await muntraService.verifyPatient(userEmail)
        
        if (verificationResult.exists && verificationResult.patient) {
          // Use the patient data from the verification result
          patientInfo = {
            ...patientInfo,
            ...verificationResult.patient,
          }
          
          // Get appointments if not included in verification result
          if (!patientInfo.appointments || patientInfo.appointments.length === 0) {
            try {
                  console.log('Fetching appointments directly from Muntra service')
              const patientAppointments = await muntraService.getPatientAppointments(verificationResult.patientId || '')
                  console.log(`Fetched ${patientAppointments.length} appointments directly from Muntra`)
                  
              if (patientAppointments && patientAppointments.length > 0) {
                    appointments = patientAppointments
              }
            } catch (err) {
              console.error('Failed to fetch appointments:', err)
            }
              } else if (patientInfo.appointments && patientInfo.appointments.length > 0) {
                appointments = [...patientInfo.appointments]
                console.log(`Using ${appointments.length} appointments from verification result`)
          }
        } else {
          // No Muntra record, falling back to mock data
          patientInfo = {
            ...patientInfo,
            lastVisit: '2023-01-15',
            nextAppointment: '2023-08-20 at 14:30',
            dentist: 'Dr. Sara Lindberg',
            clinic: 'Baltzar Tandvård',
            status: 'Regular Patient',
            insurance: 'Folktandvården Insurance'
          }
            }
          }
        }
        
        // Sort appointments by date
        if (appointments && appointments.length > 0) {
          console.log('Sorting appointments...')
          appointments = [...appointments].sort((a, b) => {
            try {
              const dateA = new Date(`${a.date} ${a.time}`)
              const dateB = new Date(`${b.date} ${b.time}`)
              return dateA.getTime() - dateB.getTime()
            } catch (e) {
              console.error('Error sorting appointments:', e)
              return 0
            }
          })
          console.log(`Sorted ${appointments.length} appointments`)
          
          // Debug log the first appointment
          if (appointments.length > 0) {
            console.log('First appointment:', JSON.stringify(appointments[0]))
          }
        } else {
          console.log('No appointments to sort')
        }
      } catch (error) {
        console.error('Error accessing Muntra service:', error)
        // Fallback to mock data on error
        patientInfo = {
          ...patientInfo,
          lastVisit: '2023-01-15',
          nextAppointment: '2023-08-20 at 14:30',
          dentist: 'Dr. Sara Lindberg',
          clinic: 'Baltzar Tandvård',
          status: 'Regular Patient',
          insurance: 'Folktandvården Insurance'
        }
      }
    }
  } catch (error) {
    console.error('Profile page: Error fetching patient data:', error)
    hasError = true
    errorMessage = error instanceof Error ? error.message : translations.errorLoadingProfile
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
      
      {hasError && (
        <div className="bg-red-900/30 border border-red-700 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-red-400 mb-2">{translations.errorTitle}</h3>
          <p className="text-red-400 mb-4">{translations.errorLoadingProfile}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          >
            {translations.refreshButton}
          </button>
        </div>
      )}
      
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
              <p className="mt-1 text-white">{patientInfo.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                {translations.name}
              </label>
              <p className="mt-1 text-white">{patientInfo.name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                {translations.phone}
              </label>
              <p className="mt-1 text-white">{patientInfo.phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                {translations.address}
              </label>
              <p className="mt-1 text-white">{patientInfo.address || '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {translations.postalCode}
                </label>
                <p className="mt-1 text-white">{patientInfo.postalCode || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {translations.city}
                </label>
                <p className="mt-1 text-white">{patientInfo.city || '-'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">
                {translations.country}
              </label>
              <p className="mt-1 text-white">{patientInfo.country || '-'}</p>
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
          
          {appointments && appointments.length > 0 ? (
            <div className="space-y-4">
              {/* Next upcoming appointment */}
              {appointments.find(a => new Date(`${a.date} ${a.time}`) > new Date()) && (
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    {translations.nextAppointment}
                  </label>
                  {(() => {
                    const next = appointments.find(a => new Date(`${a.date} ${a.time}`) > new Date());
                    return next ? (
                      <div className="mt-2 p-3 bg-gray-700 rounded-md">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-300">{translations.appointmentDate}:</span>
                          <span className="text-sm text-white">{next.date}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-300">{translations.appointmentTime}:</span>
                          <span className="text-sm text-white">{next.time}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-300">{translations.appointmentClinic}:</span>
                          <span className="text-sm text-white">{next.clinicName}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-300">{translations.appointmentClinician}:</span>
                          <span className="text-sm text-white">{next.clinicianName}</span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
              
              {/* Last visit */}
              {appointments.find(a => new Date(`${a.date} ${a.time}`) < new Date()) && (
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    {translations.lastVisit}
                  </label>
                  {(() => {
                    // Find the most recent past appointment
                    const past = [...appointments]
                      .filter(a => new Date(`${a.date} ${a.time}`) < new Date())
                      .sort((a, b) => {
                        const dateA = new Date(`${a.date} ${a.time}`);
                        const dateB = new Date(`${b.date} ${b.time}`);
                        return dateB.getTime() - dateA.getTime(); // Sort in descending order
                      })[0];
                      
                    return past ? (
                      <div className="mt-2 p-3 bg-gray-700 rounded-md">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-300">{translations.appointmentDate}:</span>
                          <span className="text-sm text-white">{past.date}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-300">{translations.appointmentTime}:</span>
                          <span className="text-sm text-white">{past.time}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-300">{translations.appointmentClinic}:</span>
                          <span className="text-sm text-white">{past.clinicName}</span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
              
              {/* Link to all appointments */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <Link 
                  href={`/${locale}/dashboard/appointments`} 
                  className="text-orange-500 hover:text-orange-400 text-sm flex items-center"
                >
                  <span>{translations.allAppointments}</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
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
          )}
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

      {/* Debug section - always visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-orange-500/30">
          <h3 className="text-orange-500 font-bold mb-4">Debug Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-semibold mb-2">Raw Patient Data</h4>
              <pre className="text-xs text-green-400 bg-black/30 p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(patientInfo, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Debug Data</h4>
              <pre className="text-xs text-green-400 bg-black/30 p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(patientInfo._debug, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 