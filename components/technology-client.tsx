"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scan, Camera, Cpu, BrainCircuit, FlaskConical, Printer, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export function TechnologyClient({
  dictionary,
  locale,
}: {
  dictionary: any
  locale: string
}) {
  const techIcons = [
    <Scan className="h-12 w-12 text-orange-500" key="scan" />,
    <Camera className="h-12 w-12 text-orange-500" key="camera" />,
    <Cpu className="h-12 w-12 text-orange-500" key="cpu" />,
    <BrainCircuit className="h-12 w-12 text-orange-500" key="brain" />,
    <FlaskConical className="h-12 w-12 text-orange-500" key="flask" />,
    <Printer className="h-12 w-12 text-orange-500" key="printer" />,
  ]

  return (
    <div className="container py-12 md:py-24">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">{dictionary.title}</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">{dictionary.subtitle}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {dictionary.items &&
          dictionary.items.map((tech: any, index: number) => <TechCard key={index} tech={tech} locale={locale} />)}
      </div>
    </div>
  )
}

function TechCard({ tech, locale }: { tech: any; locale: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Ensure the read more text is properly translated
  const readMoreText = locale === "sv" ? "Läs mer" : "Read More"
  const closeText = locale === "sv" ? "Stäng" : "Close"

  return (
    <>
      <Card className="bg-gray-900 border-gray-800 transition-all hover:border-orange-500/50 h-full flex flex-col">
        <CardHeader>
          <motion.div className="mb-4" whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}>
            {tech.icon}
          </motion.div>
          <CardTitle className="text-xl text-white">{tech.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex-grow">
          <CardDescription className="text-gray-400 text-base">{tech.description}</CardDescription>
        </CardContent>

        <CardFooter className="mt-auto pt-4">
          <Button
            variant="ghost"
            className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 w-full justify-between"
            onClick={() => setIsDialogOpen(true)}
          >
            <span>{readMoreText}</span>
            <ChevronDown className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-orange-500">{tech.title}</DialogTitle>
            <DialogDescription className="text-base text-gray-300 mt-2">{tech.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-gray-300 whitespace-pre-line">{tech.expandedDescription}</div>
          <DialogFooter className="mt-6">
            <Button
              variant="default"
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={() => setIsDialogOpen(false)}
            >
              {closeText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
