import { Footer } from "@/components/footer"
import { MenuCatalog } from "@/components/menu-catalog"
import { Navbar } from "@/components/navbar"

export default function MenuPage() {
  return (
    <main className="relative min-h-screen grain-texture">
      <Navbar />
      <MenuCatalog />
      <Footer />
    </main>
  )
}
