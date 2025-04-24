"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function ContactForm({ dictionary, locale }: { dictionary: any; locale: string }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  // Add state for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = locale === "sv" ? "Namn krävs" : "Name is required"
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = locale === "sv" ? "E-post krävs" : "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = locale === "sv" ? "Ogiltig e-postadress" : "Invalid email address"
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = locale === "sv" ? "Meddelande krävs" : "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update handleSubmit to use validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(false)

    // Simulate form submission
    setTimeout(() => {
      try {
        console.log("Form submitted:", formData)
        setIsSubmitting(false)
        setSubmitSuccess(true)

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({ name: "", email: "", phone: "", message: "" })
          setSubmitSuccess(false)
        }, 3000)
      } catch (error) {
        console.error("Form submission error:", error)
        setIsSubmitting(false)
        setSubmitError(true)
      }
    }, 1500)
  }

  return (
    <>
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
          {locale === "sv" ? "Kontakta Oss" : "Contact Us"}
        </h2>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
          {locale === "sv"
            ? "Vi tar emot nya patienter och hjälper gärna till med frågor om våra behandlingar. Kontakta oss via formuläret eller använd våra kontaktuppgifter nedan."
            : "We are accepting new patients and are happy to help with questions about our treatments. Contact us via the form or use our contact details below."}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gray-800 border-gray-700 h-full">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                {locale === "sv" ? "Skicka Ett Meddelande" : "Send Us a Message"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                aria-label={locale === "sv" ? "Kontaktformulär" : "Contact form"}
                noValidate
              >
                <div className="space-y-2">
                  <Label htmlFor="name">{dictionary.form.name}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={cn("bg-gray-700 border-gray-600", errors.name && "border-red-500 focus:ring-red-500")}
                    disabled={isSubmitting}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">
                      {errors.name}
                    </p>
                  )}
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
                    className={cn("bg-gray-700 border-gray-600", errors.email && "border-red-500 focus:ring-red-500")}
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{dictionary.form.phone}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-gray-700 border-gray-600"
                    disabled={isSubmitting}
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
                    className={cn(
                      "min-h-32 bg-gray-700 border-gray-600",
                      errors.message && "border-red-500 focus:ring-red-500",
                    )}
                    disabled={isSubmitting}
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 relative overflow-hidden"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {locale === "sv" ? "Skickar..." : "Sending..."}
                    </span>
                  ) : submitSuccess ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="h-5 w-5 mr-2 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {locale === "sv" ? "Skickat!" : "Sent!"}
                    </span>
                  ) : (
                    dictionary.form.submit
                  )}
                </Button>

                {submitError && (
                  <p className="text-red-500 text-sm mt-2">
                    {locale === "sv"
                      ? "Ett fel uppstod. Försök igen senare."
                      : "An error occurred. Please try again later."}
                  </p>
                )}
                {submitSuccess && (
                  <div className="sr-only" role="status" aria-live="polite">
                    {locale === "sv" ? "Formuläret har skickats framgångsrikt." : "Form submitted successfully."}
                  </div>
                )}

                {submitError && (
                  <div className="sr-only" role="alert">
                    {locale === "sv"
                      ? "Ett fel uppstod. Försök igen senare."
                      : "An error occurred. Please try again later."}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gray-800 border-gray-700">
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

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">{locale === "sv" ? "Hitta Hit" : "Find Us"}</CardTitle>
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
              <div className="mt-4">
                <p className="text-gray-400">
                  {locale === "sv"
                    ? "Vi är centralt belägna i Malmö, med goda kommunikationer och parkeringsmöjligheter i närheten."
                    : "We are centrally located in Malmö, with good transportation connections and parking options nearby."}
                </p>
                <ul className="mt-2 space-y-1 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500 mt-2"></span>
                    <span>
                      {locale === "sv"
                        ? "5 minuters promenad från Malmö Centralstation"
                        : "5 minutes walk from Malmö Central Station"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500 mt-2"></span>
                    <span>
                      {locale === "sv"
                        ? "Parkeringshus finns på Baltzargatan och Södra Förstadsgatan"
                        : "Parking garages available on Baltzargatan and Södra Förstadsgatan"}
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
