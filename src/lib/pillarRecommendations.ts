import type { Locale } from '../i18n/types'
import type {
  BilanResourceSignals,
  PillarId,
  ResourceMatchMeta,
  ResourceRecommendation,
  RetirementPersonalizationProfile,
  SocialFeedback,
  SocialPreferences,
} from '../types'
import { lilleResources, type LilleResource, type ThemeId } from '../data/lilleResources'
import { guideResources, type GuideResource } from '../data/guideResources'
import { PILLARS, PILLAR_ORDER, topicIdsFor, topicsForPillar } from '../data/pillars'
import {
  FINANCIAL_NEED_REASON,
  GENERIC_REASON,
  PHYSICAL_ACTIVITY_REASON,
  PHYSICAL_GOAL_REASON,
  PROJECT_REASON,
  SOCIAL_GOAL_REASON,
} from '../data/personalizationReasons'
import { scoreLilleResource } from './lilleRecommendations'
import { toResourceRecommendation } from './lilleResourceAdapter'

/* ------------------------------------------------------------------ */
/* Pillar priority                                                     */
/* ------------------------------------------------------------------ */

export interface PillarPriority {
  /** Internal weights — never shown to the user. */
  scores: Record<PillarId, number>
  order: PillarId[]
  /** The 2–3 pillars to emphasise right now. */
  highlighted: PillarId[]
}

const capped = (value: number, cap: number) => Math.min(value, cap)

const isPre = (p: RetirementPersonalizationProfile) =>
  p.retirementStage === 'still_working' || p.retirementStage === 'retiring_soon'

/**
 * Deterministic pillar emphasis. Every pillar keeps a base weight so none is
 * ever hidden: signals only change order and prominence.
 */
export function computePillarPriority(
  p: RetirementPersonalizationProfile,
): PillarPriority {
  const s: Record<PillarId, number> = {
    financial: 1,
    health: 1,
    social: 1,
    projects: 1,
  }
  const help = new Set(p.helpTopics)
  const challenges = new Set(p.challenges)

  // Financial
  if (isPre(p)) s.financial += 3
  else if (p.retirementStage === 'recently_retired') s.financial += 1.5
  if (p.financialConfidence === 'low') s.financial += 2
  else if (p.financialConfidence === 'medium') s.financial += 1
  s.financial += capped(p.retirementAdminNeeds.length, 3)
  s.financial += capped(p.financialGoals.length * 0.75, 2.5)
  if (p.extraIncomeInterest) s.financial += 0.5
  if (help.has('practical_transition')) s.financial += 2
  if (p.financialNothing && p.financialConfidence === 'high') s.financial -= 1

  // Health
  const physicalWish = p.physicalGoals.length + p.preferredPhysicalActivities.length > 0
  if (p.activityLevel === 'low') s.health += physicalWish ? 1.5 : 0.5
  else if (p.activityLevel === 'moderate') s.health += 1
  else if (p.activityLevel === 'active') s.health += 1
  s.health += capped(p.physicalGoals.length, 3)
  if (p.physicalGoals.includes('move_more')) s.health += 1
  s.health += capped(p.preferredPhysicalActivities.length * 0.5, 2)
  if (help.has('staying_active')) s.health += 2
  if (challenges.has('staying_active')) s.health += 1
  if (p.physicalNothing) s.health -= 1

  // Social
  s.social += capped(p.socialGoals.length, 3)
  if (p.socialGoals.includes('maintain_relationships')) s.social += 0.5
  if (p.socialNetworkStrength === 'rare' || p.socialNetworkStrength === 'few_around') {
    s.social += 2
  } else if (p.socialNetworkStrength === 'often_alone') {
    s.social += 2.5
  } else if (p.socialNetworkStrength === 'close_few') {
    s.social += 0.5
  }
  if (p.livingSituation === 'alone') s.social += 1
  if (p.aloneComfort === 'low') s.social += 1
  if (challenges.has('meeting_people')) s.social += 1
  if (challenges.has('doing_things_alone')) s.social += 1
  if (help.has('social')) s.social += 2
  if (help.has('activities_alone')) s.social += 0.5
  if (p.socialNothing) s.social -= 1.5

  // Projects
  s.projects += capped(p.projects.length * 0.6, 3)
  if (p.travelInterest) s.projects += 0.5
  if (p.volunteeringInterest) s.projects += 0.5
  if (p.learningGoals.length > 0) s.projects += 0.5
  s.projects += capped(
    ['personal_project', 'learning', 'travel', 'volunteering', 'finding_activities'].filter(
      (id) => help.has(id),
    ).length,
    2,
  )
  if (
    challenges.has('knowing_what_i_want') ||
    challenges.has('feeling_useful') ||
    challenges.has('finding_activities')
  ) {
    s.projects += 0.5
  }

  for (const id of PILLAR_ORDER) s[id] = Math.max(s[id], 0.5)

  const order = [...PILLAR_ORDER].sort((a, b) => s[b] - s[a])
  const top = s[order[0]!]
  const highlighted = order.slice(0, 2)
  if (s[order[2]!] >= top * 0.75 && s[order[2]!] > 1.5) highlighted.push(order[2]!)

  return { scores: s, order, highlighted }
}

/* ------------------------------------------------------------------ */
/* Resource matching                                                   */
/* ------------------------------------------------------------------ */

interface Reason {
  weight: number
  text: Record<Locale, string>
}

interface MatchResult {
  score: number
  /** Share of the score coming from each pillar's signals ('general' = transversal). */
  parts: Record<PillarId | 'general', number>
  reason: Reason | null
}

function overlap<T>(a: T[] | undefined, b: T[]): T[] {
  return a ? a.filter((v) => b.includes(v)) : []
}

/** How well a resource's metadata fits the person's profile. */
export function scoreMatch(
  meta: ResourceMatchMeta | undefined,
  p: RetirementPersonalizationProfile,
  isLocal: boolean,
): MatchResult {
  const parts = { financial: 0, health: 0, social: 0, projects: 0, general: 0 }
  let reason: Reason | null = null
  const note = (weight: number, text: Record<Locale, string>) => {
    if (!reason || weight > reason.weight) reason = { weight, text }
  }
  const result = () => ({
    score: Object.values(parts).reduce((a, b) => a + b, 0),
    parts,
    reason,
  })

  if (isLocal) parts.general += p.location === 'lille' ? 1 : -2
  if (!meta) return result()

  // Finances
  const needs = overlap(meta.financialNeeds, p.financialNeeds)
  if (needs.length) {
    parts.financial += capped(needs.length * 3, 6)
    note(3 + needs.length, FINANCIAL_NEED_REASON[needs[0]!])
  }
  if (p.retirementStage && meta.retirementStages) {
    if (meta.retirementStages.includes(p.retirementStage)) {
      parts.financial += 3
      if (isPre(p)) note(3.5, GENERIC_REASON.preRetirement)
    } else {
      parts.financial -= 3
    }
  }
  const setupOnly =
    meta.financialNeeds?.includes('retirement_application') &&
    !p.financialNeeds.includes('retirement_application')
  if (setupOnly && p.retirementStage === 'retired_years') parts.financial -= 2
  if (setupOnly && isPre(p)) parts.financial += 1.5
  if (meta.financialNeeds?.length && p.financialNothing) parts.financial -= 1

  // Health
  const activities = overlap(meta.physicalActivities, p.preferredPhysicalActivities)
  if (activities.length) {
    parts.health += capped(activities.length * 3, 6)
    note(4 + activities.length, PHYSICAL_ACTIVITY_REASON[activities[0]!])
  }
  const goals = overlap(meta.physicalGoals, p.physicalGoals)
  if (goals.length) {
    parts.health += capped(goals.length * 1.5, 3)
    note(2.5, PHYSICAL_GOAL_REASON[goals[0]!])
  }
  if (p.activityLevel && meta.activityLevels) {
    if (meta.activityLevels.includes(p.activityLevel)) {
      parts.health += 2
      if (p.activityLevel === 'low') note(2, GENERIC_REASON.gentle)
    } else if (p.activityLevel === 'active') {
      parts.health -= 1
    }
  }

  // Social
  const social = overlap(meta.socialGoals, p.socialGoals)
  if (social.length) {
    parts.social += capped(social.length * 2, 4)
    note(2 + social.length, SOCIAL_GOAL_REASON[social[0]!])
  }
  if (meta.lowBarrier) {
    if (p.aloneComfort === 'low') {
      parts.social += 2
      note(3.5, GENERIC_REASON.lowBarrier)
    } else if (p.joiningReassuranceNeeds.length > 0) {
      parts.social += 1
      note(1.5, GENERIC_REASON.lowBarrier)
    }
  }

  // Projects
  const projects = overlap(meta.projectTypes, p.projects)
  if (projects.length) {
    parts.projects += capped(projects.length * 2, 4)
    note(2 + projects.length, PROJECT_REASON[projects[0]!])
  }

  // Transversal
  if (meta.recurring) {
    if (p.needForStructure === 'high') {
      parts.general += 2
      note(2.5, GENERIC_REASON.recurring)
    } else if (p.needForStructure === 'low') {
      parts.general -= 0.5
    }
  }
  if (meta.exploratory) {
    if (p.adventureLevel === 'high') {
      parts.general += 1.5
      note(1.5, GENERIC_REASON.exploratory)
    } else if (p.adventureLevel === 'low') {
      parts.general -= 0.5
    }
  }

  return result()
}

function feedbackScore(id: string, feedback: SocialFeedback): number {
  if (feedback.dismissedIds.includes(id)) return -8
  if (feedback.laterIds.includes(id)) return -3
  if (feedback.interestedIds.includes(id)) return 3
  return 0
}

const NO_FEEDBACK: SocialFeedback = {
  interestedIds: [],
  dismissedIds: [],
  laterIds: [],
  dismissReasons: {},
}

/** Resources from the same network count as one for variety purposes. */
function familyOf(id: string): string {
  if (id.startsWith('espace-seniors') || id === 'lille-senior-spaces-network') {
    return 'senior-spaces'
  }
  if (id.startsWith('repair-cafe')) return 'repair'
  if (id.startsWith('jardin') || id.startsWith('shared-gardens')) return 'garden'
  if (id.startsWith('utl')) return 'utl'
  if (id.startsWith('animages')) return 'animages'
  return id
}

const isNetworkParent = (id: string) => id.endsWith('-network')

const HOME_PER_PILLAR = 3

/* ------------------------------------------------------------------ */
/* Resource conversion                                                 */
/* ------------------------------------------------------------------ */

export function guideToResource(
  guide: GuideResource,
  locale: Locale,
  kindLabel: string,
  saved = false,
): ResourceRecommendation {
  const description = guide.description[locale]
  return {
    id: guide.id,
    category: 'work',
    categoryLabel: kindLabel,
    discoverFilter: 'practice',
    title: guide.title[locale],
    description,
    homeSnippet: description,
    personalizationReason: guide.whyUseful[locale],
    whyUseful: guide.whyUseful[locale],
    location: '',
    metadata: '',
    sourceName: guide.sourceName,
    externalUrl: guide.url,
    sourceUrl: guide.url,
    saved,
    addedToPlan: false,
    themeIds: guide.pillarIds,
    tags: guide.tags,
    pillarIds: guide.pillarIds,
    primaryPillarId: guide.pillarIds[0],
    kind: guide.kind,
    isLocal: false,
    match: guide.match,
    topicIds: topicIdsFor(guide.match),
  }
}

/** Metadata can place a resource in an extra pillar (e.g. a walking outing). */
function withMatchPillars(item: ResourceRecommendation): ResourceRecommendation {
  const meta = item.match
  if (!meta) return item
  const pillars = new Set<PillarId>(item.pillarIds ?? [])
  if (meta.financialNeeds?.length) pillars.add('financial')
  if (meta.physicalActivities?.some((a) => a !== 'outdoor')) pillars.add('health')
  if (meta.projectTypes?.length) pillars.add('projects')
  return { ...item, pillarIds: PILLAR_ORDER.filter((id) => pillars.has(id)) }
}

/* ------------------------------------------------------------------ */
/* Hub                                                                 */
/* ------------------------------------------------------------------ */

export interface ResourceHubArgs {
  locale: Locale
  personalization: RetirementPersonalizationProfile
  socialPreferences: SocialPreferences
  socialFeedback: SocialFeedback
  bilanSignals: BilanResourceSignals | null
  typeLabel: (r: LilleResource) => string
  commitmentLabel: (r: LilleResource) => string
  kindLabel: (kind: GuideResource['kind']) => string
}

export interface HubTopic {
  id: string
  pillar: PillarId
  label: string
  /** Relevant for this person given their Bilan. */
  forYou: boolean
  count: number
}

export interface PillarSections {
  /** 'start' = things to do now (pre-retirement finances), else 'priority'. */
  mode: 'start' | 'priority'
  primary: ResourceRecommendation[]
  further: ResourceRecommendation[]
}

export interface ResourceHub {
  priority: PillarPriority
  pillarOrder: PillarId[]
  highlighted: PillarId[]
  /** Full catalogue, personally ranked. */
  all: ResourceRecommendation[]
  byPillar: Record<PillarId, ResourceRecommendation[]>
  sections: Record<PillarId, PillarSections>
  topics: Record<PillarId, HubTopic[]>
  /** Highlighted topics across the emphasised pillars. */
  focusTopics: HubTopic[]
  /** "Recommandé pour vous" selection. */
  recommended: ResourceRecommendation[]
  local: ResourceRecommendation[]
  /** Home dashboard selection, deduplicated across the whole page. */
  home: {
    pillars: Record<PillarId, ResourceRecommendation[]>
    local: ResourceRecommendation[]
  }
  /** Real counts behind the Home pillar tiles. */
  stats: Record<PillarId, { total: number; forYou: number; local: number }>
}

interface Scored {
  item: ResourceRecommendation
  /** Profile fit, independent of pillar emphasis. */
  fit: number
  base: number
  parts: MatchResult['parts']
}

const PILLAR_RANK_BONUS = [4, 2.5, 1, 0]
/** Comparable to the typical base score of a local Lille resource. */
const GUIDE_BASE = 3
const QUOTAS: Record<number, number[]> = { 2: [3, 2], 3: [2, 2, 1] }

export function buildResourceHub(
  args: ResourceHubArgs,
  options: { recommendedLimit?: number; localLimit?: number } = {},
): ResourceHub {
  const recommendedLimit = options.recommendedLimit ?? 6
  const localLimit = options.localLimit ?? 6
  const p = args.personalization
  const feedback = args.socialFeedback
  const savedIds = feedback.interestedIds

  const priority = computePillarPriority(p)
  const rankOf = (id: PillarId) => priority.order.indexOf(id)

  const focusThemes = [
    ...new Set(priority.highlighted.flatMap((id) => PILLARS[id].lilleThemes)),
  ] as ThemeId[]

  const scored: Scored[] = []

  for (const resource of lilleResources) {
    const base =
      scoreLilleResource(resource, {
        activeLilleThemes: focusThemes,
        prefs: args.socialPreferences,
        feedback: NO_FEEDBACK,
        journeyRole: 'explore',
        bilanSignals: args.bilanSignals,
      }) * 0.5
    const card = withMatchPillars(
      toResourceRecommendation(resource, {
        locale: args.locale,
        typeLabel: args.typeLabel(resource),
        commitmentLabel: args.commitmentLabel(resource),
        saved: savedIds.includes(resource.id),
        personalizationReason: resource.whyUseful[args.locale],
      }),
    )
    const match = scoreMatch(card.match, p, true)
    const fb = base + feedbackScore(resource.id, feedback)
    scored.push({
      item: withReason(card, match, args.locale),
      fit: fb + match.score,
      base: fb,
      parts: match.parts,
    })
  }

  for (const guide of guideResources) {
    const card = guideToResource(
      guide,
      args.locale,
      args.kindLabel(guide.kind),
      savedIds.includes(guide.id),
    )
    const match = scoreMatch(guide.match, p, false)
    const fb = GUIDE_BASE + feedbackScore(guide.id, feedback)
    scored.push({
      item: withReason(card, match, args.locale),
      fit: fb + match.score,
      base: fb,
      parts: match.parts,
    })
  }

  const globalScore = ({ item, fit }: Scored) => {
    const primary = item.primaryPillarId
    let bonus = primary ? PILLAR_RANK_BONUS[rankOf(primary)]! : 0
    for (const id of item.pillarIds ?? []) {
      if (id !== primary) bonus = Math.max(bonus, PILLAR_RANK_BONUS[rankOf(id)]! * 0.5)
    }
    return fit + bonus
  }
  // Inside a pillar, that pillar's own signals count fully, others lightly.
  const pillarScore = ({ item, base, parts }: Scored, pillar: PillarId) => {
    let score = base + parts.general + parts[pillar]
    for (const id of PILLAR_ORDER) if (id !== pillar) score += parts[id] * 0.3
    return score + (item.primaryPillarId === pillar ? 3 : 0)
  }

  const byId = (a: Scored, b: Scored, sa: number, sb: number) =>
    sb - sa || a.item.id.localeCompare(b.item.id)

  const all = [...scored]
    .map((s) => ({ s, score: globalScore(s) }))
    .sort((a, b) => byId(a.s, b.s, a.score, b.score))
    .map(({ s }) => s.item)

  const byPillar = {} as Record<PillarId, ResourceRecommendation[]>
  for (const pillar of PILLAR_ORDER) {
    byPillar[pillar] = scored
      .filter((s) => s.item.pillarIds?.includes(pillar))
      .map((s) => ({ s, score: pillarScore(s, pillar) }))
      .sort((a, b) => byId(a.s, b.s, a.score, b.score))
      .map(({ s }) => ({ ...s.item, primaryPillarId: pillar }))
  }

  const hidden = new Set([...feedback.dismissedIds, ...feedback.laterIds])

  const sections = {} as Record<PillarId, PillarSections>
  for (const pillar of PILLAR_ORDER) {
    const list = byPillar[pillar].filter((r) => !feedback.dismissedIds.includes(r.id))
    if (pillar === 'financial' && isPre(p)) {
      const startNow = (r: ResourceRecommendation) =>
        Boolean(
          r.match?.financialNeeds?.some((n) =>
            ['retirement_application', 'entitlements', 'pension_income'].includes(n),
          ) ||
            (p.retirementStage && r.match?.retirementStages?.includes(p.retirementStage)),
        )
      const stageFirst = (r: ResourceRecommendation) =>
        p.retirementStage && r.match?.retirementStages?.includes(p.retirementStage) ? 0 : 1
      const primary = list
        .filter(startNow)
        .sort((a, b) => stageFirst(a) - stageFirst(b))
        .slice(0, 4)
      const ids = new Set(primary.map((r) => r.id))
      sections[pillar] = {
        mode: 'start',
        primary,
        further: list.filter((r) => !ids.has(r.id)),
      }
    } else {
      const primary = pickVaried(
        list.filter((r) => !hidden.has(r.id) && !isNetworkParent(r.id)),
        3,
      )
      const ids = new Set(primary.map((r) => r.id))
      sections[pillar] = {
        mode: 'priority',
        primary,
        further: list.filter((r) => !ids.has(r.id)),
      }
    }
  }

  const topics = {} as Record<PillarId, HubTopic[]>
  for (const pillar of PILLAR_ORDER) {
    topics[pillar] = topicsForPillar(pillar)
      .map((topic) => ({
        id: topic.id,
        pillar,
        label: topic.label[args.locale],
        forYou: topic.relevant(p),
        count: byPillar[pillar].filter((r) => r.topicIds?.includes(topic.id)).length,
      }))
      .filter((topic) => topic.count > 0)
      .sort((a, b) => Number(b.forYou) - Number(a.forYou))
  }

  const focusTopics = priority.highlighted
    .flatMap((pillar) => topics[pillar].filter((t) => t.forYou).slice(0, 2))
    .slice(0, 4)

  // "Pour vous en ce moment": a few ideas from each emphasised pillar.
  const quotas = QUOTAS[priority.highlighted.length] ?? [3, 2]
  const picked: ResourceRecommendation[] = []
  const pickedIds = new Set<string>()
  const families = new Set<string>()
  const eligible = (r: ResourceRecommendation) =>
    !hidden.has(r.id) &&
    !pickedIds.has(r.id) &&
    !families.has(familyOf(r.id)) &&
    !isNetworkParent(r.id)
  const take = (r: ResourceRecommendation, pillar: PillarId) => {
    picked.push({ ...r, primaryPillarId: pillar })
    pickedIds.add(r.id)
    families.add(familyOf(r.id))
  }
  const maxQuota = Math.max(1, ...quotas)
  for (let round = 0; round < maxQuota; round += 1) {
    priority.highlighted.forEach((pillar, index) => {
      if (round >= (quotas[index] ?? 1) || picked.length >= recommendedLimit - 1) return
      const next = byPillar[pillar].find(eligible)
      if (next) take(next, pillar)
    })
  }
  const discovery = priority.order
    .filter((pillar) => !priority.highlighted.includes(pillar))
    .flatMap((pillar) => byPillar[pillar].filter(eligible).slice(0, 1).map((r) => [pillar, r] as const))[0]
  if (discovery && picked.length < recommendedLimit) take(discovery[1], discovery[0])
  for (const r of all) {
    if (picked.length >= Math.min(recommendedLimit, 4)) break
    if (eligible(r)) take(r, r.primaryPillarId ?? 'social')
  }

  // Alternate pillars so neighbouring cards never share the same colour.
  const queues = new Map<PillarId, ResourceRecommendation[]>()
  for (const r of picked) {
    const key = r.primaryPillarId ?? 'social'
    queues.set(key, [...(queues.get(key) ?? []), r])
  }
  const recommended: ResourceRecommendation[] = []
  while (recommended.length < picked.length) {
    for (const queue of queues.values()) {
      const next = queue.shift()
      if (next) recommended.push(next)
    }
  }

  // Near you: best local ideas, varied across pillars and networks.
  const localPool = all.filter(
    (r) =>
      r.isLocal &&
      !pickedIds.has(r.id) &&
      !families.has(familyOf(r.id)) &&
      !hidden.has(r.id) &&
      !isNetworkParent(r.id),
  )
  const local: ResourceRecommendation[] = []
  const localPillars = new Set<PillarId>()
  const localFamilies = new Set<string>()
  for (const pass of [0, 1]) {
    for (const r of localPool) {
      if (local.length >= localLimit) break
      if (local.includes(r) || localFamilies.has(familyOf(r.id))) continue
      const pillar = r.primaryPillarId ?? 'social'
      if (pass === 0 && localPillars.has(pillar)) continue
      local.push(r)
      localPillars.add(pillar)
      localFamilies.add(familyOf(r.id))
    }
  }

  // Home dashboard: a few ideas per pillar, then local ones — never twice on the page.
  const homeIds = new Set<string>()
  const homeFamilies = new Set<string>()
  const homeFree = (r: ResourceRecommendation) =>
    !hidden.has(r.id) &&
    !isNetworkParent(r.id) &&
    !homeIds.has(r.id) &&
    !homeFamilies.has(familyOf(r.id))
  const homeTake = (r: ResourceRecommendation) => {
    homeIds.add(r.id)
    homeFamilies.add(familyOf(r.id))
    return r
  }
  const homePillars = {} as Record<PillarId, ResourceRecommendation[]>
  for (const pillar of priority.order) {
    const { primary, further } = sections[pillar]
    const out: ResourceRecommendation[] = []
    for (const r of [...primary, ...further]) {
      if (out.length >= HOME_PER_PILLAR) break
      if (homeFree(r)) out.push(homeTake(r))
    }
    homePillars[pillar] = out
  }
  const homeLocal: ResourceRecommendation[] = []
  const homeLocalPillars = new Set<PillarId>()
  for (const pass of [0, 1]) {
    for (const r of all) {
      if (homeLocal.length >= localLimit) break
      if (!r.isLocal || !homeFree(r)) continue
      const pillar = r.primaryPillarId ?? 'social'
      if (pass === 0 && homeLocalPillars.has(pillar)) continue
      homeLocal.push(homeTake(r))
      homeLocalPillars.add(pillar)
    }
  }

  const stats = {} as ResourceHub['stats']
  for (const pillar of PILLAR_ORDER) {
    const forYouTopics = new Set(topics[pillar].filter((t) => t.forYou).map((t) => t.id))
    const list = byPillar[pillar].filter((r) => !feedback.dismissedIds.includes(r.id))
    stats[pillar] = {
      total: list.length,
      forYou: list.filter((r) => r.topicIds?.some((id) => forYouTopics.has(id))).length,
      local: list.filter((r) => r.isLocal).length,
    }
  }

  return {
    priority,
    pillarOrder: priority.order,
    highlighted: priority.highlighted,
    all,
    byPillar,
    sections,
    topics,
    focusTopics,
    recommended,
    local,
    home: { pillars: homePillars, local: homeLocal },
    stats,
  }
}

function withReason(
  item: ResourceRecommendation,
  match: MatchResult,
  locale: Locale,
): ResourceRecommendation {
  if (!match.reason) return item
  return {
    ...item,
    personalizationReason: `${match.reason.text[locale]} ${item.whyUseful}`,
  }
}

/** Top items, at most one per network. */
function pickVaried(
  list: ResourceRecommendation[],
  limit: number,
): ResourceRecommendation[] {
  const out: ResourceRecommendation[] = []
  const families = new Set<string>()
  for (const r of list) {
    if (out.length >= limit) break
    if (families.has(familyOf(r.id))) continue
    out.push(r)
    families.add(familyOf(r.id))
  }
  return out
}
