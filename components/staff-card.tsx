"use client"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface StaffMember {
  name: string
  role: string
  image: string
  bio: string
  expandedBio?: string
  education?: string[]
  specialties?: string[]
}

interface StaffCardProps {
  member: StaffMember
  index: number
  onClick?: (member: StaffMember) => void
}

export function StaffCard({ member, index, onClick }: StaffCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card
        className="bg-gray-800 border-gray-700 h-full flex flex-col overflow-hidden hover:border-orange-500/50 transition-all duration-300 cursor-pointer group"
        onClick={() => onClick && onClick(member)}
      >
        <div className="relative h-64 w-full overflow-hidden">
          <motion.div
            className="absolute inset-0 transition-all duration-300 group-hover:scale-110"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={member.image || "/placeholder.svg"}
              alt={member.name}
              fill
              className="object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </div>
        <CardHeader>
          <CardTitle className="text-white group-hover:text-orange-500 transition-colors">{member.name}</CardTitle>
          <CardDescription className="text-orange-500">{member.role}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-300">{member.bio}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
