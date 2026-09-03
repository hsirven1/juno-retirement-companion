import type { AnswerValue, SocialPreferences } from '../types'
import { getSocialJourneyStep } from '../data/socialJourney'

function mapScenarioToPreferences(
  invitation: string,
  why: string[],
): Partial<SocialPreferences> {
  const groupSize =
    invitation === 'cafe' || invitation === 'benevolat'
      ? 'small'
      : invitation === 'atelier'
        ? 'group'
        : invitation === 'sortie'
          ? 'group'
          : null

  const contexts: string[] = []
  if (why.includes('activite')) contexts.push('activity')
  if (why.includes('utile')) contexts.push('project')
  if (why.includes('detendu')) contexts.push('together')
  if (why.includes('decouvrir')) contexts.push('activity')
  if (contexts.length === 0 && invitation === 'benevolat') contexts.push('project')
  if (contexts.length === 0 && invitation === 'atelier') contexts.push('activity')

  return {
    preferredGroupSize: groupSize,
    preferredContexts: contexts,
    preferredContext: contexts[0] ?? null,
  }
}

export function applyStepResponsesToPreferences(
  prefs: SocialPreferences,
  _stepId: string,
  responses: Record<string, AnswerValue>,
): SocialPreferences {
  const next = { ...prefs }

  if (responses.previousWorkSocialNeeds !== undefined) {
    next.previousWorkSocialNeeds = Array.isArray(
      responses.previousWorkSocialNeeds,
    )
      ? (responses.previousWorkSocialNeeds as string[])
      : []
  }
  if (responses.workSocialChange !== undefined) {
    next.workSocialChange = String(responses.workSocialChange)
  }
  if (responses.socialFormInterests !== undefined) {
    next.socialFormInterests = Array.isArray(responses.socialFormInterests)
      ? (responses.socialFormInterests as string[])
      : []
  }
  if (responses.goals !== undefined) {
    next.goals = Array.isArray(responses.goals)
      ? (responses.goals as string[])
      : []
  }
  if (responses.connectionPreference !== undefined) {
    next.connectionPreference = String(responses.connectionPreference)
  }
  if (responses.scenarioInvitation !== undefined) {
    next.scenarioInvitation = String(responses.scenarioInvitation)
    const why = (responses.scenarioWhy as string[] | undefined) ?? next.scenarioWhy
    Object.assign(next, mapScenarioToPreferences(String(responses.scenarioInvitation), why))
  }
  if (responses.scenarioWhy !== undefined) {
    next.scenarioWhy = Array.isArray(responses.scenarioWhy)
      ? (responses.scenarioWhy as string[])
      : []
    if (next.scenarioInvitation) {
      Object.assign(next, mapScenarioToPreferences(next.scenarioInvitation, next.scenarioWhy))
    }
  }
  if (responses.preferredGroupSize !== undefined) {
    next.preferredGroupSize = String(responses.preferredGroupSize)
  }
  if (responses.preferredContexts !== undefined) {
    const contexts = Array.isArray(responses.preferredContexts)
      ? (responses.preferredContexts as string[])
      : []
    next.preferredContexts = contexts
    next.preferredContext = contexts[0] ?? null
  }
  if (responses.preferredFrequency !== undefined) {
    next.preferredFrequency = String(responses.preferredFrequency)
  }
  if (responses.idealWeekMoments !== undefined) {
    next.idealWeekMoments = String(responses.idealWeekMoments)
  }
  if (responses.idealWeekActivities !== undefined) {
    next.idealWeekActivities = Array.isArray(responses.idealWeekActivities)
      ? (responses.idealWeekActivities as string[])
      : []
  }
  if (responses.opportunityTypeFeedback !== undefined) {
    const raw = responses.opportunityTypeFeedback
    if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
      next.opportunityTypeFeedback = raw as Record<string, 'yes' | 'no'>
    }
  }
  if (responses.selectedResourceId !== undefined) {
    next.selectedResourceId = String(responses.selectedResourceId)
  }
  if (responses.selectedActionLabel !== undefined) {
    next.selectedActionLabel = String(responses.selectedActionLabel)
  }

  return next
}

export function mergeScreenResponse(
  current: Record<string, AnswerValue>,
  responseKey: string,
  value: AnswerValue,
): Record<string, AnswerValue> {
  return { ...current, [responseKey]: value }
}

export function getStepScreenCount(stepId: string): number {
  return getSocialJourneyStep(stepId)?.screens.length ?? 0
}
