"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

export function BlogPreview({ dictionary }: { dictionary: any }) {
  const posts = dictionary.posts
  // Change to a Set to track multiple expanded items independently
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  // Extended excerpts for the read more functionality
  const extendedExcerpts = [
    "Learn the essential daily habits that can help you maintain healthy teeth and prevent common dental problems. Proper brushing technique, flossing regularly, using mouthwash, limiting sugary foods and drinks, and scheduling regular dental check-ups are all crucial for maintaining optimal oral health. Additionally, staying hydrated and eating a balanced diet rich in calcium and vitamins can strengthen your teeth and gums.",
    "Everything you need to know about dental implants, from the procedure to recovery and maintenance. Dental implants are titanium posts surgically placed into the jawbone to replace missing tooth roots. They provide a strong foundation for fixed or removable replacement teeth. The procedure typically involves several stages, including initial consultation, implant placement surgery, healing period, abutment placement, and finally, attaching the crown or prosthetic tooth.",
    "Discover how your oral health can impact your overall physical wellbeing and why regular dental check-ups are crucial. Research has shown strong connections between oral health and conditions like heart disease, diabetes, respiratory infections, and pregnancy complications. Bacteria from inflamed gums can enter your bloodstream and travel to other parts of your body, potentially contributing to various health issues.",
  ]

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
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">{dictionary.title}</h2>
          <p className="mt-4 text-lg text-gray-400">{dictionary.subtitle}</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-orange-500 hover:bg-orange-600">{dictionary.viewAllButton}</Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any, index: number) => (
          <Card key={index} className="overflow-hidden bg-gray-900 border-gray-800 h-full flex flex-col">
            <motion.div
              className="relative h-48 w-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt={post.title}
                fill
                className="object-cover transition-transform"
              />
            </motion.div>

            <CardHeader>
              <CardTitle className="line-clamp-2 hover:text-orange-500 transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
              <CardDescription className="text-gray-400">{post.date}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
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
                  >
                    <p className="text-gray-300">{extendedExcerpts[index]}</p>
                  </motion.div>
                ) : (
                  <motion.div key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="line-clamp-3 text-gray-300">{post.excerpt}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="mt-auto pt-4 flex justify-between">
              <Link href={`/blog/${post.slug}`}>
                <Button variant="link" className="px-0 text-orange-500 hover:text-orange-400">
                  {dictionary.readMoreButton}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-orange-500"
                onClick={() => toggleExpand(index)}
              >
                <motion.div
                  className="flex items-center"
                  initial={false}
                  animate={{ color: isExpanded(index) ? "#FFA500" : "#9CA3AF" }}
                >
                  <span className="mr-1">{isExpanded(index) ? "Show Less" : "Expand"}</span>
                  <motion.span animate={{ rotate: isExpanded(index) ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    ↓
                  </motion.span>
                </motion.div>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
