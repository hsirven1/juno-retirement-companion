import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { PILLARS } from '../../data/pillars'
import { useCopy, useLocale } from '../../i18n'
import { getResourceTheme, mediaVariantForResource } from '../../lib/resourceTheme'
import type { PillarId, ResourceRecommendation } from '../../types'
import { MediaBlock } from '../MediaBlock'
import { PillarGlyph } from '../pillars/PillarGlyph'
import { PillarTag } from '../pillars/PillarCard'

function themeFor(item: ResourceRecommendation) {
  return item.primaryPillarId
    ? { id: item.primaryPillarId, ...PILLARS[item.primaryPillarId].theme }
    : getResourceTheme(item)
}

function placeOf(item: ResourceRecommendation) {
  return item.isLocal ? item.neighborhood || item.location || 'Lille' : item.sourceName
}

function metaOf(item: ResourceRecommendation) {
  return [item.categoryLabel, placeOf(item)].filter(Boolean).join(' · ')
}

/** One scannable line in a Home pillar section: thumbnail, title, type · place. */
export function CompactResourceRow({
  item,
  onOpen,
}: {
  item: ResourceRecommendation
  onOpen: (item: ResourceRecommendation) => void
}) {
  const theme = themeFor(item)
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group -mx-2.5 flex w-[calc(100%+1.25rem)] items-center gap-3.5 rounded-[16px] p-2.5 text-left transition-colors hover:bg-[var(--row-hover)] focus-visible:bg-[var(--row-hover)]"
      style={{ '--row-hover': `var(${theme.tintVar})` } as CSSProperties}
    >
      <MediaBlock
        theme={theme}
        imageUrl={item.image}
        aspect="square"
        radius="sm"
        className="w-[52px] shrink-0 rounded-[14px]"
        variant={mediaVariantForResource(item)}
        pillarId={item.primaryPillarId}
      />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[15.5px] leading-snug font-bold text-ink">
          {item.title}
        </span>
        <span className="mt-0.5 block truncate text-[13.5px] text-ink-soft">
          {metaOf(item)}
        </span>
      </span>
      <ChevronRight
        size={18}
        strokeWidth={2}
        className="shrink-0 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
    </button>
  )
}

/** Home content section for one pillar: header with "Voir tout", then a few resources. */
export function PillarSection({
  id,
  items,
  onOpen,
}: {
  id: PillarId
  items: ResourceRecommendation[]
  onOpen: (item: ResourceRecommendation) => void
}) {
  const copy = useCopy()
  const { locale } = useLocale()
  const pillar = PILLARS[id]
  const titleId = `home-pillar-${id}`

  return (
    <section
      aria-labelledby={titleId}
      className="relative flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-paper px-5 pt-5 pb-3 sm:px-6 sm:pt-6"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: `var(${pillar.theme.solidVar})` }}
      />
      <header className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-[14px]"
          style={{
            backgroundColor: `var(${pillar.theme.tintVar})`,
            color: `var(${pillar.theme.solidVar})`,
          }}
        >
          <PillarGlyph id={id} size={28} strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id={titleId}
            className="font-display text-[21px] leading-tight font-bold tracking-[-0.02em] sm:text-[23px]"
            style={{ color: `var(${pillar.theme.inkVar})` }}
          >
            {pillar.title[locale]}
          </h2>
          <p className="text-[13.5px] text-ink-soft">{pillar.tagline[locale]}</p>
        </div>
        <Link
          to={`/discover?pillar=${id}`}
          aria-label={copy.home.seeAllIn(pillar.title[locale])}
          className="group inline-flex shrink-0 items-center gap-1 self-start rounded-full px-2 py-1 text-[14.5px] font-bold hover:underline"
          style={{ color: `var(${pillar.theme.inkVar})` }}
        >
          {copy.home.seeAll}
          <ArrowRight
            size={15}
            strokeWidth={2.3}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </header>
      <ul className="mt-3 flex flex-col">
        {items.map((item) => (
          <li key={item.id} className="border-t border-line first:border-t-0">
            <CompactResourceRow item={item} onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Compact local card: square art on the left. */
export function LocalResourceRow({
  item,
  onOpen,
}: {
  item: ResourceRecommendation
  onOpen: (item: ResourceRecommendation) => void
}) {
  const theme = themeFor(item)
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group flex h-full w-full items-center gap-4 rounded-[22px] bg-paper p-3 pr-4 text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
    >
      <MediaBlock
        theme={theme}
        imageUrl={item.image}
        aspect="square"
        radius="sm"
        className="w-[76px] shrink-0"
        variant={mediaVariantForResource(item)}
        pillarId={item.primaryPillarId}
      />
      <div className="min-w-0">
        {item.primaryPillarId ? <PillarTag id={item.primaryPillarId} /> : null}
        <h3 className="mt-1 line-clamp-2 text-[15.5px] leading-snug font-extrabold text-ink">
          {item.title}
        </h3>
        <p className="mt-0.5 truncate text-[13.5px] text-ink-soft">{placeOf(item)}</p>
      </div>
    </button>
  )
}
