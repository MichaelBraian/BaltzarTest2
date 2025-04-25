import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

// Optimize font loading - disabled preload to prevent console warnings
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Baltzar Tandvård - Digital Precision, Personal Care",
  description:
    "Modern dental care with digital precision and personal attention in Malmö. Specialists in implants, aesthetic dentistry, and digital dental technology.",
  keywords: ["tandvård", "dental care", "Malmö", "implants", "digital dentistry", "aesthetic dentistry"],
  authors: [{ name: "Baltzar Tandvård" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "https://baltzartandvard.se",
    title: "Baltzar Tandvård - Digital Precision, Personal Care",
    description: "Modern dental care with digital precision and personal attention in Malmö.",
    siteName: "Baltzar Tandvård",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="baltzar-theme"
        >
          <div className="min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
