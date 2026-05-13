import Image from "next/image"
import { Coffee, Sparkles, Clock, Award } from "lucide-react"

const experiences = [
  {
    icon: Sparkles,
    title: "Handcrafted Daily",
    description: "Every batch is made fresh each morning using traditional Nigerian techniques passed down through generations.",
    image: "/images/gallery-2.jpg",
  },
  {
    icon: Coffee,
    title: "Specialty Coffee",
    description: "Single-origin beans roasted in-house, expertly brewed by our certified baristas.",
    image: "/images/gallery-3.jpg",
  },
  {
    icon: Award,
    title: "Premium Ingredients",
    description: "We source only the finest ingredients from trusted suppliers across the globe.",
    image: "/images/gallery-4.jpg",
  },
  {
    icon: Clock,
    title: "Timeless Recipes",
    description: "Classic recipes refined over decades, honoring tradition while embracing innovation.",
    image: "/images/gallery-5.jpg",
  },
]

const teamHighlights = [
  {
    name: "Chef Adeola",
    role: "Head Chef",
    image: "/images/chef.jpg",
    description: "Leads our kitchen with refined Nigerian flavors and modern presentation.",
  },
  {
    name: "Trainee Chiamaka",
    role: "Culinary Trainee",
    image: "/images/trainee.jpg",
    description: "Supports daily prep and desserts, bringing fresh energy to every service.",
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
              At Alexelle, exceptional Nigerian dining starts with premium
              ingredients, skilled hands, and hospitality rooted in culture.
              Every plate and dessert is crafted to feel both authentic and elevated.
            </p>

            <div className="mt-10 md:mt-12 grid grid-cols-3 gap-4 md:gap-8">
              <div>
                <p className="font-serif text-3xl md:text-4xl font-light text-primary">30+</p>
                <p className="mt-1 md:mt-2 text-xs md:text-sm text-muted-foreground">Nigerian Dishes</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-light text-primary">12</p>
                <p className="mt-1 md:mt-2 text-xs md:text-sm text-muted-foreground">Years Culinary Craft</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-light text-primary">4.9</p>
                <p className="mt-1 md:mt-2 text-xs md:text-sm text-muted-foreground">Guest Rating</p>
              </div>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teamHighlights.map((member) => (
              <article
                key={member.name}
                className="glass-panel rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/20"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">{member.role}</p>
                  <h3 className="mt-2 font-serif text-2xl font-light text-foreground">{member.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{member.description}</p>
                </div>
              </article>
            ))}
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="glass-panel rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/20"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <exp.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-light text-foreground">
                    {exp.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
