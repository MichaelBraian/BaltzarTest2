'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthNotFound() {
  const router = useRouter()

  useEffect(() => {
    // After 3 seconds, redirect to login page
    const timer = setTimeout(() => {
      router.push('/sv/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-center">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white">Authentication Error</h1>
        <div className="rounded-md bg-red-900/20 p-4">
          <p className="text-lg text-red-400">
            The authentication link you tried to access is invalid or has expired.
          </p>
        </div>
        <p className="text-gray-400">
          You will be redirected to the login page in a few seconds.
        </p>
        <div className="mx-auto h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-700">
          <div className="h-full animate-progress bg-orange-500" />
        </div>
        <div className="pt-4">
          <Link
            href="/sv/login"
            className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Go to Login Page
          </Link>
        </div>
      </div>
    </div>
  )
} 