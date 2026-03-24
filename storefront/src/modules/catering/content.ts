import { MIN_CATERING_PIECES } from "@lib/util/catering-cart"

export { MIN_CATERING_PIECES }

export const CATERING_FACTS = [
  { label: "Minimum order", value: `${MIN_CATERING_PIECES} empanadas` },
  { label: "Preparation", value: "Frozen or baked" },
  { label: "Built for", value: "Offices & parties" },
] as const
