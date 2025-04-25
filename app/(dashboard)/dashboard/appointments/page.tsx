import { createServerClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export default async function AppointmentsPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', session?.user.id)
    .order('start_time', { ascending: true })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <a
          href="./appointments/new"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Book New Appointment
        </a>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments?.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(appointment.start_time), 'PPP')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(appointment.start_time), 'p')} -{' '}
                  {format(new Date(appointment.end_time), 'p')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a
                    href={`./appointments/${appointment.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </a>
                  {appointment.status === 'confirmed' && (
                    <a
                      href={`./appointments/${appointment.id}/cancel`}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 