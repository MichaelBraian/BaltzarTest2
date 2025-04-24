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

export default async function Home({
  params: { locale },
}: {
  params: { locale: string }
}) {
  // Get dictionary data
  const dict = await getDictionary(locale)

  // Get staff data and values from separate files
  const { doctors, staff } = getStaffData(locale)
  const values = getValues(locale)

  // Section titles for staff section
  const staffTitles = {
    doctors: locale === "sv" ? "Våra Tandläkare" : "Our Dentists",
    doctorsSubtitle:
      locale === "sv"
        ? "Våra tandläkare är specialister inom sina respektive områden och använder den senaste digitala teknologin för att ge dig bästa möjliga vård."
        : "Our dentists are specialists in their respective fields and use the latest digital technology to provide you with the best possible care.",
    staff: locale === "sv" ? "Vår Personal" : "Our Staff",
    staffSubtitle:
      locale === "sv"
        ? "Vår dedikerade personal säkerställer att din upplevelse hos Baltzar Tandvård är så bekväm och smidig som möjligt."
        : "Our dedicated staff ensures that your experience at Baltzar Tandvård is as comfortable and smooth as possible.",
    values: locale === "sv" ? "Våra Värderingar" : "Our Values",
    valuesSubtitle:
      locale === "sv"
        ? "På Baltzar Tandvård styrs vi av ett antal kärnvärderingar som formar hur vi arbetar och interagerar med våra patienter."
        : "At Baltzar Tandvård, we are guided by a set of core values that shape how we work and interact with our patients.",
  }

  return (
    <div className="flex flex-col">
      <Navigation locale={locale} />
      <AnimatedBackground />

      {/* 1. Hero Section */}
      <section id="home" className="section min-h-screen">
        <VideoHero dictionary={dict.home.hero} />
      </section>

      {/* Main content area with id for skip link */}
      <main id="main-content">
        {/* 2. Treatments Section */}
        <section id="treatments" className="section py-20">
          <AnimatedSection animation="fadeIn">
            <div className="container mx-auto">
              <ServicesOverview dictionary={{ ...dict.home.services, locale }} />
            </div>
          </AnimatedSection>
        </section>

        {/* 3. Technology Section */}
        <section id="technology" className="section py-20">
          <AnimatedSection animation="slideUp">
            <TechnologySection dictionary={dict.home.technology} />
          </AnimatedSection>
        </section>

        {/* 4. Testimonials Section */}
        <section id="testimonials" className="section py-20">
          <AnimatedSection animation="fadeIn">
            <div className="container mx-auto">
              <PatientReviews
                locale={locale}
                title={dict.home.testimonials.title}
                subtitle={dict.home.testimonials.subtitle}
              />
            </div>
          </AnimatedSection>
        </section>

        {/* 5. Staff Section */}
        <section id="staff" className="section py-20">
          <div className="container mx-auto">
            <HomeStaffSection doctors={doctors} staff={staff} values={values} locale={locale} titles={staffTitles} />
          </div>
        </section>

        {/* 6. Contact Section */}
        <section id="contact" className="section py-20 bg-gray-900">
          <div className="container mx-auto">
            <ContactForm dictionary={dict.contact} locale={locale} />
          </div>
        </section>
      </main>

      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  )
}
