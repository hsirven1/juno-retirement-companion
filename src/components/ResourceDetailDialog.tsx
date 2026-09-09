import { useEffect, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { Button } from './Button'
import { JunoOrb } from './JunoOrb'
import { MediaBlock } from './MediaBlock'
import { useApp } from '../context/useApp'
import { useCopy, useLocale } from '../i18n'
import { formatLastChecked } from '../lib/lilleResourceAdapter'
import { getCommitmentLabel } from '../lib/resourceLabels'
import { getLilleResourceById } from '../lib/lilleRecommendations'
import { getResourceTheme, mediaVariantForResource } from '../lib/resourceTheme'
import { cn } from '../lib/cn'
import type { ResourceRecommendation } from '../types'

const DISMISS_REASON_IDS = [
  'trop-loin',
  'trop-regulier',
  'trop-monde',
  'pas-activite',
  'autre',
] as const

function MetaTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-line bg-paper px-[17px] py-[15px]">
      <p className="text-[13px] font-bold text-ink-soft">{label}</p>
      <p className="mt-1 text-[17px] font-bold leading-snug text-ink">{value}</p>
    </div>
  )
}

export function ResourceDetailDialog({
  resource,
  onClose,
  onAskJuno,
}: {
  resource: ResourceRecommendation
  onClose: () => void
  onAskJuno?: () => void
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
  const theme = getResourceTheme(resource)

  const lastChecked = resource.sourceLastChecked
    ? formatLastChecked(resource.sourceLastChecked, locale)
    : null

  const commitmentText = raw
    ? getCommitmentLabel(raw, copy)
    : resource.commitmentLevel

  const locationShort =
    resource.neighborhood || resource.location || null

  const formatText = (() => {
    const format = raw?.socialFormat?.[0]
    if (!format) return resource.categoryLabel || null
    const map: Record<string, string> = {
      small_group:
        locale === 'en' ? 'Small group' : 'Petit groupe',
      group: locale === 'en' ? 'Group' : 'Groupe',
      one_to_one:
        locale === 'en' ? 'One to one' : 'En tête-à-tête',
      mixed: locale === 'en' ? 'Mixed' : 'Mixte',
      open: locale === 'en' ? 'Open' : 'Ouvert',
    }
    return map[format] ?? resource.categoryLabel ?? null
  })()

  const rhythmText = commitmentText || null

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
      className="fixed inset-0 z-40 flex items-stretch justify-center bg-[rgba(34,28,24,0.45)] p-0 sm:items-center sm:p-6"
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

      <div className="relative z-10 flex h-full w-full max-w-[960px] flex-col overflow-hidden bg-paper shadow-[var(--shadow-overlay)] sm:h-auto sm:max-h-[min(85vh,880px)] sm:rounded-[26px] sm:border sm:border-line">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8 sm:py-5">
          <button
            type="button"
            onClick={onClose}
            className="text-[15px] font-bold text-ink-muted transition-colors hover:text-ink"
          >
            ← {copy.discover.backToDiscover}
            {resource.categoryLabel ? (
              <span className="text-ink-soft"> · {resource.categoryLabel}</span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-cream-deep text-ink-muted transition-colors hover:text-ink"
            aria-label={copy.home.close}
          >
            <X size={20} strokeWidth={1.7} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
            <div>
              <MediaBlock
                theme={theme}
                imageUrl={resource.image}
                alt=""
                aspect="hero"
                radius="lg"
                variant={mediaVariantForResource(resource)}
              />
              <div className="mt-3 hidden grid-cols-2 gap-3 sm:grid">
                <MediaBlock
                  theme={theme}
                  aspect="thumb"
                  radius="md"
                  variant={(mediaVariantForResource(resource) + 1) % 4}
                />
                <MediaBlock
                  theme={theme}
                  aspect="thumb"
                  radius="md"
                  variant={(mediaVariantForResource(resource) + 2) % 4}
                />
              </div>
            </div>

            <div className="min-w-0">
              <p
                className="text-[12px] font-[800] tracking-[0.1em] uppercase"
                style={{ color: `var(${theme.inkVar})` }}
              >
                {resource.categoryLabel}
              </p>
              <h2
                id="resource-dialog-title"
                className="mt-2 font-display text-[2rem] leading-[1.15] tracking-[-0.02em] text-ink sm:text-[2.25rem]"
              >
                {resource.title}
              </h2>
              {resource.sourceName || locationShort ? (
                <p className="mt-2 text-[17px] font-semibold text-ink-muted">
                  {[resource.sourceName, locationShort].filter(Boolean).join(', ')}
                </p>
              ) : null}
              <p className="mt-4 text-[17px] leading-relaxed text-[#4A433D]">
                {resource.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {rhythmText ? (
                  <MetaTile
                    label={copy.discover.rhythmLabel}
                    value={rhythmText}
                  />
                ) : null}
                {formatText ? (
                  <MetaTile
                    label={copy.discover.formatLabel}
                    value={formatText}
                  />
                ) : null}
                {locationShort ? (
                  <MetaTile
                    label={copy.discover.locationLabel}
                    value={locationShort}
                  />
                ) : null}
                {resource.costLabel ? (
                  <MetaTile
                    label={copy.discover.costLabel}
                    value={resource.costLabel}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div>
              {resource.eligibility || resource.address ? (
                <div>
                  <h3 className="text-[18px] font-[800] text-ink">
                    {copy.discover.practicalTitle}
                  </h3>
                  <dl className="mt-3 divide-y divide-[#F2EBE1]">
                    {resource.address ? (
                      <div className="flex justify-between gap-4 py-3">
                        <dt className="text-[15px] text-ink-soft">
                          {copy.discover.addressLabel}
                        </dt>
                        <dd className="text-right text-[15px] font-semibold text-ink">
                          {resource.address}
                        </dd>
                      </div>
                    ) : null}
                    {locationShort ? (
                      <div className="flex justify-between gap-4 py-3">
                        <dt className="text-[15px] text-ink-soft">
                          {copy.discover.locationLabel}
                        </dt>
                        <dd className="text-right text-[15px] font-semibold text-ink">
                          {locationShort}
                        </dd>
                      </div>
                    ) : null}
                    {resource.eligibility ? (
                      <div className="flex justify-between gap-4 py-3">
                        <dt className="text-[15px] text-ink-soft">
                          {copy.discover.eligibilityLabel}
                        </dt>
                        <dd className="max-w-[18rem] text-right text-[15px] font-semibold text-ink">
                          {resource.eligibility}
                        </dd>
                      </div>
                    ) : null}
                    {resource.sourceName ? (
                      <div className="flex justify-between gap-4 py-3">
                        <dt className="text-[15px] text-ink-soft">
                          {copy.discover.sourceLabel}
                        </dt>
                        <dd className="text-right text-[15px] font-semibold text-ink">
                          {resource.sourceName}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              ) : null}
            </div>

            <div>
              <div className="relative overflow-hidden rounded-[20px] bg-[#241C18] p-6 text-[#F2E7DC]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(225,80,58,0.4), transparent 68%)',
                  }}
                />
                <div className="relative flex items-center gap-3">
                  <JunoOrb size={32} glow />
                  <p className="text-[12px] font-[800] tracking-[0.1em] text-[#E6B9A6] uppercase">
                    {copy.journeyUi.whyJunoSuggests}
                  </p>
                </div>
                <p className="relative mt-3 text-[17px] leading-[1.55]">
                  {resource.personalizationReason || resource.whyUseful}
                </p>
              </div>

              {resource.sourceName ? (
                <p className="mt-4 text-[14px] text-ink-soft">
                  {copy.discover.sourceLabel} : {resource.sourceName}
                  {lastChecked ? (
                    <>
                      {' '}
                      · {copy.discover.verifiedShort(lastChecked)}
                    </>
                  ) : null}
                </p>
              ) : null}

              {resource.timeSensitive ? (
                <p className="mt-2 text-[13px] font-medium text-sage">
                  {copy.discover.programYear}
                </p>
              ) : null}

              {showAddPrompt ? (
                <div className="mt-4 rounded-[16px] border border-sage/30 bg-sage/5 px-4 py-4">
                  <p className="text-[15px] text-ink">{copy.discover.askAddToWeek}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      className="min-h-11 px-4 text-[15px]"
                      onClick={handleAddToWeek}
                      disabled={added}
                    >
                      {added ? copy.home.addedToPlan : copy.discover.addToWeek}
                    </Button>
                    <Button
                      variant="ghost"
                      className="min-h-11 px-4 text-[15px]"
                      onClick={() => setShowAddPrompt(false)}
                    >
                      {copy.coach.notNow}
                    </Button>
                  </div>
                </div>
              ) : null}

              {showDismiss ? (
                <div className="mt-4 rounded-[16px] border border-line bg-paper px-4 py-4">
                  <p className="text-[14px] font-medium text-ink">
                    {copy.discover.dismissPrompt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {dismissReasons.map((reason) => (
                      <button
                        key={reason.id}
                        type="button"
                        className="cursor-pointer rounded-full border border-line-strong px-3 py-2 text-[13px] text-ink-muted transition-colors hover:border-ink/40 hover:text-ink"
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
          </div>
        </div>

        <footer className="shrink-0 border-t border-line bg-paper px-5 py-4 sm:px-8 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {resource.externalUrl ? (
              <a
                href={resource.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-clay px-6 text-[17px] font-bold text-on-coral transition-colors hover:bg-clay-deep sm:w-auto"
              >
                {copy.discover.viewSite}
                <ExternalLink size={16} strokeWidth={2.2} aria-hidden="true" />
              </a>
            ) : (
              <span />
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {!dismissed ? (
                <button
                  type="button"
                  onClick={handleSave}
                  className={cn(
                    'min-h-11 cursor-pointer rounded-full px-4 text-[15px] font-bold transition-colors',
                    interested || resource.saved
                      ? 'text-sage'
                      : 'text-ink hover:text-clay-ink',
                  )}
                  disabled={interested && !showAddPrompt}
                >
                  {interested || resource.saved
                    ? copy.discover.saved
                    : copy.discover.interested}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  laterSocialResource(resource.id)
                  onClose()
                }}
                className="min-h-11 cursor-pointer text-[15px] font-semibold text-ink-muted transition-colors hover:text-ink"
                disabled={later}
              >
                {later ? copy.journeyUi.savedForLater : copy.discover.later}
              </button>
              <button
                type="button"
                onClick={() => setShowDismiss(true)}
                className="min-h-11 cursor-pointer text-[15px] font-semibold text-ink-muted transition-colors hover:text-ink"
              >
                {copy.discover.notForMe}
              </button>
            </div>
          </div>
          {onAskJuno ? (
            <button
              type="button"
              onClick={onAskJuno}
              className="mt-3 text-[14px] font-bold text-clay-ink hover:text-clay-deep"
            >
              {copy.discover.talkToJunoFirst}
            </button>
          ) : null}
        </footer>
      </div>
    </div>
  )
}
