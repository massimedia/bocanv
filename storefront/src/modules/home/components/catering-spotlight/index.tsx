import Link from "next/link"

import Container from "@modules/common/components/container"
import { brandButtonClasses } from "@modules/common/components/button/classes"

type CateringSpotlightProps = {
  countryCode: string
}

const FACTS = [
  { label: "Minimum order", value: "30 empanadas" },
  { label: "Preparation", value: "Frozen or baked" },
  { label: "Built for", value: "Offices & parties" },
] as const

export default function CateringSpotlight({ countryCode }: CateringSpotlightProps) {
  const base = `/${countryCode}`

  return (
    <section className="py-16 md:py-24 bg-white border-b border-brand-dark/10">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-red">
              Catering
            </p>
            <h2 className="font-display text-3xl small:text-4xl md:text-5xl tracking-wide uppercase text-brand-dark mt-3 leading-tight">
              Feed the whole room
            </h2>
            <p className="mt-6 text-brand-dark-300 text-lg leading-relaxed max-w-lg">
              Quantity fields, quick +5 / +10 adds, and a clear minimum so
              planning events stays simple. No generic shop UI — built for
              bulk orders.
            </p>
            <div className="mt-8">
              <Link
                href={`${base}/catering`}
                className={brandButtonClasses("primary", "lg")}
              >
                Start a catering order
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-brand-cream border border-brand-dark/10 p-8 md:p-10 shadow-sm">
            <p className="font-display text-xl md:text-2xl uppercase tracking-wide text-brand-dark mb-8">
              The gist
            </p>
            <ul className="space-y-6">
              {FACTS.map((f) => (
                <li
                  key={f.label}
                  className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-brand-dark/10 pb-6 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-medium text-brand-dark-300 uppercase tracking-wider">
                    {f.label}
                  </span>
                  <span className="text-lg font-semibold text-brand-dark">
                    {f.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
