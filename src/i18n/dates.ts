import type { Locale } from './types'
import { LOCALE_BCP47 } from './types'

/** Prototype week anchors: week-1 starts Monday 18 Aug 2025 */
const WEEK1_START = new Date(2025, 7, 18)

export function getWeekStartDate(weekOffset: number): Date {
  const start = new Date(WEEK1_START)
  start.setDate(start.getDate() + weekOffset * 7)
  return start
}

export function getWeekEndDate(weekOffset: number): Date {
  const end = getWeekStartDate(weekOffset)
  end.setDate(end.getDate() + 6)
  return end
}

/**
 * Locale-aware week range.
 * FR: "18 au 24 août"
 * EN: "August 18–24"
 */
export function formatWeekDateRange(
  weekOffset: number,
  locale: Locale,
): string {
  const start = getWeekStartDate(weekOffset)
  const end = getWeekEndDate(weekOffset)
  const tag = LOCALE_BCP47[locale]

  if (locale === 'fr') {
    const startDay = start.getDate()
    const endDay = end.getDate()
    const sameMonth = start.getMonth() === end.getMonth()
    const endMonth = new Intl.DateTimeFormat(tag, { month: 'long' }).format(end)

    if (sameMonth) {
      const dayStart =
        startDay === 1 ? '1er' : String(startDay)
      return `${dayStart} au ${endDay} ${endMonth}`
    }

    const startMonthShort = new Intl.DateTimeFormat(tag, {
      month: 'short',
    }).format(start)
    const endMonthShort = new Intl.DateTimeFormat(tag, {
      month: 'short',
    }).format(end)
    return `${startDay} ${startMonthShort} au ${endDay} ${endMonthShort}`
  }

  const sameMonth = start.getMonth() === end.getMonth()
  const month = new Intl.DateTimeFormat(tag, { month: 'long' }).format(start)
  if (sameMonth) {
    return `${month} ${start.getDate()}–${end.getDate()}`
  }
  const endMonth = new Intl.DateTimeFormat(tag, { month: 'long' }).format(end)
  return `${month} ${start.getDate()} – ${endMonth} ${end.getDate()}`
}
