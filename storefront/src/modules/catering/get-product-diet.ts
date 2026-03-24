import { HttpTypes } from "@medusajs/types"

export type ProductDiet = "vegan" | "vegetarian" | "meat"

export type DietFilter = "all" | ProductDiet

function parseDietFromMetadata(
  meta: Record<string, unknown> | null | undefined
): ProductDiet | null {
  const raw = meta?.diet ?? meta?.Diet
  if (typeof raw === "string") {
    const n = raw.trim().toLowerCase()
    if (n === "vegan" || n === "vegetarian" || n === "meat") {
      return n
    }
  }
  return null
}

export function getVariantDiet(
  variant: HttpTypes.StoreProductVariant
): ProductDiet | null {
  return parseDietFromMetadata(
    variant.metadata as Record<string, unknown> | null | undefined
  )
}

/** Variant metadata first, then product metadata / tags (legacy). */
export function getEffectiveCateringDiet(
  product: HttpTypes.StoreProduct,
  variant: HttpTypes.StoreProductVariant
): ProductDiet | null {
  return getVariantDiet(variant) ?? getProductDiet(product)
}

export function cateringVariantMatchesDietFilter(
  product: HttpTypes.StoreProduct,
  variant: HttpTypes.StoreProductVariant,
  filter: DietFilter
): boolean {
  if (filter === "all") {
    return true
  }
  return getEffectiveCateringDiet(product, variant) === filter
}

export function getProductDiet(
  product: HttpTypes.StoreProduct
): ProductDiet | null {
  const fromMeta = parseDietFromMetadata(
    product.metadata as Record<string, unknown> | null | undefined
  )
  if (fromMeta) {
    return fromMeta
  }

  const tags = product.tags
  if (!tags?.length) {
    return null
  }

  for (const t of tags) {
    const handle = (t as { handle?: string }).handle?.toLowerCase?.() ?? ""
    const value = (t as { value?: string }).value?.toLowerCase?.() ?? ""
    const h = handle || value
    if (h === "diet-vegan" || h === "vegan") {
      return "vegan"
    }
    if (h === "diet-vegetarian" || h === "vegetarian") {
      return "vegetarian"
    }
    if (h === "diet-meat" || h === "meat") {
      return "meat"
    }
  }

  return null
}

function stripHtmlToPlainText(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
}

/**
 * Card blurb: product custom metadata first, then Medusa description.
 * Metadata keys (unless overridden by NEXT_PUBLIC_CATERING_DESCRIPTION_METADATA_KEY):
 * catering_description, short_description, description, subtitle.
 */
export function getCateringProductCardDescription(
  product: HttpTypes.StoreProduct,
  maxLen = 200
): string | undefined {
  const meta = product.metadata as Record<string, unknown> | null | undefined
  const customKey =
    process.env.NEXT_PUBLIC_CATERING_DESCRIPTION_METADATA_KEY?.trim()
  const keys = customKey
    ? [customKey]
    : ["catering_description", "short_description", "description", "subtitle"]

  for (const k of keys) {
    const v = meta?.[k]
    if (typeof v === "string" && v.trim()) {
      const plain = stripHtmlToPlainText(v)
      if (plain) {
        return plain.length > maxLen ? `${plain.slice(0, maxLen).trim()}…` : plain
      }
    }
  }

  if (product.description?.trim()) {
    const plain = stripHtmlToPlainText(product.description)
    if (plain) {
      return plain.length > maxLen ? `${plain.slice(0, maxLen).trim()}…` : plain
    }
  }

  return undefined
}

/**
 * Variant-level description from metadata, falling back to product-level.
 * Checks variant metadata keys: description, short_description, catering_description, subtitle.
 */
export function getCateringVariantDescription(
  product: HttpTypes.StoreProduct,
  variant: HttpTypes.StoreProductVariant,
  maxLen = 200
): string | undefined {
  const vMeta = variant.metadata as Record<string, unknown> | null | undefined
  const keys = ["description", "short_description", "catering_description", "subtitle"]

  for (const k of keys) {
    const v = vMeta?.[k]
    if (typeof v === "string" && v.trim()) {
      const plain = stripHtmlToPlainText(v)
      if (plain) {
        return plain.length > maxLen ? `${plain.slice(0, maxLen).trim()}…` : plain
      }
    }
  }

  return getCateringProductCardDescription(product, maxLen)
}

export function productMatchesDietFilter(
  product: HttpTypes.StoreProduct,
  filter: DietFilter
): boolean {
  if (filter === "all") {
    return true
  }
  const d = getProductDiet(product)
  return d === filter
}
