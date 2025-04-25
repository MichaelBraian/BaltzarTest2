'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Separate component that uses useSearchParams to handle auth logic
function AuthCallbackHandler() {
  const [message, setMessage] = useState<string>('Processing authentication...')
  const router = useRouter()
  
  // This will be replaced with client-side redirection at runtime
  useEffect(() => {
    // We can't use useSearchParams directly here, but we can use window.location
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    const errorCode = url.searchParams.get('error_code')
    const errorDescription = url.searchParams.get('error_description')
    
    // If there's a code or error, redirect to the API route to handle it properly
    if (code || error || errorCode) {
      console.log('Detected auth parameters, redirecting to API handler')
      window.location.href = `/api/auth/callback${window.location.search}${window.location.hash || ''}`
      return
    }

    // If no auth parameters, handle direct visits to page
    if (error === 'access_denied' || errorCode === 'otp_expired') {
      setMessage('Your magic link has expired. Redirecting to login page...')
    } else if (errorDescription) {
      setMessage(`${errorDescription}. Redirecting to login page...`)
    } else {
      setMessage('Authentication failed. Redirecting to login page...')
    }

    // Redirect to login after a delay
    const timer = setTimeout(() => {
      router.push('/sv/login')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <p className="text-gray-600 dark:text-gray-300">{message}</p>
  )
}

// Main component with loading fallback
export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-center">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white">Authentication</h1>
        <div className="mt-4 flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <Suspense fallback={<p className="text-gray-600 dark:text-gray-300">Loading...</p>}>
            <AuthCallbackHandler />
          </Suspense>
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