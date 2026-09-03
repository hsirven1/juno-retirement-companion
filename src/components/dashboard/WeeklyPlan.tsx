import { Check, Circle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DashboardCard } from './DashboardCard'
import { useApp } from '../../context/useApp'
import { PATH_SOCIAL } from '../../data/paths'
import { formatWeekDateRange, useCopy, useLocale } from '../../i18n'
import { getCurrentSocialStepId } from '../../lib/journeyScheduling'
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
  const { profile } = useApp()

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
    <DashboardCard padding="lg" surface="coral" className="relative h-full overflow-hidden">
      {/* Decorative discs — background only, never text opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[60px] -right-[60px] size-[230px] rounded-full bg-white/[0.11]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[74px] -bottom-[90px] size-[150px] rounded-full bg-white/[0.08]"
      />

      <div className="relative flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={weekIndex <= 0}
          className="mt-1 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/35 text-on-coral transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:border-white/20 disabled:text-white/55"
          aria-label={copy.home.prevWeek}
        >
          <ChevronLeft size={20} strokeWidth={1.8} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-[800] tracking-[0.11em] text-white/80 uppercase">
            {formatWeekDateRange(week.offset, locale)}
            {showSteps ? ` · ${copy.home.weekProgress(doneCount, totalCount)}` : ''}
          </p>
          <h2 className="mt-2 font-display text-[2.1rem] leading-[1.12] tracking-[-0.02em] text-on-coral sm:text-[2.35rem]">
            {copy.home.thisWeek}
            {profile.firstName ? `, ${profile.firstName}` : ''}
          </h2>
          {relative !== 'current' ? (
            <p
              className={cn(
                'mt-2 text-[13px] font-medium tracking-[0.04em]',
                relative === 'upcoming' ? 'text-white/80' : 'text-on-coral',
              )}
            >
              {relative === 'upcoming'
                ? copy.home.forecastLabel
                : copy.home.pastWeekLabel}
            </p>
          ) : (
            <p className="mt-2 text-[17px] text-white/85">
              {copy.home.weekLead}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={weekIndex >= totalWeeksAvailable - 1}
          className="mt-1 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/35 text-on-coral transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:border-white/20 disabled:text-white/55"
          aria-label={copy.home.nextWeek}
        >
          <ChevronRight size={20} strokeWidth={1.8} />
        </button>
      </div>

      {relative === 'upcoming' ? (
        <p className="relative mt-4 text-center text-[14px] text-white/85">
          {copy.home.forecastNote}
        </p>
      ) : null}

      {allDone ? (
        <p className="relative mt-6 flex items-center justify-center gap-2 border-t border-white/25 pt-5 text-[15px] font-medium text-on-coral">
          <span
            className="flex size-7 items-center justify-center rounded-full bg-white text-clay"
            aria-hidden="true"
          >
            <Check size={16} strokeWidth={3} />
          </span>
          {copy.home.allDoneThisWeek}
        </p>
      ) : null}

      {showSteps ? (
        <ul
          className={cn(
            'relative space-y-3',
            allDone ? 'mt-4' : 'mt-6',
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
        <p className="relative mt-6 border-t border-white/25 pt-5 text-[16px] text-white/85">
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
  const { startPath, openGuidedStep, pathProgress } = useApp()
  const copy = useCopy()
  const isSocial = step.pathId === PATH_SOCIAL
  const done = step.completed
  const currentSocialStepId = getCurrentSocialStepId(pathProgress[PATH_SOCIAL])
  const isLiveRow = isSocial && !done && currentSocialStepId === step.stepId

  function openCompletedStep() {
    if (!done || !canReview) return
    if (isSocial) {
      startPath(PATH_SOCIAL)
      openGuidedStep(step.stepId)
    }
  }

  const statusIcon = done ? (
    <span
      className="weekly-step-check-icon flex size-9 items-center justify-center rounded-full bg-white text-clay"
      aria-hidden="true"
    >
      <Check size={18} strokeWidth={3} />
    </span>
  ) : canInteract ? (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors',
        isLiveRow
          ? 'text-ink-soft hover:text-ink-muted'
          : 'text-on-coral hover:text-white',
      )}
      aria-pressed={false}
      aria-label={step.subtitle}
    >
      <Circle size={24} strokeWidth={1.8} />
    </button>
  ) : (
    <span
      className={cn(
        'flex size-9 shrink-0 items-center justify-center',
        isLiveRow ? 'text-ink-soft' : 'text-on-coral',
      )}
      aria-hidden="true"
    >
      <Circle size={24} strokeWidth={1.8} />
    </span>
  )

  const textBlock = (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <p
          className={cn(
            'text-[12px] font-[800] tracking-[0.1em] uppercase',
            isLiveRow ? 'text-clay-ink' : 'text-white/80',
          )}
        >
          {step.themeTitle}
          {isLiveRow ? ` · ${copy.home.guidedStep}` : null}
        </p>
        {done ? (
          <span className="shrink-0 text-[13px] font-medium text-on-coral">
            {copy.home.completed}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          'mt-1 text-[18px] leading-snug font-medium',
          done
            ? 'text-on-coral line-through decoration-[#D6CDC2]'
            : isLiveRow
              ? 'text-ink'
              : 'text-on-coral',
        )}
      >
        {step.subtitle}
      </p>
      {!done ? (
        <p
          className={cn(
            'mt-1 text-[14px]',
            isLiveRow ? 'text-ink-muted' : 'text-white/80',
          )}
        >
          {step.estimatedMinutes} min
          {step.carriedOver ? (
            <span>
              {' '}
              · {copy.home.carriedOver}
            </span>
          ) : null}
        </p>
      ) : null}
    </div>
  )

  const actions =
    !done && canInteract ? (
      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
        {isSocial ? (
          <button
            type="button"
            className={cn(
              'inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-2.5 text-[15px] font-bold transition-colors sm:w-auto',
              isLiveRow
                ? 'bg-ink text-on-coral hover:bg-ink/90'
                : 'border-[1.5px] border-white/55 bg-transparent text-on-coral hover:bg-white/15',
            )}
            onClick={() => {
              startPath(PATH_SOCIAL)
              openGuidedStep(step.stepId)
            }}
          >
            {isLiveRow ? copy.home.resumeStep : copy.home.detailsStep}
          </button>
        ) : (
          <Link
            to={`/guide/${step.pathId}?step=${step.stepId}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border-[1.5px] border-white/55 bg-transparent px-5 py-2.5 text-[15px] font-bold text-on-coral transition-colors hover:bg-white/15 sm:w-auto"
          >
            {copy.home.detailsStep}
          </Link>
        )}
        <button
          type="button"
          onClick={onPostpone}
          className={cn(
            'w-full cursor-pointer text-[13px] font-medium transition-colors sm:w-auto',
            isLiveRow
              ? 'text-ink-muted hover:text-ink'
              : 'text-white/80 hover:text-on-coral',
          )}
        >
          {copy.home.postpone}
        </button>
      </div>
    ) : done && canReview ? (
      <span
        className={cn(
          'shrink-0 text-[13px] font-medium',
          isLiveRow ? 'text-ink-muted' : 'text-white/80',
        )}
      >
        {copy.home.reviewStep} →
      </span>
    ) : null

  const rowClassName = cn(
    'weekly-step-row flex items-start gap-4 rounded-[18px] px-4 py-[18px] transition-colors',
    done
      ? 'bg-white/[0.14]'
      : isLiveRow
        ? 'bg-paper'
        : 'bg-transparent',
  )

  if (done && canReview && isSocial) {
    return (
      <li>
        <button
          type="button"
          onClick={openCompletedStep}
          className={cn(
            rowClassName,
            'w-full cursor-pointer text-left hover:bg-white/[0.2]',
          )}
          aria-label={copy.home.reviewStepAria(step.subtitle)}
        >
          <div className="shrink-0 pt-0.5">{statusIcon}</div>
          <div className="flex min-w-0 flex-1 flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-4 sm:gap-y-1">
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
          className={cn(rowClassName, 'hover:bg-white/[0.2]')}
        >
          <div className="shrink-0 pt-0.5">{statusIcon}</div>
          <div className="flex min-w-0 flex-1 flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-4 sm:gap-y-1">
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
        <div className="flex min-w-0 flex-1 flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-4 sm:gap-y-1">
          {textBlock}
          {actions}
        </div>
      </div>
    </li>
  )
}
