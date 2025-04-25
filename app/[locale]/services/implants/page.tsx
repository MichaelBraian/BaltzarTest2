import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Implants | Baltzar Tandvård',
  description: 'Professional dental implant services at Baltzar Tandvård',
}

export default function ImplantsPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
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
            {locale === 'sv' ? 'Vad är tandimplantat?' : 'What are Dental Implants?'}
          </h2>
          <p className="text-gray-300">
            {locale === 'sv' 
              ? 'Tandimplantat är en permanent lösning för att ersätta saknade tänder. De fungerar som konstgjorda tandrötter som fästs i käkbenet.'
              : 'Dental implants are a permanent solution for replacing missing teeth. They function as artificial tooth roots that are anchored in the jawbone.'}
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {locale === 'sv' ? 'Fördelar' : 'Benefits'}
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>{locale === 'sv' ? 'Permanent lösning' : 'Permanent solution'}</li>
            <li>{locale === 'sv' ? 'Förbättrad munhälsa' : 'Improved oral health'}</li>
            <li>{locale === 'sv' ? 'Naturligt utseende' : 'Natural appearance'}</li>
            <li>{locale === 'sv' ? 'Förbättrad tal- och matförmåga' : 'Improved speech and eating'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 