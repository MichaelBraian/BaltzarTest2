"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Menu, X } from "lucide-react"

interface MenuItem {
  id: string
  name: string
}

export function Navigation({ locale }: { locale?: string }) {
  const [activeSection, setActiveSection] = useState<string>("home")
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  // Default to 'en' if locale is not provided
  const currentLocale = locale || "en"

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
      // Close mobile menu if open
      setMobileMenuOpen(false)

      // Get the header height for offset
      const headerHeight = 80

      // Calculate position accounting for header
      const sectionPosition = section.getBoundingClientRect().top + window.scrollY
      const offsetPosition = sectionPosition - headerHeight

      // Smooth scroll to section
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // Update active section
      setActiveSection(sectionId)
    }
  }, [])

  // Handle click on menu items
  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    scrollToSection(sectionId)
  }

  // Add keyboard navigation for menu items
  const handleKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      scrollToSection(sectionId)
    }
  }

  // Track scroll position and update active section using IntersectionObserver
  useEffect(() => {
    // Update header style based on scroll position
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)

    // Use IntersectionObserver to detect which section is in view
    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -20% 0px", // Adjust rootMargin to account for header and give some threshold
      threshold: 0.2, // Section is considered in view when 20% is visible
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("id") || ""
          if (sectionId) {
            setActiveSection(sectionId)
          }
        }
      })
    }, observerOptions)

    // Observe all sections
    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => {
      sectionObserver.observe(section)
    })

    // Initial call to set header style
    handleScroll()

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll)
      sections.forEach((section) => {
        sectionObserver.unobserve(section)
      })
    }
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (mobileMenuOpen && !target.closest(".mobile-menu") && !target.closest(".mobile-menu-button")) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobileMenuOpen])

  // Prevent body scroll when mobile menu is open
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
            priority
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
          </ul>
        </nav>
      </div>
    </header>
  )
}
