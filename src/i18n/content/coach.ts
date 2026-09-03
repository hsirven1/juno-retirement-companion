import type { Locale } from '../types'
import type { CoachReply, SuggestionPill } from '../../data/coach'
import {
  suggestionPills as suggestionPillsFr,
  getCoachReply as getCoachReplyFr,
  getContextualGreeting as getContextualGreetingFr,
  createMessage,
} from '../../data/coach'
import {
  suggestionPillsEn,
  getCoachReplyEn,
  getContextualGreetingEn,
} from './coach.en'

export type { CoachReply, SuggestionPill }
export { createMessage }

export interface CoachGreetingOptions {
  initialContext?: string
  relatedPriorityId?: string
  relatedPathId?: string
  greeting?: string
  firstName?: string
}

export function getSuggestionPills(locale: Locale): SuggestionPill[] {
  return locale === 'en' ? suggestionPillsEn : suggestionPillsFr
}

export function getCoachReply(userText: string, locale: Locale): CoachReply {
  return locale === 'en' ? getCoachReplyEn(userText) : getCoachReplyFr(userText)
}

export function getContextualGreeting(
  options: CoachGreetingOptions | undefined,
  locale: Locale,
): string {
  return locale === 'en'
    ? getContextualGreetingEn(options)
    : getContextualGreetingFr(options)
}
