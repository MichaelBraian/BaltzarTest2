"use client"

import { AnimatedSection } from "@/components/animated-section"
import Image from "next/image"

export function AboutHistory({ locale }: { locale: string }) {
  return (
    <AnimatedSection animation="slideUp" className="container py-16">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {locale === "sv" ? "Vår Historia" : "Our History"}
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            {locale === "sv"
              ? "Baltzar Tandvård grundades 2010 av Dr. Michael Braian med visionen att skapa en tandvårdsklinik där digital teknologi och personlig omsorg går hand i hand. Sedan dess har vi vuxit till att bli en av Malmös ledande tandvårdskliniker med fokus på digital precision."
              : "Baltzar Tandvård was founded in 2010 by Dr. Michael Braian with the vision of creating a dental clinic where digital technology and personal care go hand in hand. Since then, we have grown to become one of Malmö's leading dental clinics with a focus on digital precision."}
          </p>
          <p className="mt-4 text-lg text-gray-400">
            {locale === "sv"
              ? "Genom åren har vi kontinuerligt investerat i den senaste teknologin och vidareutbildning av vår personal för att kunna erbjuda våra patienter den bästa möjliga vården. Vår klinik på Baltzargatan har blivit en referenspunkt för digital tandvård i regionen."
              : "Over the years, we have continuously invested in the latest technology and further education of our staff to be able to offer our patients the best possible care. Our clinic on Baltzargatan has become a reference point for digital dentistry in the region."}
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden order-1 md:order-2">
          <Image
            src="/placeholder.svg?height=800&width=600"
            alt="Dental clinic history"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </AnimatedSection>
  )
}
