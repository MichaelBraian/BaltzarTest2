import { getDictionary } from "@/lib/dictionaries"
import { ServicesClient } from "@/components/services-client"

export default async function ServicesPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale
  // Fetch dictionary data on the server
  const dict = await getDictionary(locale)

  return <ServicesClient dictionary={dict.services} locale={locale} />
}
