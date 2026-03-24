"use client"

import { useEffect, useState } from "react"

const WORDS = [
  { label: "diverse", suffix: "" as const },
  { label: "flavourful", suffix: "" as const },
  { label: "bold", suffix: "" as const },
  { label: "provocative", suffix: "." as const },
] as const

const INTERVAL_MS = 2800
const FADE_MS = 320

export default function HeroRotatingHeadline() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduceMotion) {
      return
    }

    const id = window.setInterval(() => {
      setVisible(false)
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length)
        setVisible(true)
      }, FADE_MS)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  const { label, suffix } = WORDS[index]

  return (
    <p
      className="font-display flex min-h-[1.2em] flex-wrap items-baseline text-4xl uppercase leading-[1.05] tracking-wide text-brand-red xsmall:text-5xl small:text-6xl md:text-7xl large:text-8xl"
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        className={`transition-opacity duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
        {suffix}
      </span>
    </p>
  )
}
