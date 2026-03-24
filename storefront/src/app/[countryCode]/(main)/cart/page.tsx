import { listCateringProductIds } from "@lib/data/catering"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  const customer = await retrieveCustomer()
  const cateringProductIds = await listCateringProductIds(params.countryCode)

  return (
    <CartTemplate
      cart={cart}
      customer={customer}
      cateringProductIds={cateringProductIds}
    />
  )
}
