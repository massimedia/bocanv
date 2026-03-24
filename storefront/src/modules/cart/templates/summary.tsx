"use client"

import { Button, Heading } from "@medusajs/ui"

import {
  getCateringPiecesInCart,
  isCateringMinimumBlocking,
  MIN_CATERING_PIECES,
} from "@lib/util/catering-cart"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  cateringProductIds?: string[]
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({
  cart,
  cateringProductIds = [],
}: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const blockCheckout = isCateringMinimumBlocking(cart, cateringProductIds)
  const cateringCount = getCateringPiecesInCart(cart, cateringProductIds)

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      {blockCheckout && (
        <p className="rounded-lg border border-brand-red-200 bg-brand-red-50 px-3 py-2 text-sm text-brand-dark">
          Catering needs at least {MIN_CATERING_PIECES} pieces (you have{" "}
          {cateringCount}). Add more from catering or adjust your cart.
        </p>
      )}
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      {blockCheckout ? (
        <Button className="w-full h-10" disabled>
          Go to checkout
        </Button>
      ) : (
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <Button className="w-full h-10">Go to checkout</Button>
        </LocalizedClientLink>
      )}
    </div>
  )
}

export default Summary
