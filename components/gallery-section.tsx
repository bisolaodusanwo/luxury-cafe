import Image from "next/image"

const galleryImages = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Elegant café interior with warm lighting",
    span: "col-span-2 row-span-2 md:col-span-2 md:row-span-2",
  },
  {
    src: "/images/chef.jpg",
    alt: "Nigerian chef preparing signature dishes",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Specialty coffee latte art",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-4.jpg",
    alt: "Premium ingredients display",
    span: "col-span-1 row-span-1 md:row-span-2",
  },
  {
    src: "/images/gallery-5.jpg",
    alt: "Ice cream cone presentation",
    span: "col-span-1 row-span-1",
  },
]

export function GallerySection() {
  return (
    <section id="gallery" className="relative py-20 md:py-32">
      {/* Ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
            Gallery
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Moments of Indulgence
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[200px]">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl glass-panel group ${image.span}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
