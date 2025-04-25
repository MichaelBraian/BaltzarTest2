'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Separate component that handles auth logic
function AuthCallbackHandler() {
  const [message, setMessage] = useState<string>('Processing authentication...')
  const [debugInfo, setDebugInfo] = useState<Record<string, any> | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    // Parse URL
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    const errorCode = url.searchParams.get('error_code')
    const errorDescription = url.searchParams.get('error_description')
    
    // Set debug info for troubleshooting
    setDebugInfo({ code: code ? 'present' : 'missing', error, errorCode, errorDescription })
    
    async function handleAuthCallback() {
      // Handle error cases first
      if (error || errorCode === 'otp_expired') {
        console.log('Auth error detected:', { error, errorCode, errorDescription })
        
        if (errorCode === 'otp_expired') {
          setMessage('Your magic link has expired. Redirecting to login page...')
        } else if (errorDescription) {
          setMessage(`${errorDescription}. Redirecting to login page...`)
        } else {
          setMessage('Authentication failed. Redirecting to login page...')
        }
        
        setTimeout(() => {
          router.push('/sv/login')
        }, 2000)
        return
      }
      
      // Handle auth code
      if (code) {
        try {
          setMessage('Authenticating your session...')
          console.log('Exchanging code for session...')
          
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Error exchanging code for session:', error)
            setDebugInfo(prev => ({ ...prev, sessionError: error.message }))
            setMessage(`Authentication failed: ${error.message}. Redirecting...`)
            setTimeout(() => {
              router.push('/sv/login')
            }, 2000)
            return
          }
          
          if (data.session) {
            console.log('Session created successfully, user:', data.session.user.id)
            setDebugInfo(prev => ({ 
              ...prev, 
              sessionCreated: true, 
              userId: data.session.user.id,
              metadata: data.session.user.user_metadata || {} 
            }))
            
            setMessage('Authentication successful! Redirecting...')
            
            // Get user locale preference or default to 'sv'
            const locale = data.session.user?.user_metadata?.locale || 'sv'
            console.log('Using locale for redirect:', locale)
            
            // Force a hard reload to ensure session state is consistent
            window.location.href = `/${locale}/dashboard`
          } else {
            console.error('No session created after successful code exchange')
            setDebugInfo(prev => ({ ...prev, noSession: true }))
            setMessage('No session created. Redirecting to login...')
            setTimeout(() => {
              router.push('/sv/login')
            }, 2000)
          }
        } catch (err) {
          console.error('Unexpected error processing auth code:', err)
          setDebugInfo(prev => ({ ...prev, unexpectedError: String(err) }))
          setMessage('An unexpected error occurred. Redirecting to login...')
          setTimeout(() => {
            router.push('/sv/login')
          }, 2000)
        }
        return
      }
      
      // Default case - no code or error
      console.log('No auth code or error found in URL')
      setMessage('No authentication data found. Redirecting to login...')
      setTimeout(() => {
        router.push('/sv/login')
      }, 2000)
    }
    
    // Execute the auth logic
    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-300">{message}</p>
      {debugInfo && (
        <details className="mt-4 border border-gray-700 rounded-md p-2 text-left">
          <summary className="text-sm text-gray-400 cursor-pointer">Debug Info</summary>
          <pre className="mt-2 text-xs text-gray-500 overflow-auto p-2 bg-gray-900 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
      )}
    </div>
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