import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { getDictionary } from "@/lib/dictionaries"
import { Navigation } from "@/components/navigation"
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen flex flex-col mx-auto max-w-screen-2xl w-full">
            <Navigation locale={locale} />
            <main>{children}</main>
            <Footer dictionary={dict.footer} locale={locale} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
