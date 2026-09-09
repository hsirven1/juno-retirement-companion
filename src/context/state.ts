import { createContext } from 'react'
import type {
  AssessmentAnswers,
  AnswerValue,
  ChatMessage,
  ChatOpenOptions,
  MentorCall,
  MentorMatchResult,
  PathProgress,
  ResourceRecommendation,
  RetirementProfile,
  SocialFeedback,
  SocialPreferences,
  TodoItem,
  TodoStatus,
  WeeklyStepItem,
} from '../types'
import type { PersistedState } from '../lib/persistence'

export interface AppState {
  onboardingComplete: boolean
  completeOnboarding: () => void
  enterAsReturningUser: () => void
  answers: AssessmentAnswers
  setAnswer: (questionId: string, value: AnswerValue) => void
  profile: RetirementProfile
  activeThemeIds: string[]
  pathProgress: Record<string, PathProgress>
  completeGuidedStep: (
    pathId: string,
    stepId: string,
    response?: AnswerValue,
  ) => void
  startPath: (pathId: string) => void
  postponeWeeklyStep: (item: WeeklyStepItem) => void
  toggleWeeklyStepComplete: (item: WeeklyStepItem) => void
  postponedStepIds: string[]
  deferredToWeek: Record<string, string[]>
  completedWeeklyStepIds: string[]
  getWeekSteps: (weekIndex: number) => WeeklyStepItem[]
  resources: ResourceRecommendation[]
  toggleResourceSaved: (id: string) => void
  markResourceAdded: (id: string) => void
  messages: ChatMessage[]
  sendMessage: (text: string) => void
  respondToSuggestion: (messageId: string, accept: boolean) => void
  chatOpen: boolean
  chatOptions: ChatOpenOptions | null
  openChat: (options?: ChatOpenOptions) => void
  closeChat: () => void
  guidedThemeOpen: boolean
  openGuidedTheme: (stepId?: string) => void
  openGuidedStep: (stepId: string) => void
  closeGuidedTheme: () => void
  activeJourneyStepId: string | null
  completeJourneyStep: (stepId: string) => void
  getJourneyStepState: (stepId: string) => {
    screenIndex: number
    responses: Record<string, AnswerValue>
    status: string
  }
  setJourneyStepScreen: (stepId: string, screenIndex: number) => void
  setJourneyStepResponse: (
    stepId: string,
    responseKey: string,
    value: AnswerValue,
  ) => void
  mockCurrentWeekIndex: number
  setMockCurrentWeekIndex: (index: number) => void
  postponeNotice: string | null
  clearPostponeNotice: () => void
  persisted: PersistedState
  socialPreferences: SocialPreferences
  socialFeedback: SocialFeedback
  setSocialPreferences: (prefs: SocialPreferences) => void
  markSocialInterest: (resource: ResourceRecommendation) => void
  dismissSocialResource: (resourceId: string, reason?: string) => void
  laterSocialResource: (resourceId: string) => void
  addSocialWeekStep: (resource: ResourceRecommendation) => void
  locale: import('../i18n/types').Locale
  setLocale: (locale: import('../i18n/types').Locale) => void
  /** Mentor-first foundations */
  todos: TodoItem[]
  matchedMentorId: string | null
  mentorShortlistIds: string[]
  setMatchedMentorId: (mentorId: string | null) => void
  setMentorShortlistIds: (ids: string[]) => void
  /** Select mentor, persist shortlist, seed demo todos when empty. */
  selectMentor: (mentorId: string, shortlistIds?: string[]) => void
  mentorCalls: MentorCall[]
  scheduleMentorCall: (mentorId: string, startAt: string) => void
  cancelMentorCall: (callId: string) => void
  /** Fix stale mentor-authored todo names for the selected mentor. */
  realignMentorTodos: () => void
  addTodo: (
    todo: Omit<TodoItem, 'id' | 'createdAt'> & { id?: string },
  ) => void
  updateTodoStatus: (todoId: string, status: TodoStatus) => void
  getMentorMatches: (limit?: number) => MentorMatchResult[]
  resetPrototypeData: () => void
}

export const AppContext = createContext<AppState | null>(null)
