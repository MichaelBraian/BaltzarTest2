"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { StaffCard } from "@/components/staff-card"

export function StaffPreview({ locale }: { locale: string }) {
  const doctors = [
    {
      name: "Michael Braian",
      role:
        locale === "sv" ? "Specialist oral protetik, odontologisk doktor" : "Specialist in Oral Prosthodontics, PhD",
      image: "/images/staff/michael.png",
      bio:
        locale === "sv"
          ? "Michael är en mångfacetterad specialist i protetik som kombinerar djup teoretisk kunskap med praktisk skicklighet."
          : "Michael is a multifaceted specialist in prosthodontics who combines deep theoretical knowledge with practical skills.",
    },
    {
      name: "Arman Ameri",
      role: locale === "sv" ? "Specialist oral protetik, delägare" : "Specialist in Oral Prosthodontics, Co-owner",
      image: "/images/staff/arman.png",
      bio:
        locale === "sv"
          ? "Arman är en stolt medgrundare till Baltzar Tandvård samt specialisttandläkare inom oral protetik."
          : "Arman is a proud co-founder of Baltzar Tandvård and a specialist dentist in oral prosthodontics.",
    },
    {
      name: "Filip Rebelo Dessborn",
      role: locale === "sv" ? "Legitimerad tandläkare" : "Licensed Dentist",
      image: "/images/staff/filip.png",
      bio:
        locale === "sv"
          ? "Filip har en gedigen erfarenhet som tandläkare med ett särskilt intresse för Oral Protetik."
          : "Filip has solid experience as a dentist with a special interest in Oral Prosthodontics.",
    },
    {
      name: "Daniel Jönsson",
      role: locale === "sv" ? "Specialist parodontologi, Docent" : "Specialist in Periodontology, Associate Professor",
      image: "/images/staff/daniel.png",
      bio:
        locale === "sv"
          ? "Daniel är specialisttandläkare i parodontologi samt docent inom parodontologi och internmedicinsk forskning."
          : "Daniel is a specialist dentist in periodontology and an associate professor in periodontology and internal medicine research.",
    },
  ]

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const openDoctorDetails = (doctor: any) => {
    setSelectedDoctor(doctor)
    setIsDialogOpen(true)
  }

  return (
    <section className="container py-16 bg-gray-900">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
          {locale === "sv" ? "Vårt Team" : "Our Team"}
        </h2>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
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
        {doctors.map((doctor, index) => (
          <StaffCard key={index} member={doctor} index={index} onClick={openDoctorDetails} />
        ))}
      </div>

      {selectedDoctor && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-orange-500">{selectedDoctor.name}</DialogTitle>
              <DialogDescription className="text-base text-gray-300 mt-2">{selectedDoctor.role}</DialogDescription>
            </DialogHeader>
            <div className="mt-4 text-gray-300">{selectedDoctor.bio}</div>
            <DialogFooter className="mt-6">
              <Link href={`/${locale}/staff`} className="w-full">
                <Button variant="default" className="w-full bg-orange-500 hover:bg-orange-600">
                  {locale === "sv" ? "Läs Mer Om Vårt Team" : "Read More About Our Team"}
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
