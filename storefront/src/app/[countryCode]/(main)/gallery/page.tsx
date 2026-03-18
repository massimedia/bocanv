import { Metadata } from "next"
import Image from "next/image"
import galleryData from "@lib/data/gallery.json"

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from our restaurant and bar.",
}

export default function GalleryPage() {
  const images = galleryData.images as { url: string; alt: string }[]

  return (
    <div className="content-container py-12">
      <h1 className="text-2xl-semi mb-8">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ui-bg-subtle"
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
