"use client"

import { useState } from "react"
import Section from "@modules/common/components/section"
import Container from "@modules/common/components/container"
import Grid from "@modules/common/components/grid"
import Button from "@modules/common/components/button"
import FoodCard from "@modules/common/components/food-card"
import QuantityInput from "@modules/common/components/quantity-input"

export default function PreviewPage() {
  const [qty1, setQty1] = useState(0)
  const [qty2, setQty2] = useState(5)
  const [loading, setLoading] = useState(false)

  return (
    <div>
      {/* Section: Headings & Typography */}
      <Section bg="cream">
        <Container>
          <h1 className="heading-xl">Bocanv Design System</h1>
          <p className="text-muted mt-4 text-lg">Anton + Rubik font pairing</p>
        </Container>
      </Section>

      {/* Section: Typography Showcase */}
      <Section bg="white">
        <Container>
          <h2 className="heading-lg mb-8">Typography</h2>
          <div className="space-y-6">
            <div>
              <p className="text-xs text-brand-dark-300 uppercase tracking-wider mb-1">Anton -- Display / Headings</p>
              <p className="font-display text-6xl uppercase">Fresh Empanadas</p>
            </div>
            <div>
              <p className="text-xs text-brand-dark-300 uppercase tracking-wider mb-1">heading-xl</p>
              <h1 className="heading-xl">Order Catering Today</h1>
            </div>
            <div>
              <p className="text-xs text-brand-dark-300 uppercase tracking-wider mb-1">heading-lg</p>
              <h2 className="heading-lg">Our Menu Selection</h2>
            </div>
            <div>
              <p className="text-xs text-brand-dark-300 uppercase tracking-wider mb-1">heading-md</p>
              <h3 className="heading-md">Classic Flavours</h3>
            </div>
            <hr className="border-brand-dark-50" />
            <div>
              <p className="text-xs text-brand-dark-300 uppercase tracking-wider mb-1">Rubik -- Body text</p>
              <p className="text-base">Handmade empanadas baked fresh daily. Choose from our selection of classic and creative flavours, perfect for catering events of any size. Minimum order of 30 empanadas for catering.</p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-brand-dark-300 uppercase tracking-wider mb-1">Rubik Light (300)</p>
                <p className="text-lg font-light">Light weight text</p>
              </div>
              <div>
                <p className="text-xs text-brand-dark-300 uppercase tracking-wider mb-1">Rubik Regular (400)</p>
                <p className="text-lg font-normal">Regular weight text</p>
              </div>
              <div>
                <p className="text-xs text-brand-dark-300 uppercase tracking-wider mb-1">Rubik Medium (500)</p>
                <p className="text-lg font-medium">Medium weight text</p>
              </div>
              <div>
                <p className="text-xs text-brand-dark-300 uppercase tracking-wider mb-1">Rubik Semibold (600)</p>
                <p className="text-lg font-semibold">Semibold weight text</p>
              </div>
              <div>
                <p className="text-xs text-brand-dark-300 uppercase tracking-wider mb-1">Rubik Bold (700)</p>
                <p className="text-lg font-bold">Bold weight text</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section: Color Palette */}
      <Section bg="white">
        <Container>
          <h2 className="heading-lg mb-8">Color Palette</h2>
          <div className="grid grid-cols-7 gap-4">
            {[
              { name: "Chili Red", bg: "bg-brand-red", text: "text-white" },
              { name: "Sun Yellow", bg: "bg-brand-yellow", text: "text-brand-dark" },
              { name: "Papaya Orange", bg: "bg-brand-orange", text: "text-white" },
              { name: "Sky Blue", bg: "bg-brand-blue", text: "text-white" },
              { name: "Fresh Green", bg: "bg-brand-green", text: "text-white" },
              { name: "Cream", bg: "bg-brand-cream", text: "text-brand-dark" },
              { name: "Charcoal", bg: "bg-brand-dark", text: "text-white" },
            ].map((c) => (
              <div key={c.name} className={`${c.bg} ${c.text} rounded-xl p-4 text-center`}>
                <div className="font-semibold text-sm">{c.name}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-7 gap-4">
            {["brand-red", "brand-yellow", "brand-orange", "brand-blue", "brand-green", "brand-cream", "brand-dark"].map((color) => (
              <div key={color} className="flex flex-col gap-1">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                  <div
                    key={shade}
                    className={`bg-${color}-${shade} h-6 rounded text-[10px] flex items-center justify-center ${shade >= 500 ? "text-white" : "text-brand-dark"}`}
                  >
                    {shade}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section: Buttons */}
      <Section bg="white">
        <Container>
          <h2 className="heading-lg mb-8">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="sm">Primary SM</Button>
            <Button variant="primary" size="md">Primary MD</Button>
            <Button variant="primary" size="lg">Primary LG</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="ghost" size="md">Ghost</Button>
            <Button variant="primary" size="md" disabled>Disabled</Button>
            <Button
              variant="primary"
              size="md"
              loading={loading}
              onClick={() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 2000)
              }}
            >
              Click to Load
            </Button>
          </div>
        </Container>
      </Section>

      {/* Section: QuantityInput */}
      <Section bg="cream">
        <Container>
          <h2 className="heading-lg mb-8">Quantity Input</h2>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-brand-dark-300 mb-2">Default (with +5, +10)</p>
              <QuantityInput value={qty1} onChange={setQty1} />
            </div>
            <div>
              <p className="text-sm text-brand-dark-300 mb-2">Pre-filled, no quick adds</p>
              <QuantityInput value={qty2} onChange={setQty2} quickAdds={[]} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Section: FoodCards in Grid */}
      <Section bg="white">
        <Container>
          <h2 className="heading-lg mb-8">Food Cards</h2>
          <Grid cols={3}>
            <FoodCard
              title="Empanada de Carne"
              description="Classic beef empanada with a crispy golden crust and savory filling."
              price="$3.50"
              badge="Popular"
            />
            <FoodCard
              title="Empanada de Pollo"
              description="Tender chicken with onions and spices wrapped in a flaky pastry."
              price="$3.50"
            />
            <FoodCard
              title="Empanada Vegana"
              description="Roasted vegetables and plant-based cheese in a golden shell."
              price="$4.00"
              badge="Vegan"
            />
            <FoodCard
              title="Empanada de Jamón y Queso"
              description="Ham and cheese melted inside a buttery pastry."
              price="$3.50"
            >
              <QuantityInput value={qty1} onChange={setQty1} />
            </FoodCard>
          </Grid>
        </Container>
      </Section>

      {/* Section: Dark background */}
      <Section bg="dark">
        <Container>
          <h2 className="font-display text-3xl font-semibold mb-4">Dark Section</h2>
          <p className="text-white/70">Sections support dark backgrounds too.</p>
          <div className="mt-6 flex gap-4">
            <Button variant="secondary" size="lg">Order Catering</Button>
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">Browse Menu</Button>
          </div>
        </Container>
      </Section>
    </div>
  )
}
