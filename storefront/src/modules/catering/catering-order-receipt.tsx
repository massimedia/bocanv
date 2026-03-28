"use client"

import Link from "next/link"

import { deleteLineItem } from "@lib/data/cart"
import {
  getCateringPiecesInCart,
  isCateringOnlyCart,
  isCateringScheduleIncomplete,
  MAX_CATERING_PIECES_READY_TO_SERVE,
  MIN_CATERING_PIECES,
} from "@lib/util/catering-cart"
import { CATERING_MIN_LEAD_HOURS } from "@lib/util/catering-pickup"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

type CateringOrderReceiptProps = {
  cart: HttpTypes.StoreCart | null
  cateringProductIds: string[]
  countryCode: string
  hideHeading?: boolean
  readyToServe?: boolean
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
  hideHeading = false,
  readyToServe = false,
}: CateringOrderReceiptProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleRemoveLine = async (lineId: string) => {
    setDeletingId(lineId)
    try {
      await deleteLineItem(lineId)
      router.refresh()
    } catch {
      // silently fail
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
  const exceededMax =
    readyToServe && cateringPieces > MAX_CATERING_PIECES_READY_TO_SERVE
  const hasCateringLines = cateringPieces > 0
  const scheduleIncomplete =
    isCateringOnlyCart(cart, cateringProductIds) &&
    isCateringScheduleIncomplete(cart, cateringProductIds)
  const blockCheckout = !metMin || exceededMax || scheduleIncomplete
  const currency = cart?.currency_code ?? "usd"
  const base = `/${countryCode}`

  const cateringSubtotal = useMemo(
    () => lines.reduce((sum, l) => sum + (l.total ?? 0), 0),
    [lines]
  )

  const progressTarget = readyToServe
    ? MAX_CATERING_PIECES_READY_TO_SERVE
    : MIN_CATERING_PIECES
  const progressPct = Math.min(
    100,
    Math.round((cateringPieces / progressTarget) * 100)
  )

  return (
    <div
      id="catering-receipt"
      className="overflow-hidden rounded-xl bg-brand-dark text-brand-cream"
    >
      <div className="p-5">
        {!hideHeading && (
          <h3 className="font-display text-lg italic text-brand-cream">
            Your Box Summary
          </h3>
        )}

        {lines.length === 0 ? (
          <p className="mt-4 text-sm text-brand-dark-200">
            No catering items yet. Use the menu to add empanadas.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-brand-dark-400">
            {lines.map((line) => {
              const label =
                line.variant?.title ?? line.title ?? "Item"
              const isDeleting = deletingId === line.id
              return (
                <li
                  key={line.id}
                  className="group flex items-center justify-between gap-2 py-2.5 text-sm"
                >
                  <span className="min-w-0 truncate font-medium text-brand-cream">
                    {label}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-semibold text-brand-cream">
                      {line.quantity} Pieces
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(line.id)}
                      disabled={isDeleting}
                      aria-label={`Remove ${label}`}
                      className="rounded p-0.5 text-brand-dark-200 opacity-0 transition-opacity hover:text-brand-red focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-100 disabled:opacity-40"
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

        {/* Progress bar */}
        <div className="mt-5 border-t border-brand-dark-400 pt-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-semibold text-brand-cream">
              {cateringPieces} / {progressTarget} pieces
            </span>
            <span className="text-brand-dark-200">{progressPct}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-brand-dark-400">
            <div
              className="h-full rounded-full bg-brand-red transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Subtotal */}
        {hasCateringLines && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-brand-dark-200">Catering subtotal</span>
            <span className="font-semibold text-brand-cream">
              {convertToLocale({
                amount: cateringSubtotal,
                currency_code: currency,
              })}
            </span>
          </div>
        )}

        {/* Minimum order banner */}
        <div className="mt-4">
          {exceededMax ? (
            <div className="flex items-center gap-2 rounded-lg bg-brand-red/15 px-3 py-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 text-brand-red-300" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-red-300">
                  Maximum Exceeded
                </p>
                <p className="text-xs text-brand-red-300/80">
                  Ready-to-serve orders are limited to{" "}
                  {MAX_CATERING_PIECES_READY_TO_SERVE} pieces. Remove{" "}
                  {cateringPieces - MAX_CATERING_PIECES_READY_TO_SERVE} to
                  proceed.
                </p>
              </div>
            </div>
          ) : metMin && scheduleIncomplete ? (
            <div className="flex flex-col gap-1 rounded-lg bg-brand-yellow/20 px-3 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wide text-brand-dark">
                Pickup &amp; time needed
              </p>
              <p className="text-xs text-brand-dark-300">
                Choose a store, date, and pickup hour (10:00–18:00, at least{" "}
                {CATERING_MIN_LEAD_HOURS} hours ahead) below before checkout.
              </p>
              <a
                href="#catering-pickup"
                className="text-xs font-semibold text-brand-red underline-offset-2 hover:underline"
              >
                Go to pickup &amp; time
              </a>
            </div>
          ) : metMin ? (
            <div className="flex items-center gap-2 rounded-lg bg-brand-green/15 px-3 py-2.5">
              <CheckCircle className="h-4 w-4 shrink-0 text-brand-green" />
              <span className="text-xs font-semibold text-brand-green">
                Minimum reached!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-brand-red/15 px-3 py-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 text-brand-red-300" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-red-300">
                  Minimum Order Required
                </p>
                <p className="text-xs text-brand-red-300/80">
                  Minimum {MIN_CATERING_PIECES} pieces.{" "}
                  {cateringPieces > 0 &&
                    `Add ${MIN_CATERING_PIECES - cateringPieces} more.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Checkout button */}
        <div className="mt-4">
          <Link
            href={`${base}/checkout`}
            className={`flex w-full items-center justify-center rounded-lg px-5 py-3 font-display text-sm uppercase tracking-widest transition-colors ${
              blockCheckout
                ? "pointer-events-none bg-brand-dark-400 text-brand-dark-200"
                : "bg-brand-yellow text-brand-dark hover:bg-brand-yellow-400"
            }`}
            aria-disabled={blockCheckout}
            onClick={(e) => {
              if (blockCheckout) e.preventDefault()
            }}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
