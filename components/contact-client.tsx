"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { motion } from "framer-motion"

export function ContactClient({
  dictionary,
  locale,
}: {
  dictionary: any
  locale: string
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - would connect to backend in real implementation
    console.log("Form submitted:", formData)
    alert("Thank you for your message! We will get back to you soon.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  return (
    <div className="container py-12 md:py-24">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-white">{dictionary.title}</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">{dictionary.subtitle}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                {locale === "sv" ? "Skicka Ett Meddelande" : "Send Us a Message"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {locale === "sv"
                  ? "Fyll i formuläret nedan så återkommer vi så snart som möjligt."
                  : "Fill out the form below and we'll get back to you as soon as possible."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{dictionary.form.name}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{dictionary.form.email}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{dictionary.form.phone}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{dictionary.form.message}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-32 bg-gray-800 border-gray-700"
                  />
                </div>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                  {dictionary.form.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                {locale === "sv" ? "Kontaktinformation" : "Contact Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-orange-500 mt-1" />
                <div>
                  <h3 className="font-medium text-white">{locale === "sv" ? "Adress" : "Address"}</h3>
                  <p className="text-gray-400 whitespace-pre-line">{dictionary.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-orange-500 mt-1" />
                <div>
                  <h3 className="font-medium text-white">{locale === "sv" ? "Telefon" : "Phone"}</h3>
                  <p className="text-gray-400">{dictionary.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-orange-500 mt-1" />
                <div>
                  <h3 className="font-medium text-white">{locale === "sv" ? "E-post" : "Email"}</h3>
                  <p className="text-gray-400">{dictionary.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-orange-500 mt-1" />
                <div>
                  <h3 className="font-medium text-white">{locale === "sv" ? "Öppettider" : "Opening Hours"}</h3>
                  <p className="text-gray-400 whitespace-pre-line">{dictionary.hours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">{locale === "sv" ? "Hitta Hit" : "Location"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-[300px] w-full rounded-md overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2254.0133467208376!2d12.997759576678973!3d55.60567427403658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4653a15af59a1d91%3A0xa2f9089ed494eb2f!2sBaltzargatan%2025%2C%20211%2036%20Malm%C3%B6%2C%20Sweden!5e0!3m2!1sen!2sus!4v1711143223185!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Baltzar Tandvård Location"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
