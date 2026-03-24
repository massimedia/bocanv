import { HttpTypes } from "@medusajs/types"

export type PreparationMode = "frozen" | "baked"

function normalizeKey(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, " ")
}

function optionsAsKeymap(
  variantOptions: HttpTypes.StoreProductVariant["options"]
): Record<string, string> {
  if (!variantOptions?.length) {
    return {}
  }
  return variantOptions.reduce<Record<string, string>>((acc, vo: any) => {
    if (vo?.option_id) {
      acc[vo.option_id] = vo.value ?? ""
    }
    return acc
  }, {})
}

export function getPreparationOptionId(
  product: HttpTypes.StoreProduct
): string | undefined {
  const configured =
    process.env.NEXT_PUBLIC_CATERING_PREPARATION_OPTION_TITLE || "Preparation"
  const target = normalizeKey(configured)
  const opt = product.options?.find(
    (o) => normalizeKey(o.title ?? "") === target
  )
  return opt?.id
}

/**
 * All variants for this product that match Frozen or Baked (one card per variant in the grid).
 */
export function getVariantsForPreparationMode(
  product: HttpTypes.StoreProduct,
  mode: PreparationMode
): HttpTypes.StoreProductVariant[] {
  const variants = product.variants ?? []
  if (!variants.length) {
    return []
  }

  const optId = getPreparationOptionId(product)
  const want = mode === "frozen" ? "frozen" : "baked"

  if (!optId) {
    return [...variants]
  }

  return variants.filter((v) => {
    const map = optionsAsKeymap(v.options)
    const val = map[optId]
    if (!val) {
      return false
    }
    return normalizeKey(val) === want
  })
}

/** Human label from non-Preparation options (e.g. flavour / size). */
export function getVariantCateringLabel(
  product: HttpTypes.StoreProduct,
  variant: HttpTypes.StoreProductVariant
): string {
  const prepId = getPreparationOptionId(product)
  const map = optionsAsKeymap(variant.options)
  const parts: string[] = []
  for (const opt of product.options ?? []) {
    if (!opt.id || opt.id === prepId) {
      continue
    }
    const val = map[opt.id]
    if (val) {
      parts.push(val)
    }
  }
  return parts.join(" · ")
}

/**
 * Picks the variant for Frozen/Baked based on product option (default title "Preparation").
 * If that option is missing, falls back to the only variant when there is exactly one.
 */
export function getCateringVariant(
  product: HttpTypes.StoreProduct,
  mode: PreparationMode
): HttpTypes.StoreProductVariant | undefined {
  const variants = product.variants
  if (!variants?.length) {
    return undefined
  }

  const optId = getPreparationOptionId(product)
  const want = mode === "frozen" ? "frozen" : "baked"

  if (!optId) {
    if (variants.length === 1) {
      return variants[0]
    }
    return undefined
  }

  return variants.find((v) => {
    const map = optionsAsKeymap(v.options)
    const val = map[optId]
    if (!val) {
      return false
    }
    return normalizeKey(val) === want
  })
}
