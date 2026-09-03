import type { Locale } from '../i18n/types'
import type {
  DiscoverFilter,
  ResourceCategory,
  ResourceRecommendation,
  SocialFeedback,
  SocialPreferences,
} from '../types'
import type { JourneyRole, LilleResource, ThemeId } from '../data/lilleResources'
import { lilleResources } from '../data/lilleResources'

/** Map Juno active theme IDs → Lille dataset theme IDs */
export const JUNO_TO_LILLE_THEMES: Record<string, ThemeId[]> = {
  social: ['social'],
  rythme: ['new_rhythm'],
  actif: ['active'],
  transmettre: ['contribute'],
  envies: ['learn', 'travel'],
  finances: ['autonomy'],
}

/** Discover UI filter → Lille matching */
export const DISCOVER_FILTER_MATCH: Record<
  Exclude<DiscoverFilter, 'all'>,
  {
    themes?: ThemeId[]
    roles?: JourneyRole[]
    resourceTypes?: LilleResource['resourceType'][]
  }
> = {
  meet: { themes: ['social'] },
  move: { themes: ['active'] },
  engage: { themes: ['contribute'] },
  learn: { themes: ['learn'] },
  travel: { themes: ['travel'] },
  practice: {
    roles: ['support'],
    resourceTypes: ['service', 'benefit'],
    themes: ['autonomy', 'digital'],
  },
}

export function junoThemesToLille(activeThemeIds: string[]): ThemeId[] {
  const set = new Set<ThemeId>()
  for (const id of activeThemeIds) {
    for (const mapped of JUNO_TO_LILLE_THEMES[id] ?? []) set.add(mapped)
  }
  return [...set]
}

export function formatLastChecked(isoDate: string, locale: Locale): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function buildLocationLine(resource: LilleResource): string {
  const parts = [
    resource.location.neighborhood,
    resource.location.city,
  ].filter(Boolean)
  return parts.join(' · ')
}

export function buildMetaLine(
  resource: LilleResource,
  locale: Locale,
  commitmentLabel: string,
): string {
  const parts = [
    resource.location.neighborhood,
    resource.cost.label[locale],
    commitmentLabel,
  ].filter(Boolean)
  return parts.join(' · ')
}

function categoryFromResource(resource: LilleResource): ResourceCategory {
  if (resource.themeIds.includes('contribute')) return 'volunteering'
  if (resource.themeIds.includes('active')) return 'sport'
  if (resource.themeIds.includes('learn')) return 'learning'
  if (resource.themeIds.includes('travel')) return 'travel'
  if (resource.themeIds.includes('social')) return 'social'
  return 'social'
}

function discoverFilterFromResource(resource: LilleResource): DiscoverFilter {
  if (resource.themeIds.includes('contribute')) return 'engage'
  if (resource.themeIds.includes('active')) return 'move'
  if (resource.themeIds.includes('travel')) return 'travel'
  if (resource.themeIds.includes('learn')) return 'learn'
  if (
    resource.journeyRoles.includes('support') ||
    resource.resourceType === 'service' ||
    resource.resourceType === 'benefit'
  ) {
    return 'practice'
  }
  return 'meet'
}

export function matchesDiscoverFilter(
  resource: LilleResource,
  filter: DiscoverFilter,
): boolean {
  if (filter === 'all') return true
  const match = DISCOVER_FILTER_MATCH[filter]
  if (!match) return true

  const themeHit = match.themes?.some((t) => resource.themeIds.includes(t))
  const roleHit = match.roles?.some((r) => resource.journeyRoles.includes(r))
  const typeHit = match.resourceTypes?.includes(resource.resourceType)

  if (filter === 'practice') {
    return Boolean(themeHit || roleHit || typeHit)
  }
  return Boolean(themeHit)
}

export interface AdaptOptions {
  locale: Locale
  typeLabel: string
  commitmentLabel: string
  personalizationReason?: string
  saved?: boolean
  addedToPlan?: boolean
}

/** Convert a Lille record into the UI ResourceRecommendation shape. */
export function toResourceRecommendation(
  resource: LilleResource,
  options: AdaptOptions,
): ResourceRecommendation {
  const locale = options.locale
  const description = resource.description[locale]
  const why =
    options.personalizationReason ?? resource.whyUseful[locale]

  return {
    id: resource.id,
    category: categoryFromResource(resource),
    categoryLabel: options.typeLabel,
    discoverFilter: discoverFilterFromResource(resource),
    title: resource.name,
    description,
    homeSnippet: description,
    personalizationReason: why,
    location: buildLocationLine(resource),
    metadata: buildMetaLine(resource, locale, options.commitmentLabel),
    sourceName: resource.source.name,
    externalUrl: resource.source.url,
    saved: options.saved ?? false,
    addedToPlan: options.addedToPlan ?? false,
    themeIds: resource.themeIds,
    priorityIds: resource.themeIds,
    // Lille-enriched fields
    resourceType: resource.resourceType,
    journeyRoles: resource.journeyRoles,
    seniorSpecific: resource.seniorSpecific,
    commitmentLevel: resource.commitment.level,
    costLabel: resource.cost.label[locale],
    eligibility: resource.eligibility[locale],
    whyUseful: resource.whyUseful[locale],
    tags: resource.tags,
    sourceUrl: resource.source.url,
    sourceLastChecked: resource.source.lastChecked,
    timeSensitive: resource.timeSensitive,
    address: resource.location.address,
    neighborhood: resource.location.neighborhood,
    lilleThemeIds: resource.themeIds,
  }
}

export function getLilleResourceById(id: string): LilleResource | undefined {
  return lilleResources.find((item) => item.id === id)
}

export function adaptAllLilleResources(
  locale: Locale,
  labels: {
    typeLabel: (resource: LilleResource) => string
    commitmentLabel: (resource: LilleResource) => string
  },
  state?: {
    savedIds?: string[]
    addedIds?: string[]
    feedback?: SocialFeedback
  },
): ResourceRecommendation[] {
  const saved = new Set(state?.savedIds ?? [])
  const added = new Set(state?.addedIds ?? [])

  return lilleResources.map((resource) =>
    toResourceRecommendation(resource, {
      locale,
      typeLabel: labels.typeLabel(resource),
      commitmentLabel: labels.commitmentLabel(resource),
      saved: saved.has(resource.id),
      addedToPlan: added.has(resource.id),
    }),
  )
}

/** Soft preference for personalization copy (not the fixed whyUseful). */
export function buildPersonalizationReason(
  resource: LilleResource,
  prefs: SocialPreferences,
  locale: Locale,
): string {
  // Prefer the curated whyUseful; lightly tune opening based on prefs when useful.
  const base = resource.whyUseful[locale]
  if (
    prefs.connectionPreference === 'new' ||
    prefs.goals.includes('nouvelles')
  ) {
    if (resource.socialFormat.includes('small_group') || resource.tags.includes('small_group_possible')) {
      return locale === 'en'
        ? `Fits your wish to meet new people in a smaller setting. ${base}`
        : `Correspond à votre envie de rencontrer du monde dans un cadre plus intimiste. ${base}`
    }
  }
  return base
}
