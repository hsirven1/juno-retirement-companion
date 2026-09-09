import { useEffect, useMemo, useState } from 'react'
import { Container } from '../components/Container'
import { MentorEmptyHomeCard } from '../components/mentor/MentorMatchCard'
import { HomeMentorConversationPanel } from '../components/mentor/HomeMentorConversationPanel'
import { HomeTodosSection } from '../components/mentor/HomeTodosSection'
import {
  formatMentorCallParts,
  MentorCallBookingOverlay,
} from '../components/mentor/MentorCallBookingOverlay'
import { RecommendationList } from '../components/dashboard/RecommendationList'
import { ResourceDetailDialog } from '../components/ResourceDetailDialog'
import { getMentorById } from '../data/mentors'
import { useApp } from '../context/useApp'
import { getMentorCopy } from '../lib/mentorCopy'
import { buildMentorHomePreview } from '../lib/mentorHomePreview'
import {
  buildMentorMatchingProfile,
  toBilanResourceSignals,
} from '../lib/mentorMatching'
import { getRecommendedResourceCards } from '../lib/lilleRecommendations'
import { makeResourceLabelFns } from '../lib/resourceLabels'
import { useCopy, useLocale } from '../i18n'
import type { ResourceRecommendation } from '../types'

export function HomePage() {
  const {
    profile,
    activeThemeIds,
    socialPreferences,
    socialFeedback,
    matchedMentorId,
    todos,
    updateTodoStatus,
    addTodo,
    answers,
    mentorCalls,
    scheduleMentorCall,
    realignMentorTodos,
  } = useApp()
  const copy = useCopy()
  const { locale } = useLocale()
  const [activeResource, setActiveResource] =
    useState<ResourceRecommendation | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    realignMentorTodos()
  }, [matchedMentorId, realignMentorTodos])

  const mentor = matchedMentorId ? getMentorById(matchedMentorId) : undefined
  const mentorCopy = mentor ? getMentorCopy(mentor, locale) : null
  const labels = useMemo(() => makeResourceLabelFns(copy, locale), [copy, locale])

  const matchingProfile = useMemo(
    () =>
      buildMentorMatchingProfile({
        answers,
        profile,
        socialPreferences,
      }),
    [answers, profile, socialPreferences],
  )

  const upcomingCall = useMemo(() => {
    if (!matchedMentorId) return null
    const now = Date.now()
    return (
      mentorCalls
        .filter(
          (call) =>
            call.mentorId === matchedMentorId &&
            call.status === 'scheduled' &&
            new Date(call.startAt).getTime() >= now - 60_000,
        )
        .sort(
          (a, b) =>
            new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
        )[0] ?? null
    )
  }, [mentorCalls, matchedMentorId])

  const nextCallParts = upcomingCall
    ? formatMentorCallParts(upcomingCall.startAt, locale)
    : null

  const bilanSignals = useMemo(
    () => toBilanResourceSignals(matchingProfile),
    [matchingProfile],
  )

  const forYou = useMemo(
    () =>
      getRecommendedResourceCards({
        locale,
        activeThemeIds,
        socialPreferences,
        socialFeedback,
        journeyRole: 'act',
        limit: 3,
        preferConcretePlaces: true,
        bilanSignals,
        typeLabel: labels.typeLabel,
        commitmentLabel: labels.commitmentLabel,
        savedIds: socialFeedback.interestedIds,
      }),
    [
      locale,
      activeThemeIds,
      socialPreferences,
      socialFeedback,
      bilanSignals,
      labels,
    ],
  )

  const previewMessage = mentor
    ? buildMentorHomePreview(
        mentor,
        profile.firstName,
        locale,
        matchingProfile,
      )
    : ''

  return (
    <Container width="wide" className="pt-2 pb-8 sm:pt-3 sm:pb-10 lg:pt-4">
      <div className="flex flex-col gap-8 lg:gap-10">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start lg:gap-5">
          <div className="min-w-0">
            {mentor && mentorCopy ? (
              <HomeMentorConversationPanel
                mentorId={mentor.id}
                firstName={mentor.firstName}
                age={mentor.age}
                city={mentor.city}
                formerCareer={mentorCopy.formerCareer}
                previewMessage={previewMessage}
                onSchedule={() => setBookingOpen(true)}
                nextCall={nextCallParts}
                onModifyCall={() => setBookingOpen(true)}
              />
            ) : (
              <MentorEmptyHomeCard />
            )}
          </div>

          <div className="min-w-0">
            <HomeTodosSection
              todos={todos}
              onStatus={updateTodoStatus}
              onAdd={(title) =>
                addTodo({ title, source: 'user', status: 'todo' })
              }
            />
          </div>
        </div>

        <RecommendationList items={forYou} onOpen={setActiveResource} />
      </div>

      {activeResource ? (
        <ResourceDetailDialog
          resource={activeResource}
          onClose={() => setActiveResource(null)}
        />
      ) : null}

      {mentor ? (
        <MentorCallBookingOverlay
          mentor={mentor}
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          initialStartAt={upcomingCall?.startAt}
          onConfirm={(startAt) => {
            scheduleMentorCall(mentor.id, startAt)
          }}
        />
      ) : null}
    </Container>
  )
}
