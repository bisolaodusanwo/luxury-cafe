"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { menuItems } from "@/lib/menu-data"

const dietaryFilters = ["all", "vegetarian", "vegan", "gluten-free", "spicy", "alcoholic", "non-alcoholic"]
const regionFilters = ["all", "Africa", "Asia", "Europe", "Middle East", "Americas"]

const displaySlides = [
  { src: "/images/menu/jollof-rice.jpg", title: "Jollof Rice" },
  { src: "/images/menu/egusi-pounded-yam.jpg", title: "Egusi & Pounded Yam" },
  { src: "/images/menu/tom-yum-goong.jpg", title: "Tom Yum Goong" },
  { src: "/images/menu/pad-thai.jpg", title: "Pad Thai" },
  { src: "/images/menu/pasta-carbonara.jpg", title: "Pasta Carbonara" },
  { src: "/images/menu/falafel-plate.jpg", title: "Falafel Plate" },
  { src: "/images/chocolate-gelato.jpg", title: "Chocolate Cake" },
  { src: "/images/vanilla-gelato.jpg", title: "Dessert & Drinks" },
]

export function MenuCatalog() {
  const [search, setSearch] = useState("")
  const [course, setCourse] = useState<"all" | "main" | "dessert" | "drink">("all")
  const [region, setRegion] = useState("all")
  const [activeDietary, setActiveDietary] = useState("all")
  const [activeSlide, setActiveSlide] = useState(0)
  const [page, setPage] = useState(1)

  const visibleItems = useMemo(() => {
    return menuItems.filter((item) => {
      const searchKey = search.toLowerCase()
      const matchesSearch =
        item.name.toLowerCase().includes(searchKey) ||
        item.description.toLowerCase().includes(searchKey) ||
        item.category.toLowerCase().includes(searchKey)

      const matchesCourse = course === "all" || item.course === course
      const matchesRegion = region === "all" || item.region === region
      const matchesDietary =
        activeDietary === "all" || item.dietary.includes(activeDietary)

      return matchesSearch && matchesCourse && matchesRegion && matchesDietary
    })
  }, [search, course, region, activeDietary])

  useEffect(() => {
    setPage(1)
  }, [search, course, region, activeDietary])

  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(visibleItems.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pagedItems = visibleItems.slice((safePage - 1) * pageSize, safePage * pageSize)

  const prevSlide = () => {
    setActiveSlide((current) => (current === 0 ? displaySlides.length - 1 : current - 1))
  }

  const nextSlide = () => {
    setActiveSlide((current) => (current === displaySlides.length - 1 ? 0 : current + 1))
  }

  const leftIndex = activeSlide === 0 ? displaySlides.length - 1 : activeSlide - 1
  const rightIndex = activeSlide === displaySlides.length - 1 ? 0 : activeSlide + 1

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto w-full px-6 lg:px-12">
        <div className="text-center mb-12 md:mb-16">
          <p className="mb-4 text-sm font-medium tracking-[0.3em] uppercase text-primary">
            Menu
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-foreground">
            MENU
          </h1>
          <p className="mt-6 mx-auto max-w-3xl text-muted-foreground leading-relaxed">
            Use filters to find dishes, desserts, and drinks quickly.
          </p>
        </div>

        <div className="mb-8">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search dishes, regions, styles..."
                className="flex-1 h-12 rounded-lg border border-border/50 bg-card/50 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                aria-label="Search menu"
              />
              <select
                value={course}
                onChange={(event) => setCourse(event.target.value as "all" | "main" | "dessert" | "drink")}
                className="h-12 rounded-lg border border-border/50 bg-card/50 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all min-w-[140px] cursor-pointer"
                aria-label="Filter by course"
              >
                <option value="all">All Courses</option>
                <option value="main">Main Dishes</option>
                <option value="dessert">Desserts</option>
                <option value="drink">Drinks</option>
              </select>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="h-12 rounded-lg border border-border/50 bg-card/50 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all min-w-[130px] cursor-pointer"
                aria-label="Filter by region"
              >
                {regionFilters.map((value) => (
                  <option key={value} value={value}>
                    {value === "all" ? "All Regions" : value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border/50 bg-card/30">
              {dietaryFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveDietary(filter)}
                  className={`rounded-full border text-xs uppercase tracking-wider transition-all px-3 py-1.5 cursor-pointer ${
                    activeDietary === filter
                      ? "border-primary bg-primary text-primary-foreground font-medium"
                      : "border-border/60 bg-transparent text-foreground/70 hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {visibleItems.length > 0 && (
          <div className="rounded-xl p-5 md:p-6 border border-border/30 bg-card/30 backdrop-blur-sm">
            <p className="mb-5 text-sm text-muted-foreground">
              Showing {pagedItems.length} of {visibleItems.length} filtered items.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pagedItems.map((item) => (
                <article key={item.id} className="rounded-lg border border-border/70 bg-card/70 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-primary mb-1">
                        {item.region} / {item.category} / {item.course}
                      </p>
                      <h3 className="font-serif text-lg text-foreground">{item.name}</h3>
                    </div>
                    <span className="text-base font-medium text-primary">{item.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.dietary.map((tag) => (
                      <span
                        key={`${item.id}-${tag}`}
                        className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {visibleItems.length > pageSize && (
              <div className="mt-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={safePage === 1}
                  className="rounded-md border border-border px-4 py-2 text-sm text-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <p className="text-sm text-muted-foreground">
                  Page {safePage} of {totalPages}
                </p>

                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={safePage === totalPages}
                  className="rounded-md border border-border px-4 py-2 text-sm text-foreground disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {visibleItems.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            No dishes matched your filters. Try broadening your search.
          </p>
        )}

        <div className="mt-10 relative py-2">
          <div className="relative mx-auto max-w-4xl h-[280px] md:h-[420px]">
            <div className="absolute left-0 top-12 hidden md:block w-[28%] rotate-[-10deg]">
              <div className="rounded-xl bg-white p-2 shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image src={displaySlides[leftIndex].src} alt={displaySlides[leftIndex].title} fill className="object-cover" />
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-12 hidden md:block w-[28%] rotate-[10deg]">
              <div className="rounded-xl bg-white p-2 shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image src={displaySlides[rightIndex].src} alt={displaySlides[rightIndex].title} fill className="object-cover" />
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-2 w-full -translate-x-1/2 md:w-[72%] z-10">
              <div className="rounded-xl bg-white p-3 shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image
                    src={displaySlides[activeSlide].src}
                    alt={displaySlides[activeSlide].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="pt-2 text-sm text-slate-700">{displaySlides[activeSlide].title}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white hover:bg-primary hover:text-white px-4 py-3 transition-colors shadow-lg group cursor-pointer"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white hover:bg-primary hover:text-white px-4 py-3 transition-colors shadow-lg group cursor-pointer"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
