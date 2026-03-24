import Link from "next/link"

import Container from "@modules/common/components/container"

type NewsletterStripProps = {
  countryCode: string
}

export default function NewsletterStrip({ countryCode }: NewsletterStripProps) {
  return (
    <section className="py-14 md:py-16 bg-brand-cream border-t border-brand-dark/10">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide text-brand-dark">
              Join the empanada squad
            </h2>
            <p className="mt-2 text-brand-dark-300 max-w-md">
              Deals, new flavours, and catering reminders — newsletter signup
              coming soon.
            </p>
          </div>
          <Link
            href={`/${countryCode}/contact`}
            className="inline-flex items-center justify-center font-semibold text-brand-red hover:text-brand-red-600 underline underline-offset-4 decoration-2 shrink-0"
          >
            Contact us instead
          </Link>
        </div>
      </Container>
    </section>
  )
}
