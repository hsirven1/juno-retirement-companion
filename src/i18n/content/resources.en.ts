import type { ResourceRecommendation, SocialResourceMeta } from '../../types'
import type { Locale } from '../types'

export interface ResourceCopy {
  categoryLabel?: string
  /** Only set when the French title is a description, not an organization name */
  title?: string
  description?: string
  homeSnippet?: string
  personalizationReason?: string
  metadata?: string
}

/** Keyed by resource id from data/resources.ts and data/socialLife.ts */
export const resourceCopyEn: Record<string, ResourceCopy> = {
  'lyon-mentoring': {
    categoryLabel: 'Give back',
    title: 'Mentoring young entrepreneurs',
    description:
      'This organization connects experienced professionals with people starting a business, with no long-term commitment.',
    homeSnippet: 'A way to keep sharing your experience.',
    personalizationReason:
      'You told us you enjoy sharing your experience and supporting younger colleagues.',
    metadata: 'Lyon · Volunteering',
  },
  'lyon-cycling': {
    categoryLabel: 'Get moving',
    title: 'Weekday bike rides',
    description:
      'A group organizes easy rides on Thursday mornings. The pace is flexible: you can come one week and skip the next.',
    homeSnippet:
      'A small regular group that matches your interest in cycling.',
    personalizationReason:
      'You already enjoy cycling and are looking for a regular weekday activity in a small group.',
    metadata: 'Lyon · Activity',
  },
  'lyon-walking': {
    categoryLabel: 'Get moving',
    title: 'Guided walks around Lyon',
    description:
      'Guided weekday walks about local heritage and neighborhoods. Around two hours, in a small group.',
    homeSnippet: 'Get moving and learn something, in a small group.',
    personalizationReason:
      'A way to move and learn something — two things you enjoy.',
    metadata: 'Lyon · Walking',
  },
  'lyon-cafe': {
    categoryLabel: 'Meet people',
    title: 'Coffee table for industry retirees',
    description:
      'A table on Wednesdays, no sign-up needed. People who like talking about what they did — and what they do now.',
    homeSnippet: 'A relaxed get-together to see a few more people midweek.',
    personalizationReason:
      'A relaxed get-together, without a large organized group, to see a few more people.',
    metadata: 'Lyon · Get-together',
  },
  'lyon-history': {
    categoryLabel: 'Learn',
    title: 'History lecture series',
    description:
      'A short weekday series on the history of Lyon and the region. No need to commit for the whole year.',
    homeSnippet: 'Learn something, without the large groups.',
    personalizationReason:
      'You like learning, and activities where you discover something suit you better than large groups.',
    metadata: 'Lyon · Culture',
  },
  'travel-group': {
    categoryLabel: 'Travel',
    title: 'Small-group trips for active retirees',
    description:
      'Organized trips in small groups, at a comfortable pace. Worth a look if you want to travel more without organizing everything yourself.',
    homeSnippet: 'Travel more, without organizing everything yourself.',
    personalizationReason:
      'You would like to travel more, without necessarily planning every detail yourself.',
    metadata: 'Travel · Small group',
  },

  'lille-espace-seniors': {
    categoryLabel: 'Workshop',
    description:
      'Regular group activities: yoga, pottery, choir, dance and other workshops.',
    homeSnippet: 'A way to meet people around a regular activity.',
    personalizationReason:
      'You are looking to meet new people around a regular activity.',
    metadata: 'Lille-Centre · Activities',
  },
  'lille-marche-nordique': {
    categoryLabel: 'Activity',
    title: 'Tuesday Nordic walking',
    description:
      'A small group meets every week for about an hour of walking in the parks of Lille.',
    homeSnippet:
      'A regular get-together, in a small group, built around movement.',
    personalizationReason:
      'A simple format for meeting people without taking on too much.',
    metadata: 'Lille · Small group',
  },
  'lille-association-lecture': {
    categoryLabel: 'Association',
    description:
      'Once a month, the group discusses a book chosen together. Newcomers are welcome, with no annual membership.',
    homeSnippet: 'Share an interest, without meeting too often.',
    personalizationReason:
      'Ideal if you enjoy conversation around an activity, at a flexible pace.',
    metadata: 'Vieux-Lille · Culture',
  },
  'lille-benevolat-jardin': {
    categoryLabel: 'Volunteering',
    description:
      'Look after a shared garden and meet neighbors around a concrete project.',
    homeSnippet: 'Contribute alongside others, around a local project.',
    personalizationReason:
      'A way to cross paths with people while taking part in something useful.',
    metadata: 'Bois-Blancs · Project',
  },
  'lille-atelier-cuisine': {
    categoryLabel: 'Workshop',
    title: 'Wednesday cooking workshops',
    description:
      'Cook together, then share the meal. Groups limited to eight people.',
    homeSnippet: 'Learn something in a small group.',
    personalizationReason:
      'A natural setting for meeting people around a hands-on activity.',
    metadata: 'Lille · Small group',
  },
  'lille-sortie-musee': {
    categoryLabel: 'Outing',
    title: 'Museum outings at the Palais des Beaux-Arts',
    description:
      'Occasional guided visits, open to everyone. Ideal for starting without commitment.',
    homeSnippet: 'A first group outing, with no commitment.',
    personalizationReason:
      'Perfect for trying a light get-together before committing further.',
    metadata: 'Lille · Culture',
  },
  'lille-cafe-rencontre': {
    categoryLabel: 'Get-together',
    description:
      'A café open on Thursday afternoons for open conversation. No sign-up.',
    homeSnippet: 'Spend time together, simply.',
    personalizationReason:
      'If you prefer informal conversation to structured activities.',
    metadata: 'Wazemmes · Get-together',
  },
  'lille-chorale': {
    categoryLabel: 'Activity',
    description:
      'Weekly rehearsals. No experience required. A friendly atmosphere.',
    homeSnippet: 'A regular get-together around a shared passion.',
    personalizationReason:
      'Seeing the same people regularly around an activity.',
    metadata: 'Lille-Sud · Music',
  },
  'lille-bridge-club': {
    categoryLabel: 'Club',
    title: 'Bridge club in the city center',
    description:
      'Afternoon games, in small groups. You can come and try two sessions.',
    homeSnippet: 'A small regular group, around a game.',
    personalizationReason:
      'A good fit if you like a steady setting and easing into commitment.',
    metadata: 'Lille · Small group',
  },
  'lille-famille-diner': {
    categoryLabel: 'People close to you',
    title: 'An idea: a monthly family lunch',
    description:
      'Not an organization: a personal idea for seeing the people close to you more regularly.',
    homeSnippet: 'Nurture the connections you already have.',
    personalizationReason:
      'If what you mainly want is to see more of the people you already know.',
    metadata: 'Personal · People close to you',
  },
}

/** Social filter tags, keyed by their French label */
export const socialTagsEn: Record<string, string> = {
  Régulier: 'Regular',
  Groupe: 'Group',
  'Activités variées': 'Varied activities',
  'Petit groupe': 'Small group',
  'Plein air': 'Outdoors',
  Ponctuel: 'One-off',
  Culture: 'Culture',
  Projet: 'Project',
  Utile: 'Useful',
  Local: 'Local',
  Activité: 'Activity',
  Essayer: 'Try it out',
  Informel: 'Informal',
  Ouvert: 'Open to all',
  Proches: 'People close to you',
  Souple: 'Flexible',
  Personnel: 'Personal',
}

export function getLocalizedSocialTag(tag: string, locale: Locale): string {
  return locale === 'en' ? (socialTagsEn[tag] ?? tag) : tag
}

/**
 * Applies English copy over a French resource, keeping ids, categories and
 * organization names untouched. Social filter tags are translated when present.
 */
export function getLocalizedResource<T extends ResourceRecommendation>(
  resource: T,
  locale: Locale,
): T {
  if (locale !== 'en') return resource

  const copy = resourceCopyEn[resource.id]
  const social = (resource as { social?: SocialResourceMeta }).social

  const localized: T = {
    ...resource,
    categoryLabel: copy?.categoryLabel ?? resource.categoryLabel,
    title: copy?.title ?? resource.title,
    description: copy?.description ?? resource.description,
    homeSnippet: copy?.homeSnippet ?? resource.homeSnippet,
    personalizationReason:
      copy?.personalizationReason ?? resource.personalizationReason,
    metadata: copy?.metadata ?? resource.metadata,
  }

  if (!social) return localized

  return {
    ...localized,
    social: {
      ...social,
      tags: social.tags.map((tag) => getLocalizedSocialTag(tag, locale)),
    },
  }
}

export function getLocalizedResources<T extends ResourceRecommendation>(
  resources: T[],
  locale: Locale,
): T[] {
  if (locale !== 'en') return resources
  return resources.map((resource) => getLocalizedResource(resource, locale))
}
