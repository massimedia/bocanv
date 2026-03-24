import Link from "next/link"

import Container from "@modules/common/components/container"
import { brandButtonClasses } from "@modules/common/components/button/classes"

type CtaSplitProps = {
  countryCode: string
}

export default function CtaSplit({ countryCode }: CtaSplitProps) {
  const base = `/${countryCode}`

  return (
    <section className="py-16 md:py-24 bg-brand-dark text-brand-cream">
      <Container>
        <div className="grid gap-8 md:grid-cols-2 md:gap-6">
          <div className="rounded-2xl border border-brand-dark-400 bg-brand-dark-600/50 p-8 md:p-10 flex flex-col">
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide text-brand-cream">
              Hungry crowd?
            </h2>
            <p className="mt-4 text-brand-cream-300 flex-1 leading-relaxed">
              Minimum quantities, quick adds, and a summary bar built for
              catering — not impulse buys.
            </p>
            <Link
              href={`${base}/catering`}
              className={brandButtonClasses("primary", "lg", "mt-8 w-full sm:w-auto justify-center")}
            >
              Go to catering
            </Link>
          </div>

          <div className="rounded-2xl border border-brand-dark-400 bg-brand-dark-600/50 p-8 md:p-10 flex flex-col">
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide text-brand-cream">
              Just browsing?
            </h2>
            <p className="mt-4 text-brand-cream-300 flex-1 leading-relaxed">
              See what we&apos;re making. Location-based menus land next; for now
              explore the full store.
            </p>
            <Link
              href={`${base}/menu`}
              className={brandButtonClasses(
                "secondary",
                "lg",
                "mt-8 w-full sm:w-auto justify-center"
              )}
            >
              Open menu
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
