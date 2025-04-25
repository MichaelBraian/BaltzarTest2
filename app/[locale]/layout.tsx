import "./globals.css"
import { Providers } from "@/components/providers"
import { getDictionary } from "@/lib/dictionaries"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Montserrat } from "next/font/google"
import type { Metadata } from "next"
import { ReactNode } from "react"

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Baltzar Tandvård",
  description: "Advanced Specialist Dental Care",
}

// Define the layout props type for Next.js 15
type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  const dict = await getDictionary(locale)

  return (
    <html lang={locale}>
      <body className={montserrat.className}>
        <Providers locale={locale}>
          <Header dictionary={dict.navigation} locale={locale} />
          {children}
          <Footer dictionary={dict.footer} locale={locale} />
        </Providers>
      </body>
    </html>
  )
}
