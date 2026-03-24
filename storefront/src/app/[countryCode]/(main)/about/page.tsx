import { Metadata } from "next"

import Container from "@modules/common/components/container"
import Section from "@modules/common/components/section"

export const metadata: Metadata = {
  title: "About | Bocanv",
  description: "Learn about Bocanv.",
}

export default function AboutPage() {
  return (
    <Section bg="cream">
      <Container>
        <h1 className="heading-xl">About</h1>
        <p className="text-muted mt-4 max-w-xl">
          Our story and team will appear here soon.
        </p>
      </Container>
    </Section>
  )
}
