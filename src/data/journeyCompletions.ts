import type { AnswerValue, SocialPreferences } from '../types'
import { getAllSocialJourneySteps } from './socialJourney'
import { getJourneySynthesis } from '../lib/journeySynthesis'

export interface StepCompletionContent {
  accomplishment: string
  junoRetains: string
  tags: string[]
  nextTime: string
}

const NEXT_STEP_TEASERS: Record<string, string> = {
  'social-step-1':
    'Nous regarderons les différentes formes que peut prendre une vie sociale à la retraite.',
  'social-step-2':
    'Nous commencerons à identifier ce dont vous auriez envie aujourd’hui.',
  'social-step-3':
    'Nous explorerons quel type de rencontres vous ressemble le plus.',
  'social-step-4':
    'Nous imaginerons ensemble une bonne semaine, simplement.',
  'social-step-5':
    'Juno vous proposera quelques pistes concrètes qui pourraient vous correspondre.',
  'social-step-6':
    'Nous explorerons ce qui existe autour de vous, près de chez vous.',
  'social-step-7':
    'Vous pourrez choisir une première chose à essayer, sans vous engager davantage.',
  'social-step-8':
    'Nous ferons le point sur ce que vous aurez essayé — quand vous le souhaiterez.',
}

export const STEP_SYNTHESIS: Record<string, string> = {
  'social-step-1': 'work-social-summary',
  'social-step-2': 'forms-summary',
  'social-step-3': 'desires-summary',
  'social-step-4': 'meeting-summary',
  'social-step-5': 'ideal-week-summary',
  'social-step-6': 'opportunity-summary',
  'social-step-7': 'resources-summary',
  'social-step-8': 'pick-summary',
}

export function getStepCompletionContent(
  stepId: string,
  prefs: SocialPreferences,
  responses: Record<string, AnswerValue>,
): StepCompletionContent {
  const step = getAllSocialJourneySteps().find((s) => s.id === stepId)
  const synthesisId = STEP_SYNTHESIS[stepId] ?? 'work-social-summary'
  const synthesis = getJourneySynthesis(synthesisId, prefs, responses)

  const stepIndex = getAllSocialJourneySteps().findIndex((s) => s.id === stepId)
  const nextStep = getAllSocialJourneySteps()[stepIndex + 1]

  return {
    accomplishment: step?.title ?? 'Cette étape',
    junoRetains: synthesis.paragraphs.join(' '),
    tags: synthesis.tags ?? [],
    nextTime:
      NEXT_STEP_TEASERS[stepId] ??
      (nextStep
        ? `Prochaine étape : ${nextStep.title.toLowerCase()}.`
        : 'On pourra continuer à votre rythme.'),
  }
}
