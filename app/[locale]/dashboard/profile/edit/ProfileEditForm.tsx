'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProfileEditFormProps {
  user: User
  patientInfo: any
  locale: string
}

export default function ProfileEditForm({ user, patientInfo, locale }: ProfileEditFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: user.user_metadata?.full_name || patientInfo.name || '',
    phone: user.phone || patientInfo.phone || '',
    preferredLanguage: locale || 'sv',
    emailNotifications: true,
    smsNotifications: false,
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Translations
  const t = {
    backToProfile: locale === 'sv' ? 'Tillbaka till profil' : 'Back to profile',
    editProfile: locale === 'sv' ? 'Redigera Profil' : 'Edit Profile',
    fullName: locale === 'sv' ? 'Fullständigt namn' : 'Full Name',
    phone: locale === 'sv' ? 'Telefonnummer' : 'Phone Number',
    email: locale === 'sv' ? 'E-post' : 'Email',
    emailReadOnly: locale === 'sv' ? 'E-post kan inte ändras' : 'Email cannot be changed',
    preferredLanguage: locale === 'sv' ? 'Föredraget språk' : 'Preferred Language',
    swedish: 'Svenska',
    english: 'English',
    notifications: locale === 'sv' ? 'Aviseringar' : 'Notifications',
    emailNotifications: locale === 'sv' ? 'E-postaviseringar' : 'Email Notifications',
    smsNotifications: locale === 'sv' ? 'SMS-aviseringar' : 'SMS Notifications',
    save: locale === 'sv' ? 'Spara ändringar' : 'Save Changes',
    cancel: locale === 'sv' ? 'Avbryt' : 'Cancel',
    saving: locale === 'sv' ? 'Sparar...' : 'Saving...',
    successMessage: locale === 'sv' 
      ? 'Din profil har uppdaterats framgångsrikt!' 
      : 'Your profile has been successfully updated!',
    errorMessage: locale === 'sv'
      ? 'Det uppstod ett fel vid uppdatering av din profil. Försök igen senare.'
      : 'There was an error updating your profile. Please try again later.',
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    try {
      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          preferred_language: formData.preferredLanguage,
          email_notifications: formData.emailNotifications,
          sms_notifications: formData.smsNotifications,
        }
      })
      
      if (error) throw error
      
      // Save in Muntra if applicable (through API)
      const response = await fetch('/api/patients/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          preferredLanguage: formData.preferredLanguage,
          emailNotifications: formData.emailNotifications,
          smsNotifications: formData.smsNotifications,
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || t.errorMessage)
      }
      
      setSuccess(true)
      
      // Refresh page after a short delay
      setTimeout(() => {
        router.refresh() // Refresh server components
        // If language changed, redirect to the correct locale
        if (formData.preferredLanguage !== locale) {
          router.push(`/${formData.preferredLanguage}/dashboard/profile`)
        }
      }, 1500)
      
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err.message || t.errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link 
          href={`/${locale}/dashboard/profile`} 
          className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backToProfile}
        </Link>
      </div>
      
      {/* Success message */}
      {success && (
        <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
          <p className="text-green-400">{t.successMessage}</p>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-white">
            {t.editProfile}
          </h2>
          
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                {t.fullName}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                {t.phone}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            {/* Email (read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                {t.email}
              </label>
              <input
                type="email"
                id="email"
                value={user.email || ''}
                readOnly
                className="w-full px-3 py-2 bg-gray-600 border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">{t.emailReadOnly}</p>
            </div>
            
            {/* Preferred Language */}
            <div>
              <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-300 mb-1">
                {t.preferredLanguage}
              </label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="sv">{t.swedish}</option>
                <option value="en">{t.english}</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Notifications Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-white">
            {t.notifications}
          </h2>
          
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-300">
                {t.emailNotifications}
              </label>
            </div>
            
            {/* SMS Notifications */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smsNotifications"
                name="smsNotifications"
                checked={formData.smsNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700 rounded"
              />
              <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-300">
                {t.smsNotifications}
              </label>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link
            href={`/${locale}/dashboard/profile`}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 text-center"
          >
            {t.cancel}
          </Link>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                {t.saving}
              </>
            ) : t.save}
          </button>
        </div>
      </form>
    </div>
  )
} 