import type {
  AnswerValue,
  CustomWeeklyStep,
  JourneyStepProgress,
  PathProgress,
  RetirementProfile,
  SocialFeedback,
  SocialPreferences,
} from '../types'
import { guidedPaths, haroldActiveThemeIds, PATH_SOCIAL } from '../data/paths'
import { emptySocialPreferences } from '../data/socialLife'
import { profile as baseProfile } from '../data/profile'
import { SOCIAL_STEP_ORDER } from '../data/socialJourney'
import type { Locale } from '../i18n/types'
import { DEFAULT_LOCALE, isLocale } from '../i18n/types'

const STORAGE_KEY = 'juno-prototype-journey-v2'

export interface PersistedState {
  activeThemeIds: string[]
  pathProgress: Record<string, PathProgress>
  postponedStepIds: string[]
  deferredToWeek: Record<string, string[]>
  completedWeeklyStepIds: string[]
  profileOverrides: Partial<
    Pick<RetirementProfile, 'interests' | 'preferences' | 'seeking' | 'learnings'>
  >
  socialPreferences: SocialPreferences
  socialFeedback: SocialFeedback
  customWeeklySteps: CustomWeeklyStep[]
  /** Per micro-step screen progress (resume on close) */
  journeyStepProgress: Record<string, JourneyStepProgress>
  /** Which step is open in the guided overlay */
  activeJourneyStepId: string | null
  /** Mock current week index for prototype testing (0–7) */
  mockCurrentWeekIndex: number
  /** UI language preference — does not affect journey progress */
  locale: Locale
}

function emptyProgress(): PathProgress {
  return {
    status: 'not_started',
    completedStepIds: [],
    currentStepId: null,
    responses: {},
  }
}

export function createInitialPersistedState(): PersistedState {
  const pathProgress: Record<string, PathProgress> = {}
  for (const path of guidedPaths) {
    pathProgress[path.id] = emptyProgress()
  }

  return {
    activeThemeIds: [...haroldActiveThemeIds],
    pathProgress,
    postponedStepIds: [],
    deferredToWeek: {},
    completedWeeklyStepIds: [],
    profileOverrides: {},
    socialPreferences: emptySocialPreferences(),
    socialFeedback: {
      interestedIds: [],
      dismissedIds: [],
      laterIds: [],
      dismissReasons: {},
    },
    customWeeklySteps: [],
    journeyStepProgress: {},
    activeJourneyStepId: null,
    mockCurrentWeekIndex: 0,
    locale: DEFAULT_LOCALE,
  }
}

export function loadPersistedState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialPersistedState()
    const parsed = JSON.parse(raw) as PersistedState
    const base = createInitialPersistedState()
    return {
      ...base,
      ...parsed,
      pathProgress: { ...base.pathProgress, ...parsed.pathProgress },
      socialPreferences: {
        ...emptySocialPreferences(),
        ...parsed.socialPreferences,
      },
      socialFeedback: {
        ...base.socialFeedback,
        ...parsed.socialFeedback,
      },
      customWeeklySteps: parsed.customWeeklySteps ?? [],
      journeyStepProgress: parsed.journeyStepProgress ?? {},
      activeJourneyStepId: parsed.activeJourneyStepId ?? null,
      mockCurrentWeekIndex: parsed.mockCurrentWeekIndex ?? 0,
      locale: isLocale(parsed.locale) ? parsed.locale : DEFAULT_LOCALE,
    }
  } catch {
    return createInitialPersistedState()
  }
}

export function savePersistedState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

export function mergeProfile(
  overrides: PersistedState['profileOverrides'],
): RetirementProfile {
  return {
    ...baseProfile,
    interests: overrides.interests ?? baseProfile.interests,
    preferences: overrides.preferences ?? baseProfile.preferences,
    seeking: overrides.seeking ?? baseProfile.seeking,
    learnings: overrides.learnings ?? baseProfile.learnings,
  }
}

export function applyStepResponseToProfile(
  overrides: PersistedState['profileOverrides'],
  keys: Array<'preferences' | 'interests' | 'seeking'> | undefined,
  _response: AnswerValue,
  optionLabels: string[],
): PersistedState['profileOverrides'] {
  if (!keys?.length || optionLabels.length === 0) return overrides
  const next = { ...overrides }
  for (const key of keys) {
    const current = next[key] ?? baseProfile[key]
    const merged = [...current]
    for (const label of optionLabels) {
      if (!merged.includes(label)) merged.push(label)
    }
    next[key] = merged
  }
  return next
}

export function syncJourneyStepCompletion(
  progress: PathProgress | undefined,
  stepId: string,
  responses: Record<string, AnswerValue>,
): PathProgress {
  const previous = progress ?? emptyProgress()
  const completedStepIds = previous.completedStepIds.includes(stepId)
    ? previous.completedStepIds
    : [...previous.completedStepIds, stepId]

  const stepIndex = SOCIAL_STEP_ORDER.indexOf(stepId)
  const nextStepId = SOCIAL_STEP_ORDER[stepIndex + 1] ?? null
  const allDone = completedStepIds.length >= SOCIAL_STEP_ORDER.length

  return {
    status: allDone ? 'in_progress' : 'in_progress',
    completedStepIds,
    currentStepId: allDone ? null : nextStepId,
    responses: {
      ...previous.responses,
      [stepId]: responses as unknown as AnswerValue,
    },
  }
}

export { PATH_SOCIAL }
