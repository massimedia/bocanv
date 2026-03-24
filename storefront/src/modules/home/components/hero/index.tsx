import Link from "next/link"

import Container from "@modules/common/components/container"
import { brandButtonClasses } from "@modules/common/components/button/classes"

import HeroRotatingHeadline from "./rotating-headline"

/** Laboca / Webflow asset — fresh baked empanadas hero photography */
const HERO_BACKGROUND_IMAGE =
  "https://cdn.prod.website-files.com/650ca7153182230298b8add9/687100ffcebc6528cdf507e0_LABOCA_Fresh-baked-empanads.avif"

type HeroProps = {
  countryCode: string
}

export default function Hero({ countryCode }: HeroProps) {
  const base = `/${countryCode}`

  return (
    <section className="relative w-full min-h-[78vh] flex flex-col justify-center overflow-hidden border-b border-white/10 py-20 md:py-28">
      {/* Blurred photo — scale hides blur edge bleed */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 scale-110 bg-brand-cream bg-cover bg-center bg-no-repeat blur-md motion-reduce:blur-none md:blur-lg"
          style={{ backgroundImage: `url("${HERO_BACKGROUND_IMAGE}")` }}
        />
      </div>

      {/* Darken for legible big type */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/75 via-black/60 to-black/80 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-black/50 via-transparent to-black/40 pointer-events-none"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="max-w-6xl space-y-2 md:space-y-3">
          <p className="font-display text-4xl uppercase leading-[1.05] tracking-wide text-white xsmall:text-5xl small:text-6xl md:text-7xl large:text-8xl">
            Latin food culture is
          </p>
          <HeroRotatingHeadline />
          <p className="max-w-4xl pt-2 font-display text-xl uppercase leading-snug tracking-wide text-brand-orange md:pt-4 xsmall:text-2xl small:text-3xl md:text-4xl">
            …and that&apos;s also how we like to do things at Laboca.
          </p>
        </div>

        <p className="mt-10 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
          Handmade empanadas in Copenhagen — catering, takeaway, and zero
          apology on flavour.
        </p>

        <div className="mt-10 flex flex-col flex-wrap gap-4 sm:flex-row">
          <Link
            href={`${base}/catering`}
            className={brandButtonClasses("primary", "lg")}
          >
            Order catering
          </Link>
          <Link
            href={`${base}/menu`}
            className={brandButtonClasses("secondary", "lg")}
          >
            Browse menu
          </Link>
          <Link
            href={`${base}/store`}
            className={brandButtonClasses(
              "ghost",
              "lg",
              "border border-white/35 text-white hover:bg-white/10 active:bg-white/15 focus-visible:ring-white/50 focus-visible:ring-offset-black/20"
            )}
          >
            Shop all
          </Link>
        </div>
      </Container>
    </section>
  )
}
