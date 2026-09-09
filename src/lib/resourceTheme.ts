import type { ThemeId } from '../data/lilleResources'

export type ResourceThemeTokens = {
  id: string
  solidVar: string
  tintVar: string
  inkVar: string
}

/**
 * Visual theme order prefers distinctive categories over ubiquitous `social`
 * so placeholders don’t all resolve to coral.
 */
export const RESOURCE_THEME_PRIORITY: string[] = [
  'active',
  'contribute',
  'learn',
  'travel',
  'new_rhythm',
  'digital',
  'autonomy',
  'social',
]

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
    solidVar: '--theme-travel-solid',
    tintVar: '--theme-travel-tint',
    inkVar: '--theme-travel-ink',
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

const themeById = new Map(RESOURCE_THEMES.map((t) => [t.id, t]))

/** Primary visual theme for a resource (distinctive categories first). */
export function getPrimaryResourceThemeId(resource: {
  themeIds?: string[] | null
  lilleThemeIds?: string[] | null
}): string {
  const themes = new Set([
    ...(resource.themeIds ?? []),
    ...(resource.lilleThemeIds ?? []),
  ])
  for (const id of RESOURCE_THEME_PRIORITY) {
    if (themes.has(id)) return id
  }
  return 'social'
}

export function getResourceTheme(resource: {
  themeIds?: string[] | null
  lilleThemeIds?: string[] | null
}): ResourceThemeTokens {
  const id = getPrimaryResourceThemeId(resource)
  return themeById.get(id) ?? RESOURCE_THEMES[0]
}

/** Same priority helper for raw Lille theme ids. */
export function primaryLilleThemeId(themeIds: ThemeId[]): ThemeId {
  for (const id of RESOURCE_THEME_PRIORITY) {
    if (themeIds.includes(id as ThemeId)) return id as ThemeId
  }
  return themeIds[0] ?? 'social'
}

/** Short abstract label for media scaffolding (not shipped as real copy). */
export function mediaHintForResource(resource: {
  resourceType?: string | null
  tags?: string[] | null
  category?: string | null
}): string {
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

/** Stable 0–3 variant for abstract composition diversity. */
export function mediaVariantForResource(resource: {
  id?: string
  themeIds?: string[]
  lilleThemeIds?: string[]
}): number {
  const key = resource.id ?? getPrimaryResourceThemeId(resource)
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % 4
  }
  return hash
}
