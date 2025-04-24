import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Team } from "@/components/team"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"
import { DigitalTechnology } from "@/components/digital-technology"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section id="home" className="section">
        <Hero />
      </section>

      <section id="services" className="section">
        <Services />
      </section>

      <section id="technology" className="section">
        <DigitalTechnology />
      </section>

      <section id="team" className="section">
        <Team />
      </section>

      <section id="contact" className="section">
        <Contact />
      </section>
    </main>
  )
}
