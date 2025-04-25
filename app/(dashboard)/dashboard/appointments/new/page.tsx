import { createServerClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/booking/booking-form'

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'

export default async function NewAppointmentPage() {
  const supabase = createServerClient()

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    console.error("Error getting session:", sessionError);
    return <div>Error loading page. Please try again later.</div>;
  }

  if (!session) {
    // Redirect handled by middleware, but good to have a fallback state
    return <div>Loading or authentication required...</div>;
  }

  // Fetch available appointment types
  const { data: appointmentTypes, error: typesError } = await supabase
    .from('appointment_types')
    .select('*')
    .order('name')

  if (typesError) {
    console.error("Error fetching appointment types:", typesError);
    // Decide how to handle this - maybe show form without types?
    return <div>Error loading appointment types.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Book New Appointment</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <BookingForm
          patientId={session.user.id}
          appointmentTypes={appointmentTypes || []}
          returnPath="../appointments"
        />
      </div>
    </div>
  )
} 