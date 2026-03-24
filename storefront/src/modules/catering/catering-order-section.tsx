"use client"

import {
  getCateringPiecesInCart,
  MIN_CATERING_PIECES,
} from "@lib/util/catering-cart"
import { HttpTypes } from "@medusajs/types"
import Container from "@modules/common/components/container"
import { Beef, type LucideIcon, Sprout, Vegan } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import CateringOrderReceipt from "./catering-order-receipt"
import CateringProductCard from "./catering-product-card"
import {
  cateringVariantMatchesDietFilter,
  type DietFilter,
} from "./get-product-diet"
import {
  getVariantsForPreparationMode,
  type PreparationMode,
} from "./resolve-catering-variant"

const DIETS: { id: DietFilter; label: string; Icon?: LucideIcon }[] = [
  { id: "all", label: "All" },
  { id: "vegan", label: "Vegan", Icon: Vegan },
  { id: "vegetarian", label: "Vegetarian", Icon: Sprout },
  { id: "meat", label: "Meat", Icon: Beef },
]

const PREP: { id: PreparationMode; label: string }[] = [
  { id: "frozen", label: "Frozen" },
  { id: "baked", label: "Baked" },
]

type CateringOrderSectionProps = {
  products: HttpTypes.StoreProduct[]
  countryCode: string
  cateringProductIds: string[]
  cart: HttpTypes.StoreCart | null
}

function buildLineQuantities(
  cart: HttpTypes.StoreCart | null
): Record<string, number> {
  const m: Record<string, number> = {}
  cart?.items?.forEach((item) => {
    if (item.variant_id) {
      m[item.variant_id] = item.quantity ?? 0
    }
  })
  return m
}

export default function CateringOrderSection({
  products,
  countryCode,
  cateringProductIds,
  cart,
}: CateringOrderSectionProps) {
  const [diet, setDiet] = useState<DietFilter>("all")
  const [prep, setPrep] = useState<PreparationMode>("frozen")
  const [drawerOpen, setDrawerOpen] = useState(false)

  const lineQuantities = useMemo(() => buildLineQuantities(cart), [cart])

  const variantRows = useMemo(() => {
    const rows: {
      product: HttpTypes.StoreProduct
      variant: HttpTypes.StoreProductVariant
    }[] = []
    for (const p of products) {
      for (const v of getVariantsForPreparationMode(p, prep)) {
        if (!v.id) {
          continue
        }
        if (!cateringVariantMatchesDietFilter(p, v, diet)) {
          continue
        }
        rows.push({ product: p, variant: v })
      }
    }
    return rows
  }, [products, prep, diet])

  const cateringPieces = useMemo(
    () => getCateringPiecesInCart(cart, cateringProductIds),
    [cart, cateringProductIds]
  )

  const progressPct = Math.min(
    100,
    Math.round((cateringPieces / MIN_CATERING_PIECES) * 100)
  )

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [drawerOpen])

  return (
    <section
      id="catering-menu"
      className="border-b border-brand-dark/10 bg-white py-12 md:py-16"
    >
      <Container>
        <h2 className="font-display text-2xl uppercase tracking-wide text-brand-dark md:text-3xl">
          Build your order
        </h2>
        <p className="text-muted mt-3 max-w-2xl text-base">
          Filter by diet, switch between frozen and baked to see matching SKUs,
          then set quantities. Items in your cart count toward the{" "}
          {MIN_CATERING_PIECES}-piece minimum.
        </p>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark-300">
              Diet
            </span>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by diet"
            >
              {DIETS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDiet(id)}
                  aria-pressed={diet === id}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    diet === id
                      ? "bg-brand-dark text-white"
                      : "bg-brand-cream text-brand-dark hover:bg-brand-cream-200"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-dark-300">
              Preparation
            </span>
            <div
              className="inline-flex rounded-lg border border-brand-dark/15 bg-brand-cream p-1"
              role="group"
              aria-label="Frozen or baked"
            >
              {PREP.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPrep(id)}
                  aria-pressed={prep === id}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    prep === id
                      ? "bg-white text-brand-dark shadow-sm"
                      : "text-brand-dark-300 hover:text-brand-dark"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Two-column: cards 2/3, receipt 1/3 */}
        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Left — variant card grid */}
          <div>
            {products.length === 0 ? (
              <p className="text-brand-dark-300">
                No products in the catering collection yet. Add SKUs in Medusa
                Admin and assign them to this collection.
              </p>
            ) : variantRows.length === 0 ? (
              <p className="text-brand-dark-300">
                No catering SKUs match your diet and preparation filters. Try{" "}
                <button
                  type="button"
                  onClick={() => setDiet("all")}
                  className="font-semibold text-brand-red underline-offset-2 hover:underline"
                >
                  all diets
                </button>
                , switch Frozen/Baked, or check variant metadata in Medusa
                Admin.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {variantRows.map(({ product, variant }) => (
                  <li key={variant.id} className="flex">
                    <CateringProductCard
                      product={product}
                      variant={variant}
                      countryCode={countryCode}
                      lineQuantity={lineQuantities[variant.id] ?? 0}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right — sticky receipt sidebar (hidden on mobile, shown below grid via separate block) */}
          <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <CateringOrderReceipt
              cart={cart}
              cateringProductIds={cateringProductIds}
              countryCode={countryCode}
            />
          </div>
        </div>

      </Container>

      {/* Mobile sticky bottom bar — whole bar is clickable to open drawer */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="sticky bottom-0 z-20 mt-8 w-full border-t border-brand-dark/10 bg-brand-cream/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden supports-[backdrop-filter]:bg-brand-cream/90"
      >
        <Container className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-sm uppercase tracking-wide text-brand-dark">
                {cateringPieces} / {MIN_CATERING_PIECES} pcs
              </p>
              <span className="text-xs text-brand-dark-300">
                Tap to view order
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-dark/10">
              <div
                className="h-full rounded-full bg-brand-red transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 shrink-0 text-brand-dark-300"
          >
            <path
              fillRule="evenodd"
              d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
              clipRule="evenodd"
            />
          </svg>
        </Container>
      </button>

      {/* Mobile slide-up drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer panel */}
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-drawer-up overflow-y-auto rounded-t-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-dark/10 bg-white px-5 py-3">
              <h3 className="font-display text-base uppercase tracking-wide text-brand-dark">
                Your Order
              </h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-1.5 text-brand-dark-300 hover:bg-brand-cream hover:text-brand-dark"
                aria-label="Close order drawer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
            <div className="px-5 pb-8 pt-2">
              <CateringOrderReceipt
                cart={cart}
                cateringProductIds={cateringProductIds}
                countryCode={countryCode}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
