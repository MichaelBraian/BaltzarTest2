"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Testimonials({ dictionary }: { dictionary: any }) {
  const [current, setCurrent] = useState(0)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())
  const testimonials = dictionary.items

  // Extended content for testimonials
  const extendedContent = [
    "The team at DentalCare provided exceptional service. The procedure was painless and the results are amazing! I was particularly impressed with how Dr. Lindberg took the time to explain every step of the treatment. The office environment is modern and comfortable, and the staff is always friendly and professional. I've recommended DentalCare to all my friends and family.",
    "I've been afraid of dentists my whole life, but the staff here made me feel comfortable and at ease. They were patient with my anxiety and offered options to help me relax during the procedure. The dental work itself was quick and virtually painless. I'm no longer dreading my dental appointments and actually look forward to my regular check-ups now!",
    "The most professional dental clinic I've ever visited. State-of-the-art equipment and friendly staff. Dr. Johansson's expertise in orthodontics is evident in the results I've seen with my treatment. The reception staff is always helpful with scheduling and insurance questions. The clinic is immaculately clean and they follow strict hygiene protocols. Highly recommended for anyone seeking quality dental care.",
  ]

  const next = () => {
    setCurrent((current + 1) % testimonials.length)
    // Clear expanded items when changing testimonials
    setExpandedItems(new Set())
  }

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
    // Clear expanded items when changing testimonials
    setExpandedItems(new Set())
  }

  // Auto-advance testimonials, but pause when one is expanded
  useEffect(() => {
    if (expandedItems.size > 0) return

    const timer = setTimeout(next, 5000)
    return () => clearTimeout(timer)
  }, [current, expandedItems])

  const toggleExpand = (id: number) => {
    // Create a new Set from the current one
    const newExpandedItems = new Set(expandedItems)

    // If the item is already expanded, remove it; otherwise, add it
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id)
    } else {
      newExpandedItems.add(id)
    }

    setExpandedItems(newExpandedItems)
  }

  // Helper function to check if an item is expanded
  const isExpanded = (id: number) => expandedItems.has(id)

  return (
    <section className="container py-16 bg-background">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">{dictionary.title}</h2>
        <p className="mt-4 text-lg text-gray-400">{dictionary.subtitle}</p>
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
                      ))}
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded(index) ? (
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            transition: {
                              height: { duration: 0.4 },
                              opacity: { duration: 0.3, delay: 0.1 },
                            },
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            transition: {
                              height: { duration: 0.3 },
                              opacity: { duration: 0.2 },
                            },
                          }}
                          className="text-gray-300"
                        >
                          {extendedContent[index]}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="collapsed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-gray-300"
                        >
                          {testimonial.content}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      className="mt-2 text-orange-500 hover:text-orange-400 flex items-center text-sm"
                      onClick={() => toggleExpand(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isExpanded(index) ? (
                        <>
                          <span>Read Less</span>
                          <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>Read More</span>
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </motion.button>
                  </CardContent>
                  <CardFooter className="border-t border-gray-800 pt-4">
                    <div>
                      <p className="font-medium text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-gray-700 bg-background/80 backdrop-blur"
          onClick={prev}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous testimonial</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full border-gray-700 bg-background/80 backdrop-blur"
          onClick={next}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next testimonial</span>
        </Button>
      </div>
    </section>
  )
}
