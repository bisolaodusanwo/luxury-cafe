import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gold ambient glow */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-primary/8 blur-[100px]" />
        {/* Subtle secondary glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="text-center">
          {/* Overline */}
          <p className="mb-6 text-sm font-medium tracking-[0.3em] uppercase text-primary">
            Est. 2024 · Paris
          </p>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-foreground leading-[1.1]">
            <span className="block">Artisan Ice Cream</span>
            <span className="block mt-2 text-primary">&</span>
            <span className="block mt-2">Café Experience</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
            Where craftsmanship meets indulgence. Discover our handcrafted gelato 
            and specialty coffee, curated for the discerning palate.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#menu"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-4 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-primary/90"
            >
              Explore Our Menu
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#experience"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-secondary px-8 py-4 text-sm font-medium tracking-wide text-foreground transition-all hover:bg-secondary/80"
            >
              Our Story
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="h-12 w-px bg-gradient-to-b from-muted-foreground/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
