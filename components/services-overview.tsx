"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { SmileIcon as Tooth, Stethoscope, Smile, Users } from "lucide-react"
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

// Update the ServicesOverview function to properly pass the locale
export function ServicesOverview({ dictionary }: { dictionary: any }) {
  // Get the expanded descriptions from the services dictionary if available
  const getExpandedDescription = (index: number) => {
    // Try to get expanded descriptions from the services section
    if (dictionary.services && dictionary.services[index] && dictionary.services[index].expandedDescription) {
      return dictionary.services[index].expandedDescription
    }

    // If not available in the services section, try to get from the main services dictionary
    if (dictionary.items && dictionary.items[index] && dictionary.items[index].expandedDescription) {
      return dictionary.items[index].expandedDescription
    }

    // Fallback to the regular description if no expanded description is available
    return dictionary.services[index].description
  }

  // Extract locale from the parent component or URL
  // This should be passed from the parent component that has access to the URL locale
  const locale = dictionary.locale || "sv" // Use locale from dictionary or default to "sv"

  // Update the services array to include the properly translated pediatric dentistry text
  const services = [
    {
      icon: <Tooth className="h-10 w-10 text-orange-500" />,
      title: dictionary.services[0].title,
      description:
        locale === "sv"
          ? "Implantatbehandling med avancerad 3D-teknik för optimal precision och minimalt ingrepp."
          : "Implant treatment with advanced 3D technology for optimal precision and minimal intervention.",
      expandedDescription:
        locale === "sv"
          ? "Digital Implantatbehandling med 3D-teknik\nPå Baltzar Tandvård erbjuder vi digitalt planerade och utförda implantatbehandlingar med hjälp av den senaste 3D-tekniken. Vår digitala arbetsgång möjliggör:\n\nHögsta möjliga precision vid placering av implantat\n\nMinimal påverkan på omgivande vävnad\n\nFörutsägbarhet och trygghet genom hela behandlingsprocessen\n\nSamarbete mellan tandläkare och tandtekniker i realtid via digitala verktyg\n\nBehandlingen är noggrant planerad med digital röntgen (CBCT) och intraoral scanning, vilket ger dig som patient ett estetiskt och funktionellt resultat med så lite obehag som möjligt.\n\nVill du veta om du är en kandidat för implantat? Kontakta oss för en konsultation."
          : "Digital Implant Treatment with 3D Technology\nAt Baltzar Tandvård, we offer digitally planned and executed implant treatments using the latest 3D technology. Our digital workflow enables:\n\nHighest possible precision when placing implants\n\nMinimal impact on surrounding tissue\n\nPredictability and security throughout the treatment process\n\nReal-time collaboration between dentist and dental technician via digital tools\n\nThe treatment is carefully planned with digital X-ray (CBCT) and intraoral scanning, giving you as a patient an aesthetic and functional result with as little discomfort as possible.\n\nWant to know if you are a candidate for implants? Contact us for a consultation.",
      href: "/services/implants",
    },
    {
      icon: <Stethoscope className="h-10 w-10 text-orange-500" />,
      title: dictionary.services[1].title,
      description:
        locale === "sv"
          ? "Skapa ett naturligt leende med fasader, kronor och blekning – utformat och tillverkat med precision på plats hos oss."
          : "Create a natural smile with veneers, crowns, and whitening – designed and manufactured with precision on-site at our clinic.",
      expandedDescription:
        locale === "sv"
          ? "Estetisk Tandvård – Ett hantverk med teknisk perfektion\nHos Baltzar Tandvård är estetisk tandvård mer än bara en behandling – det är en kombination av vetenskap, teknologi och konstnärskap. Vi erbjuder skräddarsydda lösningar för att förbättra ditt leende genom:\n\nKeramiska fasader som korrigerar form, färg och symmetri\n\nKronor och broar tillverkade med millimeterprecision\n\nTandblekning anpassad efter din naturliga tandfärg\n\nDet som särskiljer oss är att vi tillverkar alla ersättningar själva, direkt i vår digitala tandtekniska miljö. Detta säkerställer:\n\nEn snabbare behandlingsprocess\n\nFull kontroll över varje detalj i design och funktion\n\nMöjligheten att justera färg och form direkt – för ett leende som verkligen passar dig\n\nVi ser varje fall som ett individuellt konstverk där teknik möter estetik – alltid med målet att skapa ett naturligt och harmoniskt resultat som håller över tid."
          : "Aesthetic Dentistry – A craft with technical perfection\nAt Baltzar Tandvård, aesthetic dentistry is more than just a treatment – it's a combination of science, technology, and artistry. We offer tailored solutions to enhance your smile through:\n\nCeramic veneers that correct shape, color, and symmetry\n\nCrowns and bridges manufactured with millimeter precision\n\nTeeth whitening customized to your natural tooth color\n\nWhat sets us apart is that we manufacture all restorations ourselves, directly in our digital dental technical environment. This ensures:\n\nA faster treatment process\n\nComplete control over every detail in design and function\n\nThe ability to adjust color and shape directly – for a smile that truly suits you\n\nWe view each case as an individual work of art where technology meets aesthetics – always with the goal of creating a natural and harmonious result that lasts over time.",
      href: "/services/cosmetic",
    },
    {
      icon: <Smile className="h-10 w-10 text-orange-500" />,
      title: locale === "sv" ? "Specialisttandvård" : "Specialist Dentistry",
      description:
        locale === "sv"
          ? "Avancerad vård inom protetik och parodontologi – för långsiktiga och hållbara resultat."
          : "Advanced care in prosthodontics and periodontology – for long-term and sustainable results.",
      expandedDescription:
        locale === "sv"
          ? "Specialisttandvård med fokus på protetik och parodontologi\nHos Baltzar Tandvård erbjuder vi specialisttandvård med särskild inriktning på protetik och parodontologi – två centrala områden för funktion, estetik och långsiktig tandhälsa.\n\n🔶 Protetik – skräddarsydda ersättningar för tänder\nProtetik handlar om att återskapa tänder som gått förlorade eller är svårt skadade. Det kan handla om:\n\nKronor och broar\n\nFasader\n\nAvtagbara proteser\n\nImplantatstödda konstruktioner\n\nVi arbetar med digital design och egen tillverkning på plats, vilket innebär att du får snabbare behandling, full kontroll över resultatet och kompromisslös estetik.\n\n🔶 Parodontologi – behandling av tandlossningssjukdomar\nParodontologi fokuserar på diagnostik och behandling av sjukdomar i tandkött och benvävnad, såsom:\n\nTandlossning (parodontit)\n\nPeriimplantit (infektion kring implantat)\n\nSpecialistbedömningar och långtidsuppföljning\n\nVårt mål är att bevara dina tänder så länge som möjligt, genom evidensbaserad behandling och noggrann uppföljning.\n\nVåra specialister arbetar i nära samverkan och med stöd av den senaste tekniken – alltid med dig som patient i fokus. Välkommen till specialisttandvård i toppklass."
          : "Specialist Dentistry focusing on prosthodontics and periodontology\nAt Baltzar Tandvård, we offer specialist dental care with a particular focus on prosthodontics and periodontology – two central areas for function, aesthetics, and long-term dental health.\n\n🔶 Prosthodontics – custom-made dental replacements\nProsthodontics involves recreating teeth that have been lost or are severely damaged. This can include:\n\nCrowns and bridges\n\nVeneers\n\nRemovable dentures\n\nImplant-supported constructions\n\nWe work with digital design and in-house manufacturing, which means you get faster treatment, full control over the result, and uncompromising aesthetics.\n\n🔶 Periodontology – treatment of periodontal diseases\nPeriodontology focuses on the diagnosis and treatment of diseases in the gums and bone tissue, such as:\n\nPeriodontal disease\n\nPeri-implantitis (infection around implants)\n\nSpecialist assessments and long-term follow-up\n\nOur goal is to preserve your teeth for as long as possible, through evidence-based treatment and careful follow-up.\n\nOur specialists work in close collaboration and with the support of the latest technology – always with you as a patient in focus. Welcome to top-class specialist dental care.",
      href: "/services/specialist",
    },
    {
      icon: <Users className="h-10 w-10 text-orange-500" />,
      title: locale === "sv" ? "Specialisttandvård för barn" : "Specialist Dentistry for Children",
      description:
        locale === "sv"
          ? "Specialisttandvård för barn och unga upp till 19 år med avtal från Region Skåne. Trygg, omtänksam och professionell vård för de yngsta."
          : "Specialist dentistry for children and young people up to 19 years with agreements from Region Skåne. Safe, caring, and professional care for the youngest.",
      expandedDescription:
        locale === "sv"
          ? "Specialisttandvård för barn\nSpecialisttandvård för barn och unga upp till 19 år med avtal från Region Skåne. Trygg, omtänksam och professionell vård för de yngsta.\n\nVi har avtal med Region Skåne – även för barn och unga\nBaltzar Tandvård erbjuder specialisttandvård för både vuxna och barn genom avtal med Region Skåne.\n\nFör barn och unga upp till 19 år:\nVi är ackrediterade att erbjuda specialisttandvård inom ramen för Region Skånes vårdvalssystem. Det innebär att barn och unga upp till och med det år de fyller 19 kan få avgiftsfri specialisttandvård hos oss – med remiss från tandläkare eller läkare.\n\nFör vuxna patienter:\nVi är anslutna till det nationella tandvårdsstödet och det särskilda högkostnadsskyddet. Du får specialistvård med samma ekonomiska villkor som inom den offentliga vården."
          : "Specialist Dentistry for Children\nSpecialist dentistry for children and young people up to 19 years with agreements from Region Skåne. Safe, caring, and professional care for the youngest.\n\nWe have agreements with Region Skåne – also for children and young people\nBaltzar Tandvård offers specialist dental care for both adults and children through agreements with Region Skåne.\n\nFor children and young people up to 19 years:\nWe are accredited to offer specialist dental care within the framework of Region Skåne's healthcare choice system. This means that children and young people up to and including the year they turn 19 can receive free specialist dental care with us – with a referral from a dentist or doctor.\n\nFor adult patients:\nWe are connected to the national dental care support and the special high-cost protection. You receive specialist care with the same financial conditions as in the public healthcare system.",
      href: "/services/children",
    },
  ]

  return (
    <section className="container py-16 bg-background">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">{dictionary.title}</h2>
        <p className="mt-4 text-lg text-gray-400">{dictionary.subtitle}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} locale={locale} />
        ))}
      </div>
    </section>
  )
}

// Update the ServiceCard component to properly use the locale for the button text
function ServiceCard({ service, locale }: { service: any; locale: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Card className="h-full transition-colors hover:border-orange-500/50 bg-gray-900 border-gray-800 overflow-hidden">
        <CardHeader>
          <motion.div className="mb-2" whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}>
            {service.icon}
          </motion.div>
          <CardTitle className="group-hover:text-orange-500 transition-colors">{service.title}</CardTitle>
        </CardHeader>

        <CardContent className="relative">
          <p className="text-gray-400">{service.description}</p>
        </CardContent>

        <CardFooter>
          <Button
            variant="link"
            className="px-0 text-orange-500 hover:text-orange-400 group"
            onClick={() => setIsDialogOpen(true)}
          >
            <span>{locale === "sv" ? "Läs mer" : "Read More"}</span>
            <span className="inline-block ml-1">↓</span>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-orange-500">{service.title}</DialogTitle>
            <DialogDescription className="text-base text-gray-300 mt-2">{service.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-gray-300 whitespace-pre-line">{service.expandedDescription}</div>
          <DialogFooter className="mt-6">
            <Button
              variant="default"
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={() => setIsDialogOpen(false)}
            >
              {locale === "sv" ? "Stäng" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
