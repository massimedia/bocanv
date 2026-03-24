import Container from "@modules/common/components/container"

import { CATERING_FACTS } from "./content"

export default function CateringFacts() {
  return (
    <section className="border-b border-brand-dark/10 bg-white py-12 md:py-16">
      <Container>
        <div className="rounded-2xl border border-brand-dark/10 bg-brand-cream p-8 md:p-10 shadow-sm">
          <p className="font-display text-xl uppercase tracking-wide text-brand-dark md:text-2xl">
            At a glance
          </p>
          <ul className="mt-8 space-y-6">
            {CATERING_FACTS.map((f) => (
              <li
                key={f.label}
                className="flex flex-col gap-1 border-b border-brand-dark/10 pb-6 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="text-sm font-medium uppercase tracking-wider text-brand-dark-300">
                  {f.label}
                </span>
                <span className="text-lg font-semibold text-brand-dark">
                  {f.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
