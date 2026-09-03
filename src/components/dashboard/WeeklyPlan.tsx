import { Circle, CircleCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardCard } from './DashboardCard'
import { useApp } from '../../context/useApp'
import { PATH_SOCIAL } from '../../data/paths'
import { formatWeekDateRange, useCopy, useLocale } from '../../i18n'
import { cn } from '../../lib/cn'
import type { WeekDefinition, WeeklyStepItem } from '../../types'

type WeekRelative = 'past' | 'current' | 'upcoming'

export function WeeklyPlan({
  week,
  weekIndex,
  currentWeekIndex,
  totalWeeksAvailable,
  steps,
  onToggle,
  onPostpone,
  onPrev,
  onNext,
}: {
  week: WeekDefinition
  weekIndex: number
  currentWeekIndex: number
  totalWeeksAvailable: number
  steps: WeeklyStepItem[]
  onToggle: (item: WeeklyStepItem) => void
  onPostpone: (item: WeeklyStepItem) => void
  onPrev: () => void
  onNext: () => void
}) {
  const copy = useCopy()
  const { locale } = useLocale()

  const relative: WeekRelative =
    weekIndex < currentWeekIndex
      ? 'past'
      : weekIndex > currentWeekIndex
        ? 'upcoming'
        : 'current'

  const canInteract = relative === 'current'
  const doneCount = steps.filter((step) => step.completed).length
  const totalCount = steps.length
  const allDone = totalCount > 0 && doneCount === totalCount
  const showSteps = relative !== 'upcoming' && totalCount > 0

  return (
    <DashboardCard padding="lg" className="h-full">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={weekIndex <= 0}
          className="mt-1 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line-strong text-ink transition-colors hover:border-ink/40 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={copy.home.prevWeek}
        >
          <ChevronLeft size={20} strokeWidth={1.8} />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <h2 className="font-display text-[1.85rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.05rem]">
            {copy.home.thisWeek}
          </h2>
          <p className="mt-1.5 text-[15px] text-ink-muted">
            {formatWeekDateRange(week.offset, locale)}
          </p>
          {relative !== 'current' ? (
            <p
              className={cn(
                'mt-2 text-[13px] font-medium tracking-[0.04em]',
                relative === 'upcoming' ? 'text-ink-soft' : 'text-sage',
              )}
            >
              {relative === 'upcoming'
                ? copy.home.forecastLabel
                : copy.home.pastWeekLabel}
            </p>
          ) : null}
          {showSteps && doneCount > 0 ? (
            <p className="mt-2 text-[14px] text-ink-muted">
              {copy.home.weekProgress(doneCount, totalCount)}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={weekIndex >= totalWeeksAvailable - 1}
          className="mt-1 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line-strong text-ink transition-colors hover:border-ink/40 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={copy.home.nextWeek}
        >
          <ChevronRight size={20} strokeWidth={1.8} />
        </button>
      </div>

      {relative === 'upcoming' ? (
        <p className="mt-4 text-center text-[13px] text-ink-soft">
          {copy.home.forecastNote}
        </p>
      ) : null}

      {allDone ? (
        <p className="mt-6 flex items-center justify-center gap-2 border-t border-line pt-5 text-[15px] font-medium text-sage">
          <CircleCheck size={18} strokeWidth={2} aria-hidden="true" />
          {copy.home.allDoneThisWeek}
        </p>
      ) : null}

      {showSteps ? (
        <ul
          className={cn(
            'space-y-2',
            allDone ? 'mt-4' : 'mt-6 border-t border-line pt-5',
          )}
        >
          {steps.map((step) => (
            <WeeklyStepRow
              key={step.id}
              step={step}
              canInteract={canInteract}
              canReview
              onToggle={() => onToggle(step)}
              onPostpone={() => onPostpone(step)}
            />
          ))}
        </ul>
      ) : relative !== 'upcoming' ? (
        <p className="mt-6 border-t border-line pt-5 text-[16px] text-ink-muted">
          {copy.home.stepsOpen(0)}
        </p>
      ) : null}
    </DashboardCard>
  )
}

function WeeklyStepRow({
  step,
  canInteract,
  canReview,
  onToggle,
  onPostpone,
}: {
  step: WeeklyStepItem
  canInteract: boolean
  canReview: boolean
  onToggle: () => void
  onPostpone: () => void
}) {
  const { startPath, openGuidedStep } = useApp()
  const copy = useCopy()
  const isSocial = step.pathId === PATH_SOCIAL
  const done = step.completed
  const continueClassName =
    'inline-flex shrink-0 cursor-pointer items-center text-[15px] font-medium text-clay transition-colors hover:text-clay-deep'

  function openCompletedStep() {
    if (!done || !canReview) return
    if (isSocial) {
      startPath(PATH_SOCIAL)
      openGuidedStep(step.stepId)
    }
  }

  const statusIcon = done ? (
    <span
      className="weekly-step-check-icon flex size-7 items-center justify-center rounded-full bg-sage text-cream"
      aria-hidden="true"
    >
      <CircleCheck size={18} strokeWidth={2.2} />
    </span>
  ) : canInteract ? (
    <button
      type="button"
      onClick={onToggle}
      className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:text-ink-muted"
      aria-pressed={false}
      aria-label={step.subtitle}
    >
      <Circle size={22} strokeWidth={1.6} />
    </button>
  ) : (
    <span
      className="flex size-7 shrink-0 items-center justify-center text-ink-soft"
      aria-hidden="true"
    >
      <Circle size={22} strokeWidth={1.6} />
    </span>
  )

  const textBlock = (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <p
          className={cn(
            'text-[13px] font-medium tracking-[0.04em] uppercase',
            done
              ? 'text-ink-soft line-through decoration-line-strong/80'
              : 'text-ink-soft',
          )}
        >
          {step.themeTitle}
        </p>
        {done ? (
          <span className="shrink-0 text-[11px] font-medium tracking-[0.12em] text-sage uppercase">
            {copy.home.completed}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          'mt-0.5 text-[17px] leading-snug',
          done ? 'text-ink-muted' : 'font-medium text-ink',
        )}
      >
        {step.subtitle}
      </p>
      {!done ? (
        <p className="mt-1 text-[13px] text-ink-muted">
          {step.estimatedMinutes} min
          {step.carriedOver ? (
            <span className="text-ink-soft"> · {copy.home.carriedOver}</span>
          ) : null}
        </p>
      ) : null}
    </div>
  )

  const actions =
    !done && canInteract ? (
      <div className="flex flex-col items-end gap-2">
        {isSocial ? (
          <button
            type="button"
            className={continueClassName}
            onClick={() => {
              startPath(PATH_SOCIAL)
              openGuidedStep(step.stepId)
            }}
          >
            {copy.home.startStep} →
          </button>
        ) : (
          <Link
            to={`/guide/${step.pathId}?step=${step.stepId}`}
            className={continueClassName}
          >
            {copy.home.continueStep} →
          </Link>
        )}
        <button
          type="button"
          onClick={onPostpone}
          className="cursor-pointer text-[13px] text-ink-soft transition-colors hover:text-ink-muted"
        >
          {copy.home.postpone}
        </button>
      </div>
    ) : done && canReview ? (
      <span className="shrink-0 text-[13px] text-ink-soft">
        {copy.home.reviewStep} →
      </span>
    ) : null

  const rowClassName = cn(
    'weekly-step-row flex items-start gap-3 rounded-lg border px-3.5 py-3.5',
    done
      ? 'is-completed border-sage/20 bg-sage/[0.05]'
      : 'border-transparent',
  )

  if (done && canReview && isSocial) {
    return (
      <li>
        <button
          type="button"
          onClick={openCompletedStep}
          className={cn(
            rowClassName,
            'w-full cursor-pointer text-left transition-colors hover:border-sage/35 hover:bg-sage/[0.08]',
          )}
          aria-label={copy.home.reviewStepAria(step.subtitle)}
        >
          <div className="shrink-0 pt-0.5">{statusIcon}</div>
          <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-1">
            {textBlock}
            {actions}
          </div>
        </button>
      </li>
    )
  }

  if (done && canReview && !isSocial) {
    return (
      <li>
        <Link
          to={`/guide/${step.pathId}?step=${step.stepId}`}
          className={cn(
            rowClassName,
            'transition-colors hover:border-sage/35 hover:bg-sage/[0.08]',
          )}
        >
          <div className="shrink-0 pt-0.5">{statusIcon}</div>
          <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-1">
            {textBlock}
            {actions}
          </div>
        </Link>
      </li>
    )
  }

  return (
    <li>
      <div className={rowClassName}>
        <div className="shrink-0 pt-0.5">{statusIcon}</div>
        <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-1">
          {textBlock}
          {actions}
        </div>
      </div>
    </li>
  )
}
