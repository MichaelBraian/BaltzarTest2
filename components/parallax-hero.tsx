"use client"

import { useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"

export function ParallaxHero({ dictionary }: { dictionary: any }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <section ref={ref} className="relative h-[90vh] overflow-hidden">
      <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
        <Image
          src="/placeholder.svg?height=1200&width=1920"
          alt="Modern dental clinic"
          fill
          className="object-cover brightness-50"
          priority
        />
      </motion.div>

      <motion.div
        className="container relative z-10 flex h-full flex-col items-center justify-center text-center"
        style={{ opacity }}
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
          {dictionary.subtitle}
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

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}
