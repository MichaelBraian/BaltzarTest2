'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface LoginFormProps {
  locale: string
}

export default function LoginForm({ locale }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

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

      // If patient exists, send magic link
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
        <>
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
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 placeholder-gray-400 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={locale === 'sv' ? 'E-postadress' : 'Email address'}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? locale === 'sv'
                  ? 'Skickar länk...'
                  : 'Sending link...'
                : locale === 'sv'
                ? 'Skicka inloggningslänk'
                : 'Send login link'}
            </button>
          </div>
        </>
      )}
    </form>
  )
} 