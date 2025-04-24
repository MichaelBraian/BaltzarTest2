"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter } from "lucide-react"

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    bio: "With over 15 years of experience in technology and business strategy, Sarah leads our company with vision and passion.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    bio: "Michael brings deep technical expertise and innovation leadership, guiding our technology strategy and development.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Aisha Patel",
    role: "Design Director",
    bio: "Aisha combines creativity with user-centered design principles to create exceptional digital experiences.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "David Rodriguez",
    role: "Marketing Lead",
    bio: "David crafts compelling narratives and strategies that connect our solutions with the right audiences.",
    image: "/placeholder.svg?height=400&width=400",
  },
]

export function Team() {
  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Our Team</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Meet the talented individuals who make our company exceptional. Our diverse team brings together expertise
          from various fields.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {team.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{member.bio}</p>
              </CardContent>
              <CardFooter className="flex justify-start space-x-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
