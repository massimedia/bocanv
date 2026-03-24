"use client"

import { setLineItemQuantityForVariant } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import FoodCard from "@modules/common/components/food-card"
import QuantityInput from "@modules/common/components/quantity-input"
import { Beef, Sprout, Vegan } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  getCateringVariantDescription,
  getEffectiveCateringDiet,
} from "./get-product-diet"
import { getVariantCateringLabel } from "./resolve-catering-variant"

function variantInStock(
  v: HttpTypes.StoreProductVariant | undefined
): boolean {
  if (!v) {
    return false
  }
  if (!v.manage_inventory) {
    return true
  }
  if (v.allow_backorder) {
    return true
  }
  if ((v.inventory_quantity ?? 0) > 0) {
    return true
  }
  return false
}

const dietIconConfig: Record<string, { Icon: typeof Vegan }> = {
  vegan: { Icon: Vegan },
  vegetarian: { Icon: Sprout },
  meat: { Icon: Beef },
}

type CateringProductCardProps = {
  product: HttpTypes.StoreProduct
  variant: HttpTypes.StoreProductVariant
  countryCode: string
  lineQuantity: number
}

export default function CateringProductCard({
  product,
  variant,
  countryCode,
  lineQuantity,
}: CateringProductCardProps) {
  const router = useRouter()

  const [qty, setQty] = useState(lineQuantity)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setQty(lineQuantity)
  }, [lineQuantity, variant.id])

  const inStock = variantInStock(variant)
  const { variantPrice } = getProductPrice({
    product,
    variantId: variant.id,
  })
  const priceLabel = variantPrice?.calculated_price ?? null

  const diet = getEffectiveCateringDiet(product, variant)

  const variantLabel = useMemo(
    () => getVariantCateringLabel(product, variant),
    [product, variant]
  )
  const cardTitle = variantLabel || variant.title || product.title || "Empanada"

  const cardDescription = useMemo(
    () => getCateringVariantDescription(product, variant),
    [product, variant]
  )

  const syncingRef = useRef(false)
  const pendingQtyRef = useRef<number | null>(null)

  const syncToCart = useCallback(
    async (nextQty: number) => {
      if (!variant.id || !inStock) {
        return
      }

      if (syncingRef.current) {
        pendingQtyRef.current = nextQty
        return
      }

      syncingRef.current = true
      setSyncing(true)
      setError(null)
      try {
        await setLineItemQuantityForVariant({
          variantId: variant.id,
          quantity: nextQty,
          countryCode,
        })
        router.refresh()
      } catch (e: any) {
        setQty(lineQuantity)
        setError(e?.message ?? "Could not update cart")
      } finally {
        syncingRef.current = false
        setSyncing(false)
      }

      if (pendingQtyRef.current !== null) {
        const pending = pendingQtyRef.current
        pendingQtyRef.current = null
        syncToCart(pending)
      }
    },
    [variant.id, inStock, countryCode, lineQuantity, router]
  )

  return (
    <FoodCard
      title={cardTitle}
      description={cardDescription}
      price={priceLabel ?? undefined}
      pricePosition="bottom-right"
      showImage={false}
      className="w-full"
      topRightBadge={
        diet && dietIconConfig[diet] ? (() => {
          const { Icon } = dietIconConfig[diet]
          return <Icon className="h-5 w-5 shrink-0 text-brand-dark" aria-label={diet} />
        })() : undefined
      }
    >
      <div className="flex items-center gap-3">
        <QuantityInput
          value={qty}
          onChange={setQty}
          onCommit={syncToCart}
          commitDebounceMs={400}
          min={0}
          max={999}
          disabled={!inStock || syncing}
          variant="pill"
        />
        {syncing && (
          <span className="text-xs text-brand-dark-300 animate-pulse">
            Saving…
          </span>
        )}
      </div>

      {!inStock && (
        <p className="mt-2 text-sm text-brand-dark-300">Out of stock</p>
      )}
      {error && <p className="mt-2 text-sm text-brand-red">{error}</p>}
    </FoodCard>
  )
}
