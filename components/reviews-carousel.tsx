"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Review {
  date: string
  author: string
  review: string
  rating: number
  language: string
}

interface ReviewsCarouselProps {
  reviews: Review[]
  locale: string
  autoPlaySpeed?: number
  showControls?: boolean
}

export function ReviewsCarousel({ reviews, locale, autoPlaySpeed = 5000, showControls = true }: ReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Format date based on locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === "sv" ? "sv-SE" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle next/prev navigation
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length)
  }

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || reviews.length <= 1) return

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        goToNext()
      }, autoPlaySpeed)
    }

    startTimer()

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [currentIndex, isPaused, reviews.length, autoPlaySpeed])

  // No reviews to display
  if (reviews.length === 0) {
    return null
  }

  return (
    <div className="relative w-full" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="bg-gray-800 border-gray-700 overflow-hidden">
            <CardContent className="pt-6 relative">
              <Quote className="absolute top-4 right-4 h-12 w-12 text-gray-700 opacity-30" />

              <div className="flex mb-4">
                {Array.from({ length: reviews[currentIndex].rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
                ))}
              </div>

              <p className="text-gray-300 relative z-10 text-lg italic">"{reviews[currentIndex].review}"</p>
            </CardContent>

            <CardFooter className="border-t border-gray-700 pt-4 pb-6">
              <div>
                <p className="font-medium text-white text-lg">{reviews[currentIndex].author}</p>
                <p className="text-sm text-gray-400">{formatDate(reviews[currentIndex].date)}</p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      {showControls && reviews.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full border-gray-700 bg-background/80 backdrop-blur z-10"
            onClick={goToPrev}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="sr-only">Previous review</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full border-gray-700 bg-background/80 backdrop-blur z-10"
            onClick={goToNext}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="sr-only">Next review</span>
          </Button>
        </>
      )}

      {/* Indicators */}
      {reviews.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-orange-500" : "bg-gray-600"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
