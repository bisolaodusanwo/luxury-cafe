import Image from "next/image"
import Link from "next/link"

const collageImages = [
  "/images/b.avif",
  "/images/gallery-1.jpg",
  "/images/gallery-3.jpg",
  "/images/menu/jollof-rice.jpg",
]

export function FeaturedSection() {
  return (
    <section id="menu" className="relative py-20 md:py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p className="mb-4 text-sm font-medium tracking-[0.3em] uppercase text-primary">
            Menu Preview
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Curated Visual Deck
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-muted-foreground leading-relaxed">
            Our dishes are listed in text for consistency. We use a separate image deck for atmosphere and brand storytelling.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {collageImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className={`relative overflow-hidden rounded-xl border border-border bg-card shadow-lg ${
                index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"
              }`}
            >
              <div className="relative aspect-[4/3]">
                <Image src={src} alt="Restaurant visual" fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </section>
  )
}
