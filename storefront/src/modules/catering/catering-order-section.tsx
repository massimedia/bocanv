"use client"

import { updateCart } from "@lib/data/cart"
import {
  getCateringPiecesInCart,
  MAX_CATERING_PIECES_READY_TO_SERVE,
  MIN_CATERING_PIECES,
} from "@lib/util/catering-cart"
import { HttpTypes } from "@medusajs/types"
import Container from "@modules/common/components/container"
import {
  Beef,
  Check,
  Flame,
  type LucideIcon,
  Snowflake,
  Sprout,
  Utensils,
  Vegan,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

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

const PREP: {
  id: PreparationMode
  label: string
  description: string
  Icon: LucideIcon
}[] = [
  {
    id: "baked",
    label: "Baked & Ready",
    description: "Perfect for immediate enjoyment. Arrives warm and golden brown.",
    Icon: Utensils,
  },
  {
    id: "frozen",
    label: "Frozen for Later",
    description: "Flash-frozen for quality. Includes our master baking instructions.",
    Icon: Snowflake,
  },
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
  const router = useRouter()
  const [diet, setDiet] = useState<DietFilter>("all")
  const [prep, setPrep] = useState<PreparationMode>("frozen")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [readyToServe, setReadyToServe] = useState(
    () => (cart?.metadata as Record<string, string> | undefined)?.ready_to_serve === "true"
  )

  useEffect(() => {
    if (prep !== "baked") setReadyToServe(false)
  }, [prep])

  const toggleReadyToServe = useCallback(async () => {
    const next = !readyToServe
    setReadyToServe(next)
    try {
      await updateCart({ metadata: { ready_to_serve: String(next) } })
      router.refresh()
    } catch {
      setReadyToServe(!next)
    }
  }, [readyToServe, router])

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

  const effectiveMax =
    readyToServe && prep === "baked"
      ? MAX_CATERING_PIECES_READY_TO_SERVE
      : undefined

  const progressTarget = effectiveMax ?? MIN_CATERING_PIECES
  const progressPct = Math.min(
    100,
    Math.round((cateringPieces / progressTarget) * 100)
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
      className="border-b border-brand-dark/10 bg-brand-cream py-12 md:py-16"
    >
      <Container>
        {/* Top-level 2-column: steps on left (2/3), receipt on right (1/3) */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Left column — both steps */}
          <div>
            {/* ── Step 01: Choose Preparation ── */}
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
                  01
                </span>
                <h2 className="font-display text-2xl text-brand-dark md:text-3xl">
                  Choose Your Preparation Style
                </h2>
              </div>

              <div
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
                role="radiogroup"
                aria-label="Preparation style"
              >
                {PREP.map(({ id, label, description, Icon }) => {
                  const selected = prep === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPrep(id)}
                      aria-checked={selected}
                      role="radio"
                      className={`relative flex flex-col items-start rounded-xl border-2 p-5 text-left transition-colors ${
                        selected
                          ? "border-brand-red bg-brand-cream-400"
                          : "border-brand-dark/10 bg-brand-cream-400 hover:border-brand-dark/20"
                      }`}
                    >
                      <Icon className="h-6 w-6 text-brand-red" />
                      <h3 className="mt-3 font-display text-lg text-brand-dark">
                        {label}
                      </h3>
                      <p className="mt-1 text-sm text-brand-dark-300">
                        {description}
                      </p>
                      <div
                        className={`mt-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                          selected
                            ? "border-brand-red bg-brand-red"
                            : "border-brand-dark-200 bg-transparent"
                        }`}
                      >
                        {selected && <Check className="h-4 w-4 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Nested upgrade: Ready to Serve (only when Baked is selected) */}
              {prep === "baked" && (
                <button
                  type="button"
                  onClick={toggleReadyToServe}
                  className={`mt-4 flex w-full items-start gap-4 rounded-xl border-2 p-5 text-left transition-colors ${
                    readyToServe
                      ? "border-brand-red bg-brand-cream-400"
                      : "border-brand-dark/10 bg-brand-cream-400 hover:border-brand-dark/20"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                      readyToServe
                        ? "border-brand-red bg-brand-red"
                        : "border-brand-dark-200 bg-transparent"
                    }`}
                  >
                    {readyToServe && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-brand-red" />
                      <h4 className="font-display text-base text-brand-dark">
                        Make it ready to serve
                      </h4>
                    </div>
                    <p className="mt-1 text-sm text-brand-dark-300">
                      Delivered hot and ready for immediate serving
                    </p>
                    <p className="mt-1.5 text-xs font-semibold text-brand-dark-300">
                      Max {MAX_CATERING_PIECES_READY_TO_SERVE} pieces
                    </p>
                  </div>
                </button>
              )}
            </div>

            {/* ── Step 02: Select Flavors ── */}
            <div className="mt-12">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
                  02
                </span>
                <h2 className="font-display text-2xl text-brand-dark md:text-3xl">
                  Select Your Flavors
                </h2>
              </div>

              {/* Diet filters */}
              <div className="mt-6">
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
                          : "bg-brand-cream-400 text-brand-dark hover:bg-brand-cream-500"
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product card grid */}
              <div className="mt-8">
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
            </div>
          </div>

          {/* Right column — sticky receipt sidebar, aligned to top */}
          <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <CateringOrderReceipt
              cart={cart}
              cateringProductIds={cateringProductIds}
              countryCode={countryCode}
              readyToServe={readyToServe && prep === "baked"}
            />
          </div>
        </div>
      </Container>

      {/* Mobile sticky bottom bar — whole bar is clickable to open drawer */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="sticky bottom-0 z-20 mt-8 w-full border-t border-brand-dark-400 bg-brand-dark/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md lg:hidden supports-[backdrop-filter]:bg-brand-dark/90"
      >
        <Container className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-sm uppercase tracking-wide text-brand-cream">
                {cateringPieces} / {progressTarget} pcs
              </p>
              <span className="text-xs text-brand-dark-200">
                Tap to view order
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-dark-400">
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
            className="h-5 w-5 shrink-0 text-brand-dark-200"
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
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-drawer-up overflow-y-auto rounded-t-2xl bg-brand-dark shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-dark-400 bg-brand-dark px-5 py-3">
              <h3 className="font-display text-base italic text-brand-cream">
                Your Box Summary
              </h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-1.5 text-brand-dark-200 hover:text-brand-cream"
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
            <CateringOrderReceipt
              cart={cart}
              cateringProductIds={cateringProductIds}
              countryCode={countryCode}
              hideHeading
              readyToServe={readyToServe && prep === "baked"}
            />
          </div>
        </div>
      )}
    </section>
  )
}
