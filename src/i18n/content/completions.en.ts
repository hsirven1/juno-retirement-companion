import type { AnswerValue, SocialPreferences } from '../../types'
import type { StepCompletionContent } from '../../data/journeyCompletions'
import { STEP_SYNTHESIS } from '../../data/journeyCompletions'
import { getAllSocialJourneyStepsEn } from './socialJourney.en'
import { getJourneySynthesisEn } from './journeySynthesis.en'

export const NEXT_STEP_TEASERS_EN: Record<string, string> = {
  'social-step-1':
    'We’ll look at the different shapes a social life can take in retirement.',
  'social-step-2':
    'We’ll start to work out what you’d like for yourself today.',
  'social-step-3':
    'We’ll explore what kind of get-togethers feel most like you.',
  'social-step-4': 'Together, we’ll picture a good week, simply.',
  'social-step-5':
    'Here are a few practical ideas that could suit you.',
  'social-step-6': 'We’ll look at what exists around you, close to home.',
  'social-step-7':
    'You’ll be able to choose a first thing to try, without committing further.',
  'social-step-8':
    'We’ll take stock of what you’ve tried — whenever you’re ready.',
}

export function getStepCompletionContentEn(
  stepId: string,
  prefs: SocialPreferences,
  responses: Record<string, AnswerValue>,
): StepCompletionContent {
  const steps = getAllSocialJourneyStepsEn()
  const step = steps.find((s) => s.id === stepId)
  const synthesisId = STEP_SYNTHESIS[stepId] ?? 'work-social-summary'
  const synthesis = getJourneySynthesisEn(synthesisId, prefs, responses)

  const stepIndex = steps.findIndex((s) => s.id === stepId)
  const nextStep = steps[stepIndex + 1]

  return {
    accomplishment: step?.title ?? 'This step',
    junoRetains: synthesis.paragraphs.join(' '),
    tags: synthesis.tags ?? [],
    nextTime:
      NEXT_STEP_TEASERS_EN[stepId] ??
      (nextStep
        ? `Next step: ${nextStep.title.toLowerCase()}.`
        : 'We can carry on at your own pace.'),
  }
}
