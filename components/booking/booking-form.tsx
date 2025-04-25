'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

interface AppointmentType {
  id: string
  name: string
  duration: number
}

interface BookingFormProps {
  appointmentTypes: AppointmentType[]
  patientId?: string
}

export function BookingForm({ appointmentTypes, patientId }: BookingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const appointmentTypeId = formData.get('appointmentType') as string
    const date = formData.get('date') as string
    const preferredTime = formData.get('preferredTime') as string

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Use the provided patientId if available, otherwise use the session user id
      const patientIdToUse = patientId || session.user.id

      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientIdToUse,
          appointment_type_id: appointmentTypeId,
          date: date,
          preferred_time: preferredTime,
          status: 'pending'
        })

      if (insertError) throw insertError

      router.push('/dashboard/appointments')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="appointmentType" className="block text-sm font-medium text-gray-700">
          Appointment Type
        </label>
        <select
          id="appointmentType"
          name="appointmentType"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select an appointment type</option>
          {appointmentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} ({type.duration} minutes)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          required
          min={format(new Date(), 'yyyy-MM-dd')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
          Preferred Time
        </label>
        <input
          type="time"
          id="preferredTime"
          name="preferredTime"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Booking...' : 'Book Appointment'}
      </button>
    </form>
  )
} 