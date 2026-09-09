import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createMessage, getCoachReply } from '../i18n/content/coach'
import { getMessages } from '../i18n/messages'
import { getSocialJourney, getJourneyPhaseLabels } from '../i18n/content/social'
import type { Locale } from '../i18n/types'
import { DEFAULT_LOCALE } from '../i18n/types'
import { getPathById, PATH_SOCIAL } from '../data/paths'
import { adaptAllLilleResources } from '../lib/lilleResourceAdapter'
import { makeResourceLabelFns } from '../lib/resourceLabels'
import {
  applyStepResponseToProfile,
  createResetPersistedState,
  loadPersistedState,
  mergeProfile,
  savePersistedState,
  syncJourneyStepCompletion,
  type PersistedState,
} from '../lib/persistence'
import {
  applyStepResponsesToPreferences,
  mergeScreenResponse,
} from '../lib/journeyProgress'
import {
  buildMentorMatchingProfile,
  matchMentors,
} from '../lib/mentorMatching'
import { getMentorById } from '../data/mentors'
import {
  alignMentorTodosToSelectedMentor,
  buildSeedTodosForMentor,
} from '../lib/seedMentorTodos'
import { createTodoItem } from '../lib/todos'
import {
  getNextWeekId,
  getRecommendedStepsForWeek,
  weeks,
} from '../lib/weekRecommendations'
import { AppContext } from './state'
import type {
  AnswerValue,
  ChatMessage,
  ChatOpenOptions,
  JourneyStepProgress,
  PathProgress,
  ResourceRecommendation,
  SocialPreferences,
  TodoItem,
  TodoStatus,
  WeeklyStepItem,
} from '../types'

function emptyStepProgress(): JourneyStepProgress {
  return { screenIndex: 0, responses: {}, status: 'inProgress' }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>(() =>
    loadPersistedState(),
  )
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([])
  const [addedResourceIds, setAddedResourceIds] = useState<string[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatOpen, setChatOpen] = useState(false)
  const [chatOptions, setChatOptions] = useState<ChatOpenOptions | null>(null)
  const [guidedThemeOpen, setGuidedThemeOpen] = useState(false)
  const [postponeNotice, setPostponeNotice] = useState<string | null>(null)
  const messagesRef = useRef(messages)

  const onboardingComplete = persisted.onboardingComplete
  const answers = persisted.assessmentAnswers

  const resources = useMemo(() => {
    const copy = getMessages(persisted.locale)
    const labels = makeResourceLabelFns(copy, persisted.locale)
    return adaptAllLilleResources(persisted.locale, labels, {
      savedIds: savedResourceIds,
      addedIds: addedResourceIds,
    })
  }, [persisted.locale, savedResourceIds, addedResourceIds])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    savePersistedState(persisted)
  }, [persisted])

  const updatePersisted = useCallback(
    (updater: (current: PersistedState) => PersistedState) => {
      setPersisted((current) => updater(current))
    },
    [],
  )

  const completeOnboarding = useCallback(() => {
    updatePersisted((current) => ({
      ...current,
      onboardingComplete: true,
    }))
  }, [updatePersisted])

  const enterAsReturningUser = useCallback(() => {
    updatePersisted((current) => ({
      ...current,
      onboardingComplete: true,
    }))
  }, [updatePersisted])

  const setAnswer = useCallback(
    (questionId: string, value: AnswerValue) => {
      updatePersisted((current) => ({
        ...current,
        assessmentAnswers: {
          ...current.assessmentAnswers,
          [questionId]: value,
        },
      }))
    },
    [updatePersisted],
  )

  const startPath = useCallback((pathId: string) => {
    updatePersisted((current) => {
      const path = getPathById(pathId)
      if (!path) return current
      const existing = current.pathProgress[pathId]
      if (existing?.status === 'in_progress') return current
      return {
        ...current,
        pathProgress: {
          ...current.pathProgress,
          [pathId]: {
            status: 'in_progress',
            completedStepIds: existing?.completedStepIds ?? [],
            currentStepId: path.steps[0]?.id ?? null,
            responses: existing?.responses ?? {},
          },
        },
      }
    })
  }, [updatePersisted])

  const completeGuidedStep = useCallback(
    (pathId: string, stepId: string, response?: AnswerValue) => {
      updatePersisted((current) => {
        const path = getPathById(pathId)
        if (!path) return current
        const step = path.steps.find((item) => item.id === stepId)
        if (!step) return current

        const previous = current.pathProgress[pathId] ?? {
          status: 'not_started' as const,
          completedStepIds: [],
          currentStepId: null,
          responses: {},
        }

        const completedStepIds = previous.completedStepIds.includes(stepId)
          ? previous.completedStepIds
          : [...previous.completedStepIds, stepId]

        const stepIndex = path.steps.findIndex((item) => item.id === stepId)
        const nextStep = path.steps[stepIndex + 1]
        const done = completedStepIds.length >= path.steps.length

        const responses = { ...previous.responses }
        if (response !== undefined) responses[stepId] = response

        let profileOverrides = current.profileOverrides
        if (response !== undefined && step.options) {
          const labels = (Array.isArray(response) ? response : [response])
            .map((value) =>
              step.options?.find((option) => option.id === value)?.label,
            )
            .filter((label): label is string => Boolean(label))
          profileOverrides = applyStepResponseToProfile(
            profileOverrides,
            step.profileKeys,
            response,
            labels,
          )
        }

        const progress: PathProgress = {
          status: done ? 'completed' : 'in_progress',
          completedStepIds,
          currentStepId: done ? null : (nextStep?.id ?? null),
          responses,
        }

        const week = weeks[current.mockCurrentWeekIndex]
        const weeklyId = week ? `${week.id}:${stepId}` : stepId
        const completedWeekly = current.completedWeeklyStepIds.includes(weeklyId)
          ? current.completedWeeklyStepIds
          : [...current.completedWeeklyStepIds, weeklyId]

        return {
          ...current,
          profileOverrides,
          completedWeeklyStepIds: completedWeekly,
          postponedStepIds: current.postponedStepIds.filter((id) => id !== stepId),
          pathProgress: {
            ...current.pathProgress,
            [pathId]: progress,
          },
        }
      })
    },
    [updatePersisted],
  )

  const getJourneyStepState = useCallback(
    (stepId: string) => {
      const stored =
        persisted.journeyStepProgress[stepId] ?? emptyStepProgress()
      return {
        screenIndex: stored.screenIndex,
        responses: stored.responses,
        status: stored.status,
      }
    },
    [persisted.journeyStepProgress],
  )

  const setJourneyStepScreen = useCallback(
    (stepId: string, screenIndex: number) => {
      updatePersisted((current) => {
        const existing =
          current.journeyStepProgress[stepId] ?? emptyStepProgress()
        return {
          ...current,
          journeyStepProgress: {
            ...current.journeyStepProgress,
            [stepId]: {
              ...existing,
              screenIndex,
              status:
                existing.status === 'completed' ? 'completed' : 'inProgress',
            },
          },
        }
      })
    },
    [updatePersisted],
  )

  const setJourneyStepResponse = useCallback(
    (stepId: string, responseKey: string, value: AnswerValue) => {
      updatePersisted((current) => {
        const existing =
          current.journeyStepProgress[stepId] ?? emptyStepProgress()
        const responses = mergeScreenResponse(
          existing.responses,
          responseKey,
          value,
        )
        const socialPreferences = applyStepResponsesToPreferences(
          current.socialPreferences,
          stepId,
          responses,
        )
        return {
          ...current,
          socialPreferences,
          journeyStepProgress: {
            ...current.journeyStepProgress,
            [stepId]: {
              ...existing,
              responses,
              status:
                existing.status === 'completed' ? 'completed' : 'inProgress',
            },
          },
        }
      })
    },
    [updatePersisted],
  )

  const completeJourneyStep = useCallback(
    (stepId: string) => {
      updatePersisted((current) => {
        const existing =
          current.journeyStepProgress[stepId] ?? emptyStepProgress()
        const socialPreferences = applyStepResponsesToPreferences(
          current.socialPreferences,
          stepId,
          existing.responses,
        )
        const week = weeks[current.mockCurrentWeekIndex]
        const weeklyId = week ? `${week.id}:${stepId}` : stepId
        const pathProgress = syncJourneyStepCompletion(
          current.pathProgress[PATH_SOCIAL],
          stepId,
          existing.responses,
        )

        return {
          ...current,
          socialPreferences,
          completedWeeklyStepIds: current.completedWeeklyStepIds.includes(
            weeklyId,
          )
            ? current.completedWeeklyStepIds
            : [...current.completedWeeklyStepIds, weeklyId],
          postponedStepIds: current.postponedStepIds.filter((id) => id !== stepId),
          pathProgress: {
            ...current.pathProgress,
            [PATH_SOCIAL]: pathProgress,
          },
          journeyStepProgress: {
            ...current.journeyStepProgress,
            [stepId]: {
              ...existing,
              status: 'completed',
              completedAt: new Date().toISOString(),
            },
          },
          activeJourneyStepId: null,
        }
      })
    },
    [updatePersisted],
  )

  const openGuidedStep = useCallback(
    (stepId: string) => {
      startPath(PATH_SOCIAL)
      setChatOpen(false)
      setChatOptions(null)
      updatePersisted((current) => ({
        ...current,
        activeJourneyStepId: stepId,
        journeyStepProgress: {
          ...current.journeyStepProgress,
          [stepId]:
            current.journeyStepProgress[stepId] ?? emptyStepProgress(),
        },
      }))
      setGuidedThemeOpen(true)
    },
    [startPath, updatePersisted],
  )

  const postponeWeeklyStep = useCallback(
    (item: WeeklyStepItem) => {
      const nextWeekId = getNextWeekId(item.weekId)
      updatePersisted((current) => {
        const deferredToWeek = { ...current.deferredToWeek }
        if (nextWeekId) {
          const list = deferredToWeek[nextWeekId] ?? []
          if (!list.includes(item.stepId)) {
            deferredToWeek[nextWeekId] = [...list, item.stepId]
          }
        }
        return {
          ...current,
          postponedStepIds: current.postponedStepIds.includes(item.stepId)
            ? current.postponedStepIds
            : [...current.postponedStepIds, item.stepId],
          deferredToWeek,
        }
      })
      setPostponeNotice(
        getMessages(persisted.locale).journeyUi.postponeNotice,
      )
    },
    [persisted.locale, updatePersisted],
  )

  const toggleWeeklyStepComplete = useCallback(
    (item: WeeklyStepItem) => {
      updatePersisted((current) => {
        const key = `${item.weekId}:${item.stepId}`
        const has = current.completedWeeklyStepIds.includes(key)
        return {
          ...current,
          completedWeeklyStepIds: has
            ? current.completedWeeklyStepIds.filter((id) => id !== key)
            : [...current.completedWeeklyStepIds, key],
        }
      })
    },
    [updatePersisted],
  )

  const getWeekSteps = useCallback(
    (weekIndex: number) => {
      const generated = getRecommendedStepsForWeek({
        weekIndex,
        currentWeekIndex: persisted.mockCurrentWeekIndex,
        activeThemeIds: persisted.activeThemeIds,
        pathProgress: persisted.pathProgress,
        postponedStepIds: persisted.postponedStepIds,
        deferredToWeek: persisted.deferredToWeek,
        completedWeeklyStepIds: persisted.completedWeeklyStepIds,
        locale: persisted.locale,
      })

      const journey = getSocialJourney(persisted.locale)
      const phaseLabels = getJourneyPhaseLabels(persisted.locale)

      const custom = persisted.customWeeklySteps
        .filter((item) => {
          const week = weeks[weekIndex]
          return week && item.weekId === week.id
        })
        .map((item) => ({
          id: item.id,
          weekId: item.weekId,
          pathId: item.pathId,
          themeId: item.themeId,
          themeTitle:
            item.pathId === PATH_SOCIAL ? journey.title : item.themeTitle,
          stepId: item.stepId,
          title: item.pathId === PATH_SOCIAL ? journey.title : item.themeTitle,
          subtitle: item.subtitle,
          phaseLabel:
            item.pathId === PATH_SOCIAL
              ? phaseLabels.act
              : item.phaseLabel,
          estimatedMinutes: item.estimatedMinutes,
          completed: persisted.completedWeeklyStepIds.includes(
            `${item.weekId}:${item.stepId}`,
          ),
          carriedOver: false,
          postponed: false,
          type: 'action' as const,
        }))

      return [...custom, ...generated].slice(0, 3)
    },
    [persisted],
  )

  const setSocialPreferences = useCallback(
    (prefs: SocialPreferences) => {
      updatePersisted((current) => ({
        ...current,
        socialPreferences: prefs,
      }))
    },
    [updatePersisted],
  )

  const markSocialInterest = useCallback(
    (resource: ResourceRecommendation) => {
      updatePersisted((current) => ({
        ...current,
        socialFeedback: {
          ...current.socialFeedback,
          interestedIds: current.socialFeedback.interestedIds.includes(resource.id)
            ? current.socialFeedback.interestedIds
            : [...current.socialFeedback.interestedIds, resource.id],
        },
      }))
      setSavedResourceIds((current) =>
        current.includes(resource.id) ? current : [...current, resource.id],
      )
    },
    [updatePersisted],
  )

  const dismissSocialResource = useCallback(
    (resourceId: string, reason?: string) => {
      updatePersisted((current) => ({
        ...current,
        socialFeedback: {
          ...current.socialFeedback,
          dismissedIds: current.socialFeedback.dismissedIds.includes(resourceId)
            ? current.socialFeedback.dismissedIds
            : [...current.socialFeedback.dismissedIds, resourceId],
          dismissReasons: reason
            ? { ...current.socialFeedback.dismissReasons, [resourceId]: reason }
            : current.socialFeedback.dismissReasons,
        },
      }))
    },
    [updatePersisted],
  )

  const laterSocialResource = useCallback(
    (resourceId: string) => {
      updatePersisted((current) => ({
        ...current,
        socialFeedback: {
          ...current.socialFeedback,
          laterIds: current.socialFeedback.laterIds.includes(resourceId)
            ? current.socialFeedback.laterIds
            : [...current.socialFeedback.laterIds, resourceId],
        },
      }))
    },
    [updatePersisted],
  )

  const addSocialWeekStep = useCallback(
    (resource: ResourceRecommendation) => {
      const weekId = weeks[persisted.mockCurrentWeekIndex]?.id
      if (!weekId) return
      const stepId = `social-resource-${resource.id}`
      const journey = getSocialJourney(persisted.locale)
      const phaseLabels = getJourneyPhaseLabels(persisted.locale)
      updatePersisted((current) => {
        if (current.customWeeklySteps.some((item) => item.stepId === stepId)) {
          return current
        }
        return {
          ...current,
          customWeeklySteps: [
            ...current.customWeeklySteps,
            {
              id: `${weekId}:${stepId}`,
              weekId,
              pathId: PATH_SOCIAL,
              themeId: 'social',
              themeTitle: journey.title,
              stepId,
              title: journey.title,
              subtitle: resource.title,
              phaseLabel: phaseLabels.act,
              estimatedMinutes: 10,
              resourceId: resource.id,
              reason: resource.personalizationReason,
            },
          ],
        }
      })
      setAddedResourceIds((current) =>
        current.includes(resource.id) ? current : [...current, resource.id],
      )
      setPostponeNotice(
        getMessages(persisted.locale).journeyUi.stepAddedNotice,
      )
    },
    [persisted.locale, persisted.mockCurrentWeekIndex, updatePersisted],
  )

  const setLocale = useCallback(
    (locale: Locale) => {
      updatePersisted((current) => ({
        ...current,
        locale: locale ?? DEFAULT_LOCALE,
      }))
    },
    [updatePersisted],
  )

  const setMockCurrentWeekIndex = useCallback(
    (index: number) => {
      updatePersisted((current) => ({
        ...current,
        mockCurrentWeekIndex: Math.max(0, Math.min(weeks.length - 1, index)),
      }))
    },
    [updatePersisted],
  )

  const toggleResourceSaved = useCallback((id: string) => {
    setSavedResourceIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }, [])

  const markResourceAdded = useCallback((id: string) => {
    setAddedResourceIds((current) =>
      current.includes(id) ? current : [...current, id],
    )
  }, [])

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      const reply = getCoachReply(trimmed, persisted.locale)
      setMessages((current) => [
        ...current,
        createMessage('user', trimmed),
        createMessage('coach', reply.content, reply.suggestion, reply.action),
      ])
    },
    [persisted.locale],
  )

  const openChat = useCallback((options?: ChatOpenOptions) => {
    setGuidedThemeOpen(false)
    setChatOptions(options ?? null)
    setChatOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    setChatOpen(false)
    setChatOptions(null)
  }, [])

  const openGuidedTheme = useCallback(
    (stepId?: string) => {
      const fallback =
        persisted.pathProgress[PATH_SOCIAL]?.currentStepId ?? 'social-step-1'
      openGuidedStep(stepId ?? fallback)
    },
    [openGuidedStep, persisted.pathProgress],
  )

  const closeGuidedTheme = useCallback(() => {
    setGuidedThemeOpen(false)
    updatePersisted((current) => ({
      ...current,
      activeJourneyStepId: null,
    }))
  }, [updatePersisted])

  const respondToSuggestion = useCallback(
    (messageId: string, accept: boolean) => {
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? { ...message, suggestionStatus: accept ? 'added' : 'dismissed' }
            : message,
        ),
      )
      if (!accept) return
      const suggestion = messagesRef.current.find(
        (item) => item.id === messageId,
      )?.suggestion
      if (suggestion?.priorityId) {
        startPath(
          suggestion.priorityId.startsWith('path-')
            ? suggestion.priorityId
            : `path-${suggestion.priorityId}`,
        )
      }
    },
    [startPath],
  )

  const profile = useMemo(
    () => mergeProfile(persisted.profileOverrides),
    [persisted.profileOverrides],
  )

  const setMatchedMentorId = useCallback(
    (mentorId: string | null) => {
      updatePersisted((current) => ({
        ...current,
        matchedMentorId: mentorId,
      }))
    },
    [updatePersisted],
  )

  const setMentorShortlistIds = useCallback(
    (ids: string[]) => {
      updatePersisted((current) => {
        if (
          current.mentorShortlistIds.length === ids.length &&
          current.mentorShortlistIds.every((id, index) => id === ids[index])
        ) {
          return current
        }
        return {
          ...current,
          mentorShortlistIds: ids,
        }
      })
    },
    [updatePersisted],
  )

  const selectMentor = useCallback(
    (mentorId: string, shortlistIds?: string[]) => {
      updatePersisted((current) => {
        const mentor = getMentorById(mentorId)
        if (!mentor) {
          return {
            ...current,
            matchedMentorId: mentorId,
            mentorShortlistIds: shortlistIds ?? current.mentorShortlistIds,
          }
        }

        const todos =
          current.todos.length === 0
            ? buildSeedTodosForMentor({
                mentorId,
                mentorFirstName: mentor.firstName,
                locale: current.locale,
              })
            : alignMentorTodosToSelectedMentor({
                todos: current.todos,
                mentorId,
                mentorFirstName: mentor.firstName,
                locale: current.locale,
              })

        return {
          ...current,
          matchedMentorId: mentorId,
          mentorShortlistIds: shortlistIds ?? current.mentorShortlistIds,
          todos,
        }
      })
    },
    [updatePersisted],
  )

  const scheduleMentorCall = useCallback(
    (mentorId: string, startAt: string) => {
      updatePersisted((current) => {
        const nextCall = {
          id: `call-${Date.now()}`,
          mentorId,
          startAt,
          status: 'scheduled' as const,
        }
        const withoutActiveForMentor = current.mentorCalls.map((call) =>
          call.mentorId === mentorId && call.status === 'scheduled'
            ? { ...call, status: 'cancelled' as const }
            : call,
        )
        return {
          ...current,
          mentorCalls: [...withoutActiveForMentor, nextCall],
        }
      })
    },
    [updatePersisted],
  )

  const cancelMentorCall = useCallback(
    (callId: string) => {
      updatePersisted((current) => ({
        ...current,
        mentorCalls: current.mentorCalls.map((call) =>
          call.id === callId ? { ...call, status: 'cancelled' as const } : call,
        ),
      }))
    },
    [updatePersisted],
  )

  const realignMentorTodos = useCallback(() => {
    updatePersisted((current) => {
      const mentorId = current.matchedMentorId
      if (!mentorId) return current
      const mentor = getMentorById(mentorId)
      if (!mentor) return current
      const next = alignMentorTodosToSelectedMentor({
        todos: current.todos,
        mentorId,
        mentorFirstName: mentor.firstName,
        locale: current.locale,
      })
      const unchanged = next.every(
        (todo, index) =>
          todo.relatedMentorId === current.todos[index]?.relatedMentorId &&
          todo.title === current.todos[index]?.title,
      )
      if (unchanged) return current
      return { ...current, todos: next }
    })
  }, [updatePersisted])

  const addTodo = useCallback(
    (todo: Omit<TodoItem, 'id' | 'createdAt'> & { id?: string }) => {
      updatePersisted((current) => {
        const next = createTodoItem({
          title: todo.title,
          source: todo.source,
          status: todo.status,
          relatedMentorId: todo.relatedMentorId,
          relatedResourceId: todo.relatedResourceId,
          relatedExerciseStepId: todo.relatedExerciseStepId,
          dueDate: todo.dueDate,
        })
        if (todo.id) next.id = todo.id
        return {
          ...current,
          todos: [...current.todos, next],
        }
      })
    },
    [updatePersisted],
  )

  const updateTodoStatus = useCallback(
    (todoId: string, status: TodoStatus) => {
      updatePersisted((current) => ({
        ...current,
        todos: current.todos.map((todo) =>
          todo.id === todoId ? { ...todo, status } : todo,
        ),
      }))
    },
    [updatePersisted],
  )

  const getMentorMatches = useCallback(
    (limit = 5) => {
      const matchingProfile = buildMentorMatchingProfile({
        answers: persisted.assessmentAnswers,
        profile,
        socialPreferences: persisted.socialPreferences,
      })
      return matchMentors(matchingProfile, {
        locale: persisted.locale,
        limit,
      })
    },
    [
      persisted.assessmentAnswers,
      persisted.socialPreferences,
      persisted.locale,
      profile,
    ],
  )

  const resetPrototypeData = useCallback(() => {
    const next = createResetPersistedState(persisted.locale)
    setPersisted(next)
    setMessages([])
    setChatOpen(false)
    setChatOptions(null)
    setGuidedThemeOpen(false)
    setPostponeNotice(null)
    setSavedResourceIds([])
    setAddedResourceIds([])
  }, [persisted.locale])

  const value = useMemo(
    () => ({
      onboardingComplete,
      completeOnboarding,
      enterAsReturningUser,
      answers,
      setAnswer,
      profile,
      activeThemeIds: persisted.activeThemeIds,
      pathProgress: persisted.pathProgress,
      completeGuidedStep,
      startPath,
      postponeWeeklyStep,
      toggleWeeklyStepComplete,
      postponedStepIds: persisted.postponedStepIds,
      deferredToWeek: persisted.deferredToWeek,
      completedWeeklyStepIds: persisted.completedWeeklyStepIds,
      getWeekSteps,
      resources,
      toggleResourceSaved,
      markResourceAdded,
      messages,
      sendMessage,
      respondToSuggestion,
      chatOpen,
      chatOptions,
      openChat,
      closeChat,
      guidedThemeOpen,
      openGuidedTheme,
      openGuidedStep,
      closeGuidedTheme,
      activeJourneyStepId: persisted.activeJourneyStepId,
      completeJourneyStep,
      getJourneyStepState,
      setJourneyStepScreen,
      setJourneyStepResponse,
      mockCurrentWeekIndex: persisted.mockCurrentWeekIndex,
      setMockCurrentWeekIndex,
      postponeNotice,
      clearPostponeNotice: () => setPostponeNotice(null),
      persisted,
      socialPreferences: persisted.socialPreferences,
      socialFeedback: persisted.socialFeedback,
      setSocialPreferences,
      markSocialInterest,
      dismissSocialResource,
      laterSocialResource,
      addSocialWeekStep,
      locale: persisted.locale,
      setLocale,
      todos: persisted.todos,
      matchedMentorId: persisted.matchedMentorId,
      mentorShortlistIds: persisted.mentorShortlistIds,
      mentorCalls: persisted.mentorCalls,
      setMatchedMentorId,
      setMentorShortlistIds,
      selectMentor,
      scheduleMentorCall,
      cancelMentorCall,
      realignMentorTodos,
      addTodo,
      updateTodoStatus,
      getMentorMatches,
      resetPrototypeData,
    }),
    [
      onboardingComplete,
      completeOnboarding,
      enterAsReturningUser,
      answers,
      setAnswer,
      profile,
      persisted,
      completeGuidedStep,
      startPath,
      postponeWeeklyStep,
      toggleWeeklyStepComplete,
      getWeekSteps,
      resources,
      toggleResourceSaved,
      markResourceAdded,
      messages,
      sendMessage,
      respondToSuggestion,
      chatOpen,
      chatOptions,
      openChat,
      closeChat,
      guidedThemeOpen,
      openGuidedTheme,
      openGuidedStep,
      closeGuidedTheme,
      completeJourneyStep,
      getJourneyStepState,
      setJourneyStepScreen,
      setJourneyStepResponse,
      setMockCurrentWeekIndex,
      postponeNotice,
      setSocialPreferences,
      markSocialInterest,
      dismissSocialResource,
      laterSocialResource,
      addSocialWeekStep,
      setLocale,
      setMatchedMentorId,
      setMentorShortlistIds,
      selectMentor,
      scheduleMentorCall,
      cancelMentorCall,
      realignMentorTodos,
      addTodo,
      updateTodoStatus,
      getMentorMatches,
      resetPrototypeData,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
