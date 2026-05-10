import { MapPin, Clock, Phone } from "lucide-react"

const locations = [
  {
    city: "Paris",
    address: "42 Rue de Rivoli, 75004",
    hours: "8:00 AM - 10:00 PM",
    phone: "+33 1 42 86 82 82",
    featured: true,
  },
  {
    city: "London",
    address: "15 King Street, Covent Garden",
    hours: "9:00 AM - 9:00 PM",
    phone: "+44 20 7836 4751",
    featured: false,
  },
  {
    city: "New York",
    address: "89 Madison Avenue, Manhattan",
    hours: "7:00 AM - 11:00 PM",
    phone: "+1 212 555 0123",
    featured: false,
  },
]

export function LocationsSection() {
  return (
    <section id="locations" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background-secondary" />

      {/* Ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
            Visit Us
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            Our Locations
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-muted-foreground leading-relaxed">
            Experience Maison Glacé at one of our carefully designed spaces 
            around the world.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <div
              key={index}
              className={`glass-panel rounded-xl p-8 transition-all duration-300 hover:border-primary/20 ${
                location.featured ? "md:scale-105 border-primary/10" : ""
              }`}
            >
              {location.featured && (
                <span className="inline-block mb-4 text-xs font-medium tracking-widest uppercase text-primary">
                  Flagship
                </span>
              )}
              <h3 className="font-serif text-3xl font-light text-foreground">
                {location.city}
              </h3>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{location.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{location.hours}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{location.phone}</span>
                </div>
              </div>

              <button className="mt-8 w-full rounded-md border border-border bg-secondary py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary/80 hover:border-primary/20">
                Get Directions
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
