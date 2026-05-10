import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturedSection } from "@/components/featured-section"
import { ExperienceSection } from "@/components/experience-section"
import { GallerySection } from "@/components/gallery-section"
import { LocationsSection } from "@/components/locations-section"
import { ReservationSection } from "@/components/reservation-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen grain-texture">
      <Navbar />
      <HeroSection />
      <FeaturedSection />
      <ExperienceSection />
      <GallerySection />
      <LocationsSection />
      <ReservationSection />
      <Footer />
    </main>
  )
}
