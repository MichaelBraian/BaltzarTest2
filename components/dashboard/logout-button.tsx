'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, Loader2 } from 'lucide-react'

interface LogoutButtonProps {
  locale: string
  variant?: 'primary' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

export function LogoutButton({ 
  locale, 
  variant = 'primary',
  size = 'md'
}: LogoutButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-orange-500 text-white hover:bg-orange-600'
      case 'outline':
        return 'border border-gray-600 text-gray-300 hover:bg-gray-700'
      case 'destructive':
        return 'bg-red-600 text-white hover:bg-red-700'
      default:
        return 'bg-orange-500 text-white hover:bg-orange-600'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'md':
        return 'px-4 py-2'
      case 'lg':
        return 'px-5 py-2.5 text-lg'
      default:
        return 'px-4 py-2'
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Remove any local storage data
      localStorage.removeItem('supabase.auth.token')
      
      // Redirect to home page
      router.push(`/${locale}`)
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`rounded-md ${getVariantClasses()} ${getSizeClasses()} flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed`}
      aria-label={locale === 'sv' ? 'Logga ut' : 'Log out'}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <LogOut className="h-4 w-4 mr-2" />
      )}
      {locale === 'sv' ? 'Logga ut' : 'Log out'}
    </button>
  )
} 