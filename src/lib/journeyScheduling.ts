import type { PathProgress, WeeklyStepItem } from '../types'
import {
  getSocialPhaseForStep,
  SOCIAL_STEP_ORDER,
} from '../data/socialJourney'
import {
  getSocialJourney,
  getSocialJourneyStep,
  getJourneyPhaseLabels,
  getAllSocialJourneySteps,
} from '../i18n/content/social'
import type { Locale } from '../i18n/types'
import { DEFAULT_LOCALE } from '../i18n/types'
import { getPathById, getThemeById, PATH_SOCIAL } from '../data/paths'
import type { WeekDefinition } from '../types'

export function getCompletedSocialStepIds(
  pathProgress: PathProgress | undefined,
): string[] {
  return pathProgress?.completedStepIds ?? []
}

export function getCurrentSocialStepId(
  pathProgress: PathProgress | undefined,
): string | null {
  const completed = new Set(getCompletedSocialStepIds(pathProgress))
  for (const stepId of SOCIAL_STEP_ORDER) {
    if (!completed.has(stepId)) return stepId
  }
  return null
}

export function getSocialJourneyStatus(
  pathProgress: PathProgress | undefined,
): 'not_started' | 'in_progress' | 'in_action' {
  const completed = getCompletedSocialStepIds(pathProgress)
  if (completed.length === 0) {
    return pathProgress?.status === 'in_progress' ? 'in_progress' : 'not_started'
  }
  if (completed.length >= SOCIAL_STEP_ORDER.length) return 'in_action'
  return 'in_progress'
}

/** Which step is nominally scheduled for a given week index (mock test data) */
export function scheduledSocialStepForWeek(weekIndex: number): string | null {
  return SOCIAL_STEP_ORDER[weekIndex] ?? null
}

export function isStepCarriedOver(
  stepId: string,
  currentWeekIndex: number,
): boolean {
  const stepIndex = SOCIAL_STEP_ORDER.indexOf(stepId)
  return stepIndex >= 0 && stepIndex < currentWeekIndex
}

export function buildSocialWeeklyItem(args: {
  week: WeekDefinition
  weekIndex: number
  currentWeekIndex: number
  pathProgress: PathProgress | undefined
  completedWeeklyStepIds: string[]
  locale?: Locale
}): WeeklyStepItem | null {
  const locale = args.locale ?? DEFAULT_LOCALE
  const journey = getSocialJourney(locale)
  const path = getPathById(PATH_SOCIAL)
  const theme = getThemeById(journey.themeId)
  if (!path || !theme) return null

  const completedSteps = getCompletedSocialStepIds(args.pathProgress)
  const currentActive = getCurrentSocialStepId(args.pathProgress)
  const relative =
    args.weekIndex < args.currentWeekIndex
      ? 'past'
      : args.weekIndex > args.currentWeekIndex
        ? 'future'
        : 'current'

  let stepId: string | null = null
  let carriedOver = false

  if (relative === 'current') {
    const scheduledForWeek = scheduledSocialStepForWeek(args.weekIndex)
    if (!scheduledForWeek) return null

    const scheduledIndex = SOCIAL_STEP_ORDER.indexOf(scheduledForWeek)
    const activeIndex = currentActive
      ? SOCIAL_STEP_ORDER.indexOf(currentActive)
      : SOCIAL_STEP_ORDER.length

    // Behind schedule: surface the incomplete step (carry-over).
    // On schedule or finished this week's step: surface the week assignment,
    // even if the journey has already advanced to the next step internally.
    if (currentActive && activeIndex < scheduledIndex) {
      stepId = currentActive
      carriedOver = true
    } else {
      stepId = scheduledForWeek
      carriedOver = false
    }
  } else if (relative === 'past') {
    stepId = scheduledSocialStepForWeek(args.weekIndex)
    if (!stepId) return null
  } else {
    const scheduled = scheduledSocialStepForWeek(args.weekIndex)
    if (!scheduled || !currentActive) return null
    const scheduledIndex = SOCIAL_STEP_ORDER.indexOf(scheduled)
    const activeIndex = SOCIAL_STEP_ORDER.indexOf(currentActive)
    if (activeIndex >= scheduledIndex) return null
    stepId = scheduled
  }

  const journeyStep = getSocialJourneyStep(stepId, locale)
  const phase = getSocialPhaseForStep(stepId)
  const phaseLabels = getJourneyPhaseLabels(locale)
  if (!journeyStep) return null

  const weeklyKey = `${args.week.id}:${stepId}`
  const completed =
    completedSteps.includes(stepId) ||
    args.completedWeeklyStepIds.includes(weeklyKey)

  return {
    id: weeklyKey,
    weekId: args.week.id,
    pathId: PATH_SOCIAL,
    themeId: theme.id,
    themeTitle: journey.title,
    stepId,
    title: journey.title,
    subtitle: journeyStep.title,
    phaseLabel: phase ? phaseLabels[phase.type] : '',
    estimatedMinutes: journeyStep.estimatedMinutes,
    completed,
    carriedOver,
    postponed: false,
    type: 'content',
  }
}

export function journeyStepsToGuidedPathSteps(locale: Locale = DEFAULT_LOCALE) {
  return getAllSocialJourneySteps(locale).map((step) => {
    const phase = getSocialPhaseForStep(step.id)
    const phaseType = phase?.type ?? 'discover'
    const pathPhase =
      phaseType === 'discover'
        ? ('understand' as const)
        : phaseType === 'define'
          ? ('define' as const)
          : ('act' as const)
    return {
      id: step.id,
      pathId: PATH_SOCIAL,
      phase: pathPhase,
      type: 'content' as const,
      title: step.title,
      content: step.description ?? '',
      estimatedMinutes: step.estimatedMinutes,
    }
  })
}

export function getStepProgressStatus(
  stepId: string,
  pathProgress: PathProgress | undefined,
  activeStepId: string | null,
): 'completed' | 'current' | 'upcoming' {
  const completed = getCompletedSocialStepIds(pathProgress)
  if (completed.includes(stepId)) return 'completed'
  if (stepId === activeStepId) return 'current'
  return 'upcoming'
}
