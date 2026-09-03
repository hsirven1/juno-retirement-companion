import { Link } from 'react-router-dom'
import { CardEyebrow, DashboardCard } from './DashboardCard'
import { useCopy } from '../../i18n'
import type { PathProgress, Theme } from '../../types'
import { guidedPaths } from '../../data/paths'

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
    <DashboardCard>
      <CardEyebrow>{copy.home.prioritiesTitle}</CardEyebrow>
      <ul className="mt-5 space-y-4">
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
            <li key={theme.id} className="flex items-start gap-3">
              <span
                className="mt-2 size-2 shrink-0 rounded-full bg-clay"
                aria-hidden="true"
              />
              <div>
                <p className="text-[16px] leading-snug text-ink">{theme.title}</p>
                <p className="mt-0.5 text-[13px] text-ink-soft">{statusLabel}</p>
                {path && progress?.status === 'in_progress' ? (
                  <p className="mt-0.5 text-[12px] text-ink-soft">
                    {copy.plan.stepsProgress(
                      progress.completedStepIds.length,
                      path.steps.length,
                    )}
                  </p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
      <Link
        to="/plan"
        className="mt-5 inline-flex min-h-11 cursor-pointer items-center text-[16px] text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
      >
        {copy.home.prioritiesCta}
      </Link>
    </DashboardCard>
  )
}
