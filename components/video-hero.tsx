"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface VideoHeroProps {
  dictionary: any
}

export function VideoHero({ dictionary }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    // Ensure video plays automatically when loaded
    if (videoRef.current) {
      const video = videoRef.current

      // Add event listeners
      const handleCanPlay = () => {
        setIsVideoLoaded(true)
        video.play().catch((error) => {
          // Handle autoplay restrictions gracefully
          console.log("Autoplay prevented:", error)
        })
      }

      // Check if video is already loaded
      if (video.readyState >= 3) {
        handleCanPlay()
      } else {
        video.addEventListener("canplay", handleCanPlay)
      }

      return () => {
        video.removeEventListener("canplay", handleCanPlay)
      }
    }
  }, [])

  // Determine if we should show Swedish text based on the bookButton text
  const isSwedish = dictionary.bookButton?.includes("Boka") || dictionary.bookButton?.includes("boka")

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder while video loads */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
          </div>
        )}
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-center brightness-50"
          autoPlay
          muted
          loop
          playsInline
          poster="/placeholder.svg?height=1200&width=1920"
          preload="auto"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hero_Video-8jtF497mP4a0BYzUqlIqiOSO9oJlx3.webm"
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content Overlay */}
      <motion.div
        className="container relative z-10 flex h-full flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          className="mb-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {dictionary.title}
        </motion.h1>

        <motion.p
          className="mb-8 max-w-2xl text-lg text-gray-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {isSwedish
            ? "Specialisttandvård där digital precision och dina behov samverkar för att ge dig den bästa möjliga tandvårdsupplevelsen."
            : "Specialist dental care where digital precision and your needs work together to give you the best possible dental experience."}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white relative overflow-hidden group">
            <span className="relative z-10">{dictionary.bookButton}</span>
            <span className="absolute inset-0 bg-orange-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 relative overflow-hidden group"
          >
            <span className="relative z-10">{dictionary.learnMoreButton}</span>
            <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Gradient overlay at bottom - ensure consistent transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}
