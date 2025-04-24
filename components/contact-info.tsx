"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { motion } from "framer-motion"

export function ContactInfo({ dictionary, locale }: { dictionary: any; locale: string }) {
  return (
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
          <CardTitle className="text-2xl text-white">{locale === "sv" ? "Hitta Hit" : "Find Us"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            {locale === "sv"
              ? "Vi är centralt belägna i Malmö, med goda kommunikationer och parkeringsmöjligheter i närheten."
              : "We are centrally located in Malmö, with good transportation connections and parking options nearby."}
          </p>
          <ul className="space-y-2 text-gray-400">
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
            <li className="flex items-start gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 mt-2"></span>
              <span>
                {locale === "sv" ? "Busshållplats direkt utanför kliniken" : "Bus stop right outside the clinic"}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
