import { Link } from 'react-router-dom'
import { CardEyebrow } from './DashboardCard'
import { useCopy } from '../../i18n'
import type { ResourceRecommendation } from '../../types'

export function RecommendationList({
  items,
  onOpen,
}: {
  items: ResourceRecommendation[]
  onOpen: (item: ResourceRecommendation) => void
}) {
  const copy = useCopy()

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <CardEyebrow>{copy.home.forYou}</CardEyebrow>
        <Link
          to="/discover"
          className="text-[14px] font-medium text-clay transition-colors hover:text-clay-deep"
        >
          {copy.home.seeAllResources}
        </Link>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="flex h-full w-full cursor-pointer flex-col rounded-lg border border-line bg-paper px-4 py-4 text-left transition-colors hover:border-ink/25 hover:bg-cream/40 sm:px-5 sm:py-5"
            >
              <p className="text-[11px] font-medium tracking-[0.14em] text-clay uppercase">
                {item.categoryLabel}
              </p>
              <h3 className="mt-2 text-[16px] leading-snug font-medium text-ink">
                {item.title}
              </h3>
              <p className="mt-1 text-[13px] text-ink-soft">{item.metadata}</p>
              <p className="mt-3 flex-1 text-[14px] leading-snug text-ink-muted">
                {item.homeSnippet}
              </p>
              <span className="mt-3 text-[14px] font-medium text-clay">
                {copy.home.discover} →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
