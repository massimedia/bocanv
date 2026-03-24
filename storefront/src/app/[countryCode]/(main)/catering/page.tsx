import { Metadata } from "next"
import { notFound } from "next/navigation"

import { fetchCateringCatalog } from "@lib/data/catering"
import { retrieveCart } from "@lib/data/cart"
import { getRegion } from "@lib/data/regions"
import CateringHero from "@modules/catering/catering-hero"
import CateringOrderSection from "@modules/catering/catering-order-section"

const CATERING_PRODUCT_FIELDS =
  "*variants.calculated_price,*variants.options,*variants.manage_inventory,*variants.allow_backorder,+variants.inventory_quantity,+variants.metadata,*variants.images,*options,*images,+thumbnail,+description,+metadata,+tags"

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)
  if (!region) {
    return { title: "Catering | Bocanv" }
  }

  const { products } = await fetchCateringCatalog(
    countryCode,
    "title,handle"
  )
  const title =
    products.length === 1 && products[0].title
      ? `Catering — ${products[0].title} | Bocanv`
      : "Catering | Bocanv"

  return {
    title,
    description:
      "Bulk order empanadas for your event. Frozen or baked, minimum 30 pieces.",
  }
}

export default async function CateringPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)
  if (!region) {
    return notFound()
  }

  const { products, cateringProductIds } = await fetchCateringCatalog(
    countryCode,
    CATERING_PRODUCT_FIELDS
  )
  const cart = await retrieveCart().catch(() => null)

  return (
    <>
      <CateringHero countryCode={countryCode} />
      {products.length === 0 ? (
        <section className="bg-white py-12">
          <div className="content-container mx-auto max-w-content px-6">
            <p className="text-brand-dark-300">
              No catering products found. In Medusa Admin, either add a{" "}
              <strong>collection</strong> and set{" "}
              <code className="rounded bg-brand-cream px-1">
                NEXT_PUBLIC_CATERING_COLLECTION_HANDLE
              </code>
              , or ensure your catering product exists and matches{" "}
              <code className="rounded bg-brand-cream px-1">
                NEXT_PUBLIC_CATERING_PRODUCT_HANDLES
              </code>{" "}
              (default handle{" "}
              <code className="rounded bg-brand-cream px-1">
                empanada-catering
              </code>
              ).
            </p>
          </div>
        </section>
      ) : (
        <CateringOrderSection
          products={products}
          countryCode={countryCode}
          cateringProductIds={cateringProductIds}
          cart={cart}
        />
      )}
    </>
  )
}
