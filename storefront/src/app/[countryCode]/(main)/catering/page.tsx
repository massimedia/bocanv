import { Metadata } from "next"

import Container from "@modules/common/components/container"
import Section from "@modules/common/components/section"

export const metadata: Metadata = {
  title: "Catering | Bocanv",
  description: "Bulk order empanadas for your event.",
}

export default function CateringPage() {
  return (
    <Section bg="cream">
      <Container>
        <h1 className="heading-xl">Catering</h1>
        <p className="text-muted mt-4 max-w-xl">
          Bulk ordering with minimum quantities and quick-add is coming soon.
        </p>
      </Container>
    </Section>
  )
}
