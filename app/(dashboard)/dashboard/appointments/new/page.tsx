import { createServerClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/booking/booking-form'

export default async function NewAppointmentPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Fetch available appointment types
  const { data: appointmentTypes } = await supabase
    .from('appointment_types')
    .select('*')
    .order('name')

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Book New Appointment</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <BookingForm
          patientId={session?.user.id}
          appointmentTypes={appointmentTypes || []}
          returnPath="../appointments"
        />
      </div>
    </div>
  )
} 