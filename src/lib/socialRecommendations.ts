import type {
  SocialOpportunityType,
  SocialPreferences,
} from '../types'
import {
  buildSocialSynthesis,
  lilleSocialResources,
  type LilleSocialResource,
} from '../data/socialLife'

export function getSocialOpportunityTypes(
  prefs: SocialPreferences,
): SocialOpportunityType[] {
  const types: SocialOpportunityType[] = []

  const wantsActivity =
    prefs.preferredContext === 'activity' ||
    prefs.goals.includes('activite') ||
    prefs.goals.includes('reguliers')
  const wantsProject =
    prefs.preferredContext === 'project' || prefs.goals.includes('utile')
  const wantsTry =
    prefs.commitmentPreference === 'try' ||
    prefs.commitmentPreference === 'punctual'
  const wantsExisting =
    prefs.connectionPreference === 'existing' || prefs.goals.includes('proches')

  if (wantsActivity || !wantsExisting) {
    types.push({
      id: 'activite-groupe',
      title: 'Activité en petit groupe',
      description:
        'Retrouver régulièrement les mêmes personnes autour d’une activité.',
      filterTags: ['activity', 'regular', 'small'],
    })
  }

  if (wantsProject) {
    types.push({
      id: 'association',
      title: 'Association',
      description:
        'Participer à un projet collectif et rencontrer des personnes autour d’une cause.',
      filterTags: ['project'],
    })
  }

  types.push({
    id: 'atelier',
    title: 'Atelier ou cours',
    description:
      'Apprendre ou pratiquer quelque chose avec un groupe régulier.',
    filterTags: ['activity', 'learn'],
  })

  if (wantsTry || types.length < 3) {
    types.push({
      id: 'sortie',
      title: 'Sortie collective',
      description:
        'Commencer plus simplement avec une activité ponctuelle.',
      filterTags: ['occasional', 'try'],
    })
  }

  if (wantsExisting && types.length < 3) {
    types.push({
      id: 'proches',
      title: 'Retrouver vos proches',
      description:
        'Donner un rythme simple aux relations que vous avez déjà.',
      filterTags: ['existing'],
    })
  }

  return types.slice(0, 3)
}

function scoreResource(
  resource: LilleSocialResource,
  prefs: SocialPreferences,
  dismissedIds: string[],
  dismissReasons: Record<string, string>,
): number {
  if (dismissedIds.includes(resource.id)) return -100

  let score = 0
  const { social } = resource

  if (prefs.preferredGroupSize === 'small' && social.groupSize === 'small') score += 3
  if (prefs.preferredGroupSize === 'group' && social.groupSize === 'medium') score += 2
  if (prefs.preferredFrequency === 'regular' && social.frequency === 'regular') score += 3
  if (prefs.preferredFrequency === 'occasional' && social.frequency === 'occasional')
    score += 3
  if (prefs.preferredContext === 'activity' && social.context === 'activity') score += 3
  if (prefs.preferredContext === 'together' && social.context === 'together') score += 3
  if (prefs.preferredContext === 'project' && social.context === 'project') score += 3

  if (prefs.connectionPreference === 'new' && social.connection === 'new') score += 3
  if (prefs.connectionPreference === 'existing' && social.connection === 'existing')
    score += 4
  if (prefs.connectionPreference === 'both' && social.connection !== 'existing')
    score += 1

  if (prefs.commitmentPreference === 'punctual' && social.commitment === 'punctual')
    score += 2
  if (prefs.commitmentPreference === 'regular' && social.commitment === 'regular')
    score += 2
  if (prefs.commitmentPreference === 'try' && social.commitment === 'flexible')
    score += 2
  if (prefs.commitmentPreference === 'either') score += 1

  // Soft penalties from feedback on similar resources
  for (const reason of Object.values(dismissReasons)) {
    if (reason === 'trop-monde' && social.groupSize === 'medium') score -= 2
    if (reason === 'trop-regulier' && social.frequency === 'regular') score -= 2
    if (reason === 'trop-loin') score -= 0
  }

  if (prefs.goals.includes('nouvelles') && social.connection !== 'existing') score += 1
  if (prefs.goals.includes('utile') && social.context === 'project') score += 2

  return score
}

export function getSocialRecommendations(
  prefs: SocialPreferences,
  options?: {
    dismissedIds?: string[]
    laterIds?: string[]
    dismissReasons?: Record<string, string>
    typeId?: string
    limit?: number
  },
): LilleSocialResource[] {
  const dismissed = options?.dismissedIds ?? []
  const later = options?.laterIds ?? []
  const reasons = options?.dismissReasons ?? {}
  const limit = options?.limit ?? 4

  let pool = [...lilleSocialResources]

  if (options?.typeId === 'proches') {
    pool = pool.filter((item) => item.social.connection === 'existing')
  } else if (options?.typeId === 'sortie') {
    pool = pool.filter((item) => item.social.frequency === 'occasional')
  } else if (options?.typeId === 'association') {
    pool = pool.filter((item) => item.social.context === 'project')
  } else if (options?.typeId === 'activite-groupe' || options?.typeId === 'atelier') {
    pool = pool.filter((item) => item.social.context === 'activity')
  }

  return pool
    .map((resource) => ({
      resource,
      score: scoreResource(resource, prefs, dismissed, reasons),
    }))
    .filter((item) => item.score > -50)
    .sort((a, b) => {
      const aLater = later.includes(a.resource.id) ? 1 : 0
      const bLater = later.includes(b.resource.id) ? 1 : 0
      if (aLater !== bLater) return aLater - bLater
      return b.score - a.score
    })
    .slice(0, limit)
    .map((item) => item.resource)
}

export { buildSocialSynthesis }
