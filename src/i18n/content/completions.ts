import type { AnswerValue, SocialPreferences } from '../../types'
import type { Locale } from '../types'
import {
  getStepCompletionContent as getStepCompletionContentFr,
  type StepCompletionContent,
} from '../../data/journeyCompletions'
import { getStepCompletionContentEn } from './journeyCompletions.en'

export type { StepCompletionContent }

export function getStepCompletionContent(
  stepId: string,
  prefs: SocialPreferences,
  responses: Record<string, AnswerValue>,
  locale: Locale,
): StepCompletionContent {
  return locale === 'en'
    ? getStepCompletionContentEn(stepId, prefs, responses)
    : getStepCompletionContentFr(stepId, prefs, responses)
}
