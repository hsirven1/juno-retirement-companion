import type { AnswerValue, SocialPreferences } from '../../types'
import type { StepCompletionContent } from '../../data/journeyCompletions'
import { getAllSocialJourneyStepsEn } from './socialJourney.en'

const NEXT_STEP_TEASERS_EN: Record<string, string> = {
  'social-step-1':
    'We’ll look at the different shapes a social life can take in retirement.',
  'social-step-2': 'We’ll start to pin down what you’d like today.',
  'social-step-3':
    'We’ll explore what kind of get-togethers suit you best.',
  'social-step-4': 'We’ll picture a good week together, simply.',
  'social-step-5':
    'Here are a few concrete ideas that could suit you.',
  'social-step-6': 'We’ll explore what exists around you, close to home.',
  'social-step-7':
    'You’ll be able to choose a first thing to try, without committing to anything more.',
  'social-step-8':
    'We’ll take stock of what you’ve tried — whenever you feel like it.',
}

const STEP_SYNTHESIS: Record<string, string> = {
  'social-step-1': 'work-social-summary',
  'social-step-2': 'forms-summary',
  'social-step-3': 'desires-summary',
  'social-step-4': 'meeting-summary',
  'social-step-5': 'ideal-week-summary',
  'social-step-6': 'opportunity-summary',
  'social-step-7': 'resources-summary',
  'social-step-8': 'pick-summary',
}

const WORK_NEED_LABELS_EN: Record<string, string> = {
  entoure: 'being around people',
  colleagues: 'the colleagues you enjoyed',
  informal: 'the informal conversations',
  collective: 'working with others',
  team: 'being part of a team',
  'new-people': 'regularly meeting new people',
  little: 'little social connection at work',
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
  dejeuner: 'a relaxed get-together',
  activite: 'an activity',
  groupe: 'a regular group',
  sport: 'some sport',
  projet: 'a project',
  sortie: 'an outing',
  benevolat: 'some volunteering',
  famille: 'time with family',
}

const OPPORTUNITY_TAGS_EN: Record<string, string> = {
  'activite-groupe': 'Group activity',
  atelier: 'Workshop',
}

type SummaryResult = {
  paragraphs: string[]
  tags?: string[]
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Keeps a sentence readable whether or not it follows a lead-in clause. */
function sentence(lead: string, body: string) {
  return lead ? `${lead}${body}` : capitalize(body)
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

/**
 * English counterpart of the synthesis summaries used on step completion
 * screens. Only the `*-summary` ids reachable from `STEP_SYNTHESIS` are
 * covered; anything else falls back to a neutral closing line.
 */
function getCompletionSynthesisEn(
  synthesisId: string,
  prefs: SocialPreferences,
  stepResponses: Record<string, AnswerValue>,
): SummaryResult {
  switch (synthesisId) {
    case 'work-social-summary': {
      const needs = workNeeds(stepResponses, prefs)
      if (needs.includes('little')) {
        return {
          paragraphs: [
            'Work didn’t seem to bring much to your social life.',
            'We’ll keep that in mind as we go.',
          ],
          tags: ['Exploration'],
        }
      }
      const labels = needs.map((id) => WORK_NEED_LABELS_EN[id]).filter(Boolean)
      const focus =
        labels.length >= 2
          ? `${labels[0]} and ${labels[1]}`
          : (labels[0] ?? 'connections that mattered to you')
      return {
        paragraphs: [
          `${capitalize(focus)} seem${labels.length > 1 ? '' : 's'} to have mattered in your working life.`,
          'From here, we can look for ways to find moments like these again, in a way that feels like you.',
        ],
        tags: needs
          .map((id) => WORK_TAGS_EN[id])
          .filter(Boolean)
          .slice(0, 3),
      }
    }

    case 'forms-summary': {
      const picked =
        (stepResponses.socialFormInterests as string[] | undefined) ??
        prefs.socialFormInterests
      if (picked.length === 0) {
        return {
          paragraphs: [
            'You’re taking the time to explore — that’s a good way to start.',
          ],
          tags: ['Exploration'],
        }
      }
      const labels = picked.map((id) => FORM_LABELS_EN[id]).filter(Boolean)
      return {
        paragraphs: [
          `You’re drawn to ${labels.join(', ')}.`,
          'We can refine that over the next few steps.',
        ],
        tags: labels.map(capitalize),
      }
    }

    case 'desires-summary': {
      const work = workNeeds(stepResponses, prefs)
      const lead = work.includes('informal')
        ? 'You told us you enjoy informal conversation — '
        : ''
      const wantsNew =
        prefs.goals.includes('nouvelles') ||
        prefs.connectionPreference === 'new'
      const wantsExisting =
        prefs.goals.includes('proches') ||
        prefs.connectionPreference === 'existing'
      if (wantsNew && wantsExisting) {
        return {
          paragraphs: [
            sentence(
              lead,
              'you’re looking for a balance between deepening what you already have and widening your circle a little.',
            ),
            'We’ll keep that in mind.',
          ],
          tags: ['Balance', 'People close to you', 'New encounters'],
        }
      }
      if (wantsNew) {
        return {
          paragraphs: [
            sentence(
              lead,
              'you’d mainly like to meet new people, at your own pace.',
            ),
          ],
          tags: ['New encounters'],
        }
      }
      if (wantsExisting) {
        return {
          paragraphs: [
            sentence(
              lead,
              'you’d mainly like to see more of the people you already know.',
            ),
          ],
          tags: ['People close to you'],
        }
      }
      return {
        paragraphs: [
          'You’re moving forward without pressure — a good way to get clear on what would suit you.',
        ],
        tags: ['Exploration'],
      }
    }

    case 'meeting-summary': {
      const invitation = String(
        stepResponses.scenarioInvitation ?? prefs.scenarioInvitation ?? '',
      )
      const size =
        invitation === 'cafe' || invitation === 'benevolat'
          ? 'small groups'
          : invitation === 'atelier'
            ? 'a medium-sized group'
            : prefs.preferredGroupSize === 'small'
              ? 'small groups'
              : 'a mix of formats'
      const freq =
        prefs.preferredFrequency === 'regular' ||
        prefs.preferredFrequency === 'more'
          ? 'regular get-togethers'
          : 'more occasional ones'
      return {
        paragraphs: [
          `You seem to prefer ${size} and ${freq}.`,
          'That helps us picture concrete ideas that could suit you.',
        ],
        tags: [
          size.includes('small') ? 'Small group' : 'Group',
          prefs.preferredContexts.includes('activity')
            ? 'Activity'
            : 'Easy company',
        ].filter(Boolean),
      }
    }

    case 'ideal-week-summary': {
      const activities = prefs.idealWeekActivities
        .map((id) => ACTIVITY_LABELS_EN[id])
        .filter(Boolean)
      const bullets =
        activities.length > 0
          ? activities.slice(0, 3)
          : ['a few moments with others', 'without overloading your week']
      return {
        paragraphs: [
          'This isn’t a programme to follow. Just a direction, and it can change.',
        ],
        tags: bullets.slice(0, 2).map(capitalize),
      }
    }

    case 'opportunity-summary':
      return {
        paragraphs: [
          'Thank you for telling us. We’ll take it into account in what we suggest next.',
        ],
        tags: Object.entries(prefs.opportunityTypeFeedback)
          .filter(([, value]) => value === 'yes')
          .map(([id]) => OPPORTUNITY_TAGS_EN[id] ?? 'Local group')
          .slice(0, 3),
      }

    case 'resources-summary':
      return {
        paragraphs: [
          'You’ve looked through a few concrete ideas. You can come back to them whenever you like.',
        ],
        tags: ['Lille', 'Exploration'],
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

export function getStepCompletionContentEn(
  stepId: string,
  prefs: SocialPreferences,
  responses: Record<string, AnswerValue>,
): StepCompletionContent {
  const steps = getAllSocialJourneyStepsEn()
  const stepIndex = steps.findIndex((s) => s.id === stepId)
  const step = steps[stepIndex]
  const nextStep = steps[stepIndex + 1]

  const synthesisId = STEP_SYNTHESIS[stepId] ?? 'work-social-summary'
  const synthesis = getCompletionSynthesisEn(synthesisId, prefs, responses)

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

export { NEXT_STEP_TEASERS_EN }
