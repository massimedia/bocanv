import { clx } from "@medusajs/ui"

type SectionProps = {
  children: React.ReactNode
  className?: string
  bg?: "cream" | "white" | "dark"
  padding?: boolean
} & React.HTMLAttributes<HTMLElement>

const bgMap = {
  cream: "bg-brand-cream",
  white: "bg-white",
  dark: "bg-brand-dark text-white",
} as const

export default function Section({
  children,
  className,
  bg = "white",
  padding = true,
  ...props
}: SectionProps) {
  return (
    <section
      className={clx("w-full", bgMap[bg], padding && "section-padding", className)}
      {...props}
    >
      {children}
    </section>
  )
}
