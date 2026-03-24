import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Anton, Rubik } from "next/font/google"
import "styles/globals.css"

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className={`${anton.variable} ${rubik.variable} font-sans`}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
