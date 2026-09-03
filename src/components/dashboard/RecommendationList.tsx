import { Link } from 'react-router-dom'
import { useCopy } from '../../i18n'
import type { ResourceRecommendation } from '../../types'
import { ResourceThemeTile } from '../ResourceThemeTile'

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
      <div className="mb-4 flex items-baseline justify-between gap-x-4">
        <h2 className="font-display text-[1.55rem] font-[800] leading-tight tracking-[-0.01em] text-ink">
          {copy.home.forYou}
        </h2>
        <Link
          to="/discover"
          className="text-[14px] font-medium text-clay transition-colors hover:text-clay-deep"
        >
          {copy.home.seeAllResources}
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <ResourceThemeTile item={item} onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </section>
  )
}
