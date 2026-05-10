import { Coffee, Sparkles, Clock, Award } from "lucide-react"

const experiences = [
  {
    icon: Sparkles,
    title: "Handcrafted Daily",
    description: "Every batch is made fresh each morning using traditional Italian techniques passed down through generations.",
  },
  {
    icon: Coffee,
    title: "Specialty Coffee",
    description: "Single-origin beans roasted in-house, expertly brewed by our certified baristas.",
  },
  {
    icon: Award,
    title: "Premium Ingredients",
    description: "We source only the finest ingredients from trusted suppliers across the globe.",
  },
  {
    icon: Clock,
    title: "Timeless Recipes",
    description: "Classic recipes refined over decades, honoring tradition while embracing innovation.",
  },
]

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background-secondary" />
      
      {/* Ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Text */}
          <div>
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
              The Experience
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-foreground leading-tight">
              A Journey of{" "}
              <span className="text-primary">Refined Taste</span>
            </h2>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
              At Maison Glacé, we believe that exceptional taste begins with 
              uncompromising quality. Every element of our café has been 
              thoughtfully curated to deliver an experience that transcends 
              the ordinary.
            </p>

            <div className="mt-10 md:mt-12 grid grid-cols-3 gap-4 md:gap-8">
              <div>
                <p className="font-serif text-3xl md:text-4xl font-light text-primary">24+</p>
                <p className="mt-1 md:mt-2 text-xs md:text-sm text-muted-foreground">Unique Flavors</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-light text-primary">15</p>
                <p className="mt-1 md:mt-2 text-xs md:text-sm text-muted-foreground">Years of Craft</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-light text-primary">3</p>
                <p className="mt-1 md:mt-2 text-xs md:text-sm text-muted-foreground">Locations</p>
              </div>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="glass-panel rounded-xl p-6 transition-all duration-300 hover:border-primary/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <exp.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-light text-foreground">
                  {exp.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
