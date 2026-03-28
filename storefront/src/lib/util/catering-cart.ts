import { HttpTypes } from "@medusajs/types"

import {
  CATERING_META_DATE,
  CATERING_META_SLOT,
  isCateringPickupLeadTimeMet,
} from "@lib/util/catering-pickup"

/** Must match copy on catering page / Admin docs */
export const MIN_CATERING_PIECES = 30
export const MAX_CATERING_PIECES_READY_TO_SERVE = 100

export function getCateringPiecesInCart(
  cart: HttpTypes.StoreCart | null | undefined,
  cateringProductIds: string[]
): number {
  if (!cart?.items?.length || !cateringProductIds.length) {
    return 0
  }
  const set = new Set(cateringProductIds)
  return cart.items.reduce((sum, item) => {
    const pid =
      item.product_id ??
      item.product?.id ??
      (item.variant as { product_id?: string } | undefined)?.product_id
    if (pid && set.has(pid)) {
      return sum + (item.quantity ?? 0)
    }
    return sum
  }, 0)
}

/** True when cart contains any catering SKU and total catering qty is below minimum */
export function isCateringMinimumBlocking(
  cart: HttpTypes.StoreCart | null | undefined,
  cateringProductIds: string[]
): boolean {
  if (!cart?.items?.length || !cateringProductIds.length) {
    return false
  }
  const set = new Set(cateringProductIds)
  const hasCateringLine = cart.items.some((item) => {
    const pid =
      item.product_id ??
      item.product?.id ??
      (item.variant as { product_id?: string } | undefined)?.product_id
    return pid ? set.has(pid) : false
  })
  if (!hasCateringLine) {
    return false
  }
  return getCateringPiecesInCart(cart, cateringProductIds) < MIN_CATERING_PIECES
}

/** True when ready-to-serve is enabled and catering pieces exceed the max */
export function isCateringMaxExceeded(
  cart: HttpTypes.StoreCart | null | undefined,
  cateringProductIds: string[],
  readyToServe: boolean
): boolean {
  if (!readyToServe) return false
  return (
    getCateringPiecesInCart(cart, cateringProductIds) >
    MAX_CATERING_PIECES_READY_TO_SERVE
  )
}

/** Every line item is a catering catalog product (same cart can still be built only from catering). */
export function isCateringOnlyCart(
  cart: HttpTypes.StoreCart | null | undefined,
  cateringProductIds: string[]
): boolean {
  if (!cart?.items?.length || !cateringProductIds.length) {
    return false
  }
  const set = new Set(cateringProductIds)
  return cart.items.every((item) => {
    const pid =
      item.product_id ??
      item.product?.id ??
      (item.variant as { product_id?: string } | undefined)?.product_id
    return pid ? set.has(pid) : false
  })
}

/** Catering-only flow: pickup + date + time must be set before checkout / pay. */
export function isCateringScheduleIncomplete(
  cart: HttpTypes.StoreCart | null | undefined,
  cateringProductIds: string[]
): boolean {
  if (!isCateringOnlyCart(cart, cateringProductIds)) {
    return false
  }
  const meta = cart?.metadata as Record<string, unknown> | undefined
  const hasDate = Boolean(meta?.[CATERING_META_DATE])
  const hasSlot = Boolean(meta?.[CATERING_META_SLOT])
  const hasShipping = (cart?.shipping_methods?.length ?? 0) > 0
  if (!hasDate || !hasSlot || !hasShipping) {
    return true
  }
  return !isCateringPickupLeadTimeMet(cart)
}
