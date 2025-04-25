import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dental Implants | Baltzar Tandvård',
  description: 'Advanced dental implant solutions at Baltzar Tandvård',
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ImplantsPage({ params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          {locale === 'sv' ? 'Tandimplantat' : 'Dental Implants'}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Våra Tjänster' : 'Our Services'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Enstaka implantat' : 'Single tooth implants'}</li>
            <li>{locale === 'sv' ? 'Implantatbroar' : 'Implant-supported bridges'}</li>
            <li>{locale === 'sv' ? 'All-on-4 behandling' : 'All-on-4 treatment'}</li>
            <li>{locale === 'sv' ? 'Benmjölsuppbyggnad' : 'Bone grafting'}</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Fördelar' : 'Benefits'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Livslång lösning' : 'Long-lasting solution'}</li>
            <li>{locale === 'sv' ? 'Naturligt utseende' : 'Natural appearance'}</li>
            <li>{locale === 'sv' ? 'Förbättrad tuggnförmåga' : 'Improved chewing ability'}</li>
            <li>{locale === 'sv' ? 'Bevarar käkbenet' : 'Preserves jawbone'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 