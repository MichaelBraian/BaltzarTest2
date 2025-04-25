import { getDictionary } from "@/lib/dictionaries"
import { AboutHero } from "@/components/about-hero"
import { AboutMission } from "@/components/about-mission"
import { AboutDigitalDentistry } from "@/components/about-digital-dentistry"
import { AboutHistory } from "@/components/about-history"
import { AboutValues } from "@/components/about-values"
import { AboutContact } from "@/components/about-contact"
import { Metadata } from "next"

interface PageProps {
  params: { locale: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = params.locale
  const dict = await getDictionary(locale)
  
  return {
    title: dict.navigation.about,
    description: "Learn more about Baltzar Tandvård - Advanced Specialist Dental Care",
  }
}

export default async function AboutPage({ params }: PageProps) {
  const locale = params.locale
  const dict = await getDictionary(locale)

  return (
    <div>
      <AboutHero locale={locale} />
      <AboutMission locale={locale} />
      <AboutHistory locale={locale} />
      <AboutDigitalDentistry locale={locale} />
      <AboutValues locale={locale} />
      <AboutContact locale={locale} />
    </div>
  )
}
