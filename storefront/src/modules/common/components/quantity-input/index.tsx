"use client"

import { clx } from "@medusajs/ui"
import { useCallback, useEffect, useRef } from "react"

type QuickAdd = {
  label: string
  amount: number
}

type QuantityInputProps = {
  value: number
  onChange: (value: number) => void
  /** Fired when the value should be persisted (e.g. synced to cart). Immediate for buttons, debounced for typed input. */
  onCommit?: (value: number) => void
  /** Debounce delay (ms) for typed input commits. Only meaningful when onCommit is set. */
  commitDebounceMs?: number
  min?: number
  max?: number
  step?: number
  quickAdds?: QuickAdd[]
  /** Visual variant: "default" (bordered box) or "pill" (rounded cream pill with red circular + button). */
  variant?: "default" | "pill"
  className?: string
  disabled?: boolean
}

const DEFAULT_QUICK_ADDS: QuickAdd[] = [
  { label: "+5", amount: 5 },
  { label: "+10", amount: 10 },
]

export default function QuantityInput({
  value,
  onChange,
  onCommit,
  commitDebounceMs = 400,
  min = 0,
  max = 999,
  step = 1,
  quickAdds = DEFAULT_QUICK_ADDS,
  variant = "default",
  className,
  disabled = false,
}: QuantityInputProps) {
  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max]
  )

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const commitImmediate = useCallback(
    (v: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      onCommit?.(v)
    },
    [onCommit]
  )

  const commitDebounced = useCallback(
    (v: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => onCommit?.(v), commitDebounceMs)
    },
    [onCommit, commitDebounceMs]
  )

  const handleDecrement = () => {
    const next = clamp(value - step)
    onChange(next)
    commitImmediate(next)
  }

  const handleIncrement = () => {
    const next = clamp(value + step)
    onChange(next)
    commitImmediate(next)
  }

  const handleQuickAdd = (amount: number) => {
    const next = clamp(value + amount)
    onChange(next)
    commitImmediate(next)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === "") {
      onChange(min)
      commitDebounced(min)
      return
    }
    const parsed = parseInt(raw, 10)
    if (!isNaN(parsed)) {
      const clamped = clamp(parsed)
      onChange(clamped)
      commitDebounced(clamped)
    }
  }

  const isPill = variant === "pill"

  return (
    <div className={clx("flex items-center gap-2", className)}>
      <div
        className={clx(
          "inline-flex items-center overflow-hidden",
          isPill
            ? "rounded-full bg-brand-dark px-1.5 py-1.5 gap-1"
            : "rounded-lg border border-brand-dark-100"
        )}
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className={clx(
            "transition-colors disabled:opacity-30 disabled:pointer-events-none",
            isPill
              ? "flex h-9 w-9 items-center justify-center rounded-full text-brand-cream hover:bg-brand-red hover:text-white"
              : "px-2.5 py-1.5 text-brand-dark-300 hover:bg-brand-cream-100"
          )}
          aria-label="Decrease quantity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={isPill ? "w-5 h-5" : "w-4 h-4"}>
            <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
          </svg>
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className={clx(
            clx("text-center font-semibold bg-transparent focus:outline-none disabled:opacity-50", isPill ? "text-brand-cream" : "text-brand-dark"),
            isPill
              ? "w-14 text-lg py-1"
              : "w-12 text-sm border-x border-brand-dark-100 py-1.5"
          )}
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className={clx(
            "transition-colors disabled:opacity-30 disabled:pointer-events-none",
            isPill
              ? "flex h-9 w-9 items-center justify-center rounded-full text-brand-cream hover:bg-brand-red hover:text-white"
              : "px-2.5 py-1.5 text-brand-dark-300 hover:bg-brand-cream-100"
          )}
          aria-label="Increase quantity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={isPill ? "w-5 h-5" : "w-4 h-4"}>
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
        </button>
      </div>

      {quickAdds.length > 0 && (
        <div className="flex items-center gap-1.5">
          {quickAdds.map((qa) => (
            <button
              key={qa.amount}
              type="button"
              onClick={() => handleQuickAdd(qa.amount)}
              disabled={disabled || value >= max}
              className={clx(
                "px-2 py-1 text-xs font-semibold rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none",
                isPill
                  ? "text-brand-cream bg-brand-dark-400 hover:bg-brand-red hover:text-white"
                  : "text-brand-red bg-brand-red-50 hover:bg-brand-red-100"
              )}
            >
              {qa.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
