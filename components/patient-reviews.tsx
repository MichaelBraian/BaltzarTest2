"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Review {
  date: string
  author: string
  review: string
  rating: number
  language: string
}

interface PatientReviewsProps {
  locale: string
  title: string
  subtitle: string
}

// Replace the entire reviewsData array with this expanded version that includes all the reviews
const reviewsData: Review[] = [
  {
    date: "2024-05-06",
    author: "MK",
    review: "Alltid positiv och tillmötesgående.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2024-04-15",
    author: "AA",
    review: "Det finns ingen bättre Tandläkare och jag har träffat en hel del över alla min år tack Michael.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2024-01-31",
    author: "JB",
    review: "Utmärkt som vanligt.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2024-01-11",
    author: "CB",
    review: "Bästa tandläkaren jag varit hos",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-12-06",
    author: "AC",
    review:
      "En professionell och trevlig tandläkare med härlig personal i hjärtat av Malmö. Här möts du av omtanke om dig som person och om dina tänder.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-12-05",
    author: "CG",
    review:
      "Professionell och förtroendeingivande, förklarar pedagogiskt vilka alternativ som finns. Resultatet blev utmärkt och som förväntat, rekommenderas varmt!",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-11-15",
    author: "BF",
    review: "Proffsigt!",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-09-07",
    author: "CP",
    review: "Väldigt duktig! Högsta betyg.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-05-31",
    author: "MC",
    review: "Jag rekommenderar starkt Dr. Michael. Han är bra och väldigt noggrann på sitt jobb.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-05-10",
    author: "MH",
    review:
      "Gemytlig stämning, genomgående professionalism och stort fokus på teknik som dels underlättar och dels sparar tid. Varmaste rekommendationer!",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-05-09",
    author: "IZ",
    review: "Proffsig och snabb, duktig på att förklara vad som ska göras, lätt på handen.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-03-02",
    author: "SN",
    review:
      "Jeg kører gerne fra Danmark til Malmø til Michael for at få kontrolleret og lavet alt på mine tænder. Jeg har haft tandlægeskræk fra mine besøg i Danmark, da mine tænder ikke er lavet korrekt, selvom jeg har betalt for dette. Jeg er MEGET tryg i Michael og hans team og de er grundige og mega søde.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-12-19",
    author: "RS",
    review:
      "Lyssnar in på önskemål och skapar nog med passion för det blev jättefint! Bra och trevlig bemötande av Professionell och kunnig personal. Kommer från besöket med en känsla av omhändertagande och god munhygien…",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-09-12",
    author: "NL",
    review:
      "Friendly, thorough, and professional care from the very first mail or phone call through the whole row of treatments. I quite simply can not recommend the staff highly enough. I owe them my smile 😁",
    rating: 5,
    language: "en",
  },
  {
    date: "2022-08-16",
    author: "BA",
    review: "Bästa Tandläkare",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-08-11",
    author: "MB",
    review:
      "Proffsiga, vänliga, jobbar med ärlighet. Absolut ett ställe jag rekommenderar till många vänner och bekanta.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-06-28",
    author: "AS",
    review:
      "Lyssnar och förklarar på ett väldigt trevligt sätt, säger sin ärliga mening och försöker inte sälja på några onödiga behandlingar. Har aldrig trivts så här bra hos någon annan tandläkare!",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-06-15",
    author: "MM",
    review:
      "Mycket proffsigt. Saklig och grundlig info i en behaglig miljö. Personalen uppvisade ett trevligt bemötande. Kan varmt rekomenderas.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-06-13",
    author: "AB",
    review: "Kompetent, empatisk och trevlig.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-05-17",
    author: "SO",
    review: "Alt är bra!",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-04-25",
    author: "PN",
    review:
      "Är du rädd för att gå till tandläkaren? Gå till Michael. Han fixar dina tänder varsamt o tryggt med bästa resultat.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-04-04",
    author: "MM",
    review: "Professionell, grundlig, hjärtlig",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-04-01",
    author: "JA",
    review:
      "Michael utmärker sig genom sitt lugna och omhändertagande sätt där patienten sätts i fokus. Behandlingen håller högsta klass och dokumenteras omsorgsfullt. Michael är noggrann och förefaller vara väldigt kompetent och har stort intresse för sitt yrke.",
    rating: 5,
    language: "sv",
  },
  // Filip's reviews
  {
    date: "2023-09-25",
    author: "JS",
    review: "Mycket nöjd med Filip, ger ett tryggt intryck och känns nogrann. Rekommenderar starkt",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-02-21",
    author: "LR",
    review: "Tandläkare team med mycket proffsigt bemötande och utmärkt resultat. Mycket nöjd med Filips arbete.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-02-13",
    author: "LA",
    review:
      "Mycket vänligt och bra bemötande och behandling. Bästa tandläkaren jag haft ur alla aspekter. Rekommenderas varmt!",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-01-26",
    author: "LH",
    review:
      "Proffesionellt och mycket postivt bemötande både från Filip och övrig personal. Kan verkligen rekommenderas",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-12-13",
    author: "MR",
    review:
      "Filip är den bästa tandläkaren jag någonsin haft. Proffsig, snabb, personlig och intresserad. Det gör aldrig ont, och han kommunicerar bra medan han arbetar, förbereder patienten på vad som ska hända. Personalen i övrigt är också supertrevlig och man känner sig väldigt välkommen.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-10-27",
    author: "HM",
    review:
      "Gott och genuint bemötande, noggrann i sitt utförande. Fick utrymme att ställa frågor och kände att jag bemöttes i dessa med en hög professionalitet; Filip verkade svara utifrån vad som skulle ligga i mitt bästa intresse snarare än i den egna verksamhetens, vilket uppskattades.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-10-18",
    author: "BA",
    review: "Vänligt bemötande och information löpande. Inget nonsen-prat, men glada miner från alla på mottagningen.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-10-10",
    author: "AN",
    review:
      'Jag är så nöjd med både kvaliteten, resultatet och det trevliga bemötandet. Känner alltid att det är relevanta rekommendationer på åtgärder och jag uppskattar att Filip inte lagar "i onödan" utan sakligt berättar hur det ser ut och vilka alternativ som är möjliga.',
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-04-22",
    author: "MS",
    review:
      "Mycket duktig o lätt på handen! Upplever nästan behandlingarna som smärtfria! PS. Jag har haft tandläkarskräck tidigare",
    rating: 5,
    language: "sv",
  },
  // Arman's reviews
  {
    date: "2023-12-13",
    author: "SK",
    review:
      "Jag kan varmt rekommendera Arman och han team, där medmänsklighet och gedigen kunskap går hand i hand. Som patient kan man inte begära mer!!",
    rating: 5,
    language: "sv",
  },
  {
    date: "2023-12-01",
    author: "KL",
    review: "Alltid väl bemött och tydlig förklaring",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-10-15",
    author: "AA",
    review:
      "Väldigt trevligt, professionell och vänligt bemötande! Kände mig trygg och omhändertagen under hela behandlingen. Kan verkligen rekommendera!",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-10-09",
    author: "LD",
    review: "Väl bemötande och grundlig vård.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-08-24",
    author: "RK",
    review:
      "Proffsig bemötande från dag 1. Mycket bra på att informera vad som är gjort och vad som kommer att göras nästa gång och framöver. Dessutom har de helt underbara sköterskor.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-08-18",
    author: "MH",
    review:
      "Upplevelsen var jätte bra och nöjd med behandlingen. Känner mig alltid hemma när jag kommer ditt. Trevligt bemöt.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-06-07",
    author: "IL",
    review:
      "Innan behandling ska man genom lite nödvändiga steg, som t.ex tandställning för att snygga till felställningar och tandhälsovård för att det ska vara fint och rent. Sedan kikar Arman på hur det ska se ut för att en snygg och symmetrisk rad tänder och planerar utifrån detta.",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-05-01",
    author: "ZA",
    review:
      "Se till att du alltid får den bästa sjukvården från honom. Din tillfredsställelse är mycket viktig för honom.😁👍",
    rating: 5,
    language: "sv",
  },
  {
    date: "2022-04-29",
    author: "LL",
    review: "Trevlig och förklarade allt tydligt. Gav även tips på skötsel och vad som kommer att hända i framtiden.",
    rating: 5,
    language: "sv",
  },
  // English translations for some reviews
  {
    date: "2024-05-06",
    author: "MK",
    review: "Always positive and accommodating.",
    rating: 5,
    language: "en",
  },
  {
    date: "2024-04-15",
    author: "AA",
    review: "There is no better dentist, and I have met quite a few over all my years. Thank you, Michael.",
    rating: 5,
    language: "en",
  },
  {
    date: "2024-01-31",
    author: "JB",
    review: "Excellent as usual.",
    rating: 5,
    language: "en",
  },
  {
    date: "2024-01-11",
    author: "CB",
    review: "The best dentist I've ever been to.",
    rating: 5,
    language: "en",
  },
  {
    date: "2023-12-06",
    author: "AC",
    review:
      "A professional and pleasant dentist with wonderful staff in the heart of Malmö. Here you are met with care for you as a person and for your teeth.",
    rating: 5,
    language: "en",
  },
]

// Now update the PatientReviews component to ensure continuous flow
export function PatientReviews({ locale, title, subtitle }: PatientReviewsProps) {
  // Filter reviews by language
  const filteredReviews = reviewsData.filter((review) => review.language === locale)

  // Create a longer array by repeating reviews to ensure continuous flow
  const extendedReviews = [...filteredReviews, ...filteredReviews]

  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  // Responsive breakpoints for number of visible reviews
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isTablet = useMediaQuery("(min-width: 768px)")

  // Calculate how many reviews to show based on screen size
  const visibleReviews = isDesktop ? 3 : isTablet ? 2 : 1

  // Format date based on locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === "sv" ? "sv-SE" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle manual navigation
  const handleNext = () => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / visibleReviews
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handlePrev = () => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth / visibleReviews
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  // Continuous scrolling animation
  useEffect(() => {
    const container = containerRef.current
    if (!container || isPaused) return

    let startTime: number | null = null
    const totalDuration = 686000 // 686 seconds to scroll through all reviews (30% slower than previous)
    const totalWidth = container.scrollWidth - container.clientWidth

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / totalDuration, 1)

      // Calculate position with a slight easing
      container.scrollLeft = progress * totalWidth

      // Reset when we reach the end
      if (progress === 1) {
        startTime = timestamp
        container.scrollLeft = 0
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused])

  // Reset scroll position when reviews change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0
    }
  }, [filteredReviews.length])

  return (
    <section className="container py-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">{title}</h2>
        <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">{subtitle}</p>
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          className="overflow-x-hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div
            className="flex"
            style={{
              width: `${(extendedReviews.length * 100) / visibleReviews}%`,
            }}
          >
            {extendedReviews.map((review, index) => (
              <div
                key={`${review.author}-${index}`}
                className="px-3"
                style={{ width: `${100 / extendedReviews.length}%` }}
              >
                <ReviewCard review={review} formatDate={formatDate} index={index % filteredReviews.length} />
              </div>
            ))}
          </div>
        </div>

        {/* Control buttons - always visible for better UX */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full border-gray-700 bg-background/80 backdrop-blur z-10"
          onClick={handlePrev}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="sr-only">Previous reviews</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full border-gray-700 bg-background/80 backdrop-blur z-10"
          onClick={handleNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span className="sr-only">Next reviews</span>
        </Button>
      </div>
    </section>
  )
}

interface ReviewCardProps {
  review: Review
  formatDate: (date: string) => string
  index: number
}

function ReviewCard({ review, formatDate, index }: ReviewCardProps) {
  // Determine if this is a short review (less than 100 characters)
  const isShortReview = review.review.length < 100

  return (
    <Card
      className={`bg-gray-800 border-gray-700 flex flex-col overflow-hidden hover:border-orange-500/50 transition-all duration-300 ${isShortReview ? "h-auto" : "h-full"}`}
    >
      <CardContent className="pt-6 flex-grow relative">
        <Quote className="absolute top-4 right-4 h-12 w-12 text-gray-700 opacity-30" />

        <div className="flex mb-4">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-orange-500 text-orange-500" />
          ))}
        </div>

        <p className="text-gray-300 relative z-10 text-lg italic">"{review.review}"</p>
      </CardContent>

      <CardFooter className="border-t border-gray-700 pt-4 pb-6 mt-auto">
        <div>
          <p className="font-medium text-white text-lg">{review.author}</p>
          <p className="text-sm text-gray-400">{formatDate(review.date)}</p>
        </div>
      </CardFooter>
    </Card>
  )
}
