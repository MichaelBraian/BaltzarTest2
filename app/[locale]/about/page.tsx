import { getDictionary } from "@/lib/dictionaries"
import { AboutHero } from "@/components/about-hero"
import { AboutMission } from "@/components/about-mission"
import { AboutDigitalDentistry } from "@/components/about-digital-dentistry"
import { AboutHistory } from "@/components/about-history"
import { AboutValues } from "@/components/about-values"
import { AboutContact } from "@/components/about-contact"

interface PageProps {
  params: {
    locale: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function AboutPage({ params: { locale } }: PageProps) {
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
