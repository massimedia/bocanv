import { Metadata } from "next"

import Container from "@modules/common/components/container"
import Section from "@modules/common/components/section"

export const metadata: Metadata = {
  title: "Locations | Bocanv",
  description: "Find a Bocanv location near you.",
}

export default function LocationsPage() {
  return (
    <Section bg="cream">
      <Container>
        <h1 className="heading-xl">Locations</h1>
        <p className="text-muted mt-4 max-w-xl">
          Our physical locations and opening hours will be listed here soon.
        </p>
      </Container>
    </Section>
  )
}
