import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function DashboardNav() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="w-64 bg-gray-800 text-white p-4">
      <div className="space-y-4">
        <div className="text-xl font-bold mb-8">Patient Portal</div>
        <Link
          href="/dashboard"
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/appointments"
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          Appointments
        </Link>
        <Link
          href="/dashboard/profile"
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          Profile
        </Link>
        <button
          onClick={handleSignOut}
          className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700"
        >
          Sign Out
        </button>
      </div>
    </nav>
  )
} 