import { clx } from "@medusajs/ui"
import { forwardRef } from "react"

import {
  brandButtonClasses,
  type BrandButtonSize,
  type BrandButtonVariant,
} from "./classes"

type ButtonVariant = BrandButtonVariant
type ButtonSize = BrandButtonSize

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clx(
          brandButtonClasses(variant, size),
          "disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-ring rounded-full border-2 border-current border-t-transparent" />
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button
