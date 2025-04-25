import { getDictionary } from "@/lib/dictionaries"
import { AboutHero } from "@/components/about-hero"
import { AboutMission } from "@/components/about-mission"
import { AboutDigitalDentistry } from "@/components/about-digital-dentistry"
import { AboutHistory } from "@/components/about-history"
import { AboutValues } from "@/components/about-values"
import { AboutContact } from "@/components/about-contact"
import { Metadata } from "next"

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)
  
  return {
    title: dict.navigation.about,
    description: "Learn more about Baltzar Tandvård - Advanced Specialist Dental Care",
  }
}

export default async function AboutPage({ params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <AboutHero locale={locale} />
      <AboutMission locale={locale} />
      <AboutHistory locale={locale} />
      <AboutDigitalDentistry locale={locale} />
      <AboutValues locale={locale} />
      <AboutContact locale={locale} />
    </main>
  )
}
