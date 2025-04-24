"use client"

import { useState } from "react"
import { StaffCard } from "@/components/staff-card"
import { StaffValues } from "@/components/staff-values"
import { StaffEducation } from "@/components/staff-education"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface StaffMember {
  name: string
  role: string
  image: string
  bio: string
  expandedBio?: string
  education?: string[]
  specialties?: string[]
}

interface Value {
  title: string
  description: string
}

interface StaffClientProps {
  doctors: StaffMember[]
  staff: StaffMember[]
  values: Value[]
  locale: string
  titles: {
    doctors: string
    doctorsSubtitle: string
    staff: string
    staffSubtitle: string
    values: string
    valuesSubtitle: string
  }
}

export function StaffClient({ doctors, staff, values, locale, titles }: StaffClientProps) {
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const openMemberDetails = (member: StaffMember) => {
    setSelectedMember(member)
    setIsDialogOpen(true)
  }

  return (
    <>
      <section className="container py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">{titles.doctors}</h2>
          <p className="mt-4 text-lg text-gray-400">{titles.doctorsSubtitle}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor, index) => (
            <StaffCard key={index} member={doctor} index={index} onClick={openMemberDetails} />
          ))}
        </div>
      </section>

      <StaffEducation locale={locale} doctors={doctors} />

      <section className="bg-gray-900 py-16">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white">{titles.staff}</h2>
            <p className="mt-4 text-lg text-gray-400">{titles.staffSubtitle}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {staff.map((member, index) => (
              <StaffCard key={index} member={member} index={index + doctors.length} onClick={openMemberDetails} />
            ))}
          </div>
        </div>
      </section>

      <StaffValues title={titles.values} subtitle={titles.valuesSubtitle} values={values} />

      {selectedMember && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-orange-500">{selectedMember.name}</DialogTitle>
              <DialogDescription className="text-base text-gray-300 mt-2">{selectedMember.role}</DialogDescription>
            </DialogHeader>
            <div className="mt-4 text-gray-300 whitespace-pre-line">
              {selectedMember.expandedBio || selectedMember.bio}
            </div>
            {selectedMember.education && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-2">{locale === "sv" ? "Utbildning" : "Education"}</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  {selectedMember.education.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {selectedMember.specialties && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  {locale === "sv" ? "Specialiteter" : "Specialties"}
                </h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  {selectedMember.specialties.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <DialogFooter className="mt-6">
              <Button
                variant="default"
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => setIsDialogOpen(false)}
              >
                {locale === "sv" ? "Stäng" : "Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
