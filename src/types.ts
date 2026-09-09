export type LifeAreaId =
  | 'purpose'
  | 'people'
  | 'health'
  | 'money'
  | 'experiences'

export type LifeAreaStatus =
  | 'needs-attention'
  | 'worth-exploring'
  | 'going-well'
  | 'feeling-confident'
  | 'a-priority'

export interface LifeArea {
  id: LifeAreaId
  name: string
  landingDescription: string
  status: LifeAreaStatus
  statusLabel: string
  insight: string
}

export interface RetirementProfile {
  firstName: string
  vision: string
  mapSummary: string
  startingPoints: string[]
  learnings: string[]
  interests: string[]
  seeking: string[]
  preferences: string[]
  weeklyRhythm: string
  situation: {
    retiredDate: string
    location: string
    formerRole: string
  }
}

/** Theme identified from the Bilan */
export interface Theme {
  id: string
  title: string
  shortReason: string
  personalizationReason: string
  pathId: string
}

export type PathPhase = 'understand' | 'define' | 'reflect' | 'act'

export type GuidedStepType =
  | 'content'
  | 'singleChoice'
  | 'multiChoice'
  | 'reflection'
  | 'preference'
  | 'synthesis'
  | 'recommendation'
  | 'resourceDiscovery'
  | 'action'
  | 'concepts'

export type PathProgressStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'

export type GuidedStepRuntimeStatus =
  | 'locked'
  | 'available'
  | 'current'
  | 'completed'
  | 'postponed'

export interface GuidedStepOption {
  id: string
  label: string
}

export interface GuidedStep {
  id: string
  pathId: string
  phase: PathPhase
  type: GuidedStepType
  title: string
  /** Short body or intro */
  content: string
  estimatedMinutes: number
  options?: GuidedStepOption[]
  resourceIds?: string[]
  /** Profile fields this answer may update */
  profileKeys?: Array<'preferences' | 'interests' | 'seeking'>
  ctaLabel?: string
  discoverFilter?: DiscoverFilter
}

export interface GuidedPath {
  id: string
  themeId: string
  title: string
  description: string
  estimatedTotalMinutes: number
  steps: GuidedStep[]
}

export interface PathProgress {
  status: PathProgressStatus
  completedStepIds: string[]
  currentStepId: string | null
  responses: Record<string, AnswerValue>
}

export type JourneyPhaseType = 'discover' | 'define' | 'act'

export type JourneyStepStatus =
  | 'locked'
  | 'available'
  | 'scheduled'
  | 'inProgress'
  | 'completed'
  | 'postponed'

export type JourneyScreenType =
  | 'content'
  | 'timeline'
  | 'singleChoice'
  | 'multiChoice'
  | 'concepts'
  | 'insight'
  | 'preference'
  | 'synthesis'
  | 'scenario'
  | 'recommendation'
  | 'resourceSelection'
  | 'stepCompletion'

export interface JourneyScreenOption {
  id: string
  label: string
  description?: string
}

export interface JourneyTimelineItem {
  time: string
  label: string
}

export interface JourneyScreen {
  id: string
  type: JourneyScreenType
  title?: string
  paragraphs?: string[]
  question?: string
  options?: JourneyScreenOption[]
  timeline?: JourneyTimelineItem[]
  /** Persisted response key for this screen */
  responseKey?: string
  /** Dynamic synthesis / insight handler id */
  synthesisId?: string
  /** Step completion content id (type: stepCompletion) */
  completionId?: string
  sourceName?: string
  sourceUrl?: string
  ctaLabel?: string
}

export interface JourneyStep {
  id: string
  phaseId: string
  title: string
  description?: string
  estimatedMinutes: number
  screens: JourneyScreen[]
}

export interface JourneyPhase {
  id: string
  title: string
  type: JourneyPhaseType
  steps: JourneyStep[]
}

export type ThemeJourneyStatus = 'not_started' | 'in_progress' | 'in_action'

export interface ThemeJourney {
  id: string
  themeId: string
  pathId: string
  title: string
  description: string
  phases: JourneyPhase[]
}

export interface JourneyStepProgress {
  screenIndex: number
  responses: Record<string, AnswerValue>
  status: JourneyStepStatus
  completedAt?: string
}

export interface SocialPreferences {
  goals: string[]
  preferredGroupSize: string | null
  preferredFrequency: string | null
  preferredContext: string | null
  preferredContexts: string[]
  connectionPreference: string | null
  commitmentPreference: string | null
  exploredTypeId?: string | null
  previousWorkSocialNeeds: string[]
  workSocialChange: string | null
  socialFormInterests: string[]
  scenarioInvitation: string | null
  scenarioWhy: string[]
  idealWeekMoments: string | null
  idealWeekActivities: string[]
  opportunityTypeFeedback: Record<string, 'yes' | 'no'>
  selectedResourceId: string | null
  selectedActionLabel: string | null
}

export interface SocialResourceMeta {
  groupSize: 'small' | 'medium' | 'any'
  frequency: 'occasional' | 'regular' | 'any'
  context: 'activity' | 'together' | 'project' | 'any'
  commitment: 'punctual' | 'regular' | 'flexible'
  connection: 'new' | 'existing' | 'both'
  tags: string[]
}

export interface SocialFeedback {
  interestedIds: string[]
  dismissedIds: string[]
  laterIds: string[]
  dismissReasons: Record<string, string>
}

export interface CustomWeeklyStep {
  id: string
  weekId: string
  pathId: string
  themeId: string
  themeTitle: string
  stepId: string
  title: string
  subtitle: string
  phaseLabel: string
  estimatedMinutes: number
  resourceId?: string
  reason: string
}

export interface SocialOpportunityType {
  id: string
  title: string
  description: string
  filterTags: string[]
}

export interface WeekDefinition {
  id: string
  /** @deprecated Prefer formatWeekDateRange(offset, locale) */
  dateRange?: string
  /** Relative to CURRENT_WEEK_INDEX: negative = past */
  offset: number
}

export interface WeeklyStepItem {
  id: string
  weekId: string
  pathId: string
  themeId: string
  themeTitle: string
  stepId: string
  title: string
  subtitle: string
  phaseLabel: string
  estimatedMinutes: number
  completed: boolean
  carriedOver: boolean
  postponed: boolean
  type: GuidedStepType
}

export type ResourceCategory =
  | 'volunteering'
  | 'sport'
  | 'travel'
  | 'learning'
  | 'social'
  | 'work'
  | 'culture'

export type DiscoverFilter =
  | 'all'
  | 'engage'
  | 'move'
  | 'meet'
  | 'learn'
  | 'travel'
  | 'practice'

export interface ResourceRecommendation {
  id: string
  category: ResourceCategory
  categoryLabel: string
  discoverFilter: DiscoverFilter
  title: string
  description: string
  homeSnippet: string
  personalizationReason: string
  location: string
  metadata: string
  sourceName?: string
  externalUrl?: string
  image?: string
  saved: boolean
  addedToPlan: boolean
  /** Theme / path ids this resource supports */
  themeIds: string[]
  priorityIds?: string[]
  /** Lille dataset enrichment (optional for legacy mock resources) */
  resourceType?: string
  journeyRoles?: string[]
  seniorSpecific?: boolean
  commitmentLevel?: string
  costLabel?: string
  eligibility?: string
  whyUseful?: string
  tags?: string[]
  sourceUrl?: string
  sourceLastChecked?: string
  timeSensitive?: boolean
  address?: string | null
  neighborhood?: string | null
  lilleThemeIds?: string[]
}

export interface ResourceIdea {
  id: string
  title: string
  detail: string
  metadata: string
}

export type QuestionType = 'single' | 'multiple' | 'scale' | 'text'
export type QuestionLayout = 'list' | 'grid' | 'chips'
export type QuestionAdvance = 'auto' | 'continue'
export type RetirementStage = 'pre' | 'retired' | 'unknown'

export type AnswerValue =
  | string
  | string[]
  | number
  | Record<string, string>

export type AssessmentAnswers = Record<string, AnswerValue>

export interface LocalizedText {
  fr: string
  en: string
}

export interface AssessmentOption {
  /** Language-neutral value stored in answers. */
  id: string
  label: LocalizedText
}

export interface AssessmentQuestion {
  id: string
  prompt: LocalizedText
  type: QuestionType
  options?: AssessmentOption[]
  helper?: LocalizedText
  scaleStart?: LocalizedText
  scaleEnd?: LocalizedText
  layout?: QuestionLayout
  advance?: QuestionAdvance
  allowOther?: boolean
  /** Option id used for free-text "other". */
  otherOptionId?: string
  otherLabel?: LocalizedText
  /** Exclusive option id for multi-select. */
  exclusiveOption?: string
  stagePrompts?: {
    pre: LocalizedText
    retired: LocalizedText
  }
  stageHelpers?: {
    pre: LocalizedText
    retired: LocalizedText
  }
  /** Lightweight branching — omit question when false. */
  showIf?: (answers: AssessmentAnswers) => boolean
}

/** Language-neutral matching tags used by mentor scoring. */
export type MentorCareerFamily =
  | 'engineering'
  | 'education'
  | 'management'
  | 'entrepreneurship'
  | 'healthcare'
  | 'public_sector'
  | 'unpaid_care'
  | 'creative'
  | 'other'

export type MentorSocialStyle = 'reserved' | 'balanced' | 'outgoing'
export type MentorAdventureLevel = 'low' | 'moderate' | 'high'
export type MentorLivingSituation =
  | 'alone'
  | 'with_partner'
  | 'with_family'
  | 'other'

export type MentorFamilySituation =
  | 'children_nearby'
  | 'children_far'
  | 'no_children'
  | 'other'

/** Internal tags — not shown as raw ids in UI. */
export type MentorChallengeTag =
  | 'loss_of_structure'
  | 'joining_alone'
  | 'isolation'
  | 'identity_shift'
  | 'finding_purpose'
  | 'overcommitted'
  | 'energy_or_health'

export type MentorHelpTopic =
  | 'structure'
  | 'social'
  | 'activities_alone'
  | 'volunteering'
  | 'personal_project'
  | 'travel'
  | 'learning'
  | 'transmitting'

export type MentorInterestTag =
  | 'culture'
  | 'travel'
  | 'sport'
  | 'outdoors'
  | 'learning'
  | 'volunteering'
  | 'cooking'
  | 'gardening'
  | 'music'
  | 'community'
  | 'craft'
  | 'business'

export interface MentorLocalizedCopy {
  formerCareer: string
  formerIndustry?: string
  retirementStory: string
  shortBio: string
  quote: string
  availability: string
  /** Display labels for interests (UI only). */
  interestLabels: string[]
  challengeLabels: string[]
  helpTopicLabels: string[]
  personalityTraitLabels: string[]
  familySituationLabel: string
  livingSituationLabel: string
}

export interface Mentor {
  id: string
  /** Always a first name only — demo personas, not real people. */
  firstName: string
  age: number
  city: string
  yearsRetired: number
  languages: string[]
  /** Optional portrait for demo personas. Falls back to initials avatar. */
  photoUrl?: string
  /** Matching signals (language-neutral). */
  careerFamily: MentorCareerFamily
  livingSituation: MentorLivingSituation
  familySituation: MentorFamilySituation
  socialStyle: MentorSocialStyle
  adventureLevel: MentorAdventureLevel
  interests: MentorInterestTag[]
  challengesFaced: MentorChallengeTag[]
  topicsTheyCanHelpWith: MentorHelpTopic[]
  personalityTraits: string[]
  copy: {
    fr: MentorLocalizedCopy
    en: MentorLocalizedCopy
  }
}

export type TodoStatus = 'todo' | 'done' | 'later'
export type TodoSource = 'mentor' | 'juno' | 'user' | 'resource' | 'exercise'

export interface TodoItem {
  id: string
  title: string
  status: TodoStatus
  source: TodoSource
  relatedMentorId?: string
  relatedResourceId?: string
  relatedExerciseStepId?: string
  /** Only when a real-world date exists. */
  dueDate?: string
  createdAt: string
}

/** Prototype mentor call booking — local only. */
export type MentorCallStatus = 'scheduled' | 'cancelled'

export interface MentorCall {
  id: string
  mentorId: string
  /** ISO datetime for the selected slot. */
  startAt: string
  status: MentorCallStatus
}

export interface MentorMatchReason {
  id: string
  /** Longer explanation — used on mentor profile. */
  text: string
  /** Compact signal for match cards / comparison. */
  shortLabel: string
}

export interface MentorMatchResult {
  mentor: Mentor
  /** Internal ranking only — never shown as a percentage. */
  score: number
  matchReasons: MentorMatchReason[]
}

export type RetirementStageTag =
  | 'still_working'
  | 'retiring_soon'
  | 'recently_retired'
  | 'retired_years'

export type SocialNetworkStrength =
  | 'regular'
  | 'close_few'
  | 'rare'
  | 'few_around'
  | 'often_alone'

export type JoiningReassuranceNeed =
  | 'small_group'
  | 'others_alone'
  | 'welcomed'
  | 'speak_organizer'
  | 'clear_activity'
  | 'go_with_someone'
  | 'know_what_to_expect'

export type WorkProvidedTag =
  | 'structure'
  | 'social_contact'
  | 'purpose'
  | 'learning'
  | 'status'
  | 'usefulness'
  | 'activity'
  | 'teamwork'
  | 'income'
  | 'routine'

export type WantMoreOfTag =
  | 'social_contact'
  | 'structure'
  | 'activity'
  | 'learning'
  | 'travel'
  | 'usefulness'
  | 'personal_projects'
  | 'creativity'
  | 'family_time'
  | 'new_experiences'
  | 'financial_projects'
  | 'starting_something'
  | 'quieter_life'

export type AmbitionTag =
  | 'volunteer'
  | 'small_business'
  | 'invest_property'
  | 'travel_more'
  | 'learn_something'
  | 'take_up_sport'
  | 'join_group'
  | 'creative_project'
  | 'family_time'
  | 'meet_people'
  | 'not_sure'

/**
 * Lightweight matching profile derived from bilan + prefs + retirement profile.
 */
export interface MentorMatchingProfile {
  retirementStage?: RetirementStageTag | null
  careerFamily?: MentorCareerFamily | null
  careerIdentityImportance?: 'low' | 'moderate' | 'high' | null
  workProvided: WorkProvidedTag[]
  livingSituation?: MentorLivingSituation | null
  familySituation?: MentorFamilySituation | null
  socialNetworkStrength?: SocialNetworkStrength | null
  socialStyle?: MentorSocialStyle | null
  adventureLevel?: MentorAdventureLevel | null
  interests: MentorInterestTag[]
  challenges: MentorChallengeTag[]
  helpTopics: MentorHelpTopic[]
  needForStructure?: 'low' | 'moderate' | 'high' | null
  comfortDoingThingsAlone?: 'low' | 'moderate' | 'high' | null
  joiningReassuranceNeeds: JoiningReassuranceNeed[]
  wantMoreOf: WantMoreOfTag[]
  ambitions: AmbitionTag[]
  goals: string[]
}

/** Lightweight signals consumed by resource recommendations. */
export interface BilanResourceSignals {
  aloneComfort?: 'low' | 'moderate' | 'high' | null
  needForStructure?: 'low' | 'moderate' | 'high' | null
  joiningReassuranceNeeds: JoiningReassuranceNeed[]
  interests: MentorInterestTag[]
  wantMoreOf: WantMoreOfTag[]
}

export type MessageRole = 'user' | 'coach'

export type SuggestionStatus = 'pending' | 'added' | 'dismissed'

export interface PlanSuggestion {
  id: string
  title: string
  description: string
  taskLabel: string
  priorityId: string
}

export interface ChatAction {
  label: string
  to: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  suggestion?: PlanSuggestion
  suggestionStatus?: SuggestionStatus
  action?: ChatAction
}

export interface ChatOpenOptions {
  initialContext?: string
  initialPrompt?: string
  relatedPriorityId?: string
  relatedResourceId?: string
  relatedPathId?: string
  relatedStepId?: string
  greeting?: string
}

/** @deprecated Prefer Theme / GuidedPath — kept for coach suggestion IDs */
export type PriorityStatus = 'active' | 'progressing' | 'paused' | 'completed'

export interface Priority {
  id: string
  title: string
  description: string
  personalizationReason: string
  status: PriorityStatus
  statusLabel: string
  nextStepId?: string
  resourceIds: string[]
}
