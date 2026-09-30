import {
  FinancialGlyph,
  HealthGlyph,
  ProjectsGlyph,
  SocialGlyph,
  type GlyphProps,
} from '../components/pillars/PillarGlyph'
import type { JSX } from 'react'
import type { Locale } from '../i18n/types'
import type {
  PillarId,
  ResourceKind,
  ResourceMatchMeta,
  RetirementPersonalizationProfile,
} from '../types'
import type { ThemeId } from './lilleResources'

export interface Pillar {
  id: PillarId
  title: Record<Locale, string>
  /** Two or three upbeat words, used on hero tiles. */
  tagline: Record<Locale, string>
  description: Record<Locale, string>
  icon: (props: GlyphProps) => JSX.Element
  theme: {
    solidVar: string
    tintVar: string
    inkVar: string
    softVar: string
  }
  /** Lille dataset themes that place a local resource in this pillar. */
  lilleThemes: ThemeId[]
  /** Resource kinds that belong to this pillar regardless of theme. */
  kinds?: ResourceKind[]
}

export const PILLAR_ORDER: PillarId[] = [
  'financial',
  'health',
  'social',
  'projects',
]

export const PILLARS: Record<PillarId, Pillar> = {
  financial: {
    id: 'financial',
    title: { fr: 'Finances', en: 'Finances' },
    tagline: { fr: 'Y voir clair', en: 'Get clarity' },
    description: {
      fr: 'Comprendre vos revenus et prendre de bonnes décisions pour la suite.',
      en: 'Understand your income and make good decisions for what comes next.',
    },
    icon: FinancialGlyph,
    theme: {
      solidVar: '--pillar-financial-solid',
      tintVar: '--pillar-financial-tint',
      inkVar: '--pillar-financial-ink',
      softVar: '--pillar-financial-soft',
    },
    lilleThemes: ['autonomy'],
    kinds: ['benefit'],
  },
  health: {
    id: 'health',
    title: { fr: 'Santé & forme', en: 'Health & fitness' },
    tagline: { fr: 'Bouger avec plaisir', en: 'Enjoy moving' },
    description: {
      fr: 'Rester actif et prendre soin de votre forme.',
      en: 'Stay active and look after your wellbeing.',
    },
    icon: HealthGlyph,
    theme: {
      solidVar: '--pillar-health-solid',
      tintVar: '--pillar-health-tint',
      inkVar: '--pillar-health-ink',
      softVar: '--pillar-health-soft',
    },
    lilleThemes: ['active'],
  },
  social: {
    id: 'social',
    title: { fr: 'Vie sociale', en: 'Social life' },
    tagline: { fr: 'Voir du monde', en: 'See people' },
    description: {
      fr: 'Entretenir vos liens et créer de nouvelles occasions de rencontrer du monde.',
      en: 'Nurture your relationships and create new chances to meet people.',
    },
    icon: SocialGlyph,
    theme: {
      solidVar: '--pillar-social-solid',
      tintVar: '--pillar-social-tint',
      inkVar: '--pillar-social-ink',
      softVar: '--pillar-social-soft',
    },
    lilleThemes: ['social'],
  },
  projects: {
    id: 'projects',
    title: { fr: 'Projets & loisirs', en: 'Projects & leisure' },
    tagline: { fr: 'Se faire plaisir', en: 'Treat yourself' },
    description: {
      fr: 'Voyager, apprendre, créer et faire avancer les projets qui vous tiennent à cœur.',
      en: 'Travel, learn, create and move forward with the projects that matter to you.',
    },
    icon: ProjectsGlyph,
    theme: {
      solidVar: '--pillar-projects-solid',
      tintVar: '--pillar-projects-tint',
      inkVar: '--pillar-projects-ink',
      softVar: '--pillar-projects-soft',
    },
    lilleThemes: ['learn', 'contribute', 'travel'],
  },
}

export interface PillarTopic {
  id: string
  pillar: PillarId
  label: Record<Locale, string>
  /** Does a resource belong to this topic? */
  matches: (meta: ResourceMatchMeta) => boolean
  /** Is this topic relevant for the person right now? */
  relevant: (p: RetirementPersonalizationProfile) => boolean
}

const has = <T,>(list: T[] | undefined, ...values: T[]) =>
  Boolean(list?.some((v) => values.includes(v)))

const isPreRetirement = (p: RetirementPersonalizationProfile) =>
  p.retirementStage === 'still_working' || p.retirementStage === 'retiring_soon'

export const PILLAR_TOPICS: PillarTopic[] = [
  {
    id: 'fin_admin',
    pillar: 'financial',
    label: { fr: 'Démarches & droits', en: 'Paperwork & entitlements' },
    matches: (m) =>
      has(m.financialNeeds, 'retirement_application', 'entitlements', 'pension_income'),
    relevant: (p) => p.retirementAdminNeeds.length > 0 || isPreRetirement(p),
  },
  {
    id: 'fin_budget',
    pillar: 'financial',
    label: { fr: 'Budget', en: 'Budget' },
    matches: (m) => has(m.financialNeeds, 'budget'),
    relevant: (p) => p.financialNeeds.includes('budget'),
  },
  {
    id: 'fin_savings',
    pillar: 'financial',
    label: { fr: 'Épargne & placements', en: 'Savings & investing' },
    matches: (m) => has(m.financialNeeds, 'savings', 'investing'),
    relevant: (p) => p.investmentInterest,
  },
  {
    id: 'fin_property',
    pillar: 'financial',
    label: { fr: 'Logement & transmission', en: 'Home & inheritance' },
    matches: (m) => has(m.financialNeeds, 'property', 'inheritance'),
    relevant: (p) => p.propertyInterest || p.financialNeeds.includes('inheritance'),
  },
  {
    id: 'fin_income',
    pillar: 'financial',
    label: { fr: 'Revenus complémentaires', en: 'Extra income' },
    matches: (m) => has(m.financialNeeds, 'extra_income'),
    relevant: (p) => p.extraIncomeInterest,
  },
  {
    id: 'health_walking',
    pillar: 'health',
    label: { fr: 'Marche & plein air', en: 'Walking & outdoors' },
    matches: (m) => has(m.physicalActivities, 'walking', 'outdoor', 'cycling'),
    relevant: (p) =>
      has(p.preferredPhysicalActivities, 'walking', 'outdoor', 'cycling'),
  },
  {
    id: 'health_swimming',
    pillar: 'health',
    label: { fr: 'Natation', en: 'Swimming' },
    matches: (m) => has(m.physicalActivities, 'swimming'),
    relevant: (p) => p.preferredPhysicalActivities.includes('swimming'),
  },
  {
    id: 'health_group',
    pillar: 'health',
    label: { fr: 'Cours collectifs & danse', en: 'Group classes & dance' },
    matches: (m) => has(m.physicalActivities, 'group_exercise', 'dance'),
    relevant: (p) => has(p.preferredPhysicalActivities, 'group_exercise', 'dance'),
  },
  {
    id: 'health_strength',
    pillar: 'health',
    label: { fr: 'Renforcement & sport', en: 'Strength & sport' },
    matches: (m) =>
      has(m.physicalActivities, 'gym') || has(m.physicalGoals, 'strength', 'try_new_sport'),
    relevant: (p) =>
      p.preferredPhysicalActivities.includes('gym') ||
      has(p.physicalGoals, 'strength', 'try_new_sport'),
  },
  {
    id: 'health_gentle',
    pillar: 'health',
    label: { fr: 'Activité douce', en: 'Gentle activity' },
    matches: (m) => has(m.activityLevels, 'low'),
    relevant: (p) =>
      p.activityLevel === 'low' || has(p.physicalGoals, 'move_more', 'flexibility'),
  },
  {
    id: 'social_meet',
    pillar: 'social',
    label: { fr: 'Rencontrer du monde', en: 'Meeting people' },
    matches: (m) => has(m.socialGoals, 'new_friends', 'partner'),
    relevant: (p) => has(p.socialGoals, 'new_friends', 'partner'),
  },
  {
    id: 'social_regular',
    pillar: 'social',
    label: { fr: 'Rendez-vous réguliers', en: 'Regular get-togethers' },
    matches: (m) =>
      Boolean(m.recurring) || has(m.socialGoals, 'regular_occasions', 'group_activities'),
    relevant: (p) =>
      has(p.socialGoals, 'regular_occasions', 'group_activities') ||
      p.needForStructure === 'high',
  },
  {
    id: 'social_outings',
    pillar: 'social',
    label: { fr: 'Sorties & voyages en groupe', en: 'Group outings & trips' },
    matches: (m) => has(m.socialGoals, 'outing_companions'),
    relevant: (p) => p.socialGoals.includes('outing_companions'),
  },
  {
    id: 'social_easy',
    pillar: 'social',
    label: { fr: 'Facile à rejoindre seul·e', en: 'Easy to join alone' },
    matches: (m) => Boolean(m.lowBarrier),
    relevant: (p) => p.aloneComfort === 'low' || p.joiningReassuranceNeeds.length > 0,
  },
  {
    id: 'proj_travel',
    pillar: 'projects',
    label: { fr: 'Voyages', en: 'Travel' },
    matches: (m) => has(m.projectTypes, 'travel'),
    relevant: (p) => p.travelInterest,
  },
  {
    id: 'proj_volunteer',
    pillar: 'projects',
    label: { fr: 'Bénévolat', en: 'Volunteering' },
    matches: (m) => has(m.projectTypes, 'volunteering'),
    relevant: (p) => p.volunteeringInterest,
  },
  {
    id: 'proj_learning',
    pillar: 'projects',
    label: { fr: 'Apprendre', en: 'Learning' },
    matches: (m) => has(m.projectTypes, 'courses', 'language'),
    relevant: (p) => has(p.projects, 'courses', 'language'),
  },
  {
    id: 'proj_creative',
    pillar: 'projects',
    label: { fr: 'Création & culture', en: 'Creativity & culture' },
    matches: (m) => has(m.projectTypes, 'creative', 'culture'),
    relevant: (p) => has(p.projects, 'creative', 'culture'),
  },
  {
    id: 'proj_home',
    pillar: 'projects',
    label: { fr: 'Jardin & bricolage', en: 'Garden & DIY' },
    matches: (m) => has(m.projectTypes, 'gardening', 'home_project'),
    relevant: (p) => has(p.projects, 'gardening', 'home_project'),
  },
  {
    id: 'proj_business',
    pillar: 'projects',
    label: { fr: 'Entreprendre', en: 'Starting something' },
    matches: (m) => has(m.projectTypes, 'entrepreneurship'),
    relevant: (p) => has(p.projects, 'entrepreneurship'),
  },
]

export function topicIdsFor(meta: ResourceMatchMeta | undefined): string[] {
  if (!meta) return []
  return PILLAR_TOPICS.filter((topic) => topic.matches(meta)).map((t) => t.id)
}

export function topicsForPillar(pillar: PillarId): PillarTopic[] {
  return PILLAR_TOPICS.filter((topic) => topic.pillar === pillar)
}

export function isPillarId(value: string | null | undefined): value is PillarId {
  return (
    value === 'financial' ||
    value === 'health' ||
    value === 'social' ||
    value === 'projects'
  )
}

/** Pillars a local Lille record belongs to (never empty). */
export function pillarsForLilleResource(resource: {
  themeIds: ThemeId[]
  resourceType: string
}): PillarId[] {
  const ids = PILLAR_ORDER.filter((id) => {
    const pillar = PILLARS[id]
    return (
      pillar.lilleThemes.some((t) => resource.themeIds.includes(t)) ||
      (pillar.kinds ?? []).includes(resource.resourceType as ResourceKind)
    )
  })
  return ids.length > 0 ? ids : ['social']
}

/** Primary pillar follows the dataset’s own theme order (first theme first). */
export function primaryPillarForLilleResource(resource: {
  themeIds: ThemeId[]
  resourceType: string
}): PillarId {
  if (resource.resourceType === 'benefit') return 'financial'
  for (const theme of resource.themeIds) {
    const hit = PILLAR_ORDER.find((id) => PILLARS[id].lilleThemes.includes(theme))
    if (hit) return hit
  }
  return pillarsForLilleResource(resource)[0]!
}
