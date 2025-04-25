import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Children\'s Dentistry | Baltzar Tandvård',
  description: 'Specialized pediatric dental care at Baltzar Tandvård',
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ChildrensDentistryPage({ params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          {locale === 'sv' ? 'Barntandvård' : 'Children\'s Dentistry'}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Våra Tjänster' : 'Our Services'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Rutinkontroller för barn' : 'Routine check-ups for children'}</li>
            <li>{locale === 'sv' ? 'Förebyggande tandvård' : 'Preventive dental care'}</li>
            <li>{locale === 'sv' ? 'Tandreglering' : 'Orthodontics'}</li>
            <li>{locale === 'sv' ? 'Lugnare tandläkarbesök' : 'Calm dental visits'}</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Vår Approach' : 'Our Approach'}
          </h2>
          <p className="text-gray-300">
            {locale === 'sv' 
              ? 'Vi skapar en lugn och välkomnande miljö för barn. Vårt team är specialiserat på att hantera barns tandvårdsbehov och oro på ett empatiskt sätt.'
              : 'We create a calm and welcoming environment for children. Our team specializes in addressing children\'s dental needs and anxieties with empathy.'}
          </p>
        </div>
      </div>
    </div>
  )
} 