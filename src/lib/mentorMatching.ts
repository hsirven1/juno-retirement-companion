import { getAllMentors } from '../data/mentors'
import { asString, asStringArray } from './retirementStage'
import type {
  AmbitionTag,
  AssessmentAnswers,
  BilanResourceSignals,
  JoiningReassuranceNeed,
  Mentor,
  MentorAdventureLevel,
  MentorCareerFamily,
  MentorChallengeTag,
  MentorFamilySituation,
  MentorHelpTopic,
  MentorInterestTag,
  MentorLivingSituation,
  MentorMatchReason,
  MentorMatchResult,
  MentorMatchingProfile,
  MentorSocialStyle,
  RetirementProfile,
  RetirementStageTag,
  SocialNetworkStrength,
  SocialPreferences,
  WantMoreOfTag,
  WorkProvidedTag,
} from '../types'
import type { Locale } from '../i18n/types'

function overlapCount<T>(a: T[], b: T[]): number {
  const set = new Set(a)
  return b.filter((item) => set.has(item)).length
}

function pick<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  if (!value) return null
  return (allowed as readonly string[]).includes(value) ? (value as T) : null
}

const CAREER_FAMILIES = [
  'engineering',
  'education',
  'management',
  'entrepreneurship',
  'healthcare',
  'public_sector',
  'unpaid_care',
  'creative',
  'other',
] as const satisfies readonly MentorCareerFamily[]

const LIVING = [
  'alone',
  'with_partner',
  'with_family',
  'other',
] as const satisfies readonly MentorLivingSituation[]

const FAMILY = [
  'children_nearby',
  'children_far',
  'no_children',
  'other',
] as const satisfies readonly MentorFamilySituation[]

const STAGES = [
  'still_working',
  'retiring_soon',
  'recently_retired',
  'retired_years',
] as const satisfies readonly RetirementStageTag[]

const INTEREST_MAP: Record<string, MentorInterestTag[]> = {
  travel: ['travel'],
  culture: ['culture'],
  photography: ['culture', 'craft'],
  music: ['music'],
  reading: ['learning', 'culture'],
  gardening: ['gardening', 'outdoors'],
  cooking: ['cooking'],
  sport: ['sport'],
  walking: ['outdoors', 'sport'],
  nature: ['outdoors'],
  diy: ['craft'],
  technology: ['learning'],
  languages: ['learning'],
  history: ['culture', 'learning'],
  volunteering: ['volunteering', 'community'],
  entrepreneurship: ['business'],
  property: ['business'],
  crafts: ['craft'],
  games: ['community'],
  social_activities: ['community'],
}

function inferCareerFamily(
  answers: AssessmentAnswers,
  profile: RetirementProfile,
): MentorCareerFamily | null {
  const direct = pick(asString(answers.careerFamily), CAREER_FAMILIES)
  if (direct) return direct

  const role = `${profile.situation.formerRole} ${profile.interests.join(' ')}`.toLowerCase()
  if (/ingénieur|engineer|tech|informatique/.test(role)) return 'engineering'
  if (/prof|enseignant|teacher|éducation|education/.test(role)) return 'education'
  if (/directeur|directrice|cadre|manager|executive|marketing/.test(role))
    return 'management'
  if (/entrepreneur|commerce|fondateur/.test(role)) return 'entrepreneurship'
  if (/infirm|médecin|santé|nurse|health/.test(role)) return 'healthcare'
  if (/fonction publique|public/.test(role)) return 'public_sector'
  if (/aidant|caregiver/.test(role)) return 'unpaid_care'
  return null
}

function inferCareerIdentity(
  answers: AssessmentAnswers,
): MentorMatchingProfile['careerIdentityImportance'] {
  const work = asStringArray(answers.workProvided)
  if (work.includes('status') || work.includes('purpose')) return 'high'
  if (work.includes('usefulness') || work.includes('learning')) return 'moderate'
  const challenges = asStringArray(answers.challenges)
  if (challenges.includes('leaving_identity')) return 'high'
  return 'moderate'
}

function inferAdventure(
  answers: AssessmentAnswers,
  prefs: SocialPreferences,
): MentorAdventureLevel | null {
  const novelty = asString(answers.novelty)
  if (novelty === 'try_freely') return 'high'
  if (novelty === 'curious_prepared') return 'moderate'
  if (novelty === 'need_reassurance' || novelty === 'prefer_familiar') return 'low'

  const want = asStringArray(answers.wantMoreOf)
  const ambitions = asStringArray(answers.ambitions)
  if (want.includes('new_experiences') || ambitions.includes('travel_more')) {
    return 'high'
  }
  if (
    prefs.preferredGroupSize === 'small' ||
    prefs.scenarioInvitation === 'cafe'
  ) {
    return 'low'
  }
  return 'moderate'
}

function inferSocialStyle(
  answers: AssessmentAnswers,
  prefs: SocialPreferences,
): MentorSocialStyle | null {
  const network = asString(answers.socialNetwork)
  if (network === 'regular') return 'outgoing'
  if (network === 'few_around' || network === 'often_alone') return 'reserved'
  if (network === 'close_few' || network === 'rare') return 'balanced'

  if (prefs.preferredGroupSize === 'large') return 'outgoing'
  if (prefs.preferredGroupSize === 'small') return 'reserved'
  return 'balanced'
}

function inferInterests(
  answers: AssessmentAnswers,
  profile: RetirementProfile,
  prefs: SocialPreferences,
): MentorInterestTag[] {
  const tags = new Set<MentorInterestTag>()
  for (const id of asStringArray(answers.interests)) {
    for (const tag of INTEREST_MAP[id] ?? []) tags.add(tag)
  }

  for (const id of asStringArray(answers.wantMoreOf)) {
    if (id === 'travel') tags.add('travel')
    if (id === 'learning') tags.add('learning')
    if (id === 'social_contact') tags.add('community')
    if (id === 'creativity') tags.add('craft')
    if (id === 'activity') tags.add('sport')
  }

  for (const id of asStringArray(answers.ambitions)) {
    if (id === 'volunteer') tags.add('volunteering')
    if (id === 'small_business') tags.add('business')
    if (id === 'travel_more') tags.add('travel')
    if (id === 'learn_something') tags.add('learning')
    if (id === 'take_up_sport') tags.add('sport')
    if (id === 'creative_project') tags.add('craft')
    if (id === 'meet_people' || id === 'join_group') tags.add('community')
  }

  const blob = [...profile.interests, ...profile.seeking].join(' ').toLowerCase()
  if (/vélo|sport|bouger|marche|cycl/.test(blob)) tags.add('sport')
  if (/voyage|travel/.test(blob)) tags.add('travel')
  if (/histoire|culture|musée|photo|musique/.test(blob)) tags.add('culture')
  if (/apprendre|atelier|cours/.test(blob)) tags.add('learning')
  if (/bénévolat|utile|transmettre|mentor/.test(blob)) tags.add('volunteering')

  if (prefs.socialFormInterests.includes('engager')) tags.add('volunteering')
  if (prefs.idealWeekActivities.includes('sport')) tags.add('sport')

  return [...tags]
}

function inferChallenges(
  answers: AssessmentAnswers,
  prefs: SocialPreferences,
): MentorChallengeTag[] {
  const tags = new Set<MentorChallengeTag>()
  for (const id of asStringArray(answers.challenges)) {
    if (id === 'loss_of_structure' || id === 'empty_time') {
      tags.add('loss_of_structure')
    }
    if (id === 'meeting_people') tags.add('isolation')
    if (id === 'doing_things_alone') tags.add('joining_alone')
    if (id === 'knowing_what_i_want' || id === 'feeling_useful') {
      tags.add('finding_purpose')
    }
    if (id === 'leaving_identity') tags.add('identity_shift')
    if (id === 'finding_activities' || id === 'staying_active') {
      tags.add('finding_purpose')
    }
  }

  const alone = asString(answers.aloneComfort)
  if (alone === 'prefer_known' || alone === 'might_give_up') {
    tags.add('joining_alone')
  }

  const network = asString(answers.socialNetwork)
  if (network === 'few_around' || network === 'often_alone') {
    tags.add('isolation')
  }

  const work = asStringArray(answers.workProvided)
  if (work.includes('structure') || work.includes('routine')) {
    const empty = asString(answers.emptyDays)
    if (empty === 'bored_quickly' || empty === 'prefer_planned' || empty === 'uneasy_empty') {
      tags.add('loss_of_structure')
    }
  }

  if (
    prefs.scenarioInvitation === 'cafe' ||
    prefs.scenarioWhy.includes('petit-groupe')
  ) {
    tags.add('joining_alone')
  }

  return [...tags]
}

function inferHelpTopics(
  answers: AssessmentAnswers,
  profile: RetirementProfile,
  prefs: SocialPreferences,
): MentorHelpTopic[] {
  const tags = new Set<MentorHelpTopic>()
  for (const id of asStringArray(answers.helpTopics)) {
    if (id === 'structure' || id === 'practical_transition' || id === 'staying_active') {
      tags.add('structure')
    }
    if (id === 'social') tags.add('social')
    if (id === 'finding_activities' || id === 'activities_alone') {
      tags.add('activities_alone')
    }
    if (id === 'personal_project') tags.add('personal_project')
    if (id === 'volunteering') tags.add('volunteering')
    if (id === 'travel') tags.add('travel')
    if (id === 'learning') tags.add('learning')
    if (id === 'identity') tags.add('transmitting')
  }

  for (const id of asStringArray(answers.wantMoreOf)) {
    if (id === 'structure') tags.add('structure')
    if (id === 'social_contact') tags.add('social')
    if (id === 'travel') tags.add('travel')
    if (id === 'learning') tags.add('learning')
    if (id === 'personal_projects' || id === 'starting_something') {
      tags.add('personal_project')
    }
    if (id === 'usefulness') tags.add('volunteering')
  }

  for (const id of asStringArray(answers.ambitions)) {
    if (id === 'volunteer') tags.add('volunteering')
    if (id === 'travel_more') tags.add('travel')
    if (id === 'learn_something') tags.add('learning')
    if (id === 'meet_people' || id === 'join_group') tags.add('social')
    if (id === 'small_business' || id === 'creative_project') {
      tags.add('personal_project')
    }
  }

  const seeking = profile.seeking.join(' ').toLowerCase()
  if (/rythme|structure/.test(seeking)) tags.add('structure')
  if (/rencontre|monde|social/.test(seeking)) tags.add('social')
  if (prefs.socialFormInterests.includes('engager')) tags.add('volunteering')
  if (prefs.connectionPreference === 'new') tags.add('social')
  return [...tags]
}

function inferNeedForStructure(
  answers: AssessmentAnswers,
  prefs: SocialPreferences,
): MentorMatchingProfile['needForStructure'] {
  const empty = asString(answers.emptyDays)
  if (empty === 'uneasy_empty' || empty === 'prefer_planned') return 'high'
  if (empty === 'bored_quickly') return 'high'
  if (empty === 'relaxing') return 'low'
  if (empty === 'fine_sometimes') return 'moderate'

  const want = asStringArray(answers.wantMoreOf)
  if (want.includes('structure')) return 'high'
  if (want.includes('quieter_life')) return 'low'

  if (
    prefs.preferredFrequency === 'regular' ||
    prefs.preferredFrequency === 'more'
  ) {
    return 'high'
  }
  if (prefs.preferredFrequency === 'occasional') return 'low'
  return 'moderate'
}

function inferAloneComfort(
  answers: AssessmentAnswers,
  prefs: SocialPreferences,
): MentorMatchingProfile['comfortDoingThingsAlone'] {
  const alone = asString(answers.aloneComfort)
  if (alone === 'go_easily') return 'high'
  if (alone === 'a_bit_apprehensive') return 'moderate'
  if (alone === 'prefer_known' || alone === 'might_give_up') return 'low'

  if (prefs.scenarioInvitation === 'sortie' || prefs.preferredGroupSize === 'large') {
    return 'low'
  }
  if (
    prefs.scenarioInvitation === 'cafe' ||
    prefs.scenarioInvitation === 'benevolat'
  ) {
    return 'high'
  }
  return 'moderate'
}

/** Build matching inputs from bilan + prefs + profile. */
export function buildMentorMatchingProfile(args: {
  answers: AssessmentAnswers
  profile: RetirementProfile
  socialPreferences: SocialPreferences
}): MentorMatchingProfile {
  const { answers, profile, socialPreferences } = args
  const workProvided = asStringArray(answers.workProvided).filter((id): id is WorkProvidedTag =>
    [
      'structure',
      'social_contact',
      'purpose',
      'learning',
      'status',
      'usefulness',
      'activity',
      'teamwork',
      'income',
      'routine',
    ].includes(id),
  )
  const joiningReassuranceNeeds = asStringArray(answers.joiningEasier).filter(
    (id): id is JoiningReassuranceNeed =>
      [
        'small_group',
        'others_alone',
        'welcomed',
        'speak_organizer',
        'clear_activity',
        'go_with_someone',
        'know_what_to_expect',
      ].includes(id),
  )
  const wantMoreOf = asStringArray(answers.wantMoreOf).filter((id): id is WantMoreOfTag =>
    [
      'social_contact',
      'structure',
      'activity',
      'learning',
      'travel',
      'usefulness',
      'personal_projects',
      'creativity',
      'family_time',
      'new_experiences',
      'financial_projects',
      'starting_something',
      'quieter_life',
    ].includes(id),
  )
  const ambitions = asStringArray(answers.ambitions).filter((id): id is AmbitionTag =>
    [
      'volunteer',
      'small_business',
      'invest_property',
      'travel_more',
      'learn_something',
      'take_up_sport',
      'join_group',
      'creative_project',
      'family_time',
      'meet_people',
      'not_sure',
    ].includes(id),
  )

  return {
    retirementStage: pick(asString(answers.retirementStage), STAGES),
    careerFamily: inferCareerFamily(answers, profile),
    careerIdentityImportance: inferCareerIdentity(answers),
    workProvided,
    livingSituation: pick(asString(answers.livingSituation), LIVING),
    familySituation: pick(asString(answers.familySituation), FAMILY),
    socialNetworkStrength: pick(asString(answers.socialNetwork), [
      'regular',
      'close_few',
      'rare',
      'few_around',
      'often_alone',
    ] as const satisfies readonly SocialNetworkStrength[]),
    socialStyle: inferSocialStyle(answers, socialPreferences),
    adventureLevel: inferAdventure(answers, socialPreferences),
    interests: inferInterests(answers, profile, socialPreferences),
    challenges: inferChallenges(answers, socialPreferences),
    helpTopics: inferHelpTopics(answers, profile, socialPreferences),
    needForStructure: inferNeedForStructure(answers, socialPreferences),
    comfortDoingThingsAlone: inferAloneComfort(answers, socialPreferences),
    joiningReassuranceNeeds,
    wantMoreOf,
    ambitions,
    goals: profile.seeking,
  }
}

export function toBilanResourceSignals(
  profile: MentorMatchingProfile,
): BilanResourceSignals {
  return {
    aloneComfort: profile.comfortDoingThingsAlone,
    needForStructure: profile.needForStructure,
    joiningReassuranceNeeds: profile.joiningReassuranceNeeds,
    interests: profile.interests,
    wantMoreOf: profile.wantMoreOf,
  }
}

function reason(
  id: string,
  longFr: string,
  longEn: string,
  shortFr: string,
  shortEn: string,
  locale: Locale,
): MentorMatchReason {
  return {
    id,
    text: locale === 'en' ? longEn : longFr,
    shortLabel: locale === 'en' ? shortEn : shortFr,
  }
}

function labelsForOverlap<T extends string>(
  ids: T[],
  labels: string[],
  wanted: T[],
): string[] {
  const wantedSet = new Set(wanted)
  return ids.flatMap((id, index) => {
    if (!wantedSet.has(id)) return []
    const label = labels[index]
    return label ? [label] : []
  })
}

function joinShort(parts: string[], locale: Locale): string {
  const clean = parts.filter(Boolean).slice(0, 2)
  if (clean.length === 0) return locale === 'en' ? 'Shared interests' : 'Intérêts en commun'
  if (clean.length === 1) return clean[0]!
  return `${clean[0]} & ${clean[1]}`
}

const HELP_SIGNAL: Record<MentorHelpTopic, { fr: string; en: string }> = {
  structure: { fr: 'Rythme structuré', en: 'Structured rhythm' },
  social: { fr: 'Vie sociale', en: 'Social life' },
  activities_alone: { fr: 'Essayer en solo', en: 'Trying things alone' },
  volunteering: { fr: 'Bénévolat', en: 'Volunteering' },
  personal_project: { fr: 'Projet personnel', en: 'Personal project' },
  travel: { fr: 'Voyages', en: 'Travel' },
  learning: { fr: 'Apprendre', en: 'Learning' },
  transmitting: { fr: 'Transmettre', en: 'Passing things on' },
}

function scoreMentor(
  mentor: Mentor,
  profile: MentorMatchingProfile,
  locale: Locale,
): MentorMatchResult {
  let score = 0
  const matchReasons: MentorMatchReason[] = []
  const copy = mentor.copy[locale] ?? mentor.copy.fr

  // Career similarity — soft weight only
  if (profile.careerFamily && profile.careerFamily === mentor.careerFamily) {
    score += 2
    if (profile.careerIdentityImportance === 'high') {
      score += 1
      matchReasons.push(
        reason(
          'career',
          'Vous venez tous les deux d’environnements professionnels structurés.',
          'You both came from structured professional environments.',
          copy.formerCareer,
          copy.formerCareer,
          locale,
        ),
      )
    }
  }

  const interestHits = overlapCount(profile.interests, mentor.interests)
  if (interestHits > 0) {
    score += interestHits * 2
    const sharedInterestLabels = labelsForOverlap(
      mentor.interests,
      copy.interestLabels,
      profile.interests,
    )
    const interestShort = joinShort(
      sharedInterestLabels.length > 0
        ? sharedInterestLabels
        : copy.interestLabels.slice(0, 2),
      locale,
    )
    if (interestHits >= 2) {
      matchReasons.push(
        reason(
          'interests',
          `Vous partagez plusieurs centres d’intérêt, comme ${copy.interestLabels
            .slice(0, 2)
            .join(' et ')
            .toLowerCase()}.`,
          `You share several interests, such as ${copy.interestLabels
            .slice(0, 2)
            .join(' and ')
            .toLowerCase()}.`,
          interestShort,
          interestShort,
          locale,
        ),
      )
    } else {
      matchReasons.push(
        reason(
          'interests',
          `Vous avez un intérêt en commun autour de ${copy.interestLabels[0]?.toLowerCase() ?? 'vos activités'}.`,
          `You share an interest around ${copy.interestLabels[0]?.toLowerCase() ?? 'your activities'}.`,
          interestShort,
          interestShort,
          locale,
        ),
      )
    }
  }

  const challengeHits = overlapCount(
    profile.challenges,
    mentor.challengesFaced,
  )
  if (challengeHits > 0) {
    score += challengeHits * 3
    if (mentor.challengesFaced.includes('joining_alone')) {
      matchReasons.push(
        reason(
          'joining_alone',
          `${mentor.firstName} a aussi trouvé difficile de rejoindre des activités seule au début.`,
          `${mentor.firstName} also found it difficult to join activities alone at first.`,
          'A connu la difficulté d’y aller seul·e',
          'Knew how hard it is to go alone',
          locale,
        ),
      )
    } else if (mentor.challengesFaced.includes('loss_of_structure')) {
      matchReasons.push(
        reason(
          'structure',
          `${mentor.firstName} a aussi dû retrouver des repères après la perte du rythme professionnel.`,
          `${mentor.firstName} also had to find new landmarks after losing work structure.`,
          'Rythme structuré',
          'Structured rhythm',
          locale,
        ),
      )
    } else if (mentor.challengesFaced.includes('isolation')) {
      matchReasons.push(
        reason(
          'isolation',
          `${mentor.firstName} connaît aussi les périodes où le lien social se raréfie.`,
          `${mentor.firstName} also knows periods when social connection thins out.`,
          'Connait les périodes d’isolement',
          'Knows quieter, lonelier stretches',
          locale,
        ),
      )
    } else {
      matchReasons.push(
        reason(
          'challenges',
          `Certaines difficultés que vous décrivez font écho au parcours de ${mentor.firstName}.`,
          `Some of the difficulties you describe echo ${mentor.firstName}’s path.`,
          'Parcours qui fait écho',
          'A path that resonates',
          locale,
        ),
      )
    }
  }

  const helpHits = overlapCount(
    profile.helpTopics,
    mentor.topicsTheyCanHelpWith,
  )
  if (helpHits > 0) {
    score += helpHits * 2
    const sharedHelp = mentor.topicsTheyCanHelpWith.filter((topic) =>
      profile.helpTopics.includes(topic),
    )
    const helpShort = joinShort(
      sharedHelp.map((topic) => HELP_SIGNAL[topic][locale === 'en' ? 'en' : 'fr']),
      locale,
    )
    matchReasons.push(
      reason(
        'help',
        `${mentor.firstName} peut vous accompagner sur des sujets qui semblent compter pour vous.`,
        `${mentor.firstName} can support you on topics that seem to matter to you.`,
        helpShort,
        helpShort,
        locale,
      ),
    )
  }

  if (profile.socialStyle && profile.socialStyle === mentor.socialStyle) {
    score += 2
    matchReasons.push(
      reason(
        'social_style',
        'Votre façon d’être avec les autres semble assez proche.',
        'Your ways of being with others seem fairly close.',
        'Style relationnel proche',
        'Similar social style',
        locale,
      ),
    )
  } else if (
    profile.socialStyle &&
    ((profile.socialStyle === 'reserved' && mentor.socialStyle === 'balanced') ||
      (profile.socialStyle === 'balanced' && mentor.socialStyle === 'reserved'))
  ) {
    score += 1
  }

  if (
    profile.adventureLevel &&
    profile.adventureLevel === mentor.adventureLevel
  ) {
    score += 2
    if (mentor.adventureLevel === 'high') {
      matchReasons.push(
        reason(
          'adventure',
          'Vous semblez tous les deux ouverts aux expériences un peu plus aventureuses.',
          'You both seem open to slightly more adventurous experiences.',
          'Ouverture à l’aventure',
          'Open to adventure',
          locale,
        ),
      )
    }
  }

  if (
    profile.livingSituation &&
    profile.livingSituation === mentor.livingSituation
  ) {
    score += 2
  }

  if (
    profile.familySituation &&
    profile.familySituation === mentor.familySituation
  ) {
    score += 1
  }

  if (
    profile.retirementStage === 'recently_retired' &&
    mentor.yearsRetired <= 3
  ) {
    score += 2
  }
  if (
    profile.retirementStage === 'retired_years' &&
    mentor.yearsRetired >= 3
  ) {
    score += 1
  }
  if (
    (profile.retirementStage === 'still_working' ||
      profile.retirementStage === 'retiring_soon') &&
    mentor.yearsRetired <= 4
  ) {
    score += 1
  }

  if (
    profile.needForStructure === 'high' &&
    mentor.topicsTheyCanHelpWith.includes('structure')
  ) {
    score += 3
  }
  if (
    profile.comfortDoingThingsAlone === 'low' &&
    mentor.challengesFaced.includes('joining_alone')
  ) {
    score += 3
  }
  if (
    profile.comfortDoingThingsAlone === 'high' &&
    mentor.topicsTheyCanHelpWith.includes('activities_alone')
  ) {
    score += 1
  }
  if (
    profile.joiningReassuranceNeeds.includes('small_group') &&
    mentor.socialStyle !== 'outgoing'
  ) {
    score += 1
  }
  if (
    (profile.wantMoreOf.includes('social_contact') ||
      profile.ambitions.includes('meet_people')) &&
    mentor.topicsTheyCanHelpWith.includes('social')
  ) {
    score += 2
  }
  if (
    (profile.ambitions.includes('small_business') ||
      profile.wantMoreOf.includes('starting_something')) &&
    mentor.topicsTheyCanHelpWith.includes('personal_project')
  ) {
    score += 2
  }
  if (
    (profile.ambitions.includes('volunteer') ||
      profile.wantMoreOf.includes('usefulness')) &&
    mentor.topicsTheyCanHelpWith.includes('volunteering')
  ) {
    score += 2
  }

  score += Math.min(2, matchReasons.length)

  const seen = new Set<string>()
  const uniqueReasons = matchReasons.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })

  return {
    mentor,
    score,
    matchReasons: uniqueReasons.slice(0, 3),
  }
}

/**
 * Deterministic mentor ranking for the prototype.
 * Does not return percentages — only ordered results + human reasons.
 */
export function matchMentors(
  profile: MentorMatchingProfile,
  options?: { locale?: Locale; limit?: number },
): MentorMatchResult[] {
  const locale = options?.locale ?? 'fr'
  const limit = options?.limit ?? 5

  return getAllMentors()
    .map((mentor) => scoreMentor(mentor, profile, locale))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.mentor.id.localeCompare(b.mentor.id)
    })
    .slice(0, limit)
}
