"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { motion } from "framer-motion"
import Image from "next/image"

interface StaffMember {
  name: string
  role: string
  image: string
  bio: string
}

interface StaffSectionProps {
  title?: string
  subtitle?: string
  members: StaffMember[]
  className?: string
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scale"
}

export function StaffSection({ title, subtitle, members, className = "", animation = "fadeIn" }: StaffSectionProps) {
  return (
    <AnimatedSection animation={animation} className={className}>
      {(title || subtitle) && (
        <div className="mb-12">
          {title && <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>}
          {subtitle && <p className="mt-4 text-lg text-gray-400">{subtitle}</p>}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gray-800 border-gray-700 h-full flex flex-col overflow-hidden hover:border-orange-500/50 transition-colors">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-white">{member.name}</CardTitle>
                <CardDescription className="text-orange-500">{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-300">{member.bio}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  )
}
