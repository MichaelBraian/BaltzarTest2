import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cosmetic Dentistry | Baltzar Tandvård',
  description: 'Professional cosmetic dental treatments at Baltzar Tandvård',
}

export default function CosmeticDentistryPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          {locale === 'sv' ? 'Estetisk Tandvård' : 'Cosmetic Dentistry'}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Våra Behandlingar' : 'Our Treatments'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Tandblekning' : 'Teeth whitening'}</li>
            <li>{locale === 'sv' ? 'Tandfärgning' : 'Teeth coloring'}</li>
            <li>{locale === 'sv' ? 'Tandfyllningar' : 'Dental fillings'}</li>
            <li>{locale === 'sv' ? 'Tandkorrigerande behandlingar' : 'Orthodontic treatments'}</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Fördelar' : 'Benefits'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Förbättrat självförtroende' : 'Improved confidence'}</li>
            <li>{locale === 'sv' ? 'Naturligt utseende' : 'Natural appearance'}</li>
            <li>{locale === 'sv' ? 'Långvariga resultat' : 'Long-lasting results'}</li>
            <li>{locale === 'sv' ? 'Skräddarsydda lösningar' : 'Customized solutions'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 