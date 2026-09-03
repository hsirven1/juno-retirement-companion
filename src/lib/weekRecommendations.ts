import type {
  GuidedPath,
  PathProgress,
  WeekDefinition,
  WeeklyStepItem,
} from '../types'
import { getPathById, guidedPaths, PATH_SOCIAL } from '../data/paths'
import {
  getLocalizedPhaseLabel,
  getLocalizedStepTitle,
  getLocalizedTheme,
} from '../i18n/content/pathsLocale'
import { DEFAULT_LOCALE, type Locale } from '../i18n/types'
import { buildSocialWeeklyItem } from './journeyScheduling'

export const CURRENT_WEEK_INDEX = 0

export const weeks: WeekDefinition[] = [
  { id: 'week-1', offset: 0 },
  { id: 'week-2', offset: 1 },
  { id: 'week-3', offset: 2 },
  { id: 'week-4', offset: 3 },
  { id: 'week-5', offset: 4 },
  { id: 'week-6', offset: 5 },
  { id: 'week-7', offset: 6 },
  { id: 'week-8', offset: 7 },
]

function currentStepForPath(
  path: GuidedPath,
  progress: PathProgress | undefined,
): string | null {
  if (path.id === PATH_SOCIAL) return null
  if (!progress || progress.status === 'not_started') {
    return path.steps[0]?.id ?? null
  }
  if (progress.status === 'completed') return null
  if (progress.currentStepId) return progress.currentStepId
  const next = path.steps.find(
    (step) => !progress.completedStepIds.includes(step.id),
  )
  return next?.id ?? null
}

function toWeeklyItem(args: {
  weekId: string
  path: GuidedPath
  stepId: string
  completed: boolean
  carriedOver?: boolean
  postponed?: boolean
  locale: Locale
}): WeeklyStepItem | null {
  const step = args.path.steps.find((item) => item.id === args.stepId)
  const theme = getLocalizedTheme(args.path.themeId, args.locale)
  if (!step || !theme) return null

  return {
    id: `${args.weekId}:${args.stepId}`,
    weekId: args.weekId,
    pathId: args.path.id,
    themeId: theme.id,
    themeTitle: theme.title,
    stepId: step.id,
    title: theme.title,
    subtitle: getLocalizedStepTitle(step.id, args.locale),
    phaseLabel: getLocalizedPhaseLabel(step.phase, args.locale),
    estimatedMinutes: step.estimatedMinutes,
    completed: args.completed,
    carriedOver: Boolean(args.carriedOver),
    postponed: Boolean(args.postponed),
    type: step.type,
  }
}

export function getRecommendedStepsForWeek(args: {
  weekIndex: number
  currentWeekIndex: number
  activeThemeIds: string[]
  pathProgress: Record<string, PathProgress>
  postponedStepIds: string[]
  deferredToWeek: Record<string, string[]>
  completedWeeklyStepIds: string[]
  locale?: Locale
}): WeeklyStepItem[] {
  const week = weeks[args.weekIndex]
  if (!week) return []

  const locale = args.locale ?? DEFAULT_LOCALE

  const relative =
    args.weekIndex < args.currentWeekIndex
      ? 'past'
      : args.weekIndex > args.currentWeekIndex
        ? 'future'
        : 'current'

  const items: WeeklyStepItem[] = []
  const usedStepIds = new Set<string>()

  const socialProgress = args.pathProgress[PATH_SOCIAL]
  const socialItem = buildSocialWeeklyItem({
    week,
    weekIndex: args.weekIndex,
    currentWeekIndex: args.currentWeekIndex,
    pathProgress: socialProgress,
    completedWeeklyStepIds: args.completedWeeklyStepIds,
    locale: args.locale,
  })
  if (socialItem && !usedStepIds.has(socialItem.stepId)) {
    items.push(socialItem)
    usedStepIds.add(socialItem.stepId)
  }

  if (relative === 'past' && items.length === 0) {
    const rythme = getPathById('path-rythme')
    if (rythme) {
      return [
        toWeeklyItem({
          weekId: week.id,
          path: rythme,
          stepId: 'rythme-1',
          completed: true,
          locale,
        }),
        toWeeklyItem({
          weekId: week.id,
          path: rythme,
          stepId: 'rythme-2',
          completed: true,
          locale,
        }),
      ].filter((item): item is WeeklyStepItem => Boolean(item))
    }
  }

  const deferred = args.deferredToWeek[week.id] ?? []
  for (const stepId of deferred) {
    if (usedStepIds.has(stepId) || items.length >= 3) continue
    const path = guidedPaths.find((p) => p.steps.some((s) => s.id === stepId))
    if (!path || path.id === PATH_SOCIAL) continue
    const item = toWeeklyItem({
      weekId: week.id,
      path,
      stepId,
      completed: args.completedWeeklyStepIds.includes(`${week.id}:${stepId}`),
      carriedOver: true,
      locale,
    })
    if (item) {
      items.push(item)
      usedStepIds.add(stepId)
    }
  }

  if (relative === 'current') {
    for (const stepId of args.postponedStepIds) {
      if (usedStepIds.has(stepId) || items.length >= 3) continue
      const path = guidedPaths.find((p) => p.steps.some((s) => s.id === stepId))
      if (!path || path.id === PATH_SOCIAL) continue
      const item = toWeeklyItem({
        weekId: week.id,
        path,
        stepId,
        completed: args.completedWeeklyStepIds.includes(`${week.id}:${stepId}`),
        carriedOver: true,
        locale,
      })
      if (item) {
        items.push(item)
        usedStepIds.add(stepId)
      }
    }

    const activePaths = args.activeThemeIds
      .map((themeId) => guidedPaths.find((path) => path.themeId === themeId))
      .filter((path): path is GuidedPath => Boolean(path))

    for (const path of activePaths) {
      if (items.length >= 3) break
      if (path.id === PATH_SOCIAL) continue
      const stepId = currentStepForPath(path, args.pathProgress[path.id])
      if (!stepId || usedStepIds.has(stepId)) continue
      const progress = args.pathProgress[path.id]
      if (progress?.completedStepIds.includes(stepId)) continue
      const item = toWeeklyItem({
        weekId: week.id,
        path,
        stepId,
        completed: args.completedWeeklyStepIds.includes(`${week.id}:${stepId}`),
        locale,
      })
      if (item) {
        items.push(item)
        usedStepIds.add(stepId)
      }
    }
  }

  if (relative === 'future' && items.length < 2) {
    const activePaths = args.activeThemeIds
      .map((themeId) => guidedPaths.find((path) => path.themeId === themeId))
      .filter((path): path is GuidedPath => Boolean(path))

    for (const path of activePaths) {
      if (items.length >= 2) break
      if (path.id === PATH_SOCIAL) continue
      const progress = args.pathProgress[path.id]
      const completed = new Set(progress?.completedStepIds ?? [])
      const upcoming = path.steps.find((step) => !completed.has(step.id))
      let candidate = upcoming
      if (args.weekIndex === args.currentWeekIndex + 1 && upcoming) {
        const idx = path.steps.findIndex((s) => s.id === upcoming.id)
        candidate = path.steps[idx + 1] ?? upcoming
      }
      if (!candidate || usedStepIds.has(candidate.id)) continue
      const item = toWeeklyItem({
        weekId: week.id,
        path,
        stepId: candidate.id,
        completed: false,
        locale,
      })
      if (item) {
        items.push(item)
        usedStepIds.add(candidate.id)
      }
    }
  }

  return items.slice(0, 3)
}

export function getNextWeekId(weekId: string): string | null {
  const index = weeks.findIndex((week) => week.id === weekId)
  if (index < 0 || index >= weeks.length - 1) return null
  return weeks[index + 1].id
}
