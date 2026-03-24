"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import {
  getCateringPiecesInCart,
  isCateringMinimumBlocking,
  MIN_CATERING_PIECES,
} from "@lib/util/catering-cart"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({
  cart,
  cateringProductIds = [],
}: {
  cart: any
  cateringProductIds?: string[]
}) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  const cateringBlocked = isCateringMinimumBlocking(cart, cateringProductIds)
  const cateringCount = getCateringPiecesInCart(cart, cateringProductIds)

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          {cateringBlocked && (
            <div className="mb-4 rounded-lg border border-brand-red-200 bg-brand-red-50 px-4 py-3 text-sm text-brand-dark">
              Catering orders require at least {MIN_CATERING_PIECES} pieces.
              Your cart has {cateringCount} catering pieces. Add more from the
              catering page or remove catering items to continue.
            </div>
          )}
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                By clicking the Place Order button, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read Medusa
                Store&apos;s Privacy Policy.
              </Text>
            </div>
          </div>
          <PaymentButton
            cart={cart}
            cateringProductIds={cateringProductIds}
            data-testid="submit-order-button"
          />
        </>
      )}
    </div>
  )
}

export default Review
