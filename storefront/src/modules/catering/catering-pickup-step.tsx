"use client"

import { listCartShippingMethods } from "@lib/data/fulfillment"
import { setShippingMethod, updateCart } from "@lib/data/cart"
import {
  CATERING_META_DATE,
  CATERING_META_SLOT,
  CATERING_MIN_LEAD_HOURS,
  CATERING_PICKUP_MAX_DAY_OFFSET,
  buildDefaultHourlyPickupSlots,
  cateringDayHasEligibleSlot,
  getCateringTimeSlotsForPickupOption,
  getMinPickupInstant,
  parseLocalDateOnly,
  toLocalISODate,
} from "@lib/util/catering-pickup"
import { ChevronDown } from "lucide-react"
import {
  shippingOptionFulfillmentType,
  shippingOptionPickupAddress,
} from "@lib/util/shipping-option-expanded"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { da, enUS } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { DayPicker } from "react-day-picker"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import "react-day-picker/style.css"

function CalendarDayButton(props: any) {
  const { day, modifiers, style, ...rest } = props
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])
  return (
    <button
      ref={ref}
      {...rest}
      style={{
        ...style,
        ...(modifiers.selected
          ? { backgroundColor: "#E6392F", color: "#fff" }
          : {}),
      }}
    />
  )
}

/** Dark shell like QuantityInput pill; day cells + nav match +/− circles (cream on dark-400, red hover/selected). */
const cateringScheduleDayPickerClassName =
  "mt-3 w-fit max-w-full rounded-2xl border border-white/10 bg-brand-dark py-2.5 pl-2 pr-1.5 shadow-none " +
  "[&_.rdp-day]:p-0.5 " +
  "[&_.rdp-weekday]:text-brand-cream/55 [&_.rdp-weekday]:opacity-100 " +
  "[&_.rdp-month_caption]:text-white " +
  "[&_.rdp-caption_label]:!font-semibold [&_.rdp-caption_label]:!text-white " +
  "[&_.rdp-day_button]:!m-0 [&_.rdp-day_button]:flex [&_.rdp-day_button]:h-9 [&_.rdp-day_button]:w-9 [&_.rdp-day_button]:shrink-0 [&_.rdp-day_button]:items-center [&_.rdp-day_button]:justify-center [&_.rdp-day_button]:rounded-full [&_.rdp-day_button]:border-0 [&_.rdp-day_button]:bg-brand-dark-400 [&_.rdp-day_button]:font-semibold [&_.rdp-day_button]:text-brand-cream [&_.rdp-day_button]:shadow-none [&_.rdp-day_button]:transition-colors " +
  "[&_.rdp-day_button:hover:not(:disabled)]:bg-brand-red [&_.rdp-day_button:hover:not(:disabled)]:text-white " +
  "[&_.rdp-day_button:focus-visible]:outline-none [&_.rdp-day_button:focus-visible]:ring-2 [&_.rdp-day_button:focus-visible]:ring-brand-red/40 " +
  "[&_.rdp-day.rdp-disabled_.rdp-day_button]:pointer-events-none [&_.rdp-day.rdp-disabled_.rdp-day_button]:opacity-30 [&_.rdp-day.rdp-disabled_.rdp-day_button:hover]:bg-brand-dark-400 " +
  "[&_.rdp-day.rdp-outside_.rdp-day_button]:bg-transparent [&_.rdp-day.rdp-outside_.rdp-day_button]:font-normal [&_.rdp-day.rdp-outside_.rdp-day_button]:text-brand-cream/35 [&_.rdp-day.rdp-outside_.rdp-day_button:hover]:bg-transparent " +
  "[&_.rdp-button_previous]:flex [&_.rdp-button_previous]:h-9 [&_.rdp-button_previous]:w-9 [&_.rdp-button_previous]:items-center [&_.rdp-button_previous]:justify-center [&_.rdp-button_previous]:rounded-full [&_.rdp-button_previous]:border-0 [&_.rdp-button_previous]:bg-brand-dark-400 [&_.rdp-button_previous]:text-brand-cream [&_.rdp-button_previous]:transition-colors [&_.rdp-button_previous:hover:not(:disabled)]:bg-brand-red [&_.rdp-button_previous:hover:not(:disabled)]:text-white " +
  "[&_.rdp-button_next]:flex [&_.rdp-button_next]:h-9 [&_.rdp-button_next]:w-9 [&_.rdp-button_next]:items-center [&_.rdp-button_next]:justify-center [&_.rdp-button_next]:rounded-full [&_.rdp-button_next]:border-0 [&_.rdp-button_next]:bg-brand-dark-400 [&_.rdp-button_next]:text-brand-cream [&_.rdp-button_next]:transition-colors [&_.rdp-button_next:hover:not(:disabled)]:bg-brand-red [&_.rdp-button_next:hover:not(:disabled)]:text-white " +
  "[&_.rdp-chevron]:fill-current [&_.rdp-chevron]:text-brand-cream"

function formatPickupAddress(
  address: HttpTypes.StoreCartAddress | null | undefined
) {
  if (!address) return ""
  const parts: string[] = []
  if (address.address_1) parts.push(address.address_1)
  if (address.address_2) parts.push(address.address_2)
  if (address.postal_code || address.city) {
    parts.push(
      [address.postal_code, address.city].filter(Boolean).join(" ")
    )
  }
  if (address.country_code) {
    parts.push(address.country_code.toUpperCase())
  }
  return parts.join(", ")
}

type CateringPickupStepProps = {
  cart: HttpTypes.StoreCart
  countryCode: string
}

export default function CateringPickupStep({
  cart,
  countryCode,
}: CateringPickupStepProps) {
  const router = useRouter()
  // Calendar should always be English per UX request (month/day names).
  const pickerLocale = enUS

  const [pickupOptions, setPickupOptions] = useState<
    HttpTypes.StoreCartShippingOption[] | null
  >(null)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  /** Keeps DayPicker highlight in sync while cart + router.refresh() catch up after a date click. */
  const [optimisticDateIso, setOptimisticDateIso] = useState<string | null>(
    null
  )

  const meta = (cart.metadata ?? {}) as Record<string, string | undefined>
  const selectedDate = meta[CATERING_META_DATE] ?? ""
  const selectedSlot = meta[CATERING_META_SLOT] ?? ""

  const scheduleDateIso = optimisticDateIso ?? selectedDate

  useEffect(() => {
    if (
      optimisticDateIso !== null &&
      selectedDate === optimisticDateIso
    ) {
      setOptimisticDateIso(null)
    }
  }, [selectedDate, optimisticDateIso])

  useEffect(() => {
    setOptimisticDateIso(null)
  }, [cart.id])

  const minPickupInstant = getMinPickupInstant()

  const toDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + CATERING_PICKUP_MAX_DAY_OFFSET)
    d.setHours(23, 59, 59, 999)
    return d
  }, [])

  const loadOptions = useCallback(async () => {
    if (!cart.id) return
    setLoadingOptions(true)
    try {
      const all = await listCartShippingMethods(cart.id)
      if (!all) {
        setPickupOptions([])
        setError("Could not load pickup locations. Please refresh and try again.")
        return
      }
      const pickup =
        all.filter((o) => shippingOptionFulfillmentType(o) === "pickup") ?? []
      setPickupOptions(pickup)
      setError(null)
    } finally {
      setLoadingOptions(false)
    }
  }, [cart.id])

  useEffect(() => {
    loadOptions()
  }, [loadOptions])

  const currentOptionId =
    cart.shipping_methods?.at(-1)?.shipping_option_id ?? null

  const selectedOption = useMemo(
    () => pickupOptions?.find((o) => o.id === currentOptionId) ?? null,
    [pickupOptions, currentOptionId]
  )

  const availableSlots = useMemo(
    () =>
      scheduleDateIso
        ? getCateringTimeSlotsForPickupOption(
            selectedOption,
            scheduleDateIso,
            minPickupInstant
          )
        : [],
    [scheduleDateIso, selectedOption, minPickupInstant]
  )

  const persistMetadata = async (nextMeta: Record<string, string>) => {
    const prev = (cart.metadata ?? {}) as Record<string, string>
    await updateCart({
      metadata: {
        ...prev,
        ...nextMeta,
      },
    })
    router.refresh()
  }

  const onStoreChange = async (optionId: string) => {
    setError(null)
    setApplying(true)
    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: optionId })
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not set pickup location")
    } finally {
      setApplying(false)
    }
  }

  const onCalendarSelect = async (d: Date | undefined) => {
    if (!d) return
    setError(null)
    const iso = toLocalISODate(d)
    setOptimisticDateIso(iso)
    const slots = getCateringTimeSlotsForPickupOption(
      selectedOption,
      iso,
      minPickupInstant
    )
    const slotStillValid =
      Boolean(selectedSlot) && slots.some((s) => s.value === selectedSlot)
    try {
      const prev = (cart.metadata ?? {}) as Record<string, string>
      const next: Record<string, string> = {
        ...prev,
        [CATERING_META_DATE]: iso,
      }
      if (!slotStillValid) {
        next[CATERING_META_SLOT] = ""
      }
      await updateCart({ metadata: next })
      router.refresh()
    } catch (e) {
      setOptimisticDateIso(null)
      setError(e instanceof Error ? e.message : "Could not save date")
    }
  }

  const onSlotChange = async (value: string) => {
    setError(null)
    try {
      await persistMetadata({ [CATERING_META_SLOT]: value })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save time")
    }
  }

  const selectedDay = parseLocalDateOnly(scheduleDateIso) ?? undefined

  const dateButtonLabel = useMemo(() => {
    if (!scheduleDateIso) return "Select date"
    const d = parseLocalDateOnly(scheduleDateIso)
    if (!d) return "Select date"
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }, [scheduleDateIso, countryCode])

  const selectedSlotLabel = useMemo(() => {
    if (!selectedSlot) return ""
    return availableSlots.find((s) => s.value === selectedSlot)?.label ?? ""
  }, [availableSlots, selectedSlot])

  const slotsFiltered =
    scheduleDateIso &&
    buildDefaultHourlyPickupSlots().length > availableSlots.length

  return (
    <div id="catering-pickup" className="scroll-mt-24">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
          03
        </span>
        <h2 className="font-display text-2xl text-brand-dark md:text-3xl">
          Pickup store &amp; time
        </h2>
      </div>

      <div className="mt-8 space-y-8">
        {loadingOptions ? (
          <p className="text-sm text-brand-dark-300">Loading pickup stores…</p>
        ) : !pickupOptions?.length ? (
          <p className="text-sm text-brand-red-300">
            No pickup locations available for this cart. Check stock locations
            and shipping options in Medusa Admin.
          </p>
        ) : (
          <ul
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            role="list"
          >
            {pickupOptions.map((option) => {
              const selected = option.id === currentOptionId
              const addr = formatPickupAddress(
                shippingOptionPickupAddress(option)
              )
              const disabled = option.insufficient_inventory
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    disabled={disabled || applying}
                    onClick={() => onStoreChange(option.id)}
                    className={`flex w-full flex-col items-start rounded-xl border-2 p-4 text-left transition-colors ${
                      selected
                        ? "border-brand-red bg-brand-cream-400"
                        : "border-brand-dark/10 bg-brand-cream-400 hover:border-brand-dark/20"
                    } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <span className="font-display text-base text-brand-dark">
                      {option.name}
                    </span>
                    {addr ? (
                      <span className="mt-1 text-sm text-brand-dark-300">
                        {addr}
                      </span>
                    ) : null}
                    <span className="mt-2 text-sm font-semibold text-brand-dark">
                      {convertToLocale({
                        amount: option.amount ?? 0,
                        currency_code: cart.currency_code,
                      })}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <div>
          <span
            id="catering-pickup-date"
            className="font-display text-lg text-brand-dark"
          >
            Pickup schedule
          </span>

          <button
            type="button"
            onClick={() => setScheduleOpen((o) => !o)}
            className="mt-3 inline-flex w-full items-center justify-between rounded-xl border border-brand-dark/5 bg-brand-cream-400 px-4 py-3 text-sm text-brand-dark transition-colors hover:border-brand-dark/15"
          >
            <span
              className={
                scheduleDateIso && selectedSlot
                  ? "font-semibold"
                  : "text-brand-dark-300"
              }
            >
              {scheduleDateIso && selectedSlot
                ? `${dateButtonLabel} · ${selectedSlotLabel || selectedSlot}`
                : "Choose pickup date & time"}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-brand-dark-300 transition-transform ${
                scheduleOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {scheduleOpen && (
            <div className="mt-3 overflow-hidden rounded-xl border border-brand-dark/5 bg-brand-cream-400 p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="font-display text-base text-brand-dark">
                    Date
                  </div>
                  <div className={cateringScheduleDayPickerClassName}>
                    <DayPicker
                      mode="single"
                      captionLayout="label"
                      navLayout="around"
                      className="!text-white"
                      classNames={{
                        month_caption: "rdp-month_caption !text-white",
                        caption_label:
                          "rdp-caption_label !text-white font-semibold",
                      }}
                      components={{ DayButton: CalendarDayButton }}
                      defaultMonth={selectedDay}
                      selected={selectedDay}
                      onSelect={async (d) => {
                        await onCalendarSelect(d)
                      }}
                      locale={pickerLocale}
                      toDate={toDate}
                      disabled={(date) =>
                        !cateringDayHasEligibleSlot(date, minPickupInstant)
                      }
                      style={
                        {
                          color: "#fff",
                          "--rdp-accent-color": "#E6392F",
                          "--rdp-accent-background-color": "transparent",
                          "--rdp-today-color": "#F5F0E8",
                          "--rdp-day_button-border-radius": "9999px",
                          "--rdp-day_button-height": "2.25rem",
                          "--rdp-day_button-width": "2.25rem",
                          "--rdp-day_button-border": "0 solid transparent",
                          "--rdp-selected-border": "2px solid rgba(255,255,255,0.45)",
                          "--rdp-nav_button-height": "2.25rem",
                          "--rdp-nav_button-width": "2.25rem",
                          "--rdp-weekday-padding": "0.25rem 0",
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <div className="font-display text-base text-brand-dark">
                      Time
                    </div>
                    {slotsFiltered ? (
                      <div className="text-xs text-brand-dark-300">
                        Lead time applied
                      </div>
                    ) : null}
                  </div>

                  {!scheduleDateIso ? (
                    <p className="mt-2 text-sm text-brand-dark-300">
                      Choose a date to see available times.
                    </p>
                  ) : availableSlots.length === 0 ? (
                    <p className="mt-2 text-sm text-brand-dark-300">
                      No times available for this date (min{" "}
                      {CATERING_MIN_LEAD_HOURS}h lead time).
                    </p>
                  ) : (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {availableSlots.map((s) => {
                        const isSelected = s.value === selectedSlot
                        return (
                          <button
                            key={s.value}
                            type="button"
                            onClick={async () => {
                              await onSlotChange(s.value)
                              setScheduleOpen(false)
                            }}
                            className={`inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                              isSelected
                                ? "bg-brand-red text-white"
                                : "bg-brand-dark-400 text-brand-cream hover:bg-brand-red hover:text-white"
                            }`}
                          >
                            {s.label}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  <p className="mt-3 text-xs text-brand-dark-300">
                    Pickup must be at least {CATERING_MIN_LEAD_HOURS} hours from
                    now, between 10:00 and 18:00.
                  </p>
                  {slotsFiltered ? (
                    <p className="mt-1 text-xs text-brand-dark-300">
                      Some hours are hidden on this date because they fall inside
                      the {CATERING_MIN_LEAD_HOURS}-hour lead time.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>

        {error ? (
          <p className="text-sm text-brand-red-300" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  )
}
