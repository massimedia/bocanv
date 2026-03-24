"use client"

import { clx } from "@medusajs/ui"
import { useCallback } from "react"

type QuickAdd = {
  label: string
  amount: number
}

type QuantityInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  quickAdds?: QuickAdd[]
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
  min = 0,
  max = 999,
  step = 1,
  quickAdds = DEFAULT_QUICK_ADDS,
  className,
  disabled = false,
}: QuantityInputProps) {
  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max]
  )

  const handleDecrement = () => {
    onChange(clamp(value - step))
  }

  const handleIncrement = () => {
    onChange(clamp(value + step))
  }

  const handleQuickAdd = (amount: number) => {
    onChange(clamp(value + amount))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    if (raw === "") {
      onChange(min)
      return
    }
    const parsed = parseInt(raw, 10)
    if (!isNaN(parsed)) {
      onChange(clamp(parsed))
    }
  }

  return (
    <div className={clx("flex items-center gap-2", className)}>
      <div className="inline-flex items-center border border-brand-dark-100 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="px-2.5 py-1.5 text-brand-dark-300 hover:bg-brand-cream-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Decrease quantity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clipRule="evenodd" />
          </svg>
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className="w-12 text-center text-sm font-semibold text-brand-dark bg-transparent border-x border-brand-dark-100 py-1.5 focus:outline-none disabled:opacity-50"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="px-2.5 py-1.5 text-brand-dark-300 hover:bg-brand-cream-100 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Increase quantity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
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
              className="px-2 py-1 text-xs font-semibold text-brand-red bg-brand-red-50 hover:bg-brand-red-100 rounded-md transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              {qa.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
