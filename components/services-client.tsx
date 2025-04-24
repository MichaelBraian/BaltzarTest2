"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SmileIcon as Tooth, Stethoscope, Smile, Users, BrainCircuit, Sparkles, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function ServicesClient({
  dictionary,
  locale,
}: {
  dictionary: any
  locale: string
}) {
  const serviceIcons = [
    <Tooth className="h-12 w-12 text-orange-500" key="tooth" />,
    <Stethoscope className="h-12 w-12 text-orange-500" key="stethoscope" />,
    <Smile className="h-12 w-12 text-orange-500" key="smile" />,
    <Users className="h-12 w-12 text-orange-500" key="users" />,
    <BrainCircuit className="h-12 w-12 text-orange-500" key="brain" />,
    <Sparkles className="h-12 w-12 text-orange-500" key="sparkles" />,
  ]

  return (
    <div className="container py-12 md:py-24">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">{dictionary.title}</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">{dictionary.subtitle}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {dictionary.items &&
          dictionary.items.map((service: any, index: number) => (
            <ServiceCard
              key={index}
              service={service}
              icon={serviceIcons[index % serviceIcons.length]}
              locale={locale}
            />
          ))}
      </div>
    </div>
  )
}

function ServiceCard({ service, icon, locale }: { service: any; icon: React.ReactNode; locale: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Card className="bg-gray-900 border-gray-800 transition-all hover:border-orange-500/50 h-full flex flex-col">
        <CardHeader>
          <motion.div className="mb-4" whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}>
            {icon}
          </motion.div>
          <CardTitle className="text-xl text-white">{service.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex-grow">
          <CardDescription className="text-gray-400 text-base">{service.description}</CardDescription>
        </CardContent>

        <CardFooter className="mt-auto pt-4">
          <Button
            variant="ghost"
            className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 w-full justify-between"
            onClick={() => setIsDialogOpen(true)}
          >
            <span>{locale === "sv" ? "Läs mer" : "Read More"}</span>
            <ChevronDown className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-orange-500">{service.title}</DialogTitle>
            <DialogDescription className="text-base text-gray-300 mt-2">{service.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-gray-300 whitespace-pre-line">{service.expandedDescription}</div>
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
    </>
  )
}
