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
  // Make sure params exists and has a locale property
  const locale = params?.locale || i18n.defaultLocale
  const dict = await getDictionary(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex min-h-screen flex-col mx-auto max-w-screen-2xl w-full">
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
