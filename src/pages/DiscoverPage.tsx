import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '../components/Container'
import { Button } from '../components/Button'
import { ResourceDetailDialog } from '../components/ResourceDetailDialog'
import { useApp } from '../context/useApp'
import { useCopy, useLocale } from '../i18n'
import { cn } from '../lib/cn'
import { getFilteredLilleResourceCards } from '../lib/lilleRecommendations'
import { makeResourceLabelFns } from '../lib/resourceLabels'
import type { DiscoverFilter, ResourceRecommendation } from '../types'

function resolveFilter(
  raw: string | null,
  filters: readonly { id: DiscoverFilter }[],
): DiscoverFilter {
  if (raw && filters.some((item) => item.id === raw)) {
    return raw as DiscoverFilter
  }
  return 'all'
}

export function DiscoverPage() {
  const {
    activeThemeIds,
    socialPreferences,
    socialFeedback,
    toggleResourceSaved,
  } = useApp()
  const copy = useCopy()
  const { locale } = useLocale()
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = resolveFilter(searchParams.get('filter'), copy.discover.filters)
  const [active, setActive] = useState<ResourceRecommendation | null>(null)

  const labels = useMemo(() => makeResourceLabelFns(copy, locale), [copy, locale])

  const filtered = useMemo(
    () =>
      getFilteredLilleResourceCards({
        filter,
        locale,
        typeLabel: labels.typeLabel,
        commitmentLabel: labels.commitmentLabel,
        savedIds: socialFeedback.interestedIds,
        rank: {
          activeThemeIds,
          socialPreferences,
          socialFeedback,
          journeyRole: 'explore',
        },
      }),
    [
      filter,
      locale,
      labels,
      activeThemeIds,
      socialPreferences,
      socialFeedback,
    ],
  )

  function setFilter(next: DiscoverFilter) {
    if (next === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ filter: next })
    }
  }

  return (
    <Container width="wide" className="py-10 sm:py-12 lg:py-14">
      <header className="max-w-[40rem]">
        <h1 className="font-display text-[2.2rem] font-medium tracking-[-0.02em] text-ink sm:text-[2.6rem]">
          {copy.discover.title}
        </h1>
        <p className="mt-4 text-[18px] text-ink-muted">{copy.discover.subtitle}</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {copy.discover.filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              'min-h-11 cursor-pointer rounded-md border px-4 text-[15px] transition-colors',
              filter === item.id
                ? 'border-ink bg-ink text-cream'
                : 'border-line-strong bg-paper text-ink hover:border-ink/40',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {filtered.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-line bg-paper p-5 shadow-[0_12px_32px_-28px_rgba(36,31,26,0.4)] sm:p-6"
          >
            <p className="text-[12px] font-medium tracking-[0.14em] text-clay uppercase">
              {item.categoryLabel}
            </p>
            <h2 className="mt-2 font-display text-[1.35rem] leading-snug text-ink">
              {item.title}
            </h2>
            {item.metadata ? (
              <p className="mt-2 text-[13px] text-ink-soft">{item.metadata}</p>
            ) : null}
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
              {item.description}
            </p>
            <p className="mt-4 text-[14px] text-ink">
              <span className="font-medium tracking-[0.04em] text-ink-soft uppercase">
                {copy.discover.whyForYou}
              </span>
              <span className="mt-1 block text-[15px] text-ink-muted">
                {item.personalizationReason}
              </span>
            </p>
            {item.timeSensitive ? (
              <p className="mt-3 text-[12px] font-medium text-sage">
                {copy.discover.programYear}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                className="min-h-11 px-5 text-[16px]"
                onClick={() => setActive(item)}
              >
                {copy.discover.viewResource}
              </Button>
              <Button
                variant="ghost"
                className="min-h-11 px-4 text-[16px]"
                onClick={() => toggleResourceSaved(item.id)}
              >
                {item.saved ? copy.discover.saved : copy.discover.save}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-10 text-[16px] text-ink-muted">
          {copy.discover.emptyFilter}
        </p>
      ) : null}

      {active ? (
        <ResourceDetailDialog
          resource={active}
          onClose={() => setActive(null)}
        />
      ) : null}
    </Container>
  )
}
