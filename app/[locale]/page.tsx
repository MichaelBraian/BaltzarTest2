import { VideoHero } from "@/components/video-hero"
import { AnimatedSection } from "@/components/animated-section"
import { AnimatedBackground } from "@/components/animated-background"
import { ServicesOverview } from "@/components/services-overview"
import { TechnologySection } from "@/components/technology-section"
import { PatientReviews } from "@/components/patient-reviews"
import { getDictionary } from "@/lib/dictionaries"
import { HomeStaffSection } from "@/components/home-staff-section"
import { Navigation } from "@/components/navigation"
import { ContactForm } from "@/components/contact-form"
import { ScrollToTop } from "@/components/scroll-to-top"
import { getStaffData } from "@/lib/data/staff"
import { getValues } from "@/lib/data/values"
import { i18n } from "@/lib/i18n-config"
import { Metadata } from "next"

// Define the params type for Next.js 15
type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Add try-catch for robustness, though less likely to fail here
  try {
    const resolvedParams = await params
    const locale = resolvedParams?.locale || i18n.defaultLocale
    console.log(`[Metadata] Attempting to get dictionary for locale: ${locale}`)
    const dict = await getDictionary(locale)
    console.log(`[Metadata] Dictionary fetched successfully for locale: ${locale}`)
    
    return {
      title: "Baltzar Tandvård - Advanced Specialist Dental Care",
      description: dict.home.hero.subtitle,
    }
  } catch (error) {
    console.error("[Metadata] Error generating metadata:", error)
    return {
      title: "Baltzar Tandvård",
      description: "Advanced Specialist Dental Care",
    }
  }
}

export default async function HomePage({ params }: Props) {
  try {
    console.log("[HomePage] Rendering started")
    const resolvedParams = await params
    const locale = resolvedParams?.locale
    console.log(`[HomePage] Received locale param: ${locale}`)

    const isValidLocale = locale && i18n.locales.includes(locale)
    const validLocale = isValidLocale ? locale : i18n.defaultLocale
    console.log(`[HomePage] Using valid locale: ${validLocale}`)

    console.log(`[HomePage] Fetching dictionary for locale: ${validLocale}`)
    const dict = await getDictionary(validLocale)
    console.log(`[HomePage] Dictionary fetched successfully`)

    console.log(`[HomePage] Fetching staff data for locale: ${validLocale}`)
    const { doctors, staff } = getStaffData(validLocale)
    console.log(`[HomePage] Staff data fetched successfully`)

    console.log(`[HomePage] Fetching values data for locale: ${validLocale}`)
    const values = getValues(validLocale)
    console.log(`[HomePage] Values data fetched successfully`)

    const staffTitles = {
      doctors: validLocale === "sv" ? "Våra Tandläkare" : "Our Dentists",
      doctorsSubtitle:
        validLocale === "sv"
          ? "Våra tandläkare är specialister inom sina respektive områden och använder den senaste digitala teknologin för att ge dig bästa möjliga vård."
          : "Our dentists are specialists in their respective fields and use the latest digital technology to provide you with the best possible care.",
      staff: validLocale === "sv" ? "Vår Personal" : "Our Staff",
      staffSubtitle:
        validLocale === "sv"
          ? "Vår dedikerade personal säkerställer att din upplevelse hos Baltzar Tandvård är så bekväm och smidig som möjligt."
          : "Our dedicated staff ensures that your experience at Baltzar Tandvård is as comfortable and smooth as possible.",
      values: validLocale === "sv" ? "Våra Värderingar" : "Our Values",
      valuesSubtitle:
        validLocale === "sv"
          ? "På Baltzar Tandvård styrs vi av ett antal kärnvärderingar som formar hur vi arbetar och interagerar med våra patienter."
          : "At Baltzar Tandvård, we are guided by a set of core values that shape how we work and interact with our patients.",
    }
    console.log("[HomePage] Staff titles prepared")

    console.log("[HomePage] Starting component rendering")
    return (
      <div className="flex flex-col">
        <Navigation locale={validLocale} />
        <AnimatedBackground />

        <section id="home" className="section min-h-screen">
          <VideoHero dictionary={dict.home.hero} />
        </section>

        <main id="main-content">
          <section id="treatments" className="section py-20">
            <AnimatedSection animation="fadeIn">
              <div className="container mx-auto">
                <ServicesOverview dictionary={{ ...dict.home.services, locale: validLocale }} />
              </div>
            </AnimatedSection>
          </section>

          <section id="technology" className="section py-20">
            <AnimatedSection animation="slideUp">
              <TechnologySection dictionary={dict.home.technology} locale={validLocale} />
            </AnimatedSection>
          </section>

          <section id="testimonials" className="section py-20">
            <AnimatedSection animation="fadeIn">
              <div className="container mx-auto">
                <PatientReviews
                  locale={validLocale}
                  title={dict.home.testimonials.title}
                  subtitle={dict.home.testimonials.subtitle}
                />
              </div>
            </AnimatedSection>
          </section>

          <section id="staff" className="section py-20">
            <div className="container mx-auto">
              <HomeStaffSection 
                doctors={doctors} 
                staff={staff} 
                values={values} 
                locale={validLocale} 
                titles={staffTitles} 
              />
            </div>
          </section>

          <section id="contact" className="section py-20 bg-gray-900">
            <div className="container mx-auto">
              <ContactForm dictionary={dict.contact} locale={validLocale} />
            </div>
          </section>
        </main>

        <ScrollToTop />
      </div>
    )
  } catch (error) {
    console.error("[HomePage] Critical error during page rendering:", error);
    // Return a simple error state or component
    return (
      <div>
        <h1>Server Error</h1>
        <p>Sorry, something went wrong while loading the page.</p>
        <p>Error details have been logged.</p>
      </div>
    );
  }
}
