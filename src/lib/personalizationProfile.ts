import type {
  ActivityLevel,
  AssessmentAnswers,
  FinancialConfidence,
  FinancialNeed,
  PhysicalActivity,
  PhysicalGoal,
  ProjectType,
  RetirementPersonalizationProfile,
  RetirementProfile,
  SocialGoal,
  SocialPreferences,
} from '../types'
import { buildMentorMatchingProfile } from './mentorMatching'
import { asString, asStringArray } from './retirementStage'

const ADMIN_NEEDS: FinancialNeed[] = [
  'retirement_application',
  'entitlements',
  'pension_income',
]
const FINANCIAL_NEEDS: FinancialNeed[] = [
  ...ADMIN_NEEDS,
  'budget',
  'savings',
  'investing',
  'property',
  'inheritance',
  'extra_income',
]
const PHYSICAL_GOALS: PhysicalGoal[] = [
  'move_more',
  'stay_active',
  'strength',
  'flexibility',
  'try_new_sport',
]
const PHYSICAL_ACTIVITIES: PhysicalActivity[] = [
  'walking',
  'swimming',
  'group_exercise',
  'gym',
  'outdoor',
  'cycling',
  'dance',
]
const SOCIAL_GOALS: SocialGoal[] = [
  'maintain_relationships',
  'new_friends',
  'group_activities',
  'outing_companions',
  'partner',
  'regular_occasions',
]

const AMBITION_TO_PROJECT: Record<string, ProjectType> = {
  travel_more: 'travel',
  volunteer: 'volunteering',
  learn_language: 'language',
  learn_something: 'courses',
  creative_project: 'creative',
  home_project: 'home_project',
  small_business: 'entrepreneurship',
  lifelong_dream: 'lifelong_dream',
}

const INTEREST_TO_PROJECT: Record<string, ProjectType> = {
  travel: 'travel',
  volunteering: 'volunteering',
  languages: 'language',
  courses: 'courses',
  gardening: 'gardening',
  diy: 'home_project',
  crafts: 'creative',
  photography: 'creative',
  music: 'creative',
  culture: 'culture',
  history: 'culture',
  entrepreneurship: 'entrepreneurship',
}

function only<T extends string>(values: string[], allowed: readonly T[]): T[] {
  return values.filter((v): v is T => (allowed as readonly string[]).includes(v))
}

function pickOne<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : null
}

/** Lille and its attached communes (Lomme, Hellemmes) by name or postcode. */
export function isLilleArea(location: string): boolean {
  return /lille|lomme|hellemmes|\b59(000|800|160|260|777)\b/i.test(location)
}

export function buildPersonalizationProfile(args: {
  answers: AssessmentAnswers
  profile: RetirementProfile
  socialPreferences: SocialPreferences
}): RetirementPersonalizationProfile {
  const { answers, profile } = args
  const matching = buildMentorMatchingProfile(args)

  const financeRaw = asStringArray(answers.financialTopics)
  const financialNeeds = only(financeRaw, FINANCIAL_NEEDS)
  const interestsRaw = asStringArray(answers.interests)
  if (interestsRaw.includes('property') && !financialNeeds.includes('property')) {
    financialNeeds.push('property')
  }
  const ambitionsRaw = asStringArray(answers.ambitions)
  if (ambitionsRaw.includes('small_business') && !financialNeeds.includes('extra_income')) {
    // Starting a small activity usually comes with income questions.
    financialNeeds.push('extra_income')
  }

  const physicalRaw = asStringArray(answers.physicalPreferences)
  const physicalGoals = only(physicalRaw, PHYSICAL_GOALS)
  if (ambitionsRaw.includes('take_up_sport') && !physicalGoals.includes('try_new_sport')) {
    physicalGoals.push('try_new_sport')
  }
  const preferredPhysicalActivities = only(physicalRaw, PHYSICAL_ACTIVITIES)
  if (interestsRaw.includes('walking') && !preferredPhysicalActivities.includes('walking')) {
    preferredPhysicalActivities.push('walking')
  }

  const socialRaw = asStringArray(answers.socialGoals)
  const socialGoals = only(socialRaw, SOCIAL_GOALS)
  if (
    (ambitionsRaw.includes('meet_people') || ambitionsRaw.includes('join_group')) &&
    !socialGoals.includes('new_friends')
  ) {
    socialGoals.push(ambitionsRaw.includes('join_group') ? 'group_activities' : 'new_friends')
  }

  const projects = new Set<ProjectType>()
  for (const id of ambitionsRaw) {
    const mapped = AMBITION_TO_PROJECT[id]
    if (mapped) projects.add(mapped)
  }
  for (const id of interestsRaw) {
    const mapped = INTEREST_TO_PROJECT[id]
    if (mapped) projects.add(mapped)
  }
  const help = asStringArray(answers.helpTopics)
  if (help.includes('personal_project')) projects.add('personal_project')
  if (help.includes('volunteering')) projects.add('volunteering')
  if (help.includes('travel')) projects.add('travel')
  if (help.includes('learning')) projects.add('courses')

  const learningGoals = [...projects].filter((p) =>
    ['language', 'courses'].includes(p),
  )

  const location = isLilleArea(profile.situation.location) ? 'lille' : null

  return {
    retirementStage: matching.retirementStage ?? null,
    location,
    careerFamily: matching.careerFamily ?? null,

    financialConfidence: pickOne<FinancialConfidence>(
      asString(answers.financialConfidence),
      ['low', 'medium', 'high'],
    ),
    financialNeeds,
    retirementAdminNeeds: financialNeeds.filter((n) => ADMIN_NEEDS.includes(n)),
    financialGoals: financialNeeds.filter((n) => !ADMIN_NEEDS.includes(n)),
    investmentInterest:
      financialNeeds.includes('investing') || financialNeeds.includes('savings'),
    propertyInterest: financialNeeds.includes('property'),
    extraIncomeInterest: financialNeeds.includes('extra_income'),
    financialNothing: financeRaw.includes('nothing_particular'),

    activityLevel: pickOne<ActivityLevel>(asString(answers.activityLevel), [
      'low',
      'moderate',
      'active',
    ]),
    physicalGoals,
    preferredPhysicalActivities,
    physicalNothing: physicalRaw.includes('nothing_particular'),

    livingSituation: matching.livingSituation ?? null,
    socialNetworkStrength: matching.socialNetworkStrength ?? null,
    aloneComfort: matching.comfortDoingThingsAlone ?? null,
    socialGoals,
    socialNothing: socialRaw.includes('nothing_particular'),
    joiningReassuranceNeeds: matching.joiningReassuranceNeeds,

    interests: interestsRaw,
    projects: [...projects],
    learningGoals,
    travelInterest: projects.has('travel'),
    volunteeringInterest: projects.has('volunteering'),

    needForStructure: matching.needForStructure ?? null,
    adventureLevel: matching.adventureLevel ?? null,

    helpTopics: help,
    challenges: asStringArray(answers.challenges),
  }
}
