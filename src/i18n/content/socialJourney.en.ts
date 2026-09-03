import type { JourneyPhase, JourneyStep, ThemeJourney } from '../../types'
import { PATH_SOCIAL, THEME_SOCIAL } from '../../data/paths'
import { SOCIAL_JOURNEY_ID } from '../../data/socialJourney'

export { SOCIAL_JOURNEY_ID }

export const journeyPhaseLabelsEn: Record<JourneyPhase['type'], string> = {
  discover: 'Understand',
  define: 'Define',
  act: 'Take action',
}

const WORK_DAY_TIMELINE = [
  { time: '8:45 AM', label: 'Arriving and saying hello to a few colleagues' },
  { time: '10:30 AM', label: 'Chatting for a moment over coffee' },
  { time: '12:30 PM', label: 'Having lunch with someone' },
  { time: '3:00 PM', label: 'Working through a problem together' },
  { time: '5:30 PM', label: 'Talking a little before heading home' },
]

const phaseDiscover: JourneyPhase = {
  id: 'social-phase-discover',
  title: 'UNDERSTAND',
  type: 'discover',
  steps: [
    {
      id: 'social-step-1',
      phaseId: 'social-phase-discover',
      title: 'What work brought to your social life',
      estimatedMinutes: 7,
      screens: [
        {
          id: 's1-intro',
          type: 'content',
          title: 'Work was also a source of social connection',
          paragraphs: [
            'When we think about work, we often think about tasks, responsibilities or the pace of the day.',
            'But a working day is also full of small moments of contact with other people.',
          ],
        },
        {
          id: 's1-timeline',
          type: 'timeline',
          title: 'An ordinary day at work',
          timeline: WORK_DAY_TIMELINE,
          paragraphs: [
            'Taken one by one, these moments seem small. Together, they create a steady social presence.',
          ],
        },
        {
          id: 's1-concepts',
          type: 'concepts',
          title: 'Different things work can bring',
          options: [
            { id: 'presence', label: 'PRESENCE' },
            { id: 'relations', label: 'RELATIONSHIPS' },
            { id: 'echanges', label: 'CONVERSATION' },
            { id: 'collectif', label: 'BELONGING' },
          ],
          paragraphs: [
            'Being around people, even without talking much.',
            'Regularly seeing people you know.',
            'Talking, joking, sharing ideas.',
            'Being part of a team and moving forward together.',
          ],
        },
        {
          id: 's1-question',
          type: 'multiChoice',
          question: 'And for you, what mattered most?',
          responseKey: 'previousWorkSocialNeeds',
          options: [
            { id: 'entoure', label: 'Being around people' },
            { id: 'colleagues', label: 'The colleagues I enjoyed' },
            { id: 'informal', label: 'The informal conversations' },
            { id: 'collective', label: 'Working with others' },
            { id: 'team', label: 'Being part of a team' },
            { id: 'new-people', label: 'Regularly meeting new people' },
            { id: 'little', label: 'Not much, socially' },
          ],
        },
        {
          id: 's1-insight',
          type: 'insight',
          synthesisId: 'work-reflection',
        },
        {
          id: 's1-change',
          type: 'singleChoice',
          question:
            'Since your working rhythm changed, are these moments…',
          responseKey: 'workSocialChange',
          options: [
            { id: 'more', label: 'More frequent' },
            { id: 'same', label: 'About the same' },
            { id: 'less', label: 'A little less frequent' },
            { id: 'much-less', label: 'Much less frequent' },
            { id: 'unknown', label: 'Hard to say' },
          ],
        },
        {
          id: 's1-synthesis',
          type: 'synthesis',
          synthesisId: 'work-social',
        },
        {
          id: 's1-complete',
          type: 'stepCompletion',
          completionId: 'social-step-1',
        },
      ],
    },
    {
      id: 'social-step-2',
      phaseId: 'social-phase-discover',
      title: 'A social life can take many forms',
      estimatedMinutes: 6,
      screens: [
        {
          id: 's2-intro',
          type: 'content',
          title: 'A social life isn’t just one thing',
          paragraphs: [
            'When we talk about a “social life”, we sometimes picture a single image: going out often, having lots of friends, being very active.',
            'In reality, everyone puts their social life together in their own way — and it can look very different from one person to the next.',
          ],
        },
        {
          id: 's2-concepts',
          type: 'concepts',
          options: [
            { id: 'proches', label: 'PEOPLE CLOSE TO YOU' },
            { id: 'activites', label: 'ACTIVITIES' },
            { id: 'nouvelles', label: 'NEW ENCOUNTERS' },
            { id: 'engager', label: 'GETTING INVOLVED' },
          ],
          paragraphs: [
            'Family, friends, people you already know.',
            'Doing something with others — sport, culture, a workshop…',
            'Building new connections around a shared interest.',
            'Taking part in a project, an association or a cause.',
          ],
        },
        {
          id: 's2-examples',
          type: 'insight',
          synthesisId: 'forms-examples',
        },
        {
          id: 's2-question',
          type: 'multiChoice',
          question: 'Which of these appeal to you most today?',
          responseKey: 'socialFormInterests',
          options: [
            { id: 'proches', label: 'People close to you' },
            { id: 'activites', label: 'Activities' },
            { id: 'nouvelles', label: 'New encounters' },
            { id: 'engager', label: 'Getting involved' },
          ],
        },
        {
          id: 's2-reflect',
          type: 'insight',
          synthesisId: 'forms-reflection',
        },
        {
          id: 's2-synthesis',
          type: 'synthesis',
          synthesisId: 'forms-exploration',
        },
        {
          id: 's2-complete',
          type: 'stepCompletion',
          completionId: 'social-step-2',
        },
      ],
    },
  ],
}

const phaseDefine: JourneyPhase = {
  id: 'social-phase-define',
  title: 'DEFINE',
  type: 'define',
  steps: [
    {
      id: 'social-step-3',
      phaseId: 'social-phase-define',
      title: 'What would you like today?',
      estimatedMinutes: 6,
      screens: [
        {
          id: 's3-intro',
          type: 'content',
          title: 'More people isn’t necessarily better',
          paragraphs: [
            'Some people like having a full calendar. Others prefer a few regular relationships.',
            'What matters is finding what suits you — without comparing yourself to anyone else.',
          ],
        },
        {
          id: 's3-profiles',
          type: 'insight',
          synthesisId: 'desires-profiles',
        },
        {
          id: 's3-goals',
          type: 'multiChoice',
          question: 'What would you like more of?',
          responseKey: 'goals',
          options: [
            { id: 'proches', label: 'Seeing the people close to me more often' },
            { id: 'nouvelles', label: 'Meeting new people' },
            { id: 'reguliers', label: 'Having regular get-togethers' },
            { id: 'activite', label: 'Sharing an activity' },
            { id: 'projet', label: 'Taking part in a group project' },
            { id: 'rien', label: 'Nothing in particular right now' },
          ],
        },
        {
          id: 's3-connection',
          type: 'singleChoice',
          question: 'Would you rather…',
          responseKey: 'connectionPreference',
          options: [
            { id: 'existing', label: 'Deepen the relationships I already have' },
            { id: 'new', label: 'Meet new people' },
            { id: 'both', label: 'A bit of both' },
          ],
        },
        {
          id: 's3-synthesis',
          type: 'synthesis',
          synthesisId: 'desires',
        },
        {
          id: 's3-complete',
          type: 'stepCompletion',
          completionId: 'social-step-3',
        },
      ],
    },
    {
      id: 'social-step-4',
      phaseId: 'social-phase-define',
      title: 'What kind of get-togethers suit you?',
      estimatedMinutes: 7,
      screens: [
        {
          id: 's4-intro',
          type: 'content',
          title: 'Let’s imagine an invitation',
          paragraphs: [
            'Rather than choosing between abstract categories, let’s look at what appeals to you in concrete situations.',
            'There’s no right answer — only what would feel enjoyable to you.',
          ],
        },
        {
          id: 's4-scenario',
          type: 'scenario',
          question: 'Next Saturday, which of these invitations appeals to you most?',
          responseKey: 'scenarioInvitation',
          options: [
            {
              id: 'cafe',
              label: 'Option A',
              description: 'Coffee with two people you barely know.',
            },
            {
              id: 'atelier',
              label: 'Option B',
              description: 'A photography workshop with 8 people.',
            },
            {
              id: 'sortie',
              label: 'Option C',
              description: 'A large organised outing with 30 people.',
            },
            {
              id: 'benevolat',
              label: 'Option D',
              description: 'Joining a volunteering effort with a small team.',
            },
          ],
        },
        {
          id: 's4-why',
          type: 'multiChoice',
          question: 'What appeals to you about that choice?',
          responseKey: 'scenarioWhy',
          options: [
            { id: 'petit-groupe', label: 'Small group' },
            { id: 'activite', label: 'A concrete activity' },
            { id: 'decouvrir', label: 'Getting to know people' },
            { id: 'detendu', label: 'Relaxed atmosphere' },
            { id: 'utile', label: 'Feeling useful' },
            { id: 'autre', label: 'Something else' },
          ],
        },
        {
          id: 's4-reflect',
          type: 'insight',
          synthesisId: 'scenario-why-reflection',
        },
        {
          id: 's4-frequency',
          type: 'singleChoice',
          question: 'How often would this kind of moment feel good to you?',
          responseKey: 'preferredFrequency',
          options: [
            { id: 'occasional', label: 'Now and then' },
            { id: 'regular', label: 'About once a week' },
            { id: 'more', label: 'More regularly' },
            { id: 'unknown', label: 'I don’t know yet' },
          ],
        },
        {
          id: 's4-synthesis',
          type: 'synthesis',
          synthesisId: 'meeting-style',
        },
        {
          id: 's4-complete',
          type: 'stepCompletion',
          completionId: 'social-step-4',
        },
      ],
    },
    {
      id: 'social-step-5',
      phaseId: 'social-phase-define',
      title: 'Your ideal social life, simply put',
      estimatedMinutes: 6,
      screens: [
        {
          id: 's5-intro',
          type: 'content',
          title: 'Just picture a good week',
          paragraphs: [
            'No need to describe your life two years from now, or to plan everything out.',
            'One enjoyable week is enough to guide the thinking.',
          ],
        },
        {
          id: 's5-visual',
          type: 'synthesis',
          synthesisId: 'ideal-week-visual',
        },
        {
          id: 's5-moments',
          type: 'singleChoice',
          question:
            'How many moments with others would feel good to you?',
          responseKey: 'idealWeekMoments',
          options: [
            { id: '1', label: '1' },
            { id: '2-3', label: '2-3' },
            { id: 'several', label: 'Several' },
            { id: 'varies', label: 'It depends on the week' },
          ],
        },
        {
          id: 's5-activities',
          type: 'multiChoice',
          question: 'What would you like them to include?',
          responseKey: 'idealWeekActivities',
          options: [
            { id: 'dejeuner', label: 'A lunch' },
            { id: 'activite', label: 'An activity' },
            { id: 'groupe', label: 'A regular group' },
            { id: 'sport', label: 'Some sport' },
            { id: 'projet', label: 'A project' },
            { id: 'sortie', label: 'An outing' },
            { id: 'benevolat', label: 'Some volunteering' },
            { id: 'famille', label: 'Time with family' },
          ],
        },
        {
          id: 's5-synthesis',
          type: 'synthesis',
          synthesisId: 'ideal-week',
        },
        {
          id: 's5-complete',
          type: 'stepCompletion',
          completionId: 'social-step-5',
        },
      ],
    },
  ],
}

const phaseAct: JourneyPhase = {
  id: 'social-phase-act',
  title: 'TAKE ACTION',
  type: 'act',
  steps: [
    {
      id: 'social-step-6',
      phaseId: 'social-phase-act',
      title: 'Three directions that could suit you',
      estimatedMinutes: 6,
      screens: [
        {
          id: 's6-intro',
          type: 'synthesis',
          synthesisId: 'opportunity-intro',
        },
        {
          id: 's6-context',
          type: 'content',
          paragraphs: [
            'Here are three kinds of possibilities — not specific places, but directions that could suit you.',
            'Tell us what speaks to you, and what doesn’t. That will sharpen what comes next.',
          ],
        },
        {
          id: 's6-types',
          type: 'recommendation',
        },
        {
          id: 's6-synthesis',
          type: 'synthesis',
          synthesisId: 'opportunity-summary',
        },
        {
          id: 's6-complete',
          type: 'stepCompletion',
          completionId: 'social-step-6',
        },
      ],
    },
    {
      id: 'social-step-7',
      phaseId: 'social-phase-act',
      title: 'Explore what exists around you',
      estimatedMinutes: 7,
      screens: [
        {
          id: 's7-intro',
          type: 'synthesis',
          synthesisId: 'resources-intro',
        },
        {
          id: 's7-resources',
          type: 'resourceSelection',
          title: 'A few options near you',
          paragraphs: [
            'Examples in Lille — three at most, chosen for you.',
          ],
        },
        {
          id: 's7-reflect',
          type: 'content',
          paragraphs: [
            'You don’t need to decide anything right now.',
            'Marking an option as interesting is enough for us to come back to it later.',
          ],
        },
        {
          id: 's7-complete',
          type: 'stepCompletion',
          completionId: 'social-step-7',
        },
      ],
    },
    {
      id: 'social-step-8',
      phaseId: 'social-phase-act',
      title: 'Choose a first thing to try',
      estimatedMinutes: 5,
      screens: [
        {
          id: 's8-intro',
          type: 'synthesis',
          synthesisId: 'pick-intro',
        },
        {
          id: 's8-pick',
          type: 'resourceSelection',
          synthesisId: 'pick-first',
        },
        {
          id: 's8-confirm',
          type: 'content',
          title: 'That’s great.',
          paragraphs: [
            'There’s nothing more to do right now.',
            'You can come back to this option whenever you like.',
          ],
        },
        {
          id: 's8-complete',
          type: 'stepCompletion',
          completionId: 'social-step-8',
        },
      ],
    },
  ],
}

export const socialJourneyEn: ThemeJourney = {
  id: SOCIAL_JOURNEY_ID,
  themeId: THEME_SOCIAL,
  pathId: PATH_SOCIAL,
  title: 'My social life',
  description: 'Build a social life that feels like you.',
  phases: [phaseDiscover, phaseDefine, phaseAct],
}

export function getAllSocialJourneyStepsEn(): JourneyStep[] {
  return socialJourneyEn.phases.flatMap((phase) => phase.steps)
}

export function getSocialJourneyStepEn(
  stepId: string,
): JourneyStep | undefined {
  return getAllSocialJourneyStepsEn().find((step) => step.id === stepId)
}

export function getSocialPhaseForStepEn(
  stepId: string,
): JourneyPhase | undefined {
  return socialJourneyEn.phases.find((phase) =>
    phase.steps.some((step) => step.id === stepId),
  )
}

export const SOCIAL_STEP_ORDER_EN = getAllSocialJourneyStepsEn().map(
  (s) => s.id,
)
