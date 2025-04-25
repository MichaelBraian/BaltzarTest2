import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Baltzar Tandvård',
  description: 'Processing your authentication request',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      {children}
    </div>
  )
} 