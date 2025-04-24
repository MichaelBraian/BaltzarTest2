"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathName = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Create path for the alternate locale
  const getAlternateLocaleHref = (newLocale: string) => {
    if (!pathName) return `/${newLocale}`

    // Handle the root path specially
    if (pathName === `/${locale}`) {
      return `/${newLocale}`
    }

    // For other paths, replace the locale segment
    const segments = pathName.split("/")
    segments[1] = newLocale
    return segments.join("/")
  }

  // Get paths for both locales
  const svPath = getAlternateLocaleHref("sv")
  const enPath = getAlternateLocaleHref("en")

  console.log(`Current locale: ${locale}`)
  console.log(`Current path: ${pathName}`)
  console.log(`Swedish path: ${svPath}`)
  console.log(`English path: ${enPath}`)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent hover:bg-gray-800 transition-colors"
        aria-label="Switch language"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <Link
              href={svPath}
              className={`block px-4 py-2 text-sm ${locale === "sv" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setIsOpen(false)}
            >
              Svenska
            </Link>
            <Link
              href={enPath}
              className={`block px-4 py-2 text-sm ${locale === "en" ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setIsOpen(false)}
            >
              English
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
