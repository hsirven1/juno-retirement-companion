import { Link } from 'react-router-dom'
import { DashboardCard } from './DashboardCard'
import { useCopy } from '../../i18n'
import type { PathProgress, Theme } from '../../types'
import { guidedPaths } from '../../data/paths'

const THEME_DOT: Record<string, string> = {
  social: 'bg-[var(--theme-social-solid)]',
  actif: 'bg-[var(--theme-active-solid)]',
  rythme: 'bg-[var(--theme-rythme-solid)]',
  transmettre: 'bg-[var(--theme-contribute-solid)]',
  envies: 'bg-[var(--theme-learn-solid)]',
}

export function PrioritiesPreview({
  themes,
  pathProgress,
}: {
  themes: Theme[]
  pathProgress: Record<string, PathProgress>
}) {
  const copy = useCopy()
  const visible = themes.slice(0, 3)

  return (
    <DashboardCard surface="sunken">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[19px] font-[800] leading-tight text-ink">
          {copy.home.prioritiesTitle}
        </h3>
        <Link
          to="/plan"
          className="text-[15px] font-bold text-clay-ink transition-colors hover:text-clay-deep"
        >
          {copy.home.prioritiesAdjust}
        </Link>
      </div>

      <ul className="mt-4 space-y-[11px]">
        {visible.map((theme) => {
          const path = guidedPaths.find((item) => item.id === theme.pathId)
          const progress = pathProgress[theme.pathId]
          const statusLabel =
            progress?.status === 'in_progress'
              ? copy.plan.statusInProgress
              : progress?.status === 'completed'
                ? copy.plan.statusCompleted
                : copy.plan.statusExplore
          return (
            <li
              key={theme.id}
              className="flex items-center gap-3 rounded-[14px] bg-paper px-[15px] py-[13px]"
            >
              <span
                className={`size-[9px] shrink-0 rounded-full ${THEME_DOT[theme.id] ?? 'bg-clay'}`}
                aria-hidden="true"
              />
              <p className="min-w-0 flex-1 text-[17px] font-bold leading-snug text-ink">
                {theme.title}
              </p>
              <span className="shrink-0 text-[14px] font-bold text-ink-soft">
                {statusLabel}
              </span>
              {path && progress?.status === 'in_progress' ? (
                <span className="sr-only">
                  {copy.plan.stepsProgress(
                    progress.completedStepIds.length,
                    path.steps.length,
                  )}
                </span>
              ) : null}
            </li>
          )
        })}
      </ul>
    </DashboardCard>
  )
}
