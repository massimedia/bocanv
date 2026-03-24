import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

/** Used when no `NEXT_PUBLIC_CATERING_PRODUCT_HANDLES` env is set */
const DEFAULT_PRODUCT_HANDLES = ["empanada-catering"]

export type CateringCatalogResult = {
  products: HttpTypes.StoreProduct[]
  cateringProductIds: string[]
}

/**
 * Load catering catalog for the storefront:
 * 1. If `NEXT_PUBLIC_CATERING_COLLECTION_HANDLE` is set and the collection exists → all products in that collection.
 * 2. Otherwise → each product from `NEXT_PUBLIC_CATERING_PRODUCT_HANDLES` (comma-separated), or default `empanada-catering`.
 */
export async function fetchCateringCatalog(
  countryCode: string,
  fields: string
): Promise<CateringCatalogResult> {
  const collectionHandle =
    process.env.NEXT_PUBLIC_CATERING_COLLECTION_HANDLE?.trim()

  if (collectionHandle) {
    const collection = await getCollectionByHandle(collectionHandle).catch(
      () => null
    )
    if (collection?.id) {
      const { response } = await listProducts({
        countryCode,
        queryParams: {
          collection_id: [collection.id],
          limit: 100,
          fields,
        },
      })
      const products = response.products
      return {
        products,
        cateringProductIds: products
          .map((p) => p.id)
          .filter(Boolean) as string[],
      }
    }
  }

  const handlesRaw = process.env.NEXT_PUBLIC_CATERING_PRODUCT_HANDLES?.trim()
  const handles = handlesRaw
    ? handlesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_PRODUCT_HANDLES

  const products: HttpTypes.StoreProduct[] = []
  const seen = new Set<string>()

  for (const h of handles) {
    const { response } = await listProducts({
      countryCode,
      queryParams: { handle: h, limit: 1, fields },
    })
    const p = response.products[0]
    if (p?.id && !seen.has(p.id)) {
      seen.add(p.id)
      products.push(p)
    }
  }

  return {
    products,
    cateringProductIds: products.map((p) => p.id).filter(Boolean) as string[],
  }
}

/** Product IDs that count toward the catering minimum (cart / checkout). */
export async function listCateringProductIds(
  countryCode: string
): Promise<string[]> {
  const { cateringProductIds } = await fetchCateringCatalog(countryCode, "id")
  return cateringProductIds
}
