import { HttpTypes } from "@medusajs/types"

import FeaturedProducts from "@modules/home/components/featured-products"

type FeaturedProductsSectionProps = {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}

export default function FeaturedProductsSection({
  collections,
  region,
}: FeaturedProductsSectionProps) {
  if (!collections.length) {
    return null
  }

  return (
    <section className="bg-white border-b border-brand-dark/10">
      <div className="content-container pt-16 md:pt-20 pb-4">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-red">
          From our kitchen
        </p>
        <h2 className="font-display text-3xl small:text-4xl md:text-5xl tracking-wide uppercase text-brand-dark mt-3 leading-tight">
          Grab a taste
        </h2>
        <p className="mt-4 text-brand-dark-300 max-w-xl text-lg">
          A few favourites from the store — dig into a collection or view a
          single product.
        </p>
      </div>
      <div className="flex flex-col">
        <FeaturedProducts collections={collections} region={region} />
      </div>
    </section>
  )
}
