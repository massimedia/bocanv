import { clx } from "@medusajs/ui"
import Image from "next/image"

type FoodCardProps = {
  title: string
  description?: string
  price?: string
  /** Where to render the price: "title-row" next to the title (default), or "bottom-right" small at the card footer. */
  pricePosition?: "title-row" | "bottom-right"
  thumbnail?: string | null
  badge?: string
  /** A React node rendered in the top-right corner of the card content (e.g. a diet tag). */
  topRightBadge?: React.ReactNode
  /** Set to false to hide the image/placeholder block (e.g. compact bulk-order cards). */
  showImage?: boolean
  className?: string
  children?: React.ReactNode
}

export default function FoodCard({
  title,
  description,
  price,
  pricePosition = "title-row",
  thumbnail,
  badge,
  topRightBadge,
  showImage = true,
  className,
  children,
}: FoodCardProps) {
  return (
    <div
      className={clx(
        "group relative flex h-full flex-col bg-brand-cream-400 rounded-xl overflow-hidden border border-brand-dark/5 transition-shadow duration-200",
        className
      )}
    >
      {showImage && (
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream-100">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-brand-dark-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                />
              </svg>
            </div>
          )}
          {badge && (
            <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl text-brand-dark leading-snug md:text-2xl">
            {title}
          </h3>
          {topRightBadge ?? (price && pricePosition === "title-row" && (
            <span className="text-brand-red font-semibold whitespace-nowrap">
              {price}
            </span>
          ))}
        </div>
        {description && (
          <p className="mt-1.5 text-sm text-brand-dark-300 line-clamp-2">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <div className="flex-1">{children}</div>
            {price && pricePosition === "bottom-right" && (
              <span className="shrink-0 text-xs text-brand-dark-300">
                {price}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
