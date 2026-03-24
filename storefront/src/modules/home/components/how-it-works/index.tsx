import Container from "@modules/common/components/container"

const STEPS = [
  {
    n: "1",
    title: "Pick flavours",
    body: "Browse by taste — meat, veg, vegan — and choose frozen or baked where it applies.",
  },
  {
    n: "2",
    title: "Set quantities",
    body: "Use the bulk grid with +5 / +10 shortcuts so big orders don’t take forever.",
  },
  {
    n: "3",
    title: "We prep",
    body: "Your cart stays synced with Medusa so nothing goes stale between edits.",
  },
  {
    n: "4",
    title: "Collect & enjoy",
    body: "Pick up from your chosen spot — takeaway flow coming next.",
  },
] as const

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-brand-yellow-50 border-b border-brand-dark/10">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-dark-400">
          How it works
        </p>
        <h2 className="font-display text-3xl small:text-4xl md:text-5xl tracking-wide uppercase text-brand-dark mt-3 max-w-2xl leading-tight">
          Stupid-simple steps
        </h2>
        <p className="mt-4 text-brand-dark-300 max-w-xl text-lg">
          Same energy as a DIY kit box — minus the folding instructions.
        </p>

        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.n} className="relative">
              <span
                className="font-display text-5xl md:text-6xl text-brand-green leading-none select-none"
                aria-hidden
              >
                {step.n}
              </span>
              <h3 className="font-display text-xl md:text-2xl uppercase tracking-wide text-brand-dark mt-4">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-brand-dark-300 leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
