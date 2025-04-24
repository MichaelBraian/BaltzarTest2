"use client"

import { AnimatedSection } from "@/components/animated-section"

export function AboutDigitalDentistry({ locale }: { locale: string }) {
  return (
    <AnimatedSection animation="slideUp" className="bg-gray-900 py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            {locale === "sv" ? "Digital Tandvård" : "Digital Dentistry"}
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
            {locale === "sv"
              ? "Baltzar Tandvård representerar en ny generation av tandvårdskliniker där digital teknologi står i centrum för alla behandlingar."
              : "Baltzar Tandvård represents a new generation of dental clinics where digital technology is at the center of all treatments."}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-gray-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">
              {locale === "sv" ? "Vår Filosofi" : "Our Philosophy"}
            </h3>
            <p className="text-gray-300 mb-4">
              {locale === "sv"
                ? "Vår klinik i centrala Malmö är utrustad med den senaste teknologin för 3D-scanning, digital behandlingsplanering och minimalt invasiva ingrepp."
                : "Our clinic in central Malmö is equipped with the latest technology for 3D scanning, digital treatment planning, and minimally invasive procedures."}
            </p>
            <p className="text-gray-300">
              {locale === "sv"
                ? "Vi tror att framtidens tandvård handlar om precision, komfort och förutsägbarhet - allt möjliggjort genom digital teknologi."
                : "We believe that the future of dentistry is about precision, comfort, and predictability - all made possible through digital technology."}
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-white mb-4">
              {locale === "sv" ? "Våra Specialiteter" : "Our Specialties"}
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                <span>{locale === "sv" ? "Digital implantatbehandling" : "Digital implant treatment"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                <span>{locale === "sv" ? "Estetisk tandvård" : "Aesthetic dentistry"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                <span>{locale === "sv" ? "Ortodonti med Invisalign" : "Orthodontics with Invisalign"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                <span>
                  {locale === "sv"
                    ? "Digital protetik med eget laboratorium"
                    : "Digital prosthetics with in-house laboratory"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
