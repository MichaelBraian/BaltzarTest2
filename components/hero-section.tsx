import Image from "next/image"
import { Button } from "@/components/ui/button"

export function HeroSection({ dictionary }: { dictionary: any }) {
  return (
    <section className="relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Modern dental clinic"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>
      <div className="container relative z-10 flex min-h-[600px] flex-col items-center justify-center text-center">
        <h1 className="mb-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
          {dictionary.title}
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-200">{dictionary.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
            {dictionary.bookButton}
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            {dictionary.learnMoreButton}
          </Button>
        </div>
      </div>
    </section>
  )
}
