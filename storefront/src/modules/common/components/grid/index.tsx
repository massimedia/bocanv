import { clx } from "@medusajs/ui"

type GridProps = {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4
} & React.HTMLAttributes<HTMLDivElement>

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
} as const

export default function Grid({
  children,
  className,
  cols = 3,
  ...props
}: GridProps) {
  return (
    <div
      className={clx("grid gap-6", colsMap[cols], className)}
      {...props}
    >
      {children}
    </div>
  )
}
