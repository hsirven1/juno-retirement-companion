import { useEffect, useId, useMemo, useState } from 'react'
import { MentorAvatar } from './MentorAvatar'
import { Button } from '../Button'
import { useCopy, useLocale } from '../../i18n'
import { cn } from '../../lib/cn'
import type { Mentor } from '../../types'

const DEMO_SLOTS = ['10:00', '11:30', '14:00', '15:30', '17:00'] as const

function startOfDay(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseSlotToIso(dateKey: string, slot: string) {
  const [hours, minutes] = slot.split(':').map(Number)
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d, hours, minutes, 0, 0)
  return date.toISOString()
}

/** Fictional demo availability — weekdays only for the next two weeks. */
function buildDemoDates(from: Date) {
  const start = startOfDay(from)
  const dates: Date[] = []
  for (let i = 1; i <= 18 && dates.length < 10; i += 1) {
    const day = addDays(start, i)
    const weekday = day.getDay()
    if (weekday === 0 || weekday === 6) continue
    dates.push(day)
  }
  return dates
}

type Step = 'date' | 'slot' | 'confirm' | 'done'

export function MentorCallBookingOverlay({
  mentor,
  open,
  onClose,
  onConfirm,
  initialStartAt,
}: {
  mentor: Mentor
  open: boolean
  onClose: () => void
  onConfirm: (startAt: string) => void
  initialStartAt?: string | null
}) {
  const copy = useCopy()
  const { locale } = useLocale()
  const titleId = useId()
  const dates = useMemo(() => buildDemoDates(new Date()), [])
  const [step, setStep] = useState<Step>('date')
  const [dateKey, setDateKey] = useState<string | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setStep(initialStartAt ? 'done' : 'date')
    setDateKey(null)
    setSlot(null)
    setConfirmedAt(initialStartAt ?? null)
  }, [open, initialStartAt, mentor.id])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const dateLocale = locale === 'en' ? 'en-US' : 'fr-FR'
  const selectedDate = dateKey
    ? dates.find((d) => toDateKey(d) === dateKey)
    : null

  function formatDayLabel(date: Date) {
    return new Intl.DateTimeFormat(dateLocale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(date)
  }

  function formatConfirmation(iso: string) {
    const date = new Date(iso)
    const dayPart = new Intl.DateTimeFormat(dateLocale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date)
    const timePart = new Intl.DateTimeFormat(dateLocale, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
    return copy.home.bookingConfirmed(mentor.firstName, dayPart, timePart)
  }

  function formatSlotLabel(value: string) {
    const [h, m] = value.split(':').map(Number)
    const date = new Date()
    date.setHours(h, m, 0, 0)
    return new Intl.DateTimeFormat(dateLocale, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-ink/35"
        aria-label={copy.home.bookingClose}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92vh,640px)] w-full max-w-[440px] flex-col rounded-t-[24px] border border-line bg-paper shadow-[var(--shadow-card)] sm:rounded-[24px]"
      >
        <header className="flex items-start gap-3 border-b border-line px-5 py-4">
          <MentorAvatar
            id={mentor.id}
            firstName={mentor.firstName}
            size={40}
          />
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-[17px] font-extrabold text-ink">
              {copy.home.bookingTitle(mentor.firstName)}
            </h2>
            <p className="mt-0.5 text-[12px] text-ink-soft">
              {copy.home.bookingDemoNote}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full px-3 py-2 text-[14px] font-bold text-ink-muted hover:bg-cream-deep hover:text-ink"
          >
            {copy.home.bookingClose}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 'date' ? (
            <>
              <p className="text-[15px] font-bold text-ink">
                {copy.home.bookingPickDate}
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {dates.map((date) => {
                  const key = toDateKey(date)
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => {
                          setDateKey(key)
                          setSlot(null)
                          setStep('slot')
                        }}
                        className={cn(
                          'min-h-12 w-full cursor-pointer rounded-[14px] border px-3 py-2.5 text-left text-[14px] font-bold transition-colors',
                          dateKey === key
                            ? 'border-ink bg-ink text-cream'
                            : 'border-line bg-cream text-ink hover:border-line-strong',
                        )}
                      >
                        {formatDayLabel(date)}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : null}

          {step === 'slot' && selectedDate ? (
            <>
              <button
                type="button"
                className="cursor-pointer text-[14px] font-bold text-ink-muted hover:text-ink"
                onClick={() => setStep('date')}
              >
                ← {formatDayLabel(selectedDate)}
              </button>
              <p className="mt-4 text-[15px] font-bold text-ink">
                {copy.home.bookingPickSlot}
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {DEMO_SLOTS.map((value) => (
                  <li key={value}>
                    <button
                      type="button"
                      onClick={() => {
                        setSlot(value)
                        setStep('confirm')
                      }}
                      className={cn(
                        'min-h-12 w-full cursor-pointer rounded-[14px] border px-3 py-2.5 text-[15px] font-bold transition-colors',
                        slot === value
                          ? 'border-ink bg-ink text-cream'
                          : 'border-line bg-cream text-ink hover:border-line-strong',
                      )}
                    >
                      {formatSlotLabel(value)}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {step === 'confirm' && dateKey && slot ? (
            <>
              <p className="text-[16px] leading-relaxed text-ink">
                {formatDayLabel(
                  dates.find((d) => toDateKey(d) === dateKey) ?? new Date(),
                )}{' '}
                · {formatSlotLabel(slot)}
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <Button
                  className="min-h-11 px-5 text-[16px] font-bold"
                  onClick={() => {
                    const iso = parseSlotToIso(dateKey, slot)
                    onConfirm(iso)
                    setConfirmedAt(iso)
                    setStep('done')
                  }}
                >
                  {copy.home.bookingConfirm}
                </Button>
                <Button
                  variant="ghost"
                  className="min-h-11 px-5 text-[15px] font-bold"
                  onClick={() => setStep('slot')}
                >
                  {copy.home.bookingBack}
                </Button>
              </div>
            </>
          ) : null}

          {step === 'done' && confirmedAt ? (
            <>
              <p className="text-[17px] leading-relaxed text-ink">
                {formatConfirmation(confirmedAt)}
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <Button
                  className="min-h-11 px-5 text-[16px] font-bold"
                  onClick={onClose}
                >
                  {copy.home.bookingDone}
                </Button>
                <Button
                  variant="ghost"
                  className="min-h-11 px-5 text-[15px] font-bold"
                  onClick={() => {
                    setStep('date')
                    setDateKey(null)
                    setSlot(null)
                  }}
                >
                  {copy.home.bookingModify}
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function formatMentorCallParts(
  iso: string,
  locale: 'fr' | 'en',
): { day: string; time: string } {
  const date = new Date(iso)
  const dateLocale = locale === 'en' ? 'en-US' : 'fr-FR'
  return {
    day: new Intl.DateTimeFormat(dateLocale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date),
    time: new Intl.DateTimeFormat(dateLocale, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date),
  }
}
