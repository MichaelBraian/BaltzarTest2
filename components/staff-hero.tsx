"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function StaffHero({ locale }: { locale: string }) {
  return (
    <section className="relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=600&width=1600"
          alt="Modern dental clinic team"
          fill
          className="object-cover brightness-50"
        />
      </div>
      <div className="container relative z-10 py-24 md:py-32">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">
            {locale === "sv" ? "Vårt Team" : "Our Team"}
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            {locale === "sv"
              ? "Möt våra erfarna tandvårdsspecialister som är dedikerade till att ge dig och din familj den bästa tandvårdsupplevelsen med den senaste digitala teknologin."
              : "Meet our experienced dental specialists dedicated to providing you and your family with the best dental experience using the latest digital technology."}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
