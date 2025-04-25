"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Menu, X, LogIn } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MenuItem {
  id: string
  name: string
  href?: string
  isExternal?: boolean
}

export function Navigation({ locale }: { locale?: string }) {
  const [activeSection, setActiveSection] = useState<string>("home")
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  // Default to 'en' if locale is not provided
  const currentLocale = locale || "en"

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      setIsLoggedIn(!!data.session)
    }
    
    checkSession()
  }, [])

  // Define menu items with correct section IDs
  const menuItems: MenuItem[] = [
    {
      id: "home",
      name: currentLocale === "sv" ? "Hem" : "Home",
    },
    {
      id: "treatments",
      name: currentLocale === "sv" ? "Behandlingar" : "Treatments",
    },
    {
      id: "technology",
      name: currentLocale === "sv" ? "Teknologi" : "Technology",
    },
    {
      id: "staff",
      name: currentLocale === "sv" ? "Personal" : "Staff",
    },
    {
      id: "contact",
      name: currentLocale === "sv" ? "Kontakt" : "Contact",
    },
  ]

  // Function to handle smooth scrolling to sections
  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
  }, [])

  // Function to handle menu item clicks
  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    scrollToSection(sectionId)
    setMobileMenuOpen(false)
  }

  // Function to handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      scrollToSection(sectionId)
      setMobileMenuOpen(false)
    }
  }

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Check if page has scrolled
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Update active section based on scroll position
      const sections = menuItems.map((item) => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 100 // Offset for header height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(menuItems[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [menuItems])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        mobileMenuOpen &&
        !target.closest(".mobile-menu") &&
        !target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobileMenuOpen])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/95 backdrop-blur-md py-3 shadow-lg" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#home" onClick={(e) => handleMenuClick(e as any, "home")} className="z-50 flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Baltzar_Tandvard-SrPUChwvVi0i84aU2NFJcGBvyVGAVO.png"
            alt="Baltzar Tandvård"
            width={140}
            height={40}
            className="h-10 w-auto"
            loading="lazy"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleMenuClick(e, item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-orange-500",
                    activeSection === item.id ? "text-orange-500" : "text-white/90",
                  )}
                  tabIndex={0}
                  role="menuitem"
                >
                  {item.name}
                  {activeSection === item.id && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500" aria-hidden="true" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side items */}
        <div className="flex items-center gap-4">
          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1 rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              {currentLocale === "sv" ? "Dashboard" : "Dashboard"}
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-1 rounded-md border border-orange-500 px-3 py-1.5 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-500 hover:text-white"
            >
              <LogIn size={16} />
              {currentLocale === "sv" ? "Logga in" : "Log in"}
            </Link>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher locale={currentLocale} />

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button md:hidden flex h-10 w-10 items-center justify-center rounded-md border border-gray-700 bg-gray-800 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          "mobile-menu fixed inset-0 z-40 bg-black/95 pt-24 transition-transform duration-300 md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!mobileMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label={locale === "sv" ? "Mobilmeny" : "Mobile menu"}
      >
        <nav className="container mx-auto px-6">
          <ul className="flex flex-col space-y-6">
            {menuItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleMenuClick(e, item.id)}
                  className={cn(
                    "block text-xl font-medium transition-colors hover:text-orange-500",
                    activeSection === item.id ? "text-orange-500" : "text-white",
                  )}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li>
              {isLoggedIn ? (
                <Link 
                  href="/dashboard" 
                  className="block text-xl font-medium text-orange-500 transition-colors hover:text-orange-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {currentLocale === "sv" ? "Dashboard" : "Dashboard"}
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="block text-xl font-medium text-white transition-colors hover:text-orange-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {currentLocale === "sv" ? "Logga in" : "Log in"}
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
