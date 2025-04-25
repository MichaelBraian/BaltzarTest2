import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cosmetic Dentistry | Baltzar Tandvård',
  description: 'Advanced cosmetic dental procedures at Baltzar Tandvård',
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CosmeticDentistryPage({ params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          {locale === 'sv' ? 'Kosmetisk Tandvård' : 'Cosmetic Dentistry'}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Våra Tjänster' : 'Our Services'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Tandblekning' : 'Teeth whitening'}</li>
            <li>{locale === 'sv' ? 'Porslinfasader' : 'Porcelain veneers'}</li>
            <li>{locale === 'sv' ? 'Tandkronor' : 'Dental crowns'}</li>
            <li>{locale === 'sv' ? 'Tandkonturering' : 'Dental contouring'}</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Fördelar' : 'Benefits'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Ökat självförtroende' : 'Increased confidence'}</li>
            <li>{locale === 'sv' ? 'Förbättrat leende' : 'Enhanced smile'}</li>
            <li>{locale === 'sv' ? 'Hållbara resultat' : 'Long-lasting results'}</li>
            <li>{locale === 'sv' ? 'Minimalt invasiva metoder' : 'Minimally invasive techniques'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 