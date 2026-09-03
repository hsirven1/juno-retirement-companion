import { useEffect, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { Button } from './Button'
import { useApp } from '../context/useApp'
import { useCopy, useLocale } from '../i18n'
import { formatLastChecked } from '../lib/lilleResourceAdapter'
import { getCommitmentLabel } from '../lib/resourceLabels'
import { getLilleResourceById } from '../lib/lilleRecommendations'
import type { ResourceRecommendation } from '../types'

const DISMISS_REASON_IDS = [
  'trop-loin',
  'trop-regulier',
  'trop-monde',
  'pas-activite',
  'autre',
] as const

export function ResourceDetailDialog({
  resource,
  onClose,
}: {
  resource: ResourceRecommendation
  onClose: () => void
}) {
  const copy = useCopy()
  const { locale } = useLocale()
  const {
    markSocialInterest,
    dismissSocialResource,
    laterSocialResource,
    addSocialWeekStep,
    socialFeedback,
  } = useApp()

  const [showDismiss, setShowDismiss] = useState(false)
  const [showAddPrompt, setShowAddPrompt] = useState(false)
  const [added, setAdded] = useState(resource.addedToPlan)

  const interested = socialFeedback.interestedIds.includes(resource.id)
  const later = socialFeedback.laterIds.includes(resource.id)
  const dismissed = socialFeedback.dismissedIds.includes(resource.id)
  const raw = getLilleResourceById(resource.id)

  const lastChecked = resource.sourceLastChecked
    ? formatLastChecked(resource.sourceLastChecked, locale)
    : null

  const commitmentText = raw
    ? getCommitmentLabel(raw, copy)
    : resource.commitmentLevel

  const locationShort =
    resource.neighborhood || resource.location || null

  const dismissReasons = copy.journeyUi.dismissReasons.filter((r) =>
    DISMISS_REASON_IDS.includes(r.id as (typeof DISMISS_REASON_IDS)[number]),
  )

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  function handleSave() {
    markSocialInterest(resource)
    setShowAddPrompt(true)
  }

  function handleAddToWeek() {
    addSocialWeekStep(resource)
    setAdded(true)
    setShowAddPrompt(false)
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/35 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resource-dialog-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-pointer"
        aria-label={copy.home.close}
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[min(860px,calc(100svh-2rem))] w-full max-w-[36rem] flex-col overflow-hidden rounded-lg border border-line bg-paper shadow-[0_24px_50px_-28px_rgba(36,31,26,0.45)]">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0">
            {resource.categoryLabel ? (
              <p className="text-[11px] font-medium tracking-[0.14em] text-clay uppercase">
                {resource.categoryLabel}
              </p>
            ) : null}
            <h2
              id="resource-dialog-title"
              className="mt-1 font-display text-[1.55rem] leading-snug text-ink sm:text-[1.7rem]"
            >
              {resource.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-cream hover:text-ink"
            aria-label={copy.home.close}
          >
            <X size={20} strokeWidth={1.7} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-[17px] leading-relaxed text-ink-muted">
            {resource.description}
          </p>

          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {locationShort ? (
              <div>
                <dt className="text-[11px] font-medium tracking-[0.1em] text-ink-soft uppercase">
                  {copy.discover.locationLabel}
                </dt>
                <dd className="mt-1 text-[15px] text-ink">{locationShort}</dd>
              </div>
            ) : null}
            {resource.costLabel ? (
              <div>
                <dt className="text-[11px] font-medium tracking-[0.1em] text-ink-soft uppercase">
                  {copy.discover.costLabel}
                </dt>
                <dd className="mt-1 text-[15px] text-ink">{resource.costLabel}</dd>
              </div>
            ) : null}
            {commitmentText ? (
              <div>
                <dt className="text-[11px] font-medium tracking-[0.1em] text-ink-soft uppercase">
                  {copy.discover.commitmentLabel}
                </dt>
                <dd className="mt-1 text-[15px] text-ink">{commitmentText}</dd>
              </div>
            ) : null}
          </dl>

          {resource.eligibility ? (
            <div className="mt-6">
              <p className="text-[11px] font-medium tracking-[0.1em] text-ink-soft uppercase">
                {copy.discover.eligibilityLabel}
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">
                {resource.eligibility}
              </p>
            </div>
          ) : null}

          <div className="mt-6 rounded-md border border-line bg-cream/70 px-4 py-4">
            <p className="text-[11px] font-medium tracking-[0.1em] text-ink-soft uppercase">
              {copy.journeyUi.whyJunoSuggests}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              {resource.personalizationReason || resource.whyUseful}
            </p>
          </div>

          {resource.sourceName ? (
            <p className="mt-6 text-[13px] text-ink-soft">
              {copy.discover.sourceLabel} : {resource.sourceName}
              {lastChecked ? (
                <>
                  {' '}
                  · {copy.discover.verifiedShort(lastChecked)}
                </>
              ) : null}
            </p>
          ) : null}

          {resource.timeSensitive && !lastChecked ? (
            <p className="mt-2 text-[13px] font-medium text-sage">
              {copy.discover.programYear}
            </p>
          ) : null}

          {showAddPrompt ? (
            <div className="mt-5 rounded-md border border-sage/30 bg-sage/5 px-4 py-4">
              <p className="text-[15px] text-ink">{copy.discover.askAddToWeek}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="min-h-10 px-4 text-[15px]"
                  onClick={handleAddToWeek}
                  disabled={added}
                >
                  {added ? copy.home.addedToPlan : copy.discover.addToWeek}
                </Button>
                <Button
                  variant="ghost"
                  className="min-h-10 px-4 text-[15px]"
                  onClick={() => setShowAddPrompt(false)}
                >
                  {copy.coach.notNow}
                </Button>
              </div>
            </div>
          ) : null}

          {showDismiss ? (
            <div className="mt-5 rounded-md border border-line bg-paper px-4 py-4">
              <p className="text-[14px] font-medium text-ink">
                {copy.discover.dismissPrompt}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {dismissReasons.map((reason) => (
                  <button
                    key={reason.id}
                    type="button"
                    className="cursor-pointer rounded-full border border-line-strong px-3 py-1.5 text-[13px] text-ink-muted transition-colors hover:border-ink/40 hover:text-ink"
                    onClick={() => {
                      dismissSocialResource(resource.id, reason.id)
                      onClose()
                    }}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <footer className="shrink-0 border-t border-line px-5 py-4 sm:px-7">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {resource.externalUrl ? (
              <a
                href={resource.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-clay px-5 text-[15px] font-medium text-cream transition-colors hover:bg-clay-deep"
              >
                {copy.discover.viewSite}
                <ExternalLink size={15} strokeWidth={2} aria-hidden="true" />
              </a>
            ) : null}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px]">
              {!dismissed ? (
                <button
                  type="button"
                  onClick={handleSave}
                  className="cursor-pointer text-ink transition-colors hover:text-clay"
                  disabled={interested && !showAddPrompt}
                >
                  {interested || resource.saved
                    ? copy.discover.saved
                    : copy.discover.save}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  laterSocialResource(resource.id)
                  onClose()
                }}
                className="cursor-pointer text-ink-muted transition-colors hover:text-ink"
                disabled={later}
              >
                {later ? copy.journeyUi.savedForLater : copy.discover.later}
              </button>
              <button
                type="button"
                onClick={() => setShowDismiss(true)}
                className="cursor-pointer text-ink-muted transition-colors hover:text-ink"
              >
                {copy.discover.notForMe}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
