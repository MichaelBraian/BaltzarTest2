import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'General Dentistry | Baltzar Tandvård',
  description: 'Comprehensive general dental care services at Baltzar Tandvård',
}

export default function GeneralDentistryPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          {locale === 'sv' ? 'Allmän Tandvård' : 'General Dentistry'}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Våra Tjänster' : 'Our Services'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Rutinkontroller' : 'Routine check-ups'}</li>
            <li>{locale === 'sv' ? 'Tandstensavtagning' : 'Dental cleaning'}</li>
            <li>{locale === 'sv' ? 'Kariesbehandling' : 'Cavity treatment'}</li>
            <li>{locale === 'sv' ? 'Tandvårdsrådgivning' : 'Dental advice'}</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Varför Välja Oss?' : 'Why Choose Us?'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Erfarna tandläkare' : 'Experienced dentists'}</li>
            <li>{locale === 'sv' ? 'Modern utrustning' : 'Modern equipment'}</li>
            <li>{locale === 'sv' ? 'Personlig service' : 'Personal service'}</li>
            <li>{locale === 'sv' ? 'Flexibla tider' : 'Flexible scheduling'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 