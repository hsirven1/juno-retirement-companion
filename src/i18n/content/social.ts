import type { JourneyPhase, JourneyStep, ThemeJourney } from '../../types'
import type { Locale } from '../types'
import {
  socialJourney as socialJourneyFr,
  journeyPhaseLabels as journeyPhaseLabelsFr,
  getSocialJourneyStep as getSocialJourneyStepFr,
  getAllSocialJourneySteps as getAllSocialJourneyStepsFr,
  SOCIAL_STEP_ORDER,
  SOCIAL_JOURNEY_ID,
} from '../../data/socialJourney'
import {
  socialJourneyEn,
  journeyPhaseLabelsEn,
  getSocialJourneyStepEn,
  getAllSocialJourneyStepsEn,
} from './socialJourney.en'

export { SOCIAL_STEP_ORDER, SOCIAL_JOURNEY_ID }

export function getSocialJourney(locale: Locale): ThemeJourney {
  return locale === 'en' ? socialJourneyEn : socialJourneyFr
}

export function getJourneyPhaseLabels(
  locale: Locale,
): Record<JourneyPhase['type'], string> {
  return locale === 'en' ? journeyPhaseLabelsEn : journeyPhaseLabelsFr
}

export function getSocialJourneyStep(
  stepId: string,
  locale: Locale,
): JourneyStep | undefined {
  return locale === 'en'
    ? getSocialJourneyStepEn(stepId)
    : getSocialJourneyStepFr(stepId)
}

export function getAllSocialJourneySteps(locale: Locale): JourneyStep[] {
  return locale === 'en'
    ? getAllSocialJourneyStepsEn()
    : getAllSocialJourneyStepsFr()
}
