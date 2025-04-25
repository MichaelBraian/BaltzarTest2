import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dental Services | Baltzar Tandvård',
  description: 'Comprehensive dental services at Baltzar Tandvård',
}

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ServicesPage({ params }: Props) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  
  const services = [
    {
      id: 'general',
      title: locale === 'sv' ? 'Allmän Tandvård' : 'General Dentistry',
      description: locale === 'sv' 
        ? 'Omfattande tandvård för alla dina grundläggande behov.'
        : 'Comprehensive care for all your basic dental needs.',
      url: `/${locale}/services/general`
    },
    {
      id: 'cosmetic',
      title: locale === 'sv' ? 'Kosmetisk Tandvård' : 'Cosmetic Dentistry',
      description: locale === 'sv'
        ? 'Förbättra ditt leende med våra estetiska behandlingar.'
        : 'Enhance your smile with our aesthetic treatments.',
      url: `/${locale}/services/cosmetic`
    },
    {
      id: 'implants',
      title: locale === 'sv' ? 'Tandimplantat' : 'Dental Implants',
      description: locale === 'sv'
        ? 'Permanenta lösningar för saknade tänder.'
        : 'Permanent solutions for missing teeth.',
      url: `/${locale}/services/implants`
    },
    {
      id: 'children',
      title: locale === 'sv' ? 'Barntandvård' : 'Children\'s Dentistry',
      description: locale === 'sv'
        ? 'Specialiserad tandvård för barn i alla åldrar.'
        : 'Specialized dental care for children of all ages.',
      url: `/${locale}/services/children`
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          {locale === 'sv' ? 'Våra Tjänster' : 'Our Services'}
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          {locale === 'sv' 
            ? 'Baltzar Tandvård erbjuder en komplett uppsättning tandvårdstjänster för att tillgodose alla dina behov.'
            : 'Baltzar Tandvård offers a complete range of dental services to accommodate all your needs.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <Link 
            href={service.url}
            key={service.id}
            className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors block"
          >
            <h2 className="text-2xl font-semibold text-white mb-2">{service.title}</h2>
            <p className="text-gray-300 mb-4">{service.description}</p>
            <span className="text-blue-400">
              {locale === 'sv' ? 'Läs mer' : 'Learn more'} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
