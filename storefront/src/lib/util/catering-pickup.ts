import type { HttpTypes } from "@medusajs/types"

/** Cart metadata keys for catering pickup scheduling (set from storefront). */
export const CATERING_META_DATE = "catering_pickup_date"
export const CATERING_META_SLOT = "catering_pickup_slot"

/** Minimum hours between now and pickup slot start (local time). */
export const CATERING_MIN_LEAD_HOURS = 24

const MS_DAY = 86_400_000
/** Latest calendar day offset from today for pickup selection. */
export const CATERING_PICKUP_MAX_DAY_OFFSET = 183

export type CateringTimeSlot = { value: string; label: string }

export function toLocalISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** `YYYY-MM-DD` → local Date at midnight. */
export function parseLocalDateOnly(iso: string): Date | null {
  const parts = iso.split("-").map(Number)
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null
  const [y, mo, d] = parts
  return new Date(y, mo - 1, d)
}

/** Pickup instant from cart metadata; null if missing or invalid. */
export function cateringPickupStartMs(
  metadata: Record<string, unknown> | null | undefined
): number | null {
  if (!metadata) return null
  const date = String(metadata[CATERING_META_DATE] ?? "").trim()
  const slot = String(metadata[CATERING_META_SLOT] ?? "").trim()
  if (!date || !slot) return null
  const ms = slotStartUnixMs(slot, date)
  return ms === null ? null : ms
}

/** Hourly slots 10:00–11:00 … 17:00–18:00 (values stable for cart metadata). */
export function buildDefaultHourlyPickupSlots(): CateringTimeSlot[] {
  const slots: CateringTimeSlot[] = []
  for (let h = 10; h <= 17; h++) {
    const sh = String(h).padStart(2, "0")
    const eh = String(h + 1).padStart(2, "0")
    const value = `${sh}:00-${eh}:00`
    slots.push({ value, label: `${sh}:00 – ${eh}:00` })
  }
  return slots
}

/** Parse slot value `HH:MM-HH:MM` + local date → UTC ms at slot start. */
export function slotStartUnixMs(slotValue: string, dateIso: string): number | null {
  const m = slotValue.trim().match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/)
  const d = parseLocalDateOnly(dateIso)
  if (!m || !d) return null
  const hh = Number(m[1])
  const mm = Number(m[2])
  if (
    Number.isNaN(hh) ||
    Number.isNaN(mm) ||
    hh < 0 ||
    hh > 23 ||
    mm < 0 ||
    mm > 59
  ) {
    return null
  }
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    hh,
    mm,
    0,
    0
  ).getTime()
}

export function filterSlotsByMinLeadTime(
  slots: CateringTimeSlot[],
  selectedDateIso: string,
  minInstant: Date
): CateringTimeSlot[] {
  const minMs = minInstant.getTime()
  return slots.filter((s) => {
    const start = slotStartUnixMs(s.value, selectedDateIso)
    return start !== null && start >= minMs
  })
}

/**
 * Slots for a pickup day after lead-time filter. Per-location: swap base list inside later.
 */
export function getCateringTimeSlotsForPickupOption(
  _option: HttpTypes.StoreCartShippingOption | null,
  selectedDateIso: string,
  minInstant: Date
): CateringTimeSlot[] {
  const base = buildDefaultHourlyPickupSlots()
  if (!selectedDateIso) return []
  return filterSlotsByMinLeadTime(base, selectedDateIso, minInstant)
}

/** True if date (local midnight boundary) has at least one valid hourly slot ≥ minInstant. */
export function cateringDayHasEligibleSlot(
  day: Date,
  minInstant: Date
): boolean {
  const iso = toLocalISODate(day)
  const slots = getCateringTimeSlotsForPickupOption(null, iso, minInstant)
  return slots.length > 0
}

export function getMinPickupInstant(reference: Date = new Date()): Date {
  return new Date(
    reference.getTime() + CATERING_MIN_LEAD_HOURS * 60 * 60 * 1000
  )
}

/** Catering-only: date + slot exist and first slot start is at least MIN_LEAD_HOURS ahead. */
export function isCateringPickupLeadTimeMet(
  cart: HttpTypes.StoreCart | null | undefined
): boolean {
  const ms = cateringPickupStartMs(
    cart?.metadata as Record<string, unknown> | undefined
  )
  if (ms === null) return false
  return ms >= getMinPickupInstant().getTime()
}
