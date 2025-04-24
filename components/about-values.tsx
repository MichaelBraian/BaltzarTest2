"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"

export function AboutValues({ locale }: { locale: string }) {
  return (
    <AnimatedSection animation="slideUp" className="bg-gray-900 py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            {locale === "sv" ? "Våra Värderingar" : "Our Values"}
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
            {locale === "sv"
              ? "På Baltzar Tandvård styrs vi av ett antal kärnvärderingar som formar hur vi arbetar och interagerar med våra patienter."
              : "At Baltzar Tandvård, we are guided by a set of core values that shape how we work and interact with our patients."}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">
                {locale === "sv" ? "Digital Precision" : "Digital Precision"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                {locale === "sv"
                  ? "Vi använder den senaste digitala teknologin för att säkerställa precision, förutsägbarhet och optimala resultat i alla behandlingar."
                  : "We use the latest digital technology to ensure precision, predictability, and optimal results in all treatments."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">{locale === "sv" ? "Personlig Omsorg" : "Personal Care"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                {locale === "sv"
                  ? "Varje patient är unik och förtjänar en individuellt anpassad behandlingsplan och personlig uppmärksamhet."
                  : "Every patient is unique and deserves an individually tailored treatment plan and personal attention."}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">
                {locale === "sv" ? "Kontinuerlig Utveckling" : "Continuous Development"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                {locale === "sv"
                  ? "Vi investerar kontinuerligt i utbildning och ny teknologi för att ligga i framkant inom modern tandvård."
                  : "We continuously invest in education and new technology to stay at the forefront of modern dentistry."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedSection>
  )
}
