import { getDictionary } from "@/lib/dictionaries"
import { ContactHero } from "@/components/contact-hero"
import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"
import { ContactMap } from "@/components/contact-map"

export default async function ContactPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale
  // Fetch dictionary data on the server
  const dict = await getDictionary(locale)

  return (
    <div>
      <ContactHero locale={locale} />
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <ContactForm dictionary={dict.contact} locale={locale} />
          <ContactInfo dictionary={dict.contact} locale={locale} />
        </div>
      </div>
      <ContactMap locale={locale} />
    </div>
  )
}
