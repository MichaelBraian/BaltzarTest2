import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Children\'s Dentistry | Baltzar Tandvård',
  description: 'Specialized dental care for children at Baltzar Tandvård',
}

export default function ChildrenDentistryPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          {locale === 'sv' ? 'Barnens Tandvård' : 'Children\'s Dentistry'}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Vårt Tillvägagångssätt' : 'Our Approach'}
          </h2>
          <p className="text-gray-300 mb-4">
            {locale === 'sv' 
              ? 'Vi skapar en trygg och rolig miljö för ditt barns tandvårdsbesök. Vårt mål är att bygga positiva tandvårdsvanor från tidig ålder.'
              : 'We create a safe and fun environment for your child\'s dental visits. Our goal is to build positive dental habits from an early age.'}
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Vänlig personal' : 'Friendly staff'}</li>
            <li>{locale === 'sv' ? 'Barnvänlig miljö' : 'Child-friendly environment'}</li>
            <li>{locale === 'sv' ? 'Tålmodig förklaring' : 'Patient explanation'}</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Tjänster för Barn' : 'Services for Children'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Rutinkontroller' : 'Routine check-ups'}</li>
            <li>{locale === 'sv' ? 'Tandstensavtagning' : 'Dental cleaning'}</li>
            <li>{locale === 'sv' ? 'Fluoridbehandling' : 'Fluoride treatment'}</li>
            <li>{locale === 'sv' ? 'Tandvårdsutbildning' : 'Dental education'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 