import { Metadata } from "next"

import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import CateringSpotlight from "@modules/home/components/catering-spotlight"
import CtaSplit from "@modules/home/components/cta-split"
import FeaturedProductsSection from "@modules/home/components/featured-products-section"
import Hero from "@modules/home/components/hero"
import HowItWorks from "@modules/home/components/how-it-works"
import NewsletterStrip from "@modules/home/components/newsletter-strip"
import StoryQuote from "@modules/home/components/story-quote"

export const metadata: Metadata = {
  title: "Bocanv | Empanadas, catering & takeaway",
  description:
    "Handmade empanadas in Copenhagen. Bulk catering, takeaway, and bold Latin flavours.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)
  if (!region) {
    return null
  }

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  return (
    <>
      <Hero countryCode={countryCode} />
      <CateringSpotlight countryCode={countryCode} />
      <HowItWorks />
      <StoryQuote />
      <CtaSplit countryCode={countryCode} />
      {collections && collections.length > 0 && (
        <FeaturedProductsSection collections={collections} region={region} />
      )}
      <NewsletterStrip countryCode={countryCode} />
    </>
  )
}
