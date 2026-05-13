"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Check, Loader2, Printer } from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS = ["Booking Details", "Allergies & Diet", "Pre-Order Menu", "Final Details"]

const SEAT_TYPES = [
  { value: "indoor", label: "Indoor Dining", description: "Refined ambiance" },
  { value: "outdoor", label: "Outdoor Terrace", description: "Al fresco setting" },
  { value: "private", label: "Private Room", description: "Exclusive experience" },
  { value: "bar", label: "Bar Seating", description: "Open kitchen view" },
]

const ALLERGENS = [
  "Nuts & Tree Nuts",
  "Dairy & Lactose",
  "Gluten & Wheat",
  "Shellfish & Crustaceans",
  "Eggs",
  "Soy",
  "Fish",
  "Sesame",
]

const DIETARY_PREFERENCES = ["None", "Vegetarian", "Vegan", "Halal", "Kosher", "Pescatarian"]

const MENU_ITEMS: Record<string, { name: string; price: number }[]> = {
  appetizers: [
    { name: "Truffle Arancini", price: 18 },
    { name: "Foie Gras Torchon", price: 28 },
    { name: "Oysters on Ice", price: 24 },
    { name: "Burrata & Heirloom Tomato", price: 16 },
    { name: "Charcuterie Board", price: 22 },
    { name: "Lobster Bisque", price: 20 },
  ],
  mainCourse: [
    { name: "Wagyu Beef Tenderloin", price: 85 },
    { name: "Pan-Seared Sea Bass", price: 52 },
    { name: "Duck à l'Orange", price: 48 },
    { name: "Black Truffle Risotto", price: 42 },
    { name: "Rack of Lamb", price: 58 },
    { name: "Lobster Thermidor", price: 72 },
  ],
  desserts: [
    { name: "Crème Brûlée", price: 14 },
    { name: "Chocolate Fondant", price: 16 },
    { name: "Mango Panna Cotta", price: 14 },
    { name: "Paris-Brest", price: 16 },
    { name: "Tarte Tatin", price: 15 },
    { name: "Signature Gelato Selection", price: 12 },
  ],
  nonAlcoholic: [
    { name: "Sparkling Mineral Water", price: 6 },
    { name: "Cold-Pressed Fruit Juices", price: 8 },
    { name: "Specialty Coffee", price: 7 },
    { name: "Herbal Tea Selection", price: 6 },
    { name: "Artisan Lemonade", price: 8 },
    { name: "Signature Mocktail", price: 12 },
  ],
  alcoholic: [
    { name: "Champagne — Moët & Chandon", price: 28 },
    { name: "Red Wine — Bordeaux Reserve", price: 22 },
    { name: "White Wine — Grand Cru Chablis", price: 20 },
    { name: "Rosé — Provence Selection", price: 18 },
    { name: "Aperol Spritz", price: 16 },
    { name: "Signature Cocktail of the Season", price: 18 },
  ],
}

const PRICE_MAP: Record<string, number> = Object.values(MENU_ITEMS)
  .flat()
  .reduce<Record<string, number>>((acc, item) => { acc[item.name] = item.price; return acc }, {})

const COMPLIMENTARY_ITEMS = [
  { name: "Amuse-Bouche of the Day", description: "Chef's daily surprise bite" },
  { name: "Bread & Cultured Butter Service", description: "Freshly baked sourdough" },
  { name: "Seasonal Sorbet Palate Cleanser", description: "Between-course refresher" },
  { name: "Petit Fours with Coffee", description: "House-made post-dessert treats" },
]

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1 — Booking Details
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  seatType: string

  // Step 2 — Allergies
  allergens: string[]
  dietaryPreference: string
  allergyNotes: string

  // Step 3 — Menu
  appetizers: string[]
  mainCourse: string[]
  desserts: string[]
  nonAlcoholic: string[]
  alcoholic: string[]
  complimentaryDish: string

  // Step 4 — Final Details
  reserveCar: string // "yes" | "no" | ""
  licensePlate: string
  specialRequests: string
  agreeTerms: boolean
}

const INITIAL_DATA: FormData = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  seatType: "",
  allergens: [],
  dietaryPreference: "None",
  allergyNotes: "",
  appetizers: [],
  mainCourse: [],
  desserts: [],
  nonAlcoholic: [],
  alcoholic: [],
  complimentaryDish: "",
  reserveCar: "",
  licensePlate: "",
  specialRequests: "",
  agreeTerms: false,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toggleItem(arr: string[], item: string): string[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((label, idx) => (
        <div key={idx} className="flex items-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                idx < current
                  ? "bg-primary text-primary-foreground"
                  : idx === current
                  ? "border-2 border-primary text-primary"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {idx < current ? <Check className="h-4 w-4" /> : idx + 1}
            </div>
            <span
              className={`hidden md:block text-xs tracking-wide ${
                idx === current ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-px w-6 sm:w-12 md:w-20 mx-1 mt-[-18px] md:mt-[-30px] transition-colors duration-300 ${
                idx < current ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function CheckCard({
  label,
  price,
  checked,
  onChange,
}: {
  label: string
  price?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-3 rounded-md border px-4 py-3 text-sm text-left transition-all duration-200 ${
        checked
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-input text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
          checked ? "border-primary bg-primary" : "border-muted-foreground/40"
        }`}
      >
        {checked && <Check className="h-3 w-3 text-primary-foreground" />}
      </span>
      <span className="flex-1 min-w-0">{label}</span>
      {price !== undefined && (
        <span className={`shrink-0 text-xs font-medium ${checked ? "text-primary" : "text-muted-foreground"}`}>
          ${price}
        </span>
      )}
    </button>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif text-lg font-light text-foreground mb-4 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      {children}
      <span className="h-px flex-1 bg-border" />
    </h3>
  )
}

// ─── Step 1: Booking Details ──────────────────────────────────────────────────

function Step1({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      {/* Personal Info */}
      <div>
        <SectionTitle>Personal Information</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
              className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      {/* Reservation Details */}
      <div>
        <SectionTitle>Reservation Details</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => update({ date: e.target.value })}
              className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Time</label>
            <select
              value={data.time}
              onChange={(e) => update({ time: e.target.value })}
              className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="">Select a time</option>
              {["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Number of Guests</label>
            <select
              value={data.guests}
              onChange={(e) => update({ guests: e.target.value })}
              className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {["1","2","3","4","5","6","7","8"].map((n) => (
                <option key={n} value={n}>{n} {n === "1" ? "Guest" : "Guests"}</option>
              ))}
              <option value="9+">9+ Guests (large party)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seat Type */}
      <div>
        <SectionTitle>Seating Preference</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SEAT_TYPES.map((seat) => (
            <button
              key={seat.value}
              type="button"
              onClick={() => update({ seatType: seat.value })}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-5 text-center transition-all duration-200 ${
                data.seatType === seat.value
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-input text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span className="text-sm font-medium">{seat.label}</span>
              <span className="text-xs opacity-70">{seat.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Allergies ────────────────────────────────────────────────────────

function Step2({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      {/* Allergens */}
      <div>
        <SectionTitle>Allergen Information</SectionTitle>
        <p className="text-sm text-muted-foreground mb-5">
          Select any allergens that apply. Our kitchen team will be informed of your requirements.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALLERGENS.map((allergen) => (
            <CheckCard
              key={allergen}
              label={allergen}
              checked={data.allergens.includes(allergen)}
              onChange={() => update({ allergens: toggleItem(data.allergens, allergen) })}
            />
          ))}
        </div>
      </div>

      {/* Dietary Preference */}
      <div>
        <SectionTitle>Dietary Preference</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DIETARY_PREFERENCES.map((pref) => (
            <button
              key={pref}
              type="button"
              onClick={() => update({ dietaryPreference: pref })}
              className={`rounded-md border px-4 py-3 text-sm text-center transition-all duration-200 ${
                data.dietaryPreference === pref
                  ? "border-primary bg-primary/10 text-foreground font-medium"
                  : "border-border bg-input text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Allergy Notes */}
      <div>
        <SectionTitle>Additional Notes</SectionTitle>
        <textarea
          value={data.allergyNotes}
          onChange={(e) => update({ allergyNotes: e.target.value })}
          rows={4}
          className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder="Please describe any other dietary restrictions or health-related food requirements..."
        />
      </div>
    </div>
  )
}

// ─── Step 3: Menu ─────────────────────────────────────────────────────────────

function MenuSection({
  title,
  subtitle,
  items,
  selected,
  onChange,
}: {
  title: string
  subtitle?: string
  items: { name: string; price: number }[]
  selected: string[]
  onChange: (item: string) => void
}) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <CheckCard
            key={item.name}
            label={item.name}
            price={item.price}
            checked={selected.includes(item.name)}
            onChange={() => onChange(item.name)}
          />
        ))}
      </div>
    </div>
  )
}

function Step3({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  const selectedNames = [
    ...data.appetizers, ...data.mainCourse, ...data.desserts,
    ...data.nonAlcoholic, ...data.alcoholic,
  ]
  const runningTotal = selectedNames.reduce((sum, name) => sum + (PRICE_MAP[name] ?? 0), 0)

  return (
    <div className="space-y-10">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Pre-ordering is optional. All selections are indicative — our staff will confirm on arrival.
        </p>
      </div>

      <MenuSection
        title="Appetizers"
        items={MENU_ITEMS.appetizers}
        selected={data.appetizers}
        onChange={(item) => update({ appetizers: toggleItem(data.appetizers, item) })}
      />

      <MenuSection
        title="Main Course"
        items={MENU_ITEMS.mainCourse}
        selected={data.mainCourse}
        onChange={(item) => update({ mainCourse: toggleItem(data.mainCourse, item) })}
      />

      <MenuSection
        title="Desserts"
        items={MENU_ITEMS.desserts}
        selected={data.desserts}
        onChange={(item) => update({ desserts: toggleItem(data.desserts, item) })}
      />

      {/* Drinks */}
      <div className="space-y-6">
        <SectionTitle>Drinks</SectionTitle>

        <div className="rounded-xl border border-border p-6 space-y-6">
          {/* Non-Alcoholic */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">Non-Alcoholic</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MENU_ITEMS.nonAlcoholic.map((item) => (
                <CheckCard
                  key={item.name}
                  label={item.name}
                  price={item.price}
                  checked={data.nonAlcoholic.includes(item.name)}
                  onChange={() => update({ nonAlcoholic: toggleItem(data.nonAlcoholic, item.name) })}
                />
              ))}
            </div>
          </div>

          {/* Alcoholic */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">Alcoholic</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <p className="text-xs text-muted-foreground mb-3">Must be 21+ to order alcoholic beverages.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MENU_ITEMS.alcoholic.map((item) => (
                <CheckCard
                  key={item.name}
                  label={item.name}
                  price={item.price}
                  checked={data.alcoholic.includes(item.name)}
                  onChange={() => update({ alcoholic: toggleItem(data.alcoholic, item.name) })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Complimentary Dish */}
      <div>
        <SectionTitle>Chef's Compliment</SectionTitle>
        <p className="text-sm text-muted-foreground mb-5">
          Every guest receives one complimentary item from our chef. Please select your preference.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMPLIMENTARY_ITEMS.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => update({ complimentaryDish: data.complimentaryDish === item.name ? "" : item.name })}
              className={`flex items-start gap-3 rounded-md border px-4 py-3 text-left transition-all duration-200 ${
                data.complimentaryDish === item.name
                  ? "border-primary bg-primary/10"
                  : "border-border bg-input hover:border-primary/40"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                  data.complimentaryDish === item.name ? "border-primary bg-primary" : "border-muted-foreground/40"
                }`}
              >
                {data.complimentaryDish === item.name && (
                  <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                )}
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${data.complimentaryDish === item.name ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <span className="ml-auto shrink-0 text-xs font-medium text-primary">Complimentary</span>
            </button>
          ))}
        </div>
      </div>

      {/* Running Total */}
      {runningTotal > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">Pre-Order Estimate</p>
            <p className="text-xs text-muted-foreground mt-1">{selectedNames.length} item{selectedNames.length !== 1 ? "s" : ""} selected · final bill settled on the day</p>
          </div>
          <p className="font-serif text-2xl font-light text-primary">${runningTotal}</p>
        </div>
      )}
    </div>
  )
}

// ─── Step 4: Final Details ────────────────────────────────────────────────────

function Step4({ data, update }: { data: FormData; update: (d: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      {/* Parking */}
      <div>
        <SectionTitle>Vehicle Parking</SectionTitle>
        <p className="text-sm text-muted-foreground mb-5">
          Would you like to reserve a parking space for your vehicle?
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-xs sm:max-w-xs">
          {(["yes", "no"] as const).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => update({ reserveCar: val })}
              className={`rounded-md border px-6 py-4 text-sm font-medium capitalize transition-all duration-200 ${
                data.reserveCar === val
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-input text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {val === "yes" ? "Yes, please" : "No, thanks"}
            </button>
          ))}
        </div>

        {data.reserveCar === "yes" && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">License Plate</label>
              <input
                type="text"
                value={data.licensePlate}
                onChange={(e) => update({ licensePlate: e.target.value })}
                className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary uppercase"
                placeholder="e.g. ABC-1234"
              />
            </div>
          </div>
        )}
      </div>

      {/* Special Requests */}
      <div>
        <SectionTitle>Special Requests</SectionTitle>
        <textarea
          value={data.specialRequests}
          onChange={(e) => update({ specialRequests: e.target.value })}
          rows={4}
          className="w-full rounded-md border border-border bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          placeholder="Special occasions, table decorations, accessibility needs, or anything else we should know..."
        />
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-3">
        <h4 className="text-sm font-medium tracking-wide text-primary uppercase">Booking Summary</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          {data.name && <p><span className="text-foreground">Guest:</span> {data.name}</p>}
          {data.date && data.time && (
            <p><span className="text-foreground">Date & Time:</span> {data.date} at {data.time}</p>
          )}
          {data.guests && (
            <p><span className="text-foreground">Guests:</span> {data.guests}</p>
          )}
          {data.seatType && (
            <p>
              <span className="text-foreground">Seating:</span>{" "}
              {SEAT_TYPES.find((s) => s.value === data.seatType)?.label}
            </p>
          )}
          {data.allergens.length > 0 && (
            <p><span className="text-foreground">Allergens noted:</span> {data.allergens.join(", ")}</p>
          )}
          {data.reserveCar === "yes" && (
            <p><span className="text-foreground">Parking:</span> Reserved</p>
          )}
          {data.complimentaryDish && (
            <p><span className="text-foreground">Chef's Compliment:</span> {data.complimentaryDish}</p>
          )}
          {(() => {
            const names = [...data.appetizers, ...data.mainCourse, ...data.desserts, ...data.nonAlcoholic, ...data.alcoholic]
            const total = names.reduce((s, n) => s + (PRICE_MAP[n] ?? 0), 0)
            return names.length > 0 ? (
              <p className="pt-2 border-t border-border mt-2">
                <span className="text-foreground">Pre-Order Estimate:</span>{" "}
                <span className="text-primary font-medium">${total}</span>
                <span className="text-xs text-muted-foreground ml-1">({names.length} items)</span>
              </p>
            ) : null
          })()}
        </div>
      </div>

      {/* Terms */}
      <button
        type="button"
        onClick={() => update({ agreeTerms: !data.agreeTerms })}
        className="flex items-start gap-3 text-sm text-muted-foreground text-left"
      >
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
            data.agreeTerms ? "border-primary bg-primary" : "border-muted-foreground/40"
          }`}
        >
          {data.agreeTerms && <Check className="h-3 w-3 text-primary-foreground" />}
        </span>
        <span>
          I confirm that all information provided is accurate and I agree to the{" "}
          <span className="text-primary underline underline-offset-2">cancellation policy</span>. A
          confirmation email will be sent within 24 hours.
        </span>
      </button>
    </div>
  )
}

// ─── Booking API response type ────────────────────────────────────────────────

interface BookingResponse {
  id: string
  referenceNumber: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  seatType: string
  allergens: string[]
  dietaryPreference: string
  appetizers: string[]
  mainCourse: string[]
  desserts: string[]
  nonAlcoholic: string[]
  alcoholic: string[]
  complimentaryDish: string
  preOrderTotal: number
  reserveCar: string
  specialRequests: string
  status: string
  createdAt: string
}

const SEAT_LABELS: Record<string, string> = {
  indoor: "Indoor Dining",
  outdoor: "Outdoor Terrace",
  private: "Private Room",
  bar: "Bar Seating",
}

// ─── Receipt screen ───────────────────────────────────────────────────────────

function ReceiptScreen({ booking }: { booking: BookingResponse }) {
  const categorized = [
    { label: "Appetizers", items: booking.appetizers },
    { label: "Main Course", items: booking.mainCourse },
    { label: "Desserts", items: booking.desserts },
    { label: "Non-Alcoholic", items: booking.nonAlcoholic },
    { label: "Alcoholic", items: booking.alcoholic },
  ].filter((c) => c.items.length > 0)

  const allPreOrders = categorized.flatMap((c) => c.items)
  const total = booking.preOrderTotal ?? allPreOrders.reduce((s, n) => s + (PRICE_MAP[n] ?? 0), 0)

  return (
    <div className="relative min-h-screen grain-texture print:bg-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none print:hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-xl px-6 py-16 step-enter-forward">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Receipt
          </button>
        </div>

        {/* Receipt card */}
        <div className="glass-panel rounded-2xl overflow-hidden print:border print:border-gray-200 print:shadow-none">
          {/* Gold header */}
          <div className="bg-primary px-8 py-7 text-center">
            <p className="text-primary-foreground/70 text-xs tracking-[0.3em] uppercase mb-1">Alexelle</p>
            <h1 className="font-serif text-2xl font-light text-primary-foreground">Booking Confirmation</h1>
          </div>

          <div className="px-8 py-8 space-y-7">
            {/* Reference */}
            <div className="text-center rounded-xl border border-primary/20 bg-primary/5 py-5 px-4">
              <p className="text-xs font-medium tracking-[0.25em] uppercase text-muted-foreground mb-2">
                Booking Reference
              </p>
              <p className="font-mono text-2xl font-bold tracking-widest text-primary">
                {booking.referenceNumber}
              </p>
            </div>

            {/* Status banner */}
            <div className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3">
              <Check className="h-4 w-4 text-green-400 shrink-0" />
              <p className="text-sm text-green-400">
                Confirmed — a receipt has been sent to{" "}
                <span className="font-medium">{booking.email}</span>
              </p>
            </div>

            {/* Details grid */}
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Reservation Details
              </p>
              <div className="divide-y divide-border">
                {[
                  ["Guest", booking.name],
                  ["Date", booking.date],
                  ["Time", booking.time],
                  ["Guests", booking.guests],
                  ["Seating", SEAT_LABELS[booking.seatType] ?? booking.seatType],
                  ["Parking", booking.reserveCar === "yes" ? "Reserved" : "Not required"],
                  ...(booking.dietaryPreference && booking.dietaryPreference !== "None"
                    ? [["Dietary", booking.dietaryPreference]]
                    : []),
                  ...(booking.allergens?.length > 0
                    ? [["Allergens noted", booking.allergens.join(", ")]]
                    : []),
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm text-foreground font-medium text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-orders with pricing */}
            {allPreOrders.length > 0 && (
              <div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  Pre-Order ({allPreOrders.length} item{allPreOrders.length !== 1 ? "s" : ""})
                </p>
                <div className="space-y-4">
                  {categorized.map((cat) => (
                    <div key={cat.label}>
                      <p className="text-xs text-muted-foreground mb-1.5 tracking-wide">{cat.label}</p>
                      {cat.items.map((item) => (
                        <div key={item} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                          <span className="text-sm text-foreground flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {item}
                          </span>
                          <span className="text-sm font-medium text-primary">${PRICE_MAP[item] ?? "–"}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Complimentary dish */}
                {booking.complimentaryDish && (
                  <div className="flex items-center justify-between py-1.5 mt-2 border-t border-primary/20">
                    <span className="text-sm text-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {booking.complimentaryDish}
                    </span>
                    <span className="text-xs font-medium text-green-400 border border-green-500/30 bg-green-500/10 rounded px-2 py-0.5">Complimentary</span>
                  </div>
                )}

                {/* Total */}
                <div className="mt-4 pt-4 border-t-2 border-primary/30 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Pre-Order Estimate</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Final bill settled on the day of visit</p>
                  </div>
                  <p className="font-serif text-2xl font-light text-primary">${total}</p>
                </div>
              </div>
            )}

            {/* Complimentary only (no pre-orders) */}
            {allPreOrders.length === 0 && booking.complimentaryDish && (
              <div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">
                  Chef's Compliment
                </p>
                <div className="flex items-center justify-between py-2 rounded-md border border-green-500/20 bg-green-500/5 px-4">
                  <span className="text-sm text-foreground">{booking.complimentaryDish}</span>
                  <span className="text-xs font-medium text-green-400">Complimentary</span>
                </div>
              </div>
            )}

            {/* Special requests */}
            {booking.specialRequests && (
              <div>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
                  Special Requests
                </p>
                <p className="text-sm text-foreground leading-relaxed">{booking.specialRequests}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-border pt-6 text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                To modify or cancel, contact us at least 24 hours in advance.
              </p>
              <p className="mt-3 font-serif text-lg text-primary">
                We look forward to welcoming you.
              </p>
            </div>
          </div>
        </div>

        {/* Home link (below card) */}
        <div className="text-center mt-8 print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            Back to Home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const [step, setStep] = useState(0)
  const [contentKey, setContentKey] = useState(0)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const [exiting, setExiting] = useState(false)
  const transitioning = useRef(false)

  const [formData, setFormData] = useState<FormData>(INITIAL_DATA)
  const [createdBooking, setCreatedBooking] = useState<BookingResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const update = (partial: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...partial }))

  // ── Animated step navigation ──────────────────────────────────────────────
  const goToStep = useCallback(
    (next: number) => {
      if (transitioning.current) return
      transitioning.current = true

      const dir: "forward" | "backward" = next > step ? "forward" : "backward"
      setDirection(dir)
      setExiting(true) // start exit fade-slide (250 ms)

      setTimeout(() => {
        setStep(next)
        setContentKey((k) => k + 1) // remount → triggers CSS enter animation
        setExiting(false)
        setTimeout(() => {
          transitioning.current = false
        }, 400)
      }, 250)
    },
    [step]
  )

  const handleNext = () => goToStep(step + 1)
  const handleBack = () => goToStep(step - 1)

  // ── AJAX submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const allItems = [
        ...formData.appetizers, ...formData.mainCourse, ...formData.desserts,
        ...formData.nonAlcoholic, ...formData.alcoholic,
      ]
      const preOrderTotal = allItems.reduce((s, n) => s + (PRICE_MAP[n] ?? 0), 0)

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, preOrderTotal }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { message?: string }).message ?? "Something went wrong. Please try again.")
      }

      const data = await res.json()
      setCreatedBooking(data.booking as BookingResponse)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Exit animation style ──────────────────────────────────────────────────
  const exitStyle: React.CSSProperties = exiting
    ? {
        opacity: 0,
        transform: `translateX(${direction === "forward" ? "-20px" : "20px"})`,
        transition: "opacity 0.25s ease, transform 0.25s ease",
        pointerEvents: "none",
      }
    : {}

  // ── Receipt screen ────────────────────────────────────────────────────────
  if (createdBooking) return <ReceiptScreen booking={createdBooking} />

  return (
    <div className="relative min-h-screen grain-texture">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-primary/6 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Back link */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-primary mb-4">
            Alexelle
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            Reserve Your Seat
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Complete the form below to secure your table. Our team personally reviews every
            reservation to ensure a flawless experience.
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator current={step} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Animated step container */}
          <div
            key={contentKey}
            className={`glass-panel rounded-xl p-7 md:p-10 ${
              exiting ? "" : direction === "forward" ? "step-enter-forward" : "step-enter-backward"
            }`}
            style={exitStyle}
          >
            <h2 className="font-serif text-2xl font-light text-foreground mb-8">
              {STEPS[step]}
            </h2>

            {step === 0 && <Step1 data={formData} update={update} />}
            {step === 1 && <Step2 data={formData} update={update} />}
            {step === 2 && <Step3 data={formData} update={update} />}
            {step === 3 && <Step4 data={formData} update={update} />}
          </div>

          {/* AJAX error banner */}
          {submitError && (
            <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {submitError}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={transitioning.current}
              className={`inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary/80 disabled:opacity-50 ${
                step === 0 ? "invisible" : ""
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={transitioning.current}
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 ml-auto disabled:opacity-50"
              >
                Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!formData.agreeTerms || isSubmitting}
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 ml-auto disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirming…
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Step counter mobile */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  )
}
