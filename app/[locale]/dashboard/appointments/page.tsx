import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, User, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Your Appointments | Baltzar Tandvård',
  description: 'View and manage your dental appointments',
}

// Define appointment type
interface Appointment {
  id: string
  date: string
  time: string
  type: string
  dentist: string
  location: string
  duration: number
  notes?: string
  status?: 'scheduled' | 'completed' | 'cancelled'
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
}

// Mock appointments data - would be from API in real implementation
const mockAppointments = {
  upcoming: [
    {
      id: '1',
      date: '2023-07-15',
      time: '14:30',
      type: 'Regular Check-up',
      dentist: 'Dr. Sara Lindberg',
      location: 'Baltzar Tandvård, Floor 3, Room 302',
      duration: 30
    }
  ],
  past: [
    {
      id: '2',
      date: '2023-01-10',
      time: '09:15',
      type: 'Root Canal Treatment',
      dentist: 'Dr. Erik Johansson',
      location: 'Baltzar Tandvård, Floor 2, Room 204',
      duration: 60
    },
    {
      id: '3',
      date: '2022-11-22',
      time: '11:00',
      type: 'Regular Check-up',
      dentist: 'Dr. Sara Lindberg',
      location: 'Baltzar Tandvård, Floor 3, Room 302',
      duration: 30
    }
  ]
}

// Swedish translation of appointment types
const appointmentTypeTranslations = {
  'Regular Check-up': 'Ordinarie kontroll',
  'Root Canal Treatment': 'Rotbehandling',
  'Dental Cleaning': 'Tandrengöring',
  'Filling': 'Lagning',
  'Extraction': 'Extraktion',
  'Consultation': 'Konsultation'
}

export default async function AppointmentsPage({ params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  // Server-side auth check
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    // If no session, redirect to login
    redirect(`/${locale}/login`)
  }
  
  // Fetch appointments from API
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  let appointmentsData: { upcoming: Appointment[], past: Appointment[] } = { upcoming: [], past: [] };
  let apiMessage = '';
  
  try {
    const response = await fetch(`${siteUrl}/api/appointments`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      next: { revalidate: 60 } // Revalidate every minute
    });

    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }

    const data = await response.json();
    appointmentsData = data.appointments;
    apiMessage = data.message;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    // Will use the default empty arrays if fetch fails
  }
  
  // Translations
  const t = {
    backToDashboard: locale === 'sv' ? 'Tillbaka till dashboard' : 'Back to dashboard',
    yourAppointments: locale === 'sv' ? 'Dina bokningar' : 'Your Appointments',
    upcoming: locale === 'sv' ? 'Kommande besök' : 'Upcoming Appointments',
    past: locale === 'sv' ? 'Tidigare besök' : 'Past Appointments',
    noUpcoming: locale === 'sv' ? 'Du har inga kommande bokningar' : 'You have no upcoming appointments',
    noPast: locale === 'sv' ? 'Du har inga tidigare bokningar' : 'You have no past appointments',
    book: locale === 'sv' ? 'Boka nytt besök' : 'Book New Appointment',
    date: locale === 'sv' ? 'Datum' : 'Date',
    time: locale === 'sv' ? 'Tid' : 'Time',
    type: locale === 'sv' ? 'Typ' : 'Type',
    dentist: locale === 'sv' ? 'Tandläkare' : 'Dentist',
    location: locale === 'sv' ? 'Plats' : 'Location',
    duration: locale === 'sv' ? 'Varaktighet' : 'Duration',
    minutes: locale === 'sv' ? 'minuter' : 'minutes',
    reschedule: locale === 'sv' ? 'Boka om' : 'Reschedule',
    cancel: locale === 'sv' ? 'Avboka' : 'Cancel',
    comingSoon: locale === 'sv' ? 'Kommer snart' : 'Coming Soon',
  }
  
  // Function to translate appointment type
  const translateAppointmentType = (type: string) => {
    if (locale === 'sv') {
      return appointmentTypeTranslations[type as keyof typeof appointmentTypeTranslations] || type
    }
    return type
  }

  // Format date based on locale
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat(locale === 'sv' ? 'sv-SE' : 'en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date)
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
          {t.backToDashboard}
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold text-white">
          {t.yourAppointments}
        </h1>
        <div className="mt-4 md:mt-0">
          <div className="text-yellow-500 text-sm flex items-center">
            <span className="mr-2">{t.book}:</span>
            <span className="text-xs">{t.comingSoon}</span>
          </div>
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-orange-500" />
          {t.upcoming}
        </h2>
        
        {appointmentsData.upcoming.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <p className="text-gray-400">{t.noUpcoming}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointmentsData.upcoming.map(appointment => (
              <div key={appointment.id} className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">
                      {translateAppointmentType(appointment.type)}
                    </h3>
                    <div className="space-y-2">
                      <p className="flex items-center text-gray-300">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        {formatDate(appointment.date)}
                      </p>
                      <p className="flex items-center text-gray-300">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        {appointment.time} ({appointment.duration} {t.minutes})
                      </p>
                      <p className="flex items-center text-gray-300">
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                        {appointment.dentist}
                      </p>
                      <p className="flex items-center text-gray-300">
                        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                        {appointment.location}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 space-y-2 flex md:flex-col gap-2 md:gap-0">
                    <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 inline-flex items-center">
                      {t.reschedule}
                    </button>
                    <button className="px-3 py-1 bg-red-900/40 text-red-300 rounded text-sm hover:bg-red-900/60 inline-flex items-center">
                      {t.cancel}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Past Appointments */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-orange-500" />
          {t.past}
        </h2>
        
        {appointmentsData.past.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
            <p className="text-gray-400">{t.noPast}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointmentsData.past.map(appointment => (
              <div key={appointment.id} className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
                <div className="opacity-75">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {translateAppointmentType(appointment.type)}
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-300">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      {formatDate(appointment.date)}
                    </p>
                    <p className="flex items-center text-gray-300">
                      <Clock className="mr-2 h-4 w-4 text-gray-500" />
                      {appointment.time} ({appointment.duration} {t.minutes})
                    </p>
                    <p className="flex items-center text-gray-300">
                      <User className="mr-2 h-4 w-4 text-gray-500" />
                      {appointment.dentist}
                    </p>
                    <p className="flex items-center text-gray-300">
                      <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                      {appointment.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* API Note */}
      {apiMessage && (
        <div className="mt-8 p-4 border border-yellow-500/30 bg-yellow-900/10 rounded-md">
          <p className="text-sm text-yellow-200">
            <span className="font-medium">Note:</span> {apiMessage}
          </p>
        </div>
      )}
    </div>
  )
} 