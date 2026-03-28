import { HttpTypes } from "@medusajs/types"

/**
 * /store/shipping-options returns nested service_zone; core TS types may omit it.
 */
export type StoreShippingOptionExpanded =
  HttpTypes.StoreCartShippingOption & {
    service_zone?: {
      fulfillment_set?: {
        type?: string
        location?: { address?: HttpTypes.StoreCartAddress }
      }
    }
  }

export function shippingOptionFulfillmentType(
  option: HttpTypes.StoreCartShippingOption
): string | undefined {
  return (option as StoreShippingOptionExpanded).service_zone?.fulfillment_set
    ?.type
}

export function shippingOptionPickupAddress(
  option: HttpTypes.StoreCartShippingOption
): HttpTypes.StoreCartAddress | null | undefined {
  return (option as StoreShippingOptionExpanded).service_zone?.fulfillment_set
    ?.location?.address
}
