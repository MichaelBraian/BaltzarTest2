import { getDictionary } from "@/lib/dictionaries"
import { TechnologyClient } from "@/components/technology-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Digital Technology | Baltzar Tandvård",
  description: "Advanced digital dentistry technology at Baltzar Tandvård",
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TechnologyPage({ params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  // Fetch dictionary data on the server
  const dict = await getDictionary(locale)

  // Make sure we're explicitly passing the locale to the client component
  return <TechnologyClient dictionary={dict.technology} locale={locale} />
}
