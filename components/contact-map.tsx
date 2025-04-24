"use client"

import { motion } from "framer-motion"

export function ContactMap({ locale }: { locale: string }) {
  return (
    <section className="py-12 bg-gray-900">
      <div className="container">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {locale === "sv" ? "Hitta Till Oss" : "Find Your Way To Us"}
          </h2>
        </motion.div>

        <motion.div
          className="relative h-[500px] w-full rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2254.0133467208376!2d12.997759576678973!3d55.60567427403658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4653a15af59a1d91%3A0xa2f9089ed494eb2f!2sBaltzargatan%2025%2C%20211%2036%20Malm%C3%B6%2C%20Sweden!5e0!3m2!1sen!2sus!4v1711143223185!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Baltzar Tandvård Location"
          ></iframe>
        </motion.div>
      </div>
    </section>
  )
}
