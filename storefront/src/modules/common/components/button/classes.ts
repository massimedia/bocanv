import { clx } from "@medusajs/ui"

export type BrandButtonVariant = "primary" | "secondary" | "ghost"
export type BrandButtonSize = "sm" | "md" | "lg"

const variantStyles: Record<BrandButtonVariant, string> = {
  primary:
    "bg-brand-red text-white hover:bg-brand-red-600 active:bg-brand-red-700 shadow-sm",
  secondary:
    "bg-brand-orange text-white hover:bg-brand-orange-600 active:bg-brand-orange-700 shadow-sm",
  ghost:
    "bg-transparent text-brand-dark hover:bg-brand-cream-200 active:bg-brand-cream-300",
}

const sizeStyles: Record<BrandButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
}

const base =
  "inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-300 focus-visible:ring-offset-2"

export function brandButtonClasses(
  variant: BrandButtonVariant = "primary",
  size: BrandButtonSize = "md",
  className?: string
) {
  return clx(base, variantStyles[variant], sizeStyles[size], className)
}
