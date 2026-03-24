import { Metadata } from "next"

import Container from "@modules/common/components/container"
import Section from "@modules/common/components/section"

export const metadata: Metadata = {
  title: "Menu | Bocanv",
  description: "Browse our empanadas by location.",
}

export default function MenuPage() {
  return (
    <Section bg="cream">
      <Container>
        <h1 className="heading-xl">Menu</h1>
        <p className="text-muted mt-4 max-w-xl">
          Location-based menu is coming soon. For now, browse all products in the
          store.
        </p>
      </Container>
    </Section>
  )
}
