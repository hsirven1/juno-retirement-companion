import type { Locale } from '../i18n/types'
import type { Mentor, MentorLocalizedCopy } from '../types'

export function getMentorCopy(
  mentor: Mentor,
  locale: Locale,
): MentorLocalizedCopy {
  return mentor.copy[locale] ?? mentor.copy.fr
}

export function mentorYearsLabel(
  years: number,
  locale: Locale,
): string {
  if (locale === 'en') {
    return years === 1 ? 'Retired for 1 year' : `Retired for ${years} years`
  }
  return years === 1
    ? 'À la retraite depuis 1 an'
    : `À la retraite depuis ${years} ans`
}
