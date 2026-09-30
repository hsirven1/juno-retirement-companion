import type { PathPhase } from '../../types'

export interface ThemeCopy {
  title: string
  shortReason: string
  personalizationReason: string
}

export interface PathCopy {
  title: string
  description: string
}

export interface StepCopy {
  title: string
  content: string
  ctaLabel?: string
  options?: Array<{ id: string; label: string }>
}

/** Keyed by theme id from data/paths.ts */
export const themeCopyEn: Record<string, ThemeCopy> = {
  rythme: {
    title: 'Finding my new rhythm',
    shortReason: 'Find a balance between freedom and structure.',
    personalizationReason:
      'After a full working life, you are looking for a balance between freedom and structure.',
  },
  actif: {
    title: 'Staying active',
    shortReason: 'Keep moving regularly, in a way you enjoy.',
    personalizationReason:
      'You like being active and want to keep a regular routine.',
  },
  transmettre: {
    title: 'Sharing my experience',
    shortReason: 'Explore new ways to put your experience to good use.',
    personalizationReason:
      'You enjoyed supporting younger colleagues and want to keep feeling useful.',
  },
  social: {
    title: 'My social life',
    shortReason:
      'Decide how much room you want to give to get-togethers, activities and the people who matter to you.',
    personalizationReason:
      'You would like more freedom to choose the place other people have in your new routine.',
  },
  envies: {
    title: 'Nurturing my interests',
    shortReason: 'Make room for what you would like to discover.',
    personalizationReason:
      'Retirement can also be the moment to try the things you set aside.',
  },
  finances: {
    title: 'Approaching retirement finances',
    shortReason: 'Get a clearer picture of what changes, without pressure.',
    personalizationReason:
      'Understanding the broad strokes can help you feel more at ease.',
  },
}

/** Keyed by path id from data/paths.ts */
export const pathCopyEn: Record<string, PathCopy> = {
  'path-rythme': {
    title: 'Finding my new rhythm',
    description:
      'Find a balance between freedom and a few anchors that do you good.',
  },
  'path-actif': {
    title: 'Staying active',
    description: 'Find a way of moving regularly that fits who you are.',
  },
  'path-transmettre': {
    title: 'Sharing my experience',
    description: 'Explore different ways to put your experience to good use.',
  },
  'path-social': {
    title: 'My social life',
    description: 'Build a social life that feels like you.',
  },
  'path-envies': {
    title: 'Nurturing my interests',
    description: 'Make room for what you would like to discover.',
  },
  'path-finances': {
    title: 'Approaching retirement finances',
    description:
      'Understand what changes and identify the useful questions — no personalized advice.',
  },
}

const placeholderContentEn =
  'This step is part of your journey. The detailed content is still being written — for now, move forward at your own pace.'

/** Keyed by step id from data/paths.ts */
export const stepCopyEn: Record<string, StepCopy> = {
  'rythme-1': {
    title: 'What changes when work stops',
    content:
      'Work did not only shape your days: it also gave you a rhythm, appointments, and sometimes a reason to go out.\n\nWhen that frame disappears, the freedom is real — and a little disorienting. This is not a problem to fix. It is simply new ground to explore.',
    ctaLabel: 'Continue',
  },
  'rythme-2': {
    title: 'Freedom does not have to mean no rhythm',
    content:
      'Many people discover that a little structure helps them enjoy their freedom more — not less.\n\nThis is not about filling up the calendar. It is about choosing a few anchors that do you good.',
    ctaLabel: 'Continue',
  },
  'rythme-3': {
    title: 'What you would like to keep in your weeks',
    content:
      'What do you miss a little about the rhythm of work — or would feel good to find again, in another form?',
    ctaLabel: 'Continue',
    options: [
      { id: 'sortie', label: 'Having a reason to go out' },
      { id: 'monde', label: 'Seeing people' },
      { id: 'horaires', label: 'A few set times in the week' },
      { id: 'utile', label: 'Feeling useful' },
      { id: 'rien', label: 'Nothing in particular' },
    ],
  },
  'rythme-4': {
    title: 'What you no longer want',
    content:
      'Retirement is also a chance to leave behind what weighed on you. What should no longer have a place in your weeks?',
    ctaLabel: 'Continue',
    options: [
      { id: 'agenda-plein', label: 'An overly full calendar' },
      { id: 'grands-groupes', label: 'Large organized groups' },
      { id: 'pression', label: 'The pressure to “produce”' },
      { id: 'matin-tot', label: 'Overloaded mornings' },
      { id: 'autre', label: 'Something else' },
    ],
  },
  'rythme-5': {
    title: 'What kind of rhythm might suit you?',
    content:
      'Without committing forever: which direction speaks to you most, today?',
    ctaLabel: 'Continue',
    options: [
      {
        id: 'leger',
        label: 'One or two regular commitments, the rest of the time free',
      },
      { id: 'variable', label: 'A flexible rhythm that changes week to week' },
      { id: 'projet', label: 'A project that structures part of my time' },
      { id: 'encore', label: 'I do not know yet — and that is fine' },
    ],
  },
  'rythme-6': {
    title: 'Your first direction',
    content:
      'You seem to enjoy the freedom of your new routine, but keeping a few regular commitments could suit you.\n\nNext step: choose one simple thing to try — an activity, a get-together, a time slot — without deciding everything at once.',
    ctaLabel: 'See the next step',
  },
  'rythme-7': {
    title: 'Choose a first thing to try',
    content:
      'Here are a few ideas near you, chosen around what you already enjoy — cycling, small groups, weekday activities.',
    ctaLabel: 'See the ideas',
  },

  'path-actif-1': {
    title: 'Why staying active still matters',
    content: placeholderContentEn,
    ctaLabel: 'Continue',
  },
  'path-actif-2': {
    title: 'Regular does not mean intense',
    content: placeholderContentEn,
    ctaLabel: 'Continue',
  },
  'path-actif-3': {
    title: 'What you already enjoy',
    content: 'What appeals to you most?',
    ctaLabel: 'Continue',
    options: [
      { id: 'velo', label: 'Cycling' },
      { id: 'marche', label: 'Walking' },
      { id: 'autre', label: 'Another activity' },
    ],
  },
  'path-actif-4': {
    title: 'Discover an activity near you',
    content:
      'A few ideas around Lille that match what you enjoy.',
    ctaLabel: 'See the ideas',
  },
  'path-actif-5': {
    title: 'Try it a first time',
    content: placeholderContentEn,
    ctaLabel: 'Continue',
  },

  'transmettre-1': {
    title: 'The different ways to share what you know',
    content:
      'Mentoring, volunteering, community groups, occasional support… There are several ways to stay useful without going back to full-time work.',
    ctaLabel: 'Continue',
  },
  'transmettre-2': {
    title: 'Volunteering, mentoring, community groups',
    content:
      'Mentoring often suits people who enjoy supporting young professionals. Volunteering can be broader. What matters: choosing a level of commitment that keeps you free.',
    ctaLabel: 'Continue',
  },
  'transmettre-3': {
    title: 'Who would you like to share your experience with?',
    content: 'Without committing: which direction appeals to you?',
    ctaLabel: 'Continue',
    options: [
      { id: 'jeunes-pro', label: 'Young professionals' },
      { id: 'entrepreneurs', label: 'Young entrepreneurs' },
      { id: 'local', label: 'People near where I live' },
      { id: 'encore', label: 'I do not know yet' },
    ],
  },
  'transmettre-4': {
    title: 'What level of commitment would suit you?',
    content: 'Choose what feels realistic to start with.',
    ctaLabel: 'Continue',
    options: [
      { id: 'ponctuel', label: 'A few hours now and then' },
      { id: 'mensuel', label: 'A regular commitment each month' },
      { id: 'explorer', label: 'Explore first, without committing' },
    ],
  },
  'transmettre-5': {
    title: 'Discover options near you',
    content:
      'Here are mentoring and volunteering options selected for you in Lyon.',
    ctaLabel: 'See the resources',
  },
  'transmettre-6': {
    title: 'Choose a direction to explore',
    content:
      'Pick one organization or form of mentoring. You can come back to it when you feel ready.',
    ctaLabel: 'Finish this step',
  },

  'social-step-1': {
    title: 'What work brought to your social life',
    content: '',
  },
  'social-step-2': {
    title: 'A social life can take many forms',
    content: '',
  },
  'social-step-3': {
    title: 'What would you like today?',
    content: '',
  },
  'social-step-4': {
    title: 'What kind of get-togethers suit you?',
    content: '',
  },
  'social-step-5': {
    title: 'Your ideal social life, simply put',
    content: '',
  },
  'social-step-6': {
    title: 'Three directions that could suit you',
    content: '',
  },
  'social-step-7': {
    title: 'Explore what exists around you',
    content: '',
  },
  'social-step-8': {
    title: 'Choose a first thing to try',
    content: '',
  },

  'path-envies-1': {
    title: 'The interests you set aside',
    content: placeholderContentEn,
    ctaLabel: 'Continue',
  },
  'path-envies-2': {
    title: 'What would you like to try?',
    content: placeholderContentEn,
    ctaLabel: 'Continue',
  },
  'path-envies-3': {
    title: 'Discover a first idea',
    content: placeholderContentEn,
    ctaLabel: 'Continue',
  },

  'finances-1': {
    title: 'What changes when your income changes',
    content:
      'Retirement often changes the way money comes in and goes out. Understanding the broad categories — income, spending, savings — helps you see more clearly, without deciding everything at once.',
    ctaLabel: 'Continue',
  },
  'finances-2': {
    title: 'The topics worth revisiting',
    content:
      'Everyday budget, plans (travel, helping family), and things to watch out for. A way to organise your questions — not a replacement for a professional.',
    ctaLabel: 'Continue',
  },
  'finances-3': {
    title: 'What would you like to be clearer about?',
    content: 'Choose what would be most useful to start with.',
    ctaLabel: 'Continue',
    options: [
      { id: 'budget', label: 'My everyday budget' },
      { id: 'projets', label: 'Funding plans that matter to me' },
      { id: 'documents', label: 'Knowing which documents to gather' },
      { id: 'pro', label: 'Knowing when to talk to a professional' },
    ],
  },
  'finances-4': {
    title: 'Identify a first useful action',
    content:
      'For example: list your questions, gather a few documents, or note what you would like to clarify with an advisor. No personalised financial advice is provided here.',
    ctaLabel: 'Finish this step',
  },
}

export const phaseLabelsEn: Record<PathPhase, string> = {
  understand: 'Understand',
  define: 'Define',
  reflect: 'Reflect',
  act: 'Take action',
}
