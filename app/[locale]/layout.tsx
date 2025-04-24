import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { i18n } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Get the locale from params and validate it
  const locale = params.locale
  const isValidLocale = i18n.locales.includes(locale)
  const validLocale = isValidLocale ? locale : i18n.defaultLocale
  
  // Get dictionary data
  const dict = await getDictionary(validLocale)

  return (
    <html lang={validLocale} suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen flex flex-col mx-auto max-w-screen-2xl w-full">
            <Navigation locale={validLocale} />
            <PageTransition>
              <main className="flex-1">{children}</main>
            </PageTransition>
            <Footer locale={validLocale} dictionary={dict.footer} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
