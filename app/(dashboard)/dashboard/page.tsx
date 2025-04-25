import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', session?.user.id)
    .order('start_time', { ascending: true })
    .limit(5)

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {session?.user.email}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          {appointments && appointments.length > 0 ? (
            <ul className="space-y-4">
              {appointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="border-b pb-2 last:border-b-0"
                >
                  <div className="font-medium">
                    {new Date(appointment.start_time).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(appointment.start_time).toLocaleTimeString()} -{' '}
                    {new Date(appointment.end_time).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Type: {appointment.type}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No upcoming appointments</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <a
              href="/dashboard/appointments/new"
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Book New Appointment
            </a>
            <a
              href="/dashboard/profile"
              className="block w-full text-center bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
            >
              Update Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 