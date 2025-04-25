'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface LoginFormProps {
  locale: string
}

export default function LoginForm({ locale }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  // Get site URL for redirection - this is the critical fix
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baltzartandvardcursor.netlify.app'
  console.log("[Login] Using site URL for redirect:", siteUrl)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // First, verify if the patient exists in Muntra
      const verifyResponse = await fetch('/api/patients/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        if (verifyData.code === 'NO_PATIENT_RECORD') {
          setError(
            locale === 'sv'
              ? 'Ingen patient med denna e-postadress hittades i vårt system. Vänligen kontakta kliniken för att registrera dig.'
              : 'No patient record found with this email. Please contact the clinic to register.'
          )
          return
        }
        throw new Error(verifyData.error || 'Verification failed')
      }

      // If patient exists, send magic link - THIS IS WHERE WE NEED TO FIX THE URL
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            locale: locale, // Store the locale in user metadata
          }
        },
      })

      if (signInError) {
        throw new Error(signInError.message)
      }

      setVerificationSent(true)
    } catch (error) {
      setError(
        locale === 'sv'
          ? 'Ett fel uppstod. Vänligen försök igen.'
          : 'An error occurred. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {error && (
        <div className="rounded-md bg-red-900/50 p-4">
          <div className="text-sm text-red-200">{error}</div>
        </div>
      )}
      
      {verificationSent ? (
        <div className="rounded-md bg-green-900/50 p-4">
          <div className="text-sm text-green-200">
            {locale === 'sv'
              ? 'Vi har skickat en inloggningslänk till din e-postadress. Vänligen kolla din inkorg.'
              : 'We have sent a login link to your email address. Please check your inbox.'}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                {locale === 'sv' ? 'E-postadress' : 'Email address'}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 placeholder-gray-400 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder={locale === 'sv' ? 'E-postadress' : 'Email address'}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : null}
              {locale === 'sv' ? 'Skicka inloggningslänk' : 'Send Login Link'}
            </button>
          </div>
        </form>
      )}
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 mb-2">
          {locale === 'sv' 
            ? 'Ny patient? Prova vår nya registrering med lösenord:' 
            : 'New patient? Try our new password-based registration:'}
        </p>
        <Link 
          href={`/${locale}/register`}
          className="inline-flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          {locale === 'sv' ? 'Registrera konto' : 'Register Account'}
        </Link>
      </div>
      
      <div className="text-center mt-6">
        <div className="text-xs text-gray-500">
          {locale === 'sv'
            ? 'Vi använder lösenordslös inloggning för extra säkerhet. Du får en säker länk skickad till din e-post.'
            : 'We use passwordless login for enhanced security. You will receive a secure link via email.'}
        </div>
      </div>
    </div>
  )
} 