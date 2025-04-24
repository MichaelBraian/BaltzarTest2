"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function ContactHero({ locale }: { locale: string }) {
  return (
    <section className="relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=600&width=1600"
          alt="Modern dental clinic contact"
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
            {locale === "sv" ? "Kontakta Oss" : "Contact Us"}
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            {locale === "sv"
              ? "Vi tar emot nya patienter och hjälper gärna till med frågor om våra behandlingar. Kontakta oss via formuläret eller använd våra kontaktuppgifter nedan."
              : "We are accepting new patients and are happy to help with questions about our treatments. Contact us via the form or use our contact details below."}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
