import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Catering", href: "/catering" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="border-b border-brand-dark/10 bg-brand-cream shadow-sm">
        <nav className="content-container flex items-center justify-between w-full h-16 md:h-[4.25rem] text-small-regular text-brand-dark gap-4">
          <div className="flex items-center gap-3 md:gap-5 min-w-0 flex-1">
            <div className="lg:hidden">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
            <LocalizedClientLink
              href="/"
              className="font-display text-xl md:text-2xl tracking-wide text-brand-dark hover:text-brand-red transition-colors uppercase shrink-0"
              data-testid="nav-store-link"
            >
              Bocanv
            </LocalizedClientLink>
            <ul className="hidden lg:flex items-center gap-5 xl:gap-6 ml-2 min-w-0">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href} className="shrink-0">
                  <LocalizedClientLink
                    href={href}
                    className="text-sm font-medium text-brand-dark-400 hover:text-brand-red transition-colors"
                    data-testid={`nav-link-${label.toLowerCase()}`}
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <LocalizedClientLink
              className="hidden sm:inline text-sm font-medium text-brand-dark-400 hover:text-brand-red transition-colors"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-sm font-medium text-brand-dark-400 hover:text-brand-red"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
