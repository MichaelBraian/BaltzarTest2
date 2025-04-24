"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Cpu, Scan, Camera, BrainCircuit, Glasses } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// Add text shadow utility class
const shadowTextStyle = {
  textShadow: "0px 0px 10px rgba(0, 0, 0, 0.8), 0px 0px 5px rgba(0, 0, 0, 0.9)",
}

export function TechnologySection({ dictionary, locale }: { dictionary: any; locale: string }) {
  const technologies = [
    {
      icon: <Scan className="h-10 w-10 text-orange-500" />,
      title: dictionary.items[0].title,
      description: dictionary.items[0].description,
      expandedDescription: dictionary.items[0].expandedDescription,
    },
    {
      icon: <Camera className="h-10 w-10 text-orange-500" />,
      title: dictionary.items[1].title,
      description: dictionary.items[1].description,
      expandedDescription: dictionary.items[1].expandedDescription,
    },
    {
      icon: <Cpu className="h-10 w-10 text-orange-500" />,
      title: dictionary.items[2].title,
      description: dictionary.items[2].description,
      expandedDescription: dictionary.items[2].expandedDescription,
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-orange-500" />,
      title: dictionary.items[3].title,
      description: dictionary.items[3].description,
      expandedDescription: dictionary.items[3].expandedDescription,
    },
    {
      icon: <Glasses className="h-10 w-10 text-orange-500" />,
      title: dictionary.items[4].title,
      description: dictionary.items[4].description,
      expandedDescription: dictionary.items[4].expandedDescription,
    },
  ]

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Ensure video plays automatically when loaded
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        // Handle autoplay restrictions gracefully
        console.log("Autoplay prevented:", error)
      })
    }
  }, [])

  return (
    <section className="relative py-16">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 min-h-full min-w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/placeholder.svg?height=800&width=1600"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dental-technology-ZwzRNUzO7GyPUg2mTjG07HzruZoNZX.webm"
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="container relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white" style={shadowTextStyle}>
            {dictionary.title}
          </h2>
          <p className="mt-4 text-lg text-white max-w-3xl mx-auto" style={shadowTextStyle}>
            {dictionary.subtitle}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech, index) => (
            <TechCard key={index} tech={tech} locale={locale} dictionary={dictionary} />
          ))}
        </div>
      </div>

      {/* Add a gradient fade-out at the bottom for smoother transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  )
}

function TechCard({ tech, locale, dictionary }: { tech: any; locale: string; dictionary: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Use the dictionary for translations
  const readMoreText = dictionary.readMoreButton
  const closeText = dictionary.closeButton

  return (
    <>
      <Card className="h-full transition-colors hover:border-orange-500/50 bg-gray-800 border-gray-700 overflow-hidden">
        <CardHeader>
          <motion.div className="mb-2" whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}>
            {tech.icon}
          </motion.div>
          <CardTitle className="group-hover:text-orange-500 transition-colors text-white">{tech.title}</CardTitle>
        </CardHeader>

        <CardContent className="relative">
          <p className="text-gray-300">{tech.description}</p>
        </CardContent>

        <CardFooter>
          <Button
            variant="ghost"
            className="px-0 text-orange-500 hover:text-orange-400 group w-full justify-center"
            onClick={() => setIsDialogOpen(true)}
          >
            <span>{readMoreText}</span>
            <span className="inline-block ml-1">↓</span>
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
