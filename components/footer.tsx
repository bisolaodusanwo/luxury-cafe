import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

const footerLinks = {
  explore: [
    { name: "Menu", href: "#menu" },
    { name: "Experience", href: "#experience" },
    { name: "Gallery", href: "#gallery" },
    { name: "Locations", href: "#locations" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="relative py-14 md:py-20 border-t border-border">
      {/* Background */}
      <div className="absolute inset-0 bg-background-secondary" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-medium tracking-wide text-foreground">
                Maison Glacé
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
              Where craftsmanship meets indulgence. Experience the finest artisan 
              ice cream and café delicacies.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-all hover:border-primary/20 hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-all hover:border-primary/20 hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-all hover:border-primary/20 hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wide text-foreground">
              Explore
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wide text-foreground">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-medium tracking-wide text-foreground">
              Legal
            </h4>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              © 2024 Maison Glacé. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Crafted with passion in Paris
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
