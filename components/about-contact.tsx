"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"

export function AboutContact({ locale }: { locale: string }) {
  return (
    <AnimatedSection animation="fadeIn" className="container py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
          {locale === "sv" ? "Kontakta Oss" : "Contact Us"}
        </h2>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
          {locale === "sv"
            ? "Vi välkomnar nya patienter och ser fram emot att hjälpa dig med dina tandvårdsbehov."
            : "We welcome new patients and look forward to helping you with your dental care needs."}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-3">
              <MapPin className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-white">{locale === "sv" ? "Adress" : "Address"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Baltzargatan 25, 211 36 Malmö</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-white">{locale === "sv" ? "Telefon" : "Phone"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">+4640123456</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-white">{locale === "sv" ? "E-post" : "Email"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">info@baltzartandvard.se</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <Link href={`/${locale}/contact`}>
          <Button className="bg-orange-500 hover:bg-orange-600">
            {locale === "sv" ? "Kontakta Oss" : "Contact Us"}
          </Button>
        </Link>
      </div>
    </AnimatedSection>
  )
}
