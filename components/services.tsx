"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SmileIcon as Tooth, Smile, Stethoscope, Users } from "lucide-react"

const services = [
  {
    title: "Digital Implant Treatment",
    description: "Planned and performed with 3D technology for optimal results and minimal intervention.",
    icon: <Tooth className="h-10 w-10 text-primary" />,
  },
  {
    title: "Aesthetic Dentistry",
    description: "Enhance your smile with veneers, crowns, and whitening designed for natural results.",
    icon: <Smile className="h-10 w-10 text-primary" />,
  },
  {
    title: "General Dentistry",
    description: "Regular care with focus on prevention and long-term dental health.",
    icon: <Stethoscope className="h-10 w-10 text-primary" />,
  },
  {
    title: "Pediatric Dentistry",
    description: "Safe and positive dental experience for our youngest patients.",
    icon: <Users className="h-10 w-10 text-primary" />,
  },
]

export function Services() {
  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          At Baltzar Tandvård, we offer everything from general dentistry to specialized treatments with digital
          precision.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mb-2"
                >
                  {service.icon}
                </motion.div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
