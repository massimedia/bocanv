import Link from "next/link"

import Container from "@modules/common/components/container"
import { brandButtonClasses } from "@modules/common/components/button/classes"

import { MIN_CATERING_PIECES } from "./content"

type CateringHeroProps = {
  countryCode: string
}

export default function CateringHero({ countryCode }: CateringHeroProps) {
  const base = `/${countryCode}`

  return (
    <section className="bg-brand-cream py-14 md:py-20">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-red">
          Catering
        </p>
        <h1 className="heading-xl mt-3 max-w-3xl">
          Bulk empanadas for teams &amp; events
        </h1>
        <p className="text-muted mt-6 max-w-2xl text-lg leading-relaxed">
          Pick frozen or baked, filter by diet, and build your tray. Minimum{" "}
          {MIN_CATERING_PIECES} pieces per catering order.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="#catering-menu" className={brandButtonClasses("primary", "lg")}>
            Build your order
          </a>
          <Link
            href={`${base}/contact`}
            className={brandButtonClasses("secondary", "lg")}
          >
            Ask a question
          </Link>
        </div>
      </Container>
    </section>
  )
}
