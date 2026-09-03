import type { Locale } from '../types'
import type { SocialOpportunityType, SocialPreferences } from '../../types'
import { getSocialOpportunityTypes as getSocialOpportunityTypesFr } from '../../lib/socialRecommendations'

const opportunityCopyEn: Record<
  string,
  { title: string; description: string }
> = {
  'activite-groupe': {
    title: 'Small-group activity',
    description:
      'See the same people regularly around a shared activity.',
  },
  association: {
    title: 'Community association',
    description:
      'Join a collective project and meet people around a shared cause.',
  },
  atelier: {
    title: 'Workshop or class',
    description: 'Learn or practice something with a regular group.',
  },
  sortie: {
    title: 'Group outing',
    description: 'Start more simply with a one-off activity.',
  },
  proches: {
    title: 'Seeing people you already know',
    description: 'Give a simple rhythm to the relationships you already have.',
  },
}

export function getOpportunityTypesForStep(
  prefs: SocialPreferences,
  locale: Locale,
): SocialOpportunityType[] {
  const types = getSocialOpportunityTypesFr({
    ...prefs,
    preferredContext:
      prefs.preferredContexts[0] ?? prefs.preferredContext ?? null,
  })

  if (locale !== 'en') return types

  return types.map((type) => {
    const en = opportunityCopyEn[type.id]
    if (!en) return type
    return { ...type, title: en.title, description: en.description }
  })
}
