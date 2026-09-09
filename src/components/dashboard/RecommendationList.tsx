import { Link } from 'react-router-dom'
import { useCopy } from '../../i18n'
import type { ResourceRecommendation } from '../../types'
import { MediaBlock } from '../MediaBlock'
import {
  getResourceTheme,
  mediaVariantForResource,
} from '../../lib/resourceTheme'
import { cn } from '../../lib/cn'

function HomeResourcePreview({
  item,
  onOpen,
}: {
  item: ResourceRecommendation
  onOpen: (item: ResourceRecommendation) => void
}) {
  const theme = getResourceTheme(item)
  const tags = (item.tags ?? []).slice(0, 2)
  const location =
    item.neighborhood || item.location || item.metadata || item.sourceName

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group flex h-full w-full flex-col overflow-hidden rounded-[16px] border border-line bg-paper text-left transition-colors hover:border-line-strong hover:bg-cream-deep/30"
    >
      <MediaBlock
        theme={theme}
        imageUrl={item.image}
        alt=""
        aspect="compact"
        radius="sm"
        className="rounded-none rounded-t-[15px]"
        variant={mediaVariantForResource(item)}
      />
      <div className="flex flex-1 flex-col px-3 py-2.5">
        <p
          className="text-[11px] font-extrabold tracking-[0.08em] uppercase"
          style={{ color: `var(${theme.inkVar})` }}
        >
          {item.categoryLabel}
        </p>
        <h3 className="mt-1 line-clamp-2 text-[14.5px] font-extrabold leading-snug tracking-[-0.01em] text-ink">
          {item.title}
        </h3>
        {location ? (
          <p className="mt-0.5 line-clamp-1 text-[12.5px] text-ink-muted">
            {location}
          </p>
        ) : null}
        {tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                style={{
                  backgroundColor: `var(${theme.tintVar})`,
                  color: `var(${theme.inkVar})`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {item.personalizationReason ? (
          <p className="mt-2 line-clamp-1 text-[12px] leading-snug text-ink-soft">
            {item.personalizationReason}
          </p>
        ) : null}
      </div>
    </button>
  )
}

export function RecommendationList({
  items,
  onOpen,
  className,
}: {
  items: ResourceRecommendation[]
  onOpen: (item: ResourceRecommendation) => void
  className?: string
}) {
  const copy = useCopy()

  return (
    <section className={cn(className)}>
      <div className="mb-2.5 flex items-baseline justify-between gap-x-4">
        <h2 className="font-display text-[1.25rem] font-medium leading-tight tracking-[-0.01em] text-ink sm:text-[1.35rem]">
          {copy.home.forYou}
        </h2>
        <Link
          to="/discover?tab=activities"
          className="text-[13px] font-medium text-clay transition-colors hover:text-clay-deep"
        >
          {copy.home.seeAllResources}
        </Link>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <HomeResourcePreview item={item} onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </section>
  )
}
