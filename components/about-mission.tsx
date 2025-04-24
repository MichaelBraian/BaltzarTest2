"use client"

import Image from "next/image"
import { AnimatedSection } from "@/components/animated-section"

export function AboutMission({ locale }: { locale: string }) {
  return (
    <AnimatedSection animation="fadeIn" className="container py-16">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {locale === "sv" ? "Vår Mission" : "Our Mission"}
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            {locale === "sv"
              ? "På Baltzar Tandvård är vår mission att erbjuda exceptionell tandvård i en bekväm och välkomnande miljö. Vi är dedikerade till att använda den senaste teknologin och teknikerna för att säkerställa att våra patienter får behandling av högsta kvalitet."
              : "At Baltzar Tandvård, our mission is to provide exceptional dental care in a comfortable and welcoming environment. We are committed to using the latest technology and techniques to ensure our patients receive the highest quality treatment."}
          </p>
          <p className="mt-4 text-lg text-gray-400">
            {locale === "sv"
              ? "Vi tror på förebyggande vård och patientutbildning som nycklar till optimal tandhälsa. Vi strävar efter att förbättra våra patienters liv genom att fokusera på att förebygga tandproblem innan de uppstår, och ge personlig vård när behandling behövs."
              : "We believe in preventive care and patient education as the keys to optimal dental health. We aim to improve the lives of our patients by focusing on preventing dental issues before they occur, and providing personalized care when treatment is needed."}
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=800&width=600"
            alt="Dental clinic reception"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </AnimatedSection>
  )
}
