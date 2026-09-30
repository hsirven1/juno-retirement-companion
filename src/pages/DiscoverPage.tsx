import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, MapPin, Search, X } from 'lucide-react'
import { Container } from '../components/Container'
import { ResourceCard } from '../components/ResourceCard'
import { ResourceDetailDialog } from '../components/ResourceDetailDialog'
import { PillarArt } from '../components/pillars/PillarCard'
import { PILLARS, isPillarId } from '../data/pillars'
import { useCopy, useLocale } from '../i18n'
import { cn } from '../lib/cn'
import { displayTags } from '../lib/resourceLabels'
import { useResourceHub } from '../lib/useResourceHub'
import type { Locale } from '../i18n/types'
import type { PillarId, ResourceRecommendation } from '../types'

type Scope = 'all' | PillarId

function matchesQuery(
  item: ResourceRecommendation,
  query: string,
  locale: Locale,
): boolean {
  if (!query) return true
  const haystack = [
    item.title,
    item.description,
    item.metadata,
    item.location,
    item.neighborhood,
    item.sourceName,
    item.categoryLabel,
    ...displayTags(item.tags, locale, 20),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

function SectionHeading({
  title,
  lead,
  count,
}: {
  title: string
  lead?: string
  count?: string
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[23px] font-[800] tracking-[-0.02em] text-ink sm:text-[27px]">
          {title}
        </h2>
        {lead ? (
          <p className="mt-1 max-w-[40rem] text-[16px] text-ink-muted sm:text-[17px]">
            {lead}
          </p>
        ) : null}
      </div>
      {count ? (
        <p className="text-[15px] font-semibold text-ink-soft">{count}</p>
      ) : null}
    </div>
  )
}

function ResourceGrid({
  items,
  onOpen,
  pillarId,
}: {
  items: ResourceRecommendation[]
  onOpen: (item: ResourceRecommendation) => void
  pillarId?: PillarId
}) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <ResourceCard item={item} onOpen={onOpen} pillarId={pillarId} />
        </li>
      ))}
    </ul>
  )
}

function TopicChip({
  label,
  selected,
  onClick,
  inkVar,
  forYouLabel,
}: {
  label: string
  selected: boolean
  onClick: () => void
  inkVar: string
  forYouLabel?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-10 items-center gap-2 rounded-full border-[1.5px] px-3.5 text-[14.5px] font-bold whitespace-nowrap transition-colors',
        selected ? 'text-[#FDF9F4]' : 'border-transparent bg-paper hover:bg-paper/70',
      )}
      style={
        selected
          ? { backgroundColor: `var(${inkVar})`, borderColor: `var(${inkVar})` }
          : { color: `var(${inkVar})` }
      }
    >
      {label}
      {forYouLabel ? (
        <span
          className={cn(
            'rounded-full px-1.5 py-px text-[11px] font-extrabold tracking-[0.04em] uppercase',
            selected ? 'bg-paper/20' : 'bg-cream-deep',
          )}
        >
          {forYouLabel}
        </span>
      ) : null}
    </button>
  )
}

export function DiscoverPage() {
  const copy = useCopy()
  const { locale } = useLocale()
  const [searchParams, setSearchParams] = useSearchParams()
  const rawPillar = searchParams.get('pillar')
  const scope: Scope = isPillarId(rawPillar) ? rawPillar : 'all'
  const rawTopic = searchParams.get('topic')
  const localOnly = searchParams.get('local') === '1'
  const [active, setActive] = useState<ResourceRecommendation | null>(null)
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const hub = useResourceHub({ recommendedLimit: 6, localLimit: 6 })

  const scoped = scope === 'all' ? hub.all : hub.byPillar[scope]
  const searchResults = useMemo(
    () =>
      scoped.filter(
        (item) =>
          (!localOnly || item.isLocal) && matchesQuery(item, normalizedQuery, locale),
      ),
    [scoped, normalizedQuery, locale, localOnly],
  )

  const guides = useMemo(() => hub.all.filter((item) => !item.isLocal), [hub.all])

  const pillarTopics = scope === 'all' ? [] : hub.topics[scope]
  const activeTopic = pillarTopics.find((topic) => topic.id === rawTopic) ?? null
  const topicItems = useMemo(
    () =>
      scope === 'all' || !activeTopic
        ? []
        : hub.byPillar[scope].filter((item) => item.topicIds?.includes(activeTopic.id)),
    [scope, activeTopic, hub.byPillar],
  )
  const sections = scope === 'all' ? null : hub.sections[scope]

  function setScope(next: Scope) {
    const params = new URLSearchParams(searchParams)
    params.delete('tab')
    params.delete('filter')
    params.delete('topic')
    if (next === 'all') params.delete('pillar')
    else params.set('pillar', next)
    setSearchParams(params)
  }

  function toggleLocal() {
    const params = new URLSearchParams(searchParams)
    if (localOnly) params.delete('local')
    else params.set('local', '1')
    setSearchParams(params, { replace: true })
  }

  function setTopic(next: string | null) {
    const params = new URLSearchParams(searchParams)
    if (next) params.set('topic', next)
    else params.delete('topic')
    setSearchParams(params, { replace: true })
  }

  const tabs: Array<{ id: Scope; label: string }> = [
    { id: 'all', label: copy.discover.tabAll },
    ...hub.pillarOrder.map((id) => ({ id, label: PILLARS[id].title[locale] })),
  ]

  const activePillar = scope === 'all' ? null : PILLARS[scope]
  const pillarNote =
    scope === 'financial'
      ? copy.discover.pillarFinancialNote
      : scope === 'health'
        ? copy.discover.pillarHealthNote
        : null

  return (
    <Container width="wide" className="py-8 sm:py-10 lg:py-12">
      <header className="max-w-[44rem]">
        <p className="text-[12px] font-extrabold tracking-[0.12em] text-ink-label uppercase">
          {copy.discover.title}
        </p>
        <h1 className="mt-2 font-display text-[2.1rem] font-medium leading-[1.12] tracking-[-0.02em] text-ink sm:text-[2.55rem]">
          {copy.discover.heroTitle}
        </h1>
        <p className="mt-3 text-[17px] text-ink-muted">{copy.discover.subtitle}</p>
      </header>

      <div className="-mx-5 mt-8 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div
          className="flex w-max gap-2 sm:w-auto sm:flex-wrap"
          role="tablist"
          aria-label={copy.discover.tabsAria}
        >
          {tabs.map((item) => {
            const selected = scope === item.id
            const pillar = item.id === 'all' ? null : PILLARS[item.id]
            const Icon = pillar?.icon ?? LayoutGrid
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setScope(item.id)}
                className={cn(
                  'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-[1.5px] px-4 text-[16px] font-bold transition-colors duration-160 sm:px-5',
                  selected && !pillar && 'border-ink bg-ink text-[#FDF9F4]',
                  !selected &&
                    'border-line-strong bg-paper text-ink hover:bg-[#F6EFE5]',
                )}
                style={
                  selected && pillar
                    ? {
                        borderColor: `var(${pillar.theme.solidVar})`,
                        backgroundColor: `var(${pillar.theme.tintVar})`,
                        color: `var(${pillar.theme.inkVar})`,
                      }
                    : undefined
                }
              >
                <Icon size={17} strokeWidth={2} aria-hidden="true" />
                {item.label}
                {pillar && hub.highlighted.includes(item.id as PillarId) ? (
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: `var(${pillar.theme.solidVar})` }}
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {activePillar ? (
        <section
          className="relative mt-8 overflow-hidden rounded-[28px] px-5 py-6 sm:px-8 sm:py-8"
          style={{ backgroundColor: `var(${activePillar.theme.tintVar})` }}
        >
          <PillarArt
            id={activePillar.id}
            size={220}
            className="origin-bottom-right scale-[0.6] opacity-80 sm:scale-100"
          />
          <div className="relative flex items-start gap-4">
            <div className="min-w-0 pr-16 sm:pr-48">
              <h2
                className="font-display text-[30px] leading-none font-bold tracking-[-0.03em] sm:text-[40px]"
                style={{ color: `var(${activePillar.theme.inkVar})` }}
              >
                {activePillar.title[locale]}
              </h2>
              <p className="mt-1 max-w-[40rem] text-[16px] text-ink sm:text-[17px]">
                {activePillar.description[locale]}
              </p>
              {pillarNote ? (
                <p className="mt-3 max-w-[44rem] text-[14px] leading-snug text-ink-muted">
                  {pillarNote}
                </p>
              ) : null}
            </div>
          </div>

          {pillarTopics.length > 0 ? (
            <ul
              className="relative mt-5 flex flex-wrap gap-2"
              aria-label={copy.discover.topicsAria}
            >
              <li>
                <TopicChip
                  label={copy.discover.topicAll}
                  selected={!activeTopic}
                  onClick={() => setTopic(null)}
                  inkVar={activePillar.theme.inkVar}
                />
              </li>
              {pillarTopics.map((topic) => (
                <li key={topic.id}>
                  <TopicChip
                    label={topic.label}
                    selected={activeTopic?.id === topic.id}
                    onClick={() => setTopic(topic.id)}
                    inkVar={activePillar.theme.inkVar}
                    forYouLabel={topic.forYou ? copy.discover.topicForYou : undefined}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative block w-full max-w-md">
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
        <button
          type="button"
          aria-pressed={localOnly}
          onClick={toggleLocal}
          className={cn(
            'inline-flex min-h-12 items-center gap-2 rounded-full border-[1.5px] px-5 text-[16px] font-bold transition-colors',
            localOnly
              ? 'border-ink bg-ink text-[#FDF9F4]'
              : 'border-line-strong bg-paper text-ink hover:bg-[#F6EFE5]',
          )}
        >
          <MapPin size={17} strokeWidth={2} aria-hidden="true" />
          {copy.discover.localFilter}
        </button>
      </div>

      {normalizedQuery || localOnly ? (
        <section className="mt-10">
          <SectionHeading
            title={
              localOnly
                ? copy.discover.localTitle
                : activePillar
                  ? activePillar.title[locale]
                  : copy.discover.catalogueTitle
            }
            count={copy.discover.countProposals(searchResults.length)}
          />
          {searchResults.length > 0 ? (
            <ResourceGrid
              items={searchResults}
              onOpen={setActive}
              pillarId={scope === 'all' ? undefined : scope}
            />
          ) : (
            <p className="text-[16px] text-ink-muted">{copy.discover.emptySearch}</p>
          )}
        </section>
      ) : scope === 'all' ? (
        <div className="mt-10 space-y-14">
          {hub.recommended.length > 0 ? (
            <section>
              <SectionHeading
                title={copy.discover.recommendedTitle}
                lead={copy.discover.recommendedLead}
              />
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {hub.recommended.map((item) => (
                  <li key={item.id}>
                    <ResourceCard
                      item={item}
                      onOpen={setActive}
                      pillarId={item.primaryPillarId}
                      borderless
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {hub.local.length > 0 ? (
            <section className="-mx-5 bg-cream-deep px-5 py-8 sm:mx-0 sm:rounded-[24px] sm:px-6">
              <SectionHeading
                title={copy.discover.localTitle}
                lead={copy.discover.localLead}
              />
              <ResourceGrid items={hub.local} onOpen={setActive} />
            </section>
          ) : null}

          {guides.length > 0 ? (
            <section>
              <SectionHeading
                title={copy.discover.guidesTitle}
                lead={copy.discover.guidesLead}
              />
              <ResourceGrid items={guides} onOpen={setActive} />
            </section>
          ) : null}

          <section>
            <SectionHeading
              title={copy.discover.catalogueTitle}
              count={copy.discover.countProposals(hub.all.length)}
            />
            <ResourceGrid items={hub.all} onOpen={setActive} />
          </section>
        </div>
      ) : activeTopic ? (
        <section className="mt-10">
          <SectionHeading
            title={activeTopic.label}
            count={copy.discover.countProposals(topicItems.length)}
          />
          <ResourceGrid items={topicItems} onOpen={setActive} pillarId={scope} />
        </section>
      ) : (
        <div className="mt-10 space-y-14">
          {sections && sections.primary.length > 0 ? (
            <section>
              <SectionHeading
                title={
                  sections.mode === 'start'
                    ? copy.discover.pillarStartNow
                    : copy.discover.pillarForYou
                }
                lead={
                  sections.mode === 'start'
                    ? copy.discover.pillarStartNowLead
                    : undefined
                }
              />
              <ResourceGrid
                items={sections.primary}
                onOpen={setActive}
                pillarId={scope}
              />
            </section>
          ) : null}

          {sections && sections.further.length > 0 ? (
            <section>
              <SectionHeading
                title={copy.discover.pillarFurther}
                count={copy.discover.countProposals(hub.byPillar[scope].length)}
              />
              <ResourceGrid items={sections.further} onOpen={setActive} pillarId={scope} />
            </section>
          ) : null}

          {hub.byPillar[scope].length === 0 ? (
            <p className="text-[16px] text-ink-muted">{copy.discover.emptyFilter}</p>
          ) : null}
        </div>
      )}

      {active ? (
        <ResourceDetailDialog
          resource={active}
          onClose={() => setActive(null)}
        />
      ) : null}
    </Container>
  )
}
