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
export type QuestionLayout = 'list' | 'grid'
export type QuestionAdvance = 'auto' | 'continue'
export type RetirementStage = 'pre' | 'retired' | 'unknown'

export interface AssessmentQuestion {
  id: string
  prompt: string
  type: QuestionType
  options?: string[]
  helper?: string
  scaleStart?: string
  scaleEnd?: string
  layout?: QuestionLayout
  advance?: QuestionAdvance
  allowOther?: boolean
  otherLabel?: string
  exclusiveOption?: string
  stagePrompts?: {
    pre: string
    retired: string
  }
  stageHelpers?: {
    pre: string
    retired: string
  }
}

export type AnswerValue =
  | string
  | string[]
  | number
  | Record<string, string>

export type AssessmentAnswers = Record<string, AnswerValue>

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
