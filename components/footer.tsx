import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer({
  locale,
  dictionary,
}: {
  locale: string
  dictionary: any
}) {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="mb-6">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Baltzar_Tandvard-SrPUChwvVi0i84aU2NFJcGBvyVGAVO.png"
                alt="Baltzar Tandvård"
                width={160}
                height={45}
                className="h-12 w-auto"
                loading="lazy"
              />
            </div>
            <h3 className="mb-4 text-lg font-medium text-white">{dictionary.company.title}</h3>
            <ul className="space-y-2">
              {dictionary.company.links.map((link: any, index: number) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium text-white">{dictionary.services.title}</h3>
            <ul className="space-y-2">
              {dictionary.services.links.map((link: any, index: number) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium text-white">{dictionary.contact.title}</h3>
            <address className="not-italic text-gray-400">
              <p>{dictionary.contact.address}</p>
              <p className="mt-2">{dictionary.contact.phone}</p>
              <p className="mt-2">{dictionary.contact.email}</p>
            </address>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium text-white">{dictionary.social.title}</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Baltzar Tandvård. {dictionary.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
