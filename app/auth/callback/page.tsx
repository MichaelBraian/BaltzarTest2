'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState<string>('Processing your login...')

  useEffect(() => {
    // Check if there are auth parameters
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    const errorDescription = searchParams.get('error_description')

    // If there's a code or error, redirect to the API route to handle it properly
    if (code || error || errorCode) {
      console.log('Detected auth parameters, redirecting to API handler');
      
      // Construct the full URL with all query parameters
      const queryString = Array.from(searchParams.entries())
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
        
      window.location.href = `/api/auth/callback?${queryString}${window.location.hash || ''}`;
      return;
    }

    // Process errors if present (for direct visits to the page)
    if (error || errorCode) {
      console.log('Auth error detected:', { error, errorCode, errorDescription })
      
      // Handle expired OTP specifically
      if (errorCode === 'otp_expired') {
        setMessage('Your magic link has expired. Redirecting to login page...')
      } else if (errorDescription) {
        setMessage(`${errorDescription}. Redirecting to login page...`)
      } else {
        setMessage('Authentication failed. Redirecting to login page...')
      }

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push(`/sv/login?error=${error || 'auth_error'}&error_description=${encodeURIComponent(errorDescription || 'Authentication failed')}`)
      }, 2000)
      return
    }
    
    // If no error but somehow we're on this page (route handler didn't redirect)
    // just redirect to login
    setTimeout(() => {
      router.push('/sv/login')
    }, 2000)
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication</h1>
        <div className="mt-4 flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  )
} 