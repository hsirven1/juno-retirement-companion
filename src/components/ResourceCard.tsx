import { cn } from '../lib/cn'
import { MediaBlock } from './MediaBlock'
import {
  getResourceTheme,
  mediaHintForResource,
} from '../lib/resourceTheme'
import type { ResourceRecommendation } from '../types'

export function ResourceCard({
  item,
  onOpen,
  className,
  showDescription = true,
  borderless = false,
}: {
  item: ResourceRecommendation
  onOpen: (item: ResourceRecommendation) => void
  className?: string
  showDescription?: boolean
  /** Editorial treatment: no white card chrome */
  borderless?: boolean
}) {
  const theme = getResourceTheme(item)

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn(
        'group flex h-full w-full flex-col text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px]',
        borderless
          ? 'bg-transparent'
          : 'rounded-[22px] border border-line bg-paper p-5 shadow-none hover:shadow-[var(--shadow-card-hover)]',
        className,
      )}
    >
      <MediaBlock
        theme={theme}
        imageUrl={item.image}
        alt=""
        aspect="card"
      />

      <p
        className="mt-3.5 text-[12px] font-[800] tracking-[0.1em] uppercase"
        style={{ color: `var(${theme.inkVar})` }}
      >
        {item.categoryLabel}
      </p>

      <h3 className="mt-1.5 line-clamp-2 text-[20px] leading-[1.25] font-[800] tracking-[-0.015em] text-pretty text-ink">
        {item.title}
      </h3>

      {item.sourceName ? (
        <p className="mt-1 text-[15px] font-semibold text-ink-muted">
          {item.sourceName}
        </p>
      ) : null}

      {item.metadata ? (
        <p className="mt-1 text-[15px] leading-snug text-ink-soft">
          {item.metadata}
        </p>
      ) : null}

      {showDescription && item.homeSnippet ? (
        <p className="mt-2 line-clamp-2 text-[16px] leading-[1.5] text-[#4A433D]">
          {item.homeSnippet}
        </p>
      ) : null}

      {/* Keep hint out of production UI; reserved for future photography pipeline. */}
      <span className="sr-only">{mediaHintForResource(item)}</span>
    </button>
  )
}

export function ResourceCardCompact({
  item,
  onOpen,
  className,
}: {
  item: ResourceRecommendation
  onOpen: (item: ResourceRecommendation) => void
  className?: string
}) {
  const theme = getResourceTheme(item)

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn(
        'group flex w-full items-start gap-4 rounded-[20px] border border-line bg-paper p-[18px] text-left transition-[transform,box-shadow] duration-200 hover:-translate-y-[2px] hover:shadow-[var(--shadow-card-hover)]',
        className,
      )}
    >
      <MediaBlock
        theme={theme}
        imageUrl={item.image}
        alt=""
        aspect="square"
        radius="md"
        className="w-24 shrink-0 sm:w-32"
      />
      <div className="min-w-0 flex-1">
        <p
          className="text-[12px] font-[800] tracking-[0.1em] uppercase"
          style={{ color: `var(${theme.inkVar})` }}
        >
          {item.categoryLabel}
        </p>
        <h3 className="mt-1 line-clamp-2 text-[18px] leading-snug font-[800] text-ink">
          {item.title}
        </h3>
        {item.metadata ? (
          <p className="mt-1 text-[14px] leading-snug text-ink-soft">
            {item.metadata}
          </p>
        ) : null}
      </div>
    </button>
  )
}
