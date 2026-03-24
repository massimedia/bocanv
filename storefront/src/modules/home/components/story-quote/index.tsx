import Container from "@modules/common/components/container"

export default function StoryQuote() {
  return (
    <section className="py-16 md:py-20 bg-brand-blue-50 border-b border-brand-dark/10">
      <Container wide>
        <blockquote className="max-w-4xl mx-auto text-center">
          <p className="font-display text-2xl small:text-3xl md:text-4xl uppercase tracking-wide text-brand-dark leading-snug">
            The world&apos;s most shareable food
          </p>
          <p className="mt-8 text-lg md:text-xl text-brand-dark-300 leading-relaxed">
            Hand-held, hot, and honest — empanadas belong at every table. We
            bring Latin warmth to Copenhagen: bold fillings, golden pastry, and
            catering that scales with your crowd.
          </p>
        </blockquote>
      </Container>
    </section>
  )
}
