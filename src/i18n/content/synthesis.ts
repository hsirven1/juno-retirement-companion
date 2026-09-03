import type { AnswerValue, SocialPreferences } from '../../types'
import type { Locale } from '../types'
import { getJourneySynthesis as getJourneySynthesisFr } from '../../lib/journeySynthesis'
import {
  getJourneySynthesisEn,
  hasEnglishSynthesis,
} from './journeySynthesis.en'
import { buildSocialProfileSummary as buildSocialProfileSummaryFr } from '../../lib/journeySynthesis'

export function getJourneySynthesis(
  synthesisId: string,
  prefs: SocialPreferences,
  responses: Record<string, AnswerValue>,
  locale: Locale,
) {
  if (locale === 'en') {
    if (hasEnglishSynthesis(synthesisId)) {
      return getJourneySynthesisEn(synthesisId, prefs, responses)
    }
    // Prefer French content over a weak English placeholder for uncovered ids
    return getJourneySynthesisFr(synthesisId, prefs, responses)
  }
  return getJourneySynthesisFr(synthesisId, prefs, responses)
}

export function buildSocialProfileSummary(
  prefs: SocialPreferences,
  locale: Locale,
): string[] {
  if (locale === 'en') {
    // Lightweight English summary from preference IDs
    const lines: string[] = []
    if (prefs.preferredGroupSize === 'small') {
      lines.push('You tend to prefer smaller groups.')
    } else if (prefs.preferredGroupSize === 'group') {
      lines.push('You are comfortable in larger groups.')
    }
    if (
      prefs.connectionPreference === 'new' ||
      prefs.connectionPreference === 'both'
    ) {
      lines.push('You would like to meet new people.')
    } else if (prefs.connectionPreference === 'existing') {
      lines.push('You prefer deepening existing connections.')
    }
    if (prefs.preferredFrequency === 'regular' || prefs.preferredFrequency === 'more') {
      lines.push('A fairly regular rhythm suits you.')
    } else if (prefs.preferredFrequency === 'occasional') {
      lines.push('Occasional get-togethers suit you better than a fixed schedule.')
    }
    if (lines.length === 0) {
      return buildSocialProfileSummaryFr(prefs)
    }
    return lines
  }
  return buildSocialProfileSummaryFr(prefs)
}
