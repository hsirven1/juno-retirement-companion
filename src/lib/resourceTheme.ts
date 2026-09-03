import type { ResourceRecommendation } from '../types'

export type ResourceThemeTokens = {
  id: string
  solidVar: string
  tintVar: string
  inkVar: string
}

export const RESOURCE_THEMES: ResourceThemeTokens[] = [
  {
    id: 'social',
    solidVar: '--theme-social-solid',
    tintVar: '--theme-social-tint',
    inkVar: '--theme-social-ink',
  },
  {
    id: 'active',
    solidVar: '--theme-active-solid',
    tintVar: '--theme-active-tint',
    inkVar: '--theme-active-ink',
  },
  {
    id: 'new_rhythm',
    solidVar: '--theme-rythme-solid',
    tintVar: '--theme-rythme-tint',
    inkVar: '--theme-rythme-ink',
  },
  {
    id: 'learn',
    solidVar: '--theme-learn-solid',
    tintVar: '--theme-learn-tint',
    inkVar: '--theme-learn-ink',
  },
  {
    id: 'travel',
    solidVar: '--theme-rythme-solid',
    tintVar: '--theme-rythme-tint',
    inkVar: '--theme-rythme-ink',
  },
  {
    id: 'contribute',
    solidVar: '--theme-contribute-solid',
    tintVar: '--theme-contribute-tint',
    inkVar: '--theme-contribute-ink',
  },
  {
    id: 'autonomy',
    solidVar: '--theme-contribute-solid',
    tintVar: '--theme-contribute-tint',
    inkVar: '--theme-contribute-ink',
  },
  {
    id: 'digital',
    solidVar: '--theme-learn-solid',
    tintVar: '--theme-learn-tint',
    inkVar: '--theme-learn-ink',
  },
]

export function getResourceTheme(
  resource: Pick<ResourceRecommendation, 'themeIds' | 'lilleThemeIds'>,
): ResourceThemeTokens {
  const themes = new Set([
    ...(resource.themeIds ?? []),
    ...(resource.lilleThemeIds ?? []),
  ])
  for (const candidate of RESOURCE_THEMES) {
    if (themes.has(candidate.id)) return candidate
  }
  return RESOURCE_THEMES[0]
}

/** Short abstract label for media scaffolding (not shipped as real copy). */
export function mediaHintForResource(
  resource: Pick<ResourceRecommendation, 'resourceType' | 'tags' | 'category'>,
): string {
  const tags = resource.tags ?? []
  if (tags.some((t) => /garden|jardin/i.test(t))) return 'jardin'
  if (tags.some((t) => /photo|atelier/i.test(t))) return 'atelier'
  if (tags.some((t) => /marche|walk|sport/i.test(t))) return 'marche'
  if (resource.category === 'learning') return 'atelier'
  if (resource.category === 'sport') return 'marche'
  if (resource.category === 'volunteering') return 'association'
  if (resource.resourceType === 'place') return 'lieu'
  if (resource.resourceType === 'event') return 'événement'
  return 'activité'
}
