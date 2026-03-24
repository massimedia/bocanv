import { clx } from "@medusajs/ui"

type ContainerProps = {
  children: React.ReactNode
  className?: string
  wide?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function Container({
  children,
  className,
  wide = false,
  ...props
}: ContainerProps) {
  return (
    <div
      className={clx(
        "w-full mx-auto px-6",
        wide ? "max-w-content-wide" : "max-w-content",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
