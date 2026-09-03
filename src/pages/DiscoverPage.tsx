import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { Container } from '../components/Container'
import { CollectionTile } from '../components/CollectionTile'
import { ResourceCard, ResourceCardCompact } from '../components/ResourceCard'
import { ResourceDetailDialog } from '../components/ResourceDetailDialog'
import { useApp } from '../context/useApp'
import { useCopy, useLocale } from '../i18n'
import { cn } from '../lib/cn'
import {
  getFilteredLilleResourceCards,
  getRecommendedResourceCards,
} from '../lib/lilleRecommendations'
import { matchesDiscoverFilter } from '../lib/lilleResourceAdapter'
import { makeResourceLabelFns } from '../lib/resourceLabels'
import { lilleResources } from '../data/lilleResources'
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

function matchesQuery(item: ResourceRecommendation, query: string): boolean {
  if (!query) return true
  const haystack = [
    item.title,
    item.description,
    item.metadata,
    item.location,
    item.neighborhood,
    item.sourceName,
    item.categoryLabel,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

function isLowCommitment(item: ResourceRecommendation): boolean {
  const level = item.commitmentLevel ?? ''
  return (
    level === 'very_low' ||
    level === 'low' ||
    level === 'flexible' ||
    (item.tags ?? []).some((t) =>
      /low_barrier|try_once|flexible|drop.?in/i.test(t),
    )
  )
}

export function DiscoverPage() {
  const {
    activeThemeIds,
    socialPreferences,
    socialFeedback,
    openChat,
  } = useApp()
  const copy = useCopy()
  const { locale } = useLocale()
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = resolveFilter(searchParams.get('filter'), copy.discover.filters)
  const [active, setActive] = useState<ResourceRecommendation | null>(null)
  const [query, setQuery] = useState('')
  const [showAllCollections, setShowAllCollections] = useState(false)

  const labels = useMemo(() => makeResourceLabelFns(copy, locale), [copy, locale])
  const normalizedQuery = query.trim().toLowerCase()

  const rankArgs = useMemo(
    () => ({
      activeThemeIds,
      socialPreferences,
      socialFeedback,
      journeyRole: 'explore' as const,
    }),
    [activeThemeIds, socialPreferences, socialFeedback],
  )

  const allRanked = useMemo(
    () =>
      getFilteredLilleResourceCards({
        filter: 'all',
        locale,
        typeLabel: labels.typeLabel,
        commitmentLabel: labels.commitmentLabel,
        savedIds: socialFeedback.interestedIds,
        rank: rankArgs,
      }),
    [locale, labels, socialFeedback.interestedIds, rankArgs],
  )

  const filtered = useMemo(() => {
    const base =
      filter === 'all'
        ? allRanked
        : getFilteredLilleResourceCards({
            filter,
            locale,
            typeLabel: labels.typeLabel,
            commitmentLabel: labels.commitmentLabel,
            savedIds: socialFeedback.interestedIds,
            rank: rankArgs,
          })
    return base.filter((item) => matchesQuery(item, normalizedQuery))
  }, [
    filter,
    allRanked,
    locale,
    labels,
    socialFeedback.interestedIds,
    rankArgs,
    normalizedQuery,
  ])

  const forYou = useMemo(
    () =>
      getRecommendedResourceCards({
        locale,
        activeThemeIds,
        socialPreferences,
        socialFeedback,
        journeyRole: 'explore',
        limit: 6,
        preferConcretePlaces: true,
        typeLabel: labels.typeLabel,
        commitmentLabel: labels.commitmentLabel,
        savedIds: socialFeedback.interestedIds,
      }).filter((item) => matchesQuery(item, normalizedQuery)),
    [
      locale,
      activeThemeIds,
      socialPreferences,
      socialFeedback,
      labels,
      normalizedQuery,
    ],
  )

  const lowCommitment = useMemo(
    () =>
      allRanked
        .filter(isLowCommitment)
        .filter((item) => matchesQuery(item, normalizedQuery))
        .slice(0, 6),
    [allRanked, normalizedQuery],
  )

  const learnCards = useMemo(
    () =>
      allRanked
        .filter((item) => {
          const raw = lilleResources.find((r) => r.id === item.id)
          return raw ? matchesDiscoverFilter(raw, 'learn') : false
        })
        .filter((item) => matchesQuery(item, normalizedQuery))
        .slice(0, 4),
    [allRanked, normalizedQuery],
  )

  const contributeCards = useMemo(
    () =>
      allRanked
        .filter((item) => {
          const raw = lilleResources.find((r) => r.id === item.id)
          return raw ? matchesDiscoverFilter(raw, 'engage') : false
        })
        .filter((item) => matchesQuery(item, normalizedQuery))
        .slice(0, 4),
    [allRanked, normalizedQuery],
  )

  const collectionCounts = useMemo(() => {
    const counts: Partial<Record<DiscoverFilter, number>> = { all: lilleResources.length }
    for (const item of copy.discover.filters) {
      if (item.id === 'all') continue
      counts[item.id] = lilleResources.filter((r) =>
        matchesDiscoverFilter(r, item.id),
      ).length
    }
    return counts
  }, [copy.discover.filters])

  const forYouSubtitle = useMemo(() => {
    if (
      socialPreferences.connectionPreference === 'new' ||
      socialPreferences.goals.includes('nouvelles')
    ) {
      return copy.discover.forYouSubtitle
    }
    if (
      socialPreferences.socialFormInterests.includes('apprendre') ||
      socialPreferences.goals.includes('apprendre')
    ) {
      return copy.discover.learnSubtitle
    }
    return copy.discover.aroundSubtitle
  }, [socialPreferences, copy.discover])

  function setFilter(next: DiscoverFilter) {
    if (next === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ filter: next })
    }
  }

  const visibleCollections = copy.discover.collections

  const browsingFiltered = filter !== 'all' || normalizedQuery.length > 0

  return (
    <Container width="wide" className="py-8 sm:py-10 lg:py-12">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[40rem]">
          <h1 className="font-display text-[2.25rem] font-medium leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.75rem]">
            {copy.discover.title}
          </h1>
          <p className="mt-3 text-[17px] leading-snug text-ink-muted sm:text-[18px]">
            {copy.discover.subtitle}
          </p>
        </div>

        <label className="relative block w-full max-w-md lg:w-[min(100%,22rem)]">
          <span className="sr-only">{copy.discover.searchAria}</span>
          <Search
            size={18}
            strokeWidth={1.8}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.discover.searchPlaceholder}
            className="min-h-12 w-full rounded-full border border-line bg-paper py-3 pr-11 pl-11 text-[16px] text-ink placeholder:text-[#9A9088] focus:border-line-strong focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft hover:bg-cream-deep hover:text-ink"
              aria-label={copy.discover.clearSearch}
            >
              <X size={16} strokeWidth={2} />
            </button>
          ) : null}
        </label>
      </header>

      <div className="-mx-5 mt-7 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {copy.discover.filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                'min-h-11 shrink-0 snap-start rounded-full border-[1.5px] px-5 text-[16px] font-bold transition-colors duration-160',
                filter === item.id
                  ? 'border-ink bg-ink text-[#FDF9F4]'
                  : 'border-line-strong bg-paper text-ink hover:bg-[#F6EFE5]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {!browsingFiltered ? (
        <>
          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-[23px] font-[800] tracking-[-0.02em] text-ink sm:text-[27px]">
                {copy.discover.collectionsTitle}
              </h2>
              <p className="mt-1 text-[16px] text-ink-muted sm:text-[17px]">
                {copy.discover.collectionsSubtitle(lilleResources.length)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-[14px] sm:gap-[18px] lg:grid-cols-3">
              {visibleCollections.map((collection, index) => (
                <CollectionTile
                  key={collection.id}
                  title={collection.title}
                  solid={collection.solid}
                  countLabel={copy.discover.countProposals(
                    collectionCounts[collection.id] ?? 0,
                  )}
                  onClick={() => setFilter(collection.id)}
                  className={cn(
                    !showAllCollections && index >= 4 && 'max-lg:hidden',
                  )}
                />
              ))}
              <CollectionTile
                variant="outline"
                title={copy.discover.browseAll}
                countLabel={copy.discover.browseAllCount(lilleResources.length)}
                onClick={() => setFilter('all')}
                className={cn(
                  !showAllCollections && 'col-span-2 max-lg:hidden lg:col-span-1',
                  showAllCollections && 'col-span-2 lg:col-span-1',
                )}
              />
            </div>

            {!showAllCollections ? (
              <button
                type="button"
                onClick={() => setShowAllCollections(true)}
                className="mt-4 flex min-h-12 w-full items-center justify-center rounded-full border-[1.5px] border-line-strong bg-paper text-[16px] font-bold text-ink lg:hidden"
              >
                {copy.discover.seeAllCollections}
              </button>
            ) : null}
          </section>

          {forYou.length > 0 ? (
            <section className="mt-12">
              <div className="mb-5">
                <h2 className="text-[23px] font-[800] tracking-[-0.02em] text-ink sm:text-[27px]">
                  {copy.discover.forYouTitle}
                </h2>
                <p className="mt-1 max-w-[40rem] text-[16px] text-ink-muted sm:text-[17px]">
                  {forYouSubtitle}
                </p>
              </div>
              <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 lg:grid lg:grid-cols-3 lg:gap-5 [&::-webkit-scrollbar]:hidden">
                <ul className="flex w-max gap-4 sm:w-auto sm:grid sm:grid-cols-2 sm:gap-5 lg:contents">
                  {forYou.slice(0, 3).map((item) => (
                    <li
                      key={item.id}
                      className="w-[min(78vw,304px)] shrink-0 snap-start sm:w-auto"
                    >
                      <ResourceCard
                        item={item}
                        onOpen={setActive}
                        borderless
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : null}

          {lowCommitment.length > 0 ? (
            <section className="full-bleed mt-12 -mx-5 bg-cream-deep px-5 py-8 sm:mx-0 sm:rounded-[24px] sm:px-6 sm:py-8">
              <div className="mb-5">
                <h2 className="text-[23px] font-[800] tracking-[-0.02em] text-ink sm:text-[27px]">
                  {copy.discover.lowCommitmentTitle}
                </h2>
                <p className="mt-1 max-w-[40rem] text-[16px] text-ink-muted sm:text-[17px]">
                  {copy.discover.lowCommitmentSubtitle}
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {lowCommitment.map((item) => (
                  <li key={item.id}>
                    <ResourceCardCompact item={item} onOpen={setActive} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {learnCards.length > 0 ? (
            <section className="mt-12">
              <div className="mb-5">
                <h2 className="text-[23px] font-[800] tracking-[-0.02em] text-ink sm:text-[27px]">
                  {copy.discover.learnTitle}
                </h2>
                <p className="mt-1 text-[16px] text-ink-muted sm:text-[17px]">
                  {copy.discover.learnSubtitle}
                </p>
              </div>
              <ul className="grid gap-5 sm:grid-cols-2">
                {learnCards.map((item) => (
                  <li key={item.id}>
                    <ResourceCard item={item} onOpen={setActive} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {contributeCards.length > 0 ? (
            <section className="mt-12">
              <div className="mb-5">
                <h2 className="text-[23px] font-[800] tracking-[-0.02em] text-ink sm:text-[27px]">
                  {copy.discover.contributeTitle}
                </h2>
                <p className="mt-1 text-[16px] text-ink-muted sm:text-[17px]">
                  {copy.discover.contributeSubtitle}
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {contributeCards.map((item) => (
                  <li key={item.id}>
                    <ResourceCardCompact item={item} onOpen={setActive} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : (
        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[23px] font-[800] tracking-[-0.02em] text-ink sm:text-[27px]">
                {filter === 'all'
                  ? copy.discover.aroundTitle
                  : copy.discover.filters.find((f) => f.id === filter)?.label}
              </h2>
              <p className="mt-1 text-[16px] text-ink-muted">
                {copy.discover.countProposals(filtered.length)}
              </p>
            </div>
            {filter !== 'all' ? (
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="text-[15px] font-bold text-clay-ink hover:text-clay-deep"
              >
                {copy.discover.browseAll} →
              </button>
            ) : null}
          </div>

          {filtered.length === 0 ? (
            <p className="mt-8 text-[16px] text-ink-muted">
              {normalizedQuery
                ? copy.discover.emptySearch
                : copy.discover.emptyFilter}
            </p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <li key={item.id}>
                  <ResourceCard item={item} onOpen={setActive} />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {active ? (
        <ResourceDetailDialog
          resource={active}
          onClose={() => setActive(null)}
          onAskJuno={() => {
            setActive(null)
            openChat({
              greeting: active.personalizationReason,
              relatedPriorityId: active.themeIds?.[0],
            })
          }}
        />
      ) : null}
    </Container>
  )
}
