import type { Locale } from '../i18n/types'
import type { Mentor, MentorMatchingProfile } from '../types'

/** Lightweight opening line shown in the Home conversation preview. */
export function buildMentorHomePreview(
  _mentor: Mentor,
  userFirstName: string,
  locale: Locale,
  matching?: MentorMatchingProfile | null,
): string {
  const you = userFirstName.trim() || (locale === 'en' ? 'there' : 'vous')
  const wantsSocial =
    matching?.wantMoreOf.includes('social_contact') ||
    matching?.ambitions.includes('meet_people') ||
    matching?.helpTopics.includes('social') ||
    matching?.socialNetworkStrength === 'few_around' ||
    matching?.socialNetworkStrength === 'often_alone'

  const wantsStructure =
    matching?.needForStructure === 'high' ||
    matching?.wantMoreOf.includes('structure') ||
    matching?.helpTopics.includes('structure')

  const joiningHard =
    matching?.comfortDoingThingsAlone === 'low' ||
    matching?.challenges.includes('joining_alone')

  if (locale === 'en') {
    if (wantsSocial && joiningHard) {
      return `Hello ${you}. You wanted more social contact. How do you feel about trying an activity where you don’t know anyone yet?`
    }
    if (wantsStructure) {
      return `Hello ${you}. You seemed to want a steadier rhythm. Want to look together at one simple thing you could keep each week?`
    }
    if (wantsSocial) {
      return `Hello ${you}. You wanted to rebuild more social life. Where would you like to start — something gentle, or something a bit more lively?`
    }
    return `Hello ${you}. I’m glad we’re connected. What would feel useful to talk about first?`
  }

  if (wantsSocial && joiningHard) {
    return `Bonjour ${you}. Vous aviez envie de retrouver davantage de contacts sociaux. Comment vous vous sentez à l’idée d’essayer une activité où vous ne connaissez personne ?`
  }
  if (wantsStructure) {
    return `Bonjour ${you}. Vous sembliez chercher un rythme un peu plus structuré. On regarde ensemble une chose simple à garder chaque semaine ?`
  }
  if (wantsSocial) {
    return `Bonjour ${you}. Vous aviez envie de retrouver davantage de vie sociale. Par où aimeriez-vous commencer — quelque chose de doux, ou un peu plus vivant ?`
  }
  return `Bonjour ${you}. Content·e qu’on soit en contact. De quoi aimeriez-vous parler en premier ?`
}
