"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"

interface Value {
  title: string
  description: string
}

interface StaffValuesProps {
  title: string
  subtitle: string
  values: Value[]
}

export function StaffValues({ title, subtitle, values }: StaffValuesProps) {
  return (
    <AnimatedSection animation="fadeIn" className="container py-16">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
        <p className="mt-4 text-lg text-gray-400">{subtitle}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {values.map((value, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700 hover:border-orange-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-white">{value.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  )
}
