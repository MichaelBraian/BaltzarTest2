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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Ensure params.locale is valid, defaulting to the default locale if not
  const locale = (params && params.locale && i18n.locales.includes(params.locale))
    ? params.locale
    : i18n.defaultLocale
    
  const dict = await getDictionary(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen flex flex-col mx-auto max-w-screen-2xl w-full">
            <Navigation locale={locale} />
            <PageTransition>
              <main className="flex-1">{children}</main>
            </PageTransition>
            <Footer locale={locale} dictionary={dict.footer} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
