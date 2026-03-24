"use client"

import Link from "next/link"

import { deleteLineItem } from "@lib/data/cart"
import {
  getCateringPiecesInCart,
  isCateringMinimumBlocking,
  MIN_CATERING_PIECES,
} from "@lib/util/catering-cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { brandButtonClasses } from "@modules/common/components/button/classes"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

type CateringOrderReceiptProps = {
  cart: HttpTypes.StoreCart | null
  cateringProductIds: string[]
  countryCode: string
}

function getCateringLines(
  cart: HttpTypes.StoreCart | null,
  cateringProductIds: string[]
): HttpTypes.StoreCartLineItem[] {
  if (!cart?.items?.length || !cateringProductIds.length) {
    return []
  }
  const set = new Set(cateringProductIds)
  return cart.items.filter((item) => {
    const pid =
      item.product_id ??
      item.product?.id ??
      (item.variant as { product_id?: string } | undefined)?.product_id
    return pid ? set.has(pid) : false
  })
}

export default function CateringOrderReceipt({
  cart,
  cateringProductIds,
  countryCode,
}: CateringOrderReceiptProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleRemoveLine = async (lineId: string) => {
    setDeletingId(lineId)
    try {
      await deleteLineItem(lineId)
      router.refresh()
    } catch {
      // silently fail — line will still show until next refresh
    } finally {
      setDeletingId(null)
    }
  }

  const lines = useMemo(
    () => getCateringLines(cart, cateringProductIds),
    [cart, cateringProductIds]
  )

  const cateringPieces = useMemo(
    () => getCateringPiecesInCart(cart, cateringProductIds),
    [cart, cateringProductIds]
  )

  const metMin = cateringPieces >= MIN_CATERING_PIECES
  const hasCateringLines = cateringPieces > 0
  const blockCheckout = isCateringMinimumBlocking(cart, cateringProductIds)
  const currency = cart?.currency_code ?? "usd"
  const base = `/${countryCode}`

  const cateringSubtotal = useMemo(
    () => lines.reduce((sum, l) => sum + (l.total ?? 0), 0),
    [lines]
  )

  const progressPct = Math.min(
    100,
    Math.round((cateringPieces / MIN_CATERING_PIECES) * 100)
  )

  return (
    <div
      id="catering-receipt"
      className="rounded-xl border border-brand-dark/10 bg-white p-5 shadow-sm"
    >
      <h3 className="font-display text-lg uppercase tracking-wide text-brand-dark">
        Your Order
      </h3>

      {lines.length === 0 ? (
        <p className="mt-4 text-sm text-brand-dark-300">
          No catering items yet. Use the menu to add empanadas.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-brand-dark/5">
          {lines.map((line) => {
            const label =
              line.variant?.title ?? line.title ?? "Item"
            const isDeleting = deletingId === line.id
            return (
              <li
                key={line.id}
                className="group flex items-start justify-between gap-2 py-2 text-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-brand-dark">
                    {label}
                  </p>
                  <p className="text-brand-dark-300">
                    {line.quantity} &times;{" "}
                    {convertToLocale({
                      amount: line.unit_price ?? 0,
                      currency_code: currency,
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="font-semibold text-brand-dark">
                    {convertToLocale({
                      amount: line.total ?? 0,
                      currency_code: currency,
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(line.id)}
                    disabled={isDeleting}
                    aria-label={`Remove ${label}`}
                    className="rounded p-0.5 text-brand-dark-300 opacity-0 transition-opacity hover:text-brand-red focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-100 disabled:opacity-40"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-4 space-y-3 border-t border-brand-dark/10 pt-4">
        {/* Piece progress */}
        <div>
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold text-brand-dark">
              {cateringPieces} / {MIN_CATERING_PIECES} pieces
            </span>
            <span className="text-brand-dark-300">{progressPct}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-cream">
            <div
              className="h-full rounded-full bg-brand-red transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {hasCateringLines && !metMin && (
            <p className="mt-1.5 text-xs text-brand-red">
              Add {MIN_CATERING_PIECES - cateringPieces} more to reach the
              minimum.
            </p>
          )}
        </div>

        {/* Subtotal */}
        {hasCateringLines && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-dark-300">Catering subtotal</span>
            <span className="font-semibold text-brand-dark">
              {convertToLocale({
                amount: cateringSubtotal,
                currency_code: currency,
              })}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <Link
            href={`${base}/checkout`}
            className={brandButtonClasses(
              "primary",
              "md",
              blockCheckout ? "opacity-50 pointer-events-none" : ""
            )}
            aria-disabled={blockCheckout}
            onClick={(e) => {
              if (blockCheckout) e.preventDefault()
            }}
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
