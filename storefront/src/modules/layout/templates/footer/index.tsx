import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SHOP_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Store", href: "/store" },
  { label: "Catering", href: "/catering" },
  { label: "Cart", href: "/cart" },
] as const

const BUSINESS_LINKS = [
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Gallery", href: "/gallery" },
] as const

export default async function Footer() {
  return (
    <footer className="border-t border-brand-dark/10 bg-brand-dark text-brand-cream w-full">
      <div className="content-container flex flex-col w-full py-16 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <LocalizedClientLink
              href="/"
              className="font-display text-2xl tracking-wide uppercase text-brand-cream hover:text-brand-yellow transition-colors"
            >
              Bocanv
            </LocalizedClientLink>
            <p className="mt-4 text-sm text-brand-cream-300 leading-relaxed">
              Handmade empanadas, takeaway, catering, and bar. Warm food, bold
              flavours.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-16 text-sm">
            <div className="flex flex-col gap-3">
              <span className="font-semibold text-brand-cream uppercase tracking-wider text-xs">
                Shop
              </span>
              <ul className="flex flex-col gap-2 text-brand-cream-200">
                {SHOP_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <LocalizedClientLink
                      href={href}
                      className="hover:text-brand-yellow transition-colors"
                    >
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-semibold text-brand-cream uppercase tracking-wider text-xs">
                Business
              </span>
              <ul className="flex flex-col gap-2 text-brand-cream-200">
                {BUSINESS_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <LocalizedClientLink
                      href={href}
                      className="hover:text-brand-yellow transition-colors"
                    >
                      {label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
              <span className="font-semibold text-brand-cream uppercase tracking-wider text-xs">
                Account
              </span>
              <ul className="flex flex-col gap-2 text-brand-cream-200">
                <li>
                  <LocalizedClientLink
                    href="/account"
                    className="hover:text-brand-yellow transition-colors"
                  >
                    Account
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-dark-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-brand-cream-300">
          <span>© {new Date().getFullYear()} Bocanv. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
