"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { motion } from "framer-motion"

export function AboutTeamPreview({ locale }: { locale: string }) {
  return (
    <AnimatedSection animation="fadeIn" className="container py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
          {locale === "sv" ? "Vårt Team" : "Our Team"}
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
          {locale === "sv"
            ? "Möt våra erfarna tandvårdsspecialister som är dedikerade till att ge dig vård av högsta kvalitet."
            : "Meet our experienced dental specialists dedicated to providing you with the highest quality care."}
        </p>
        <div className="mt-8">
          <Link href={`/${locale}/staff`}>
            <Button className="bg-orange-500 hover:bg-orange-600">
              {locale === "sv" ? "Se Hela Teamet" : "View Full Team"}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gray-800 border-gray-700 h-full flex flex-col overflow-hidden hover:border-orange-500/50 transition-colors">
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="/images/doctors/doctor1.png"
                alt={locale === "sv" ? "Michael Braian" : "Dr. Michael Braian"}
                fill
                className="object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-white">{locale === "sv" ? "Michael Braian" : "Dr. Michael Braian"}</CardTitle>
              <CardDescription className="text-orange-500">
                {locale === "sv" ? "Tandläkare, Specialist" : "Dentist, Specialist"}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gray-800 border-gray-700 h-full flex flex-col overflow-hidden hover:border-orange-500/50 transition-colors">
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="/images/doctors/doctor2.png"
                alt={locale === "sv" ? "Arman Ameri" : "Dr. Arman Ameri"}
                fill
                className="object-cover transition-transform hover:scale-105 duration-500"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-white">{locale === "sv" ? "Arman Ameri" : "Dr. Arman Ameri"}</CardTitle>
              <CardDescription className="text-orange-500">
                {locale === "sv" ? "Tandläkare, Estetisk Tandvård" : "Dentist, Aesthetic Dentistry"}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700 h-full flex flex-col justify-center p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              {locale === "sv" ? "Expertis & Erfarenhet" : "Expertise & Experience"}
            </h3>
            <p className="text-gray-300 mb-6">
              {locale === "sv"
                ? "Vårt team består av erfarna specialister inom olika områden av tandvård. Tillsammans har vi över 50 års erfarenhet och kontinuerlig utbildning inom de senaste digitala teknikerna."
                : "Our team consists of experienced specialists in various areas of dentistry. Together, we have over 50 years of experience and continuous education in the latest digital techniques."}
            </p>
            <Link href={`/${locale}/staff`} className="text-orange-500 hover:text-orange-400 flex items-center">
              {locale === "sv" ? "Läs mer om vårt team" : "Learn more about our team"}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </Card>
        </div>
      </div>
    </AnimatedSection>
  )
}
