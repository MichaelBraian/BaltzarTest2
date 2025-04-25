import { ReactNode } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: '%s | Baltzar Tandvård',
    default: 'Dashboard | Baltzar Tandvård',
  },
}

type DashboardLayoutProps = {
  children: ReactNode
  params: { locale: string }
}

export default function DashboardLayout({
  children,
  params: { locale },
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-background pt-24 pb-16"> {/* pt-24 adds padding to avoid menu overlap */}
      <div className="container mx-auto">
        {children}
      </div>
    </main>
  )
} 