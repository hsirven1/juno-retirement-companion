import type { PlanSuggestion } from '../../types'
import type { CoachReply, SuggestionPill } from '../../data/coach'
import { PATH_TRANSMETTRE, THEME_TRANSMETTRE } from '../../data/paths'

export const mentoringSuggestionEn: PlanSuggestion = {
  id: 'explore-mentoring',
  title: 'Look into mentoring',
  description: 'Try one mentoring idea, without committing long term.',
  taskLabel: 'Explore a mentoring opportunity',
  priorityId: PATH_TRANSMETTRE,
}

export const suggestionPillsEn: SuggestionPill[] = [
  {
    label: 'Find a regular activity',
    message: 'I’d like to find a regular activity.',
  },
  {
    label: 'Look into mentoring',
    message: 'I’d like to look into mentoring.',
  },
  {
    label: 'Meet more people',
    message: 'I’d like to meet more people.',
  },
  {
    label: 'Find a local group',
    message: 'I’d like to find a group near me.',
  },
  {
    label: 'See my next steps',
    message: 'What are my next steps?',
  },
]

const repliesEn: Record<string, CoachReply> = {
  'i’d like to find a regular activity.': {
    content:
      'Of course. You told me you enjoy cycling, prefer small groups, and would like to get out more during the week.\n\nI have a few ideas that could suit you — and your “Staying active” journey can help you get there.',
    action: {
      label: 'See recommended activities',
      to: '/discover',
    },
  },
  'i’d like to look into mentoring.': {
    content:
      'You told me you enjoy passing on your experience. I can show you a few ways to mentor, and the organizations we’ve selected near Lyon.',
    suggestion: mentoringSuggestionEn,
    action: {
      label: 'See resources',
      to: '/discover',
    },
  },
  'i’d like to meet more people.': {
    content:
      'You already have strong relationships. What’s missing is a little more company during the week — not a packed social calendar.\n\nYour “Growing my social life” journey can help with that, one step at a time.',
    action: {
      label: 'Explore ways to meet people',
      to: '/discover',
    },
  },
  'i’d like to find a group near me.': {
    content:
      'All right. Around Lyon, Juno has already found groups connected to your areas — mentoring, activities, meeting people.\n\nI can take you to Discover.',
    action: {
      label: 'Open Discover',
      to: '/discover',
    },
  },
  'what are my next steps?': {
    content:
      'This week, your next steps come from your active journeys — mainly your rhythm and passing on your experience.\n\nThey’re on your Home page. We can pick one together.',
    action: {
      label: 'Back to my Home',
      to: '/home',
    },
  },
}

export const defaultReplyEn: CoachReply = {
  content:
    'That’s worth pausing on. From your assessment, you’re mainly moving forward on your rhythm, staying active, and passing on your experience.\n\nWhat would be most useful to you right now?',
}

function normalize(text: string) {
  return text.trim().toLowerCase().replace(/['’]/g, "'")
}

const repliesByKeyEn: Record<string, CoachReply> = Object.fromEntries(
  Object.entries(repliesEn).map(([prompt, reply]) => [
    normalize(prompt),
    reply,
  ]),
)

export function getCoachReplyEn(userText: string): CoachReply {
  return repliesByKeyEn[normalize(userText)] ?? defaultReplyEn
}

export function getContextualGreetingEn(options?: {
  initialContext?: string
  relatedPriorityId?: string
  relatedPathId?: string
  greeting?: string
  firstName?: string
}): string {
  if (options?.greeting) return options.greeting

  if (
    options?.relatedPathId === 'path-social' ||
    options?.initialContext === 'social'
  ) {
    return 'Not sure what kind of social life would suit you? We can think it through together.'
  }

  if (
    options?.relatedPathId === 'path-rythme' ||
    options?.initialContext === 'rythme'
  ) {
    return 'Would you like to think together about what could give your weeks a little structure?'
  }

  if (
    options?.relatedPathId === PATH_TRANSMETTRE ||
    options?.relatedPriorityId === THEME_TRANSMETTRE ||
    options?.initialContext === 'mentoring' ||
    options?.initialContext === 'transmettre'
  ) {
    return 'Would you like to talk about mentoring options?'
  }

  if (
    options?.initialContext === 'activity' ||
    options?.relatedPathId === 'path-actif'
  ) {
    return 'Would you like to make progress on finding a regular activity?'
  }

  const name = options?.firstName ?? 'Harold'
  return `Hello ${name}. What would you like to work on today?`
}
