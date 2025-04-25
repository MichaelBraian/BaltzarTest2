import { getDictionary } from "@/lib/dictionaries"
import { ContactHero } from "@/components/contact-hero"
import { ContactForm } from "@/components/contact-form"
import { ContactMap } from "@/components/contact-map"
import { ContactInfo } from "@/components/contact-info"
import { Metadata } from "next"

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)
  
  return {
    title: dict.navigation.contact,
    description: "Contact Baltzar Tandvård - Advanced Specialist Dental Care",
  }
}

export default async function ContactPage({ params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ContactHero locale={locale} />
      <ContactForm dictionary={dict.contact} locale={locale} />
      <ContactMap locale={locale} />
      <ContactInfo dictionary={dict.contact} locale={locale} />
    </main>
  )
}
