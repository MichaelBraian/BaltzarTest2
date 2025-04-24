import { getDictionary } from "@/lib/dictionaries"
import { TechnologyClient } from "@/components/technology-client"

export default async function TechnologyPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  // Fetch dictionary data on the server
  const dict = await getDictionary(locale)

  // Make sure we're explicitly passing the locale to the client component
  return <TechnologyClient dictionary={dict.technology} locale={locale} />
}
