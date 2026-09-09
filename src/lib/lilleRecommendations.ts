import type { Locale } from '../i18n/types'
import type {
  BilanResourceSignals,
  DiscoverFilter,
  ResourceRecommendation,
  SocialFeedback,
  SocialPreferences,
} from '../types'
import {
  lilleResources,
  type JourneyRole,
  type LilleResource,
  type ThemeId,
} from '../data/lilleResources'
import {
  junoThemesToLille,
  matchesDiscoverFilter,
  toResourceRecommendation,
  type AdaptOptions,
} from './lilleResourceAdapter'
import { primaryLilleThemeId } from './resourceTheme'

export interface RecommendArgs {
  locale: Locale
  activeThemeIds: string[]
  socialPreferences: SocialPreferences
  socialFeedback: SocialFeedback
  journeyRole?: JourneyRole
  limit?: number
  preferConcretePlaces?: boolean
  /** Optional bilan-derived signals from Phase 3. */
  bilanSignals?: BilanResourceSignals | null
}

const NETWORK_TO_CHILDREN: Record<string, string[]> = {
  'lille-senior-spaces-network': [
    'espace-seniors-lille-centre',
    'espace-seniors-vieux-lille',
  ],
}

function wantsLowBarrier(prefs: SocialPreferences): boolean {
  return (
    prefs.commitmentPreference === 'try' ||
    prefs.commitmentPreference === 'punctual' ||
    prefs.preferredFrequency === 'occasional'
  )
}

function wantsRegular(prefs: SocialPreferences): boolean {
  return (
    prefs.preferredFrequency === 'regular' ||
    prefs.preferredFrequency === 'more' ||
    prefs.commitmentPreference === 'regular'
  )
}

function prefersSmallGroup(prefs: SocialPreferences): boolean {
  return prefs.preferredGroupSize === 'small'
}

function prefersActivity(prefs: SocialPreferences): boolean {
  return (
    prefs.preferredContext === 'activity' ||
    prefs.preferredContexts.includes('activity') ||
    prefs.goals.includes('activite') ||
    prefs.goals.includes('reguliers')
  )
}

function prefersProject(prefs: SocialPreferences): boolean {
  return (
    prefs.preferredContext === 'project' ||
    prefs.preferredContexts.includes('project') ||
    prefs.goals.includes('utile')
  )
}

function wantsNewConnections(prefs: SocialPreferences): boolean {
  return (
    prefs.connectionPreference === 'new' ||
    prefs.connectionPreference === 'both' ||
    prefs.goals.includes('nouvelles')
  )
}

function wantsExisting(prefs: SocialPreferences): boolean {
  return (
    prefs.connectionPreference === 'existing' ||
    prefs.goals.includes('proches')
  )
}

function wantsLearning(prefs: SocialPreferences): boolean {
  return (
    prefs.socialFormInterests.includes('apprendre') ||
    prefs.idealWeekActivities.includes('apprendre') ||
    prefs.goals.includes('apprendre')
  )
}

/** Deterministic match score — never shown to the user. */
export function scoreLilleResource(
  resource: LilleResource,
  args: {
    activeLilleThemes: ThemeId[]
    prefs: SocialPreferences
    feedback: SocialFeedback
    journeyRole?: JourneyRole
    bilanSignals?: BilanResourceSignals | null
  },
): number {
  let score = 0
  const { activeLilleThemes, prefs, feedback, journeyRole, bilanSignals } = args

  const themeHits = resource.themeIds.filter((t) =>
    activeLilleThemes.includes(t),
  ).length
  score += themeHits * 4

  if (journeyRole && resource.journeyRoles.includes(journeyRole)) {
    score += 3
  } else if (!journeyRole && resource.journeyRoles.includes('explore')) {
    score += 1
  }

  if (prefersSmallGroup(prefs)) {
    if (
      resource.socialFormat.includes('small_group') ||
      resource.tags.includes('small_group_possible')
    ) {
      score += 2
    }
    if (
      resource.socialFormat.includes('large_group') &&
      !resource.socialFormat.includes('small_group')
    ) {
      score -= 1
    }
  }

  if (
    prefersActivity(prefs) &&
    resource.interactionStyle.includes('activity_based')
  ) {
    score += 2
  }

  if (
    prefersProject(prefs) &&
    (resource.themeIds.includes('contribute') ||
      resource.tags.includes('associations') ||
      resource.tags.includes('volunteer') ||
      resource.tags.includes('benevolat'))
  ) {
    score += 2
  }

  if (
    wantsLearning(prefs) &&
    (resource.interactionStyle.includes('learning') ||
      resource.themeIds.includes('learn'))
  ) {
    score += 2
  }

  if (wantsLowBarrier(prefs)) {
    if (
      resource.commitment.level === 'very_low' ||
      resource.commitment.level === 'low'
    ) {
      score += 2
    }
    if (resource.commitment.level === 'high') score -= 2
    if (resource.tags.includes('drop_in')) score += 1
  }

  if (wantsRegular(prefs)) {
    if (
      resource.commitment.level === 'medium' ||
      resource.commitment.cadence.includes('weekly')
    ) {
      score += 2
    }
  }

  if (
    prefs.preferredContexts.includes('together') &&
    resource.environment.includes('outdoor')
  ) {
    score += 1
  }

  // Senior-specific: one light signal only — never dominant
  if (resource.seniorSpecific) score += 1

  if (wantsNewConnections(prefs) && !wantsExisting(prefs)) {
    if (
      resource.tags.includes('social') ||
      resource.themeIds.includes('social')
    ) {
      score += 1
    }
  }

  // Phase 3 bilan signals — light adjustments only
  if (bilanSignals) {
    if (bilanSignals.aloneComfort === 'low') {
      if (
        resource.socialFormat.includes('small_group') ||
        resource.tags.includes('small_group_possible') ||
        resource.tags.includes('newcomer_friendly') ||
        resource.interactionStyle.includes('activity_based')
      ) {
        score += 2
      }
      if (
        resource.commitment.level === 'very_low' ||
        resource.commitment.level === 'low'
      ) {
        score += 1
      }
      if (
        resource.socialFormat.includes('large_group') &&
        !resource.socialFormat.includes('small_group')
      ) {
        score -= 1
      }
    }

    if (bilanSignals.needForStructure === 'high') {
      if (
        resource.themeIds.includes('new_rhythm') ||
        resource.commitment.cadence.includes('weekly') ||
        resource.interactionStyle.includes('activity_based')
      ) {
        score += 2
      }
    }

    if (bilanSignals.joiningReassuranceNeeds.includes('small_group')) {
      if (
        resource.socialFormat.includes('small_group') ||
        resource.tags.includes('small_group_possible')
      ) {
        score += 1
      }
    }
    if (bilanSignals.joiningReassuranceNeeds.includes('clear_activity')) {
      if (resource.interactionStyle.includes('activity_based')) score += 1
    }
    if (bilanSignals.joiningReassuranceNeeds.includes('know_what_to_expect')) {
      if (
        resource.commitment.level === 'low' ||
        resource.commitment.level === 'very_low' ||
        resource.tags.includes('drop_in')
      ) {
        score += 1
      }
    }

    if (
      bilanSignals.interests.includes('culture') &&
      (resource.tags.includes('culture') ||
        resource.tags.includes('museum') ||
        resource.tags.includes('art'))
    ) {
      score += 1
    }
    if (
      bilanSignals.interests.includes('travel') &&
      resource.themeIds.includes('travel')
    ) {
      score += 1
    }
    if (
      bilanSignals.interests.includes('learning') &&
      (resource.themeIds.includes('learn') ||
        resource.interactionStyle.includes('learning'))
    ) {
      score += 1
    }
    if (
      bilanSignals.wantMoreOf.includes('social_contact') &&
      (resource.themeIds.includes('social') || resource.tags.includes('social'))
    ) {
      score += 1
    }
    if (
      bilanSignals.wantMoreOf.includes('usefulness') &&
      (resource.themeIds.includes('contribute') ||
        resource.tags.includes('volunteer') ||
        resource.tags.includes('benevolat'))
    ) {
      score += 1
    }
  }

  if (feedback.dismissedIds.includes(resource.id)) score -= 5
  if (feedback.laterIds.includes(resource.id)) score -= 2
  if (feedback.interestedIds.includes(resource.id)) score += 3

  return score
}

function dedupeHierarchy(
  ranked: Array<{ resource: LilleResource; score: number }>,
  preferConcrete: boolean,
): Array<{ resource: LilleResource; score: number }> {
  if (!preferConcrete) return ranked

  const ids = new Set(ranked.map((r) => r.resource.id))
  const exclude = new Set<string>()

  for (const [parent, children] of Object.entries(NETWORK_TO_CHILDREN)) {
    const childPresent = children.some((id) => ids.has(id))
    if (childPresent && ids.has(parent)) exclude.add(parent)
  }

  const repairChildren = ranked.filter(
    (r) =>
      r.resource.id.includes('repair') &&
      r.resource.resourceType === 'activity',
  )
  if (repairChildren.length > 0) {
    for (const item of ranked) {
      if (
        item.resource.id.includes('repair') &&
        item.resource.resourceType === 'organization'
      ) {
        exclude.add(item.resource.id)
      }
    }
  }

  return ranked.filter((item) => !exclude.has(item.resource.id))
}

export function getRecommendedLilleResources(
  args: RecommendArgs,
): LilleResource[] {
  const activeLilleThemes = junoThemesToLille(args.activeThemeIds)
  const limit = args.limit ?? 2
  const preferConcrete = args.preferConcretePlaces ?? true

  const themes: ThemeId[] =
    activeLilleThemes.length > 0
      ? activeLilleThemes
      : ['social', 'new_rhythm', 'active']

  let ranked = lilleResources.map((resource) => ({
    resource,
    score: scoreLilleResource(resource, {
      activeLilleThemes: themes,
      prefs: args.socialPreferences,
      feedback: args.socialFeedback,
      journeyRole: args.journeyRole,
      bilanSignals: args.bilanSignals,
    }),
  }))

  ranked = ranked
    .filter((item) => item.score > -4)
    .sort((a, b) => b.score - a.score)

  ranked = dedupeHierarchy(ranked, preferConcrete)

  return pickDiverseRecommendations(ranked, limit).map((item) => item.resource)
}

/**
 * Rank-first selection with light category diversity for Home / strips.
 * Keeps top result; remaining slots prefer a different primary theme among
 * similarly scored candidates (within ~3 score points of the next pick).
 */
function pickDiverseRecommendations(
  ranked: Array<{ resource: LilleResource; score: number }>,
  limit: number,
): Array<{ resource: LilleResource; score: number }> {
  if (ranked.length <= limit) return ranked

  const picked: Array<{ resource: LilleResource; score: number }> = []
  const used = new Set<string>()
  const remaining = [...ranked]

  const take = (index: number) => {
    const [item] = remaining.splice(index, 1)
    if (!item) return
    picked.push(item)
    used.add(primaryLilleThemeId(item.resource.themeIds))
  }

  take(0)

  while (picked.length < limit && remaining.length > 0) {
    const bestScore = remaining[0]!.score
    const diverseIndex = remaining.findIndex((item) => {
      const theme = primaryLilleThemeId(item.resource.themeIds)
      return !used.has(theme) && bestScore - item.score <= 3
    })
    take(diverseIndex >= 0 ? diverseIndex : 0)
  }

  return picked
}

export function getRecommendedResourceCards(
  args: RecommendArgs & {
    typeLabel: (r: LilleResource) => string
    commitmentLabel: (r: LilleResource) => string
    savedIds?: string[]
    addedIds?: string[]
  },
) {
  const resources = getRecommendedLilleResources(args)
  return resources.map((resource) => {
    const options: AdaptOptions = {
      locale: args.locale,
      typeLabel: args.typeLabel(resource),
      commitmentLabel: args.commitmentLabel(resource),
      saved: args.savedIds?.includes(resource.id),
      addedToPlan: args.addedIds?.includes(resource.id),
      personalizationReason: resource.whyUseful[args.locale],
    }
    return toResourceRecommendation(resource, options)
  })
}

export function getFilteredLilleResourceCards(args: {
  filter: DiscoverFilter
  locale: Locale
  typeLabel: (r: LilleResource) => string
  commitmentLabel: (r: LilleResource) => string
  savedIds?: string[]
  addedIds?: string[]
  rank?: Omit<RecommendArgs, 'locale' | 'limit'>
}): ResourceRecommendation[] {
  const pool = lilleResources.filter((resource) =>
    matchesDiscoverFilter(resource, args.filter),
  )

  if (!args.rank) {
    return pool.map((resource) =>
      toResourceRecommendation(resource, {
        locale: args.locale,
        typeLabel: args.typeLabel(resource),
        commitmentLabel: args.commitmentLabel(resource),
        saved: args.savedIds?.includes(resource.id),
        addedToPlan: args.addedIds?.includes(resource.id),
      }),
    )
  }

  const themes = junoThemesToLille(args.rank.activeThemeIds)

  return pool
    .map((resource) => ({
      resource,
      score: scoreLilleResource(resource, {
        activeLilleThemes:
          themes.length > 0 ? themes : ['social', 'new_rhythm', 'active'],
        prefs: args.rank!.socialPreferences,
        feedback: args.rank!.socialFeedback,
        journeyRole: args.rank!.journeyRole ?? 'explore',
        bilanSignals: args.rank!.bilanSignals,
      }),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ resource }) =>
      toResourceRecommendation(resource, {
        locale: args.locale,
        typeLabel: args.typeLabel(resource),
        commitmentLabel: args.commitmentLabel(resource),
        saved: args.savedIds?.includes(resource.id),
        addedToPlan: args.addedIds?.includes(resource.id),
        personalizationReason: resource.whyUseful[args.locale],
      }),
    )
}

export function getLilleResourceById(id: string): LilleResource | undefined {
  return lilleResources.find((item) => item.id === id)
}
