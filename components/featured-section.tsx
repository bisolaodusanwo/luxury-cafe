import Image from "next/image"

const featuredItems = [
  {
    id: 1,
    name: "Madagascar Vanilla Bean",
    category: "Signature Gelato",
    description: "Pure Bourbon vanilla from Madagascar, slow-churned to silky perfection",
    price: "$8",
    image: "/images/vanilla-gelato.jpg",
  },
  {
    id: 2,
    name: "Belgian Dark Chocolate",
    category: "Signature Gelato",
    description: "70% Callebaut chocolate with a hint of Himalayan salt",
    price: "$9",
    image: "/images/chocolate-gelato.jpg",
  },
  {
    id: 3,
    name: "Sicilian Pistachio",
    category: "Premium Selection",
    description: "Bronte pistachios, roasted and blended with cream from the Alps",
    price: "$12",
    image: "/images/pistachio-gelato.jpg",
  },
]

export function FeaturedSection() {
  return (
    <section id="menu" className="relative py-20 md:py-32">
      {/* Ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
            Our Creations
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Signature Collection
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-muted-foreground leading-relaxed">
            Each flavor is a masterpiece, crafted with the finest ingredients 
            sourced from around the world.
          </p>
        </div>

        {/* Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <article
              key={item.id}
              className="group glass-panel rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/20"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-medium tracking-widest uppercase text-primary">
                  {item.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-2xl font-light text-foreground">
                    {item.name}
                  </h3>
                  <span className="text-lg font-medium text-primary">
                    {item.price}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* View Full Menu Link */}
        <div className="mt-16 text-center">
          <a
            href="#full-menu"
            className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-primary hover:text-primary/80 transition-colors"
          >
            View Full Menu
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
