"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"

interface Doctor {
  name: string
  education?: string[]
  specialties?: string[]
}

export function StaffEducation({ locale, doctors }: { locale: string; doctors: Doctor[] }) {
  return (
    <AnimatedSection animation="fadeIn" className="container py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
          {locale === "sv" ? "Expertis & Specialiteter" : "Expertise & Specialties"}
        </h2>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
          {locale === "sv"
            ? "Vårt team består av erfarna specialister inom olika områden av tandvård med kontinuerlig utbildning inom de senaste digitala teknikerna."
            : "Our team consists of experienced specialists in various areas of dentistry with continuous education in the latest digital techniques."}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {locale === "sv" ? "Utbildning & Certifieringar" : "Education & Certifications"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {doctors.map(
                (doctor, index) =>
                  doctor.education && (
                    <li key={index} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium text-orange-500 mb-2">{doctor.name}</h3>
                      <ul className="list-disc pl-5 text-gray-300 space-y-1">
                        {doctor.education.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </li>
                  ),
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{locale === "sv" ? "Specialområden" : "Specialties"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {doctors.map(
                (doctor, index) =>
                  doctor.specialties && (
                    <li key={index} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                      <h3 className="font-medium text-orange-500 mb-2">{doctor.name}</h3>
                      <ul className="list-disc pl-5 text-gray-300 space-y-1">
                        {doctor.specialties.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </li>
                  ),
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AnimatedSection>
  )
}
