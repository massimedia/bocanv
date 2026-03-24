import { Metadata } from "next"

import Container from "@modules/common/components/container"
import Section from "@modules/common/components/section"

export const metadata: Metadata = {
  title: "Contact | Bocanv",
  description: "Get in touch with Bocanv.",
}

export default function ContactPage() {
  return (
    <Section bg="cream">
      <Container>
        <h1 className="heading-xl">Contact</h1>
        <p className="text-muted mt-4 max-w-xl">
          Contact form and details will be added here soon.
        </p>
      </Container>
    </Section>
  )
}
