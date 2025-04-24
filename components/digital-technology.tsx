"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Scan, Camera, Cpu, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"

const technologies = [
  {
    icon: <Scan className="h-8 w-8 text-orange-500" />,
    title: "3D CBCT Scanning",
    description: "Digital 3D x-ray with low radiation for exact diagnostics.",
  },
  {
    icon: <Camera className="h-8 w-8 text-orange-500" />,
    title: "Intraoral 3D Scanning",
    description: "Digital impression taking without discomfort for perfect fit.",
  },
  {
    icon: <Cpu className="h-8 w-8 text-orange-500" />,
    title: "CAD/CAM Technology",
    description: "Computer-aided design and manufacturing for precision components.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-orange-500" />,
    title: "AI-assisted Analysis",
    description: "Artificial intelligence for improved diagnostics and treatment planning.",
  },
]

export function DigitalTechnology() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Ensure video plays automatically when loaded
    if (videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play()
          console.log("Video playing successfully")
        } catch (error) {
          console.error("Error playing video:", error)
        }
      }

      playVideo()
    }
  }, [])

  return (
    <div className="relative min-h-[600px] bg-gray-900">
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
          <source src="/videos/dental-technology.webm" type="video/webm" />
        </video>

        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-gray-900/60"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-white">Digital Tandvårdsteknologi</h2>
          <p className="mx-auto max-w-2xl text-gray-300">
            På Baltzar Tandvård investerar vi i den senaste digitala teknologin för att ge dig säkrare, bekvämare och
            mer precisa behandlingar.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full bg-gray-900/80 backdrop-blur-sm border-gray-800 hover:border-orange-500/50 transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 p-3 rounded-full bg-gray-800"
                  >
                    {tech.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-white">{tech.title}</h3>
                  <p className="text-gray-300">{tech.description}</p>
                  <Button variant="link" className="mt-4 text-orange-500 hover:text-orange-400">
                    Read More ↓
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
