import type { AnswerValue, SocialPreferences } from '../../types'

/**
 * English counterparts for the synthesis blocks used by step completions.
 * Only the `*-summary` ids (and their aliases) are covered for now; other
 * synthesis screens still fall back to the French builder.
 */

const WORK_NEED_LABELS_EN: Record<string, string> = {
  entoure: 'being around people',
  colleagues: 'the colleagues you enjoyed',
  informal: 'informal conversations',
  collective: 'working with others',
  team: 'being part of a team',
  'new-people': 'regularly meeting new people',
  little: 'little social contact at work',
}

const WORK_TAGS_EN: Record<string, string> = {
  entoure: 'Being around people',
  colleagues: 'Colleagues',
  informal: 'Informal conversation',
  collective: 'Working together',
  team: 'Team spirit',
  'new-people': 'New encounters',
}

const FORM_LABELS_EN: Record<string, string> = {
  proches: 'the people close to you',
  activites: 'shared activities',
  nouvelles: 'new encounters',
  engager: 'getting involved in a project',
}

const ACTIVITY_LABELS_EN: Record<string, string> = {
  dejeuner: 'a friendly get-together',
  activite: 'an activity',
  groupe: 'a regular group',
  sport: 'some sport',
  projet: 'a project',
  sortie: 'an outing',
  benevolat: 'some volunteering',
  famille: 'time with family',
}

export type SynthesisResult = {
  title?: string
  paragraphs: string[]
  bullets?: string[]
  tags?: string[]
}

export const EN_SYNTHESIS_IDS = [
  'work-social',
  'work-social-summary',
  'forms-exploration',
  'forms-summary',
  'desires',
  'desires-summary',
  'meeting-style',
  'meeting-summary',
  'ideal-week',
  'ideal-week-summary',
  'opportunity-summary',
  'resources-summary',
  'pick-summary',
] as const

export function hasEnglishSynthesis(synthesisId: string): boolean {
  return (EN_SYNTHESIS_IDS as readonly string[]).includes(synthesisId)
}

function workNeeds(
  stepResponses: Record<string, AnswerValue>,
  prefs: SocialPreferences,
): string[] {
  return (
    (stepResponses.previousWorkSocialNeeds as string[] | undefined) ??
    prefs.previousWorkSocialNeeds
  )
}

function workTags(needs: string[]): string[] {
  return needs
    .map((id) => WORK_TAGS_EN[id])
    .filter(Boolean)
    .slice(0, 3)
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function getJourneySynthesisEn(
  synthesisId: string,
  prefs: SocialPreferences,
  stepResponses: Record<string, AnswerValue>,
): SynthesisResult {
  switch (synthesisId) {
    case 'work-social':
    case 'work-social-summary': {
      const needs = workNeeds(stepResponses, prefs)
      if (needs.includes('little')) {
        return {
          paragraphs: [
            'Work didn’t seem to bring much to your social life.',
            'We’ll keep that in mind as we go.',
          ],
          tags: ['Exploring'],
        }
      }
      const labels = needs.map((id) => WORK_NEED_LABELS_EN[id]).filter(Boolean)
      const focus =
        labels.length >= 2
          ? `${labels[0]} and ${labels[1]}`
          : labels[0] ?? 'connections that mattered to you'
      return {
        title:
          synthesisId === 'work-social' ? 'Here’s what stands out' : undefined,
        paragraphs: [
          `${capitalize(focus)} seem${labels.length > 1 ? '' : 's'} to have mattered in your working life — **${focus}**.`,
          'From here, we can look for ways to find that kind of moment again, in a way that suits you.',
        ],
        tags: workTags(needs),
      }
    }

    case 'forms-exploration':
    case 'forms-summary': {
      const picked =
        (stepResponses.socialFormInterests as string[] | undefined) ??
        prefs.socialFormInterests
      if (picked.length === 0) {
        return {
          paragraphs: [
            'You’re taking the time to explore — that’s a good way to start.',
          ],
          tags: ['Exploring'],
        }
      }
      const labels = picked.map((id) => FORM_LABELS_EN[id]).filter(Boolean)
      return {
        paragraphs: [
          `You seem drawn to **${labels.join(', ')}**.`,
          'We can refine that over the next few steps.',
        ],
        tags: labels.map(capitalize),
      }
    }

    case 'desires':
    case 'desires-summary': {
      const work = workNeeds(stepResponses, prefs)
      const goals =
        (stepResponses.goals as string[] | undefined) ?? prefs.goals
      const connection =
        (stepResponses.connectionPreference as string | undefined) ??
        prefs.connectionPreference
      const intro = work.includes('informal')
        ? 'You mentioned enjoying informal conversation — '
        : ''
      const wantsNew =
        goals.includes('nouvelles') || connection === 'new'
      const wantsExisting =
        goals.includes('proches') || connection === 'existing'
      const wantsActivity = goals.includes('activite')
      if (wantsNew && wantsActivity) {
        return {
          paragraphs: [
            `${intro}you seem to prefer meeting **new people** around a **concrete activity**, rather than in large groups.`,
          ],
          tags: ['New encounters', 'Activity'],
        }
      }
      if (wantsNew && wantsExisting) {
        return {
          paragraphs: [
            `${intro}for now, you’re looking for a **balance** between deepening what you already have and widening your circle a little.`,
          ],
          tags: ['Balance', 'People close to you', 'New encounters'],
        }
      }
      if (wantsNew) {
        return {
          paragraphs: [
            `${intro}you seem to mainly want to **meet new people**, at your own pace.`,
          ],
          tags: ['New encounters'],
        }
      }
      if (wantsExisting) {
        return {
          paragraphs: [
            `${intro}you seem to mainly want to see more of the **people you already know**.`,
          ],
          tags: ['People close to you'],
        }
      }
      return {
        paragraphs: [
          'For now, you’re moving forward without pressure — a good way to work out what would suit you.',
        ],
        tags: ['Exploring'],
      }
    }

    case 'meeting-style':
    case 'meeting-summary': {
      const invitation = String(
        stepResponses.scenarioInvitation ?? prefs.scenarioInvitation ?? '',
      )
      const why =
        (stepResponses.scenarioWhy as string[] | undefined) ?? prefs.scenarioWhy
      const frequency =
        (stepResponses.preferredFrequency as string | undefined) ??
        prefs.preferredFrequency
      const size =
        invitation === 'cafe' || invitation === 'benevolat'
          ? 'small groups'
          : invitation === 'atelier'
            ? 'a mid-sized group'
            : prefs.preferredGroupSize === 'small'
              ? 'small groups'
              : 'a range of formats'
      const freq =
        frequency === 'regular' || frequency === 'more'
          ? 'regular get-togethers'
          : 'more flexible occasions'
      const activityLed =
        why.includes('activite') ||
        prefs.preferredContexts.includes('activity') ||
        invitation === 'atelier'
      const newPeople = why.includes('decouvrir')
      let main = `You seem to prefer **${size}** and **${freq}**.`
      if (activityLed && newPeople) {
        main =
          'You seem to prefer meeting **new people** around a **concrete activity**, rather than in large groups.'
      } else if (activityLed) {
        main = `You seem to prefer **${size}** around a **concrete activity**, with **${freq}**.`
      }
      return {
        paragraphs: [
          main,
          'That helps us picture practical ideas that could suit you.',
        ],
        tags: [
          size.includes('small') ? 'Small group' : 'Group',
          activityLed ? 'Activity' : 'Good company',
          ...(newPeople ? ['New encounters'] : []),
        ].filter(Boolean),
      }
    }

    case 'ideal-week':
    case 'ideal-week-summary': {
      const activityIds =
        (stepResponses.idealWeekActivities as string[] | undefined) ??
        prefs.idealWeekActivities
      const activities = activityIds
        .map((id) => ACTIVITY_LABELS_EN[id])
        .filter(Boolean)
      const bullets =
        activities.length > 0
          ? activities.slice(0, 3)
          : ['a few moments with others', 'without overfilling the week']
      return {
        title: 'Your balance could look something like…',
        bullets,
        paragraphs:
          activities.length > 0
            ? [
                `For now, what stands out: **${activities.slice(0, 2).join('** and **')}**.`,
                'This isn’t a schedule to follow — just a direction, and it can change.',
              ]
            : [
                'This isn’t a schedule to follow. Just a direction, and it can change.',
              ],
        tags: bullets.slice(0, 2),
      }
    }

    case 'opportunity-summary':
      return {
        paragraphs: [
          'Thank you for that. Juno will take it into account for the next suggestions.',
        ],
        tags: Object.entries(prefs.opportunityTypeFeedback)
          .filter(([, v]) => v === 'yes')
          .map(([id]) =>
            id === 'activite-groupe'
              ? 'Group activity'
              : id === 'atelier'
                ? 'Workshop'
                : 'Local organization',
          )
          .slice(0, 3),
      }

    case 'resources-summary':
      return {
        paragraphs: [
          'You’ve looked through a few practical ideas. You can come back to them whenever you like.',
        ],
        tags: ['Lille', 'Exploring'],
      }

    case 'pick-summary':
      return {
        paragraphs: prefs.selectedActionLabel
          ? [`Next action: ${prefs.selectedActionLabel}`]
          : ['You’ve chosen a first idea to explore.'],
        tags: ['First step'],
      }

    default:
      return {
        paragraphs: ['That’s it for this step.'],
      }
  }
}
