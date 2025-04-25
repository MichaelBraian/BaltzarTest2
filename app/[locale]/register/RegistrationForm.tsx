'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface RegistrationFormProps {
  locale: string
  prefilledEmail?: string
  verified?: boolean
}

export default function RegistrationForm({ 
  locale, 
  prefilledEmail = '', 
  verified = false 
}: RegistrationFormProps) {
  const [step, setStep] = useState<'verify' | 'register'>(verified ? 'register' : 'verify')
  const [email, setEmail] = useState(prefilledEmail)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [patientInfo, setPatientInfo] = useState<any>(null)
  
  const router = useRouter()
  const supabase = createClient()

  // Translations
  const t = {
    emailLabel: locale === 'sv' ? 'E-postadress' : 'Email address',
    passwordLabel: locale === 'sv' ? 'Lösenord' : 'Password',
    confirmPasswordLabel: locale === 'sv' ? 'Bekräfta lösenord' : 'Confirm password',
    verifyButton: locale === 'sv' ? 'Verifiera e-post' : 'Verify Email',
    registerButton: locale === 'sv' ? 'Registrera konto' : 'Register Account',
    backToLogin: locale === 'sv' ? 'Tillbaka till inloggning' : 'Back to login',
    errorEmailRequired: locale === 'sv' ? 'E-postadress krävs' : 'Email is required',
    errorPatientNotFound: locale === 'sv' 
      ? 'Ingen patient hittades med denna e-post. Kontakta kliniken.' 
      : 'No patient found with this email. Please contact the clinic.',
    errorPasswordRequired: locale === 'sv' ? 'Lösenord krävs' : 'Password is required',
    errorPasswordLength: locale === 'sv' 
      ? 'Lösenordet måste vara minst 8 tecken' 
      : 'Password must be at least 8 characters',
    errorPasswordMatch: locale === 'sv' 
      ? 'Lösenorden matchar inte' 
      : 'Passwords do not match',
    errorServerError: locale === 'sv' 
      ? 'Ett serverfel uppstod. Försök igen senare.' 
      : 'A server error occurred. Please try again later.',
    errorEmailExists: locale === 'sv'
      ? 'Det finns redan ett konto med denna e-postadress.'
      : 'An account with this email already exists.',
    verifiedSuccess: locale === 'sv'
      ? 'E-postadressen verifierad! Skapa ett lösenord för att slutföra registreringen.'
      : 'Email verified! Create a password to complete registration.',
    registerSuccess: locale === 'sv'
      ? 'Konto skapat! Omdirigerar...'
      : 'Account created! Redirecting...',
  }

  // Handle email verification step
  const handleVerifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email) {
      setError(t.errorEmailRequired)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Check if the email is already registered using signInWithOtp
      // This will check if the email exists without actually sending an OTP
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: 'check-if-exists-temp-password',
      })
      
      // If there's no auth error or the error is not "Invalid login credentials", 
      // then the email likely exists
      if (!authError || !authError.message.includes('Invalid login credentials')) {
        setError(t.errorEmailExists)
        setIsLoading(false)
        return
      }
      
      // Verify if the patient exists in Muntra
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
          setError(t.errorPatientNotFound)
          return
        }
        throw new Error(verifyData.error || 'Verification failed')
      }

      // Store patient info for registration
      setPatientInfo(verifyData.patient)
      
      // Move to step 2 - registration with password
      setStep('register')
    } catch (error) {
      console.error('Verification error:', error)
      setError(t.errorServerError)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle registration with password
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate password
    if (!password) {
      setError(t.errorPasswordRequired)
      return
    }
    
    if (password.length < 8) {
      setError(t.errorPasswordLength)
      return
    }
    
    if (password !== confirmPassword) {
      setError(t.errorPasswordMatch)
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Register with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: patientInfo?.firstName && patientInfo?.lastName 
              ? `${patientInfo.firstName} ${patientInfo.lastName}` 
              : '',
            phone: patientInfo?.phoneNumberCell || '',
            preferred_language: locale,
          }
        }
      })
      
      if (signUpError) throw signUpError
      
      // Successfully registered, redirect to dashboard or confirmation page
      router.push(`/${locale}/dashboard`)
    } catch (error: any) {
      console.error('Registration error:', error)
      setError(error.message || t.errorServerError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {step === 'verify' ? (
        <form className="mt-8 space-y-6" onSubmit={handleVerifyEmail}>
          {error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <div className="text-sm text-red-200">{error}</div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                {t.emailLabel}
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
                placeholder={t.emailLabel}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              )}
              {t.verifyButton}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <Link href={`/${locale}/login`} className="text-orange-500 hover:text-orange-400">
              {t.backToLogin}
            </Link>
          </div>
        </form>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <div className="text-sm text-red-200">{error}</div>
            </div>
          )}
          
          <div className="rounded-md bg-green-900/20 p-4 mb-4">
            <div className="text-sm text-green-400">{t.verifiedSuccess}</div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="verified-email" className="block text-sm font-medium text-gray-300 mb-1">
                {t.emailLabel}
              </label>
              <input
                id="verified-email"
                type="email"
                value={email}
                disabled
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-gray-400 focus:outline-none sm:text-sm cursor-not-allowed"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 placeholder-gray-400 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 pr-10 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                {t.confirmPasswordLabel}
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900 placeholder-gray-400 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-800 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              )}
              {t.registerButton}
            </button>
          </div>
          
          <div className="text-sm text-center">
            <Link href={`/${locale}/login`} className="text-orange-500 hover:text-orange-400">
              {t.backToLogin}
            </Link>
          </div>
        </form>
      )}
    </>
  )
} 