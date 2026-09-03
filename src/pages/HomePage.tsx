import { useMemo, useState } from 'react'
import { Container } from '../components/Container'
import { WeeklyPlan } from '../components/dashboard/WeeklyPlan'
import { PrioritiesPreview } from '../components/dashboard/PrioritiesPreview'
import { CoachShortcut } from '../components/dashboard/CoachShortcut'
import { RecommendationList } from '../components/dashboard/RecommendationList'
import { ResourceDetailDialog } from '../components/ResourceDetailDialog'
import { useApp } from '../context/useApp'
import { weeks } from '../lib/weekRecommendations'
import {
  formatWeekDateRange,
  getLocalizedActiveThemes,
  useCopy,
  useLocale,
} from '../i18n'
import { getRecommendedResourceCards } from '../lib/lilleRecommendations'
import { makeResourceLabelFns } from '../lib/resourceLabels'
import type { ResourceRecommendation } from '../types'

export function HomePage() {
  const {
    profile,
    activeThemeIds,
    pathProgress,
    getWeekSteps,
    toggleWeeklyStepComplete,
    postponeWeeklyStep,
    postponeNotice,
    clearPostponeNotice,
    mockCurrentWeekIndex,
    setMockCurrentWeekIndex,
    socialPreferences,
    socialFeedback,
  } = useApp()
  const copy = useCopy()
  const { locale } = useLocale()
  const [weekIndex, setWeekIndex] = useState(mockCurrentWeekIndex)
  const [activeResource, setActiveResource] =
    useState<ResourceRecommendation | null>(null)

  const viewedWeek = weeks[weekIndex]
  const weekSteps = getWeekSteps(weekIndex)
  const themes = getLocalizedActiveThemes(activeThemeIds, locale)
  const labels = useMemo(() => makeResourceLabelFns(copy, locale), [copy, locale])

  const today = new Date()
  const todayLabel = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-FR' : 'en-US',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    },
  ).format(today)

  const socialTheme = themes.find((t) => t.id === 'social')
  const weekNumber = mockCurrentWeekIndex + 1

  const forYou = useMemo(
    () =>
      getRecommendedResourceCards({
        locale,
        activeThemeIds,
        socialPreferences,
        socialFeedback,
        journeyRole: 'act',
        limit: 2,
        preferConcretePlaces: true,
        typeLabel: labels.typeLabel,
        commitmentLabel: labels.commitmentLabel,
        savedIds: socialFeedback.interestedIds,
      }),
    [
      locale,
      activeThemeIds,
      socialPreferences,
      socialFeedback,
      labels,
    ],
  )

  function goToWeek(index: number) {
    const next = Math.max(0, Math.min(weeks.length - 1, index))
    setWeekIndex(next)
    setMockCurrentWeekIndex(next)
  }

  return (
    <Container width="wide" className="pt-5 pb-10 sm:pt-6 sm:pb-12 lg:pt-7 lg:pb-14">
      <header className="mb-4 sm:mb-5">
        <p className="text-[13px] font-medium tracking-[0.04em] text-ink-soft uppercase">
          {todayLabel}
        </p>
        <h1 className="mt-1 font-display text-[2.25rem] leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
          {copy.home.greeting(profile.firstName, new Date().getHours())}.
        </h1>

        {socialTheme ? (
          <div className="mt-3 rounded-xl border border-line bg-paper px-4 py-3 lg:hidden">
            <p className="text-[12px] font-[800] tracking-[0.11em] text-ink-label uppercase">
              {copy.home.journeyInProgress}
            </p>
            <p className="mt-1 text-[15px] font-medium text-ink">
              {socialTheme.title} • {weekNumber} {copy.home.weekLabel}
            </p>
          </div>
        ) : null}
      </header>

      <details className="mb-4 rounded-md border border-line bg-paper px-4 py-3 text-[14px] text-ink-muted">
        <summary className="cursor-pointer font-medium text-ink">
          {copy.home.prototypeWeekSimulator}
        </summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {weeks.map((week, index) => (
            <button
              key={week.id}
              type="button"
              onClick={() => goToWeek(index)}
              className={
                index === mockCurrentWeekIndex
                  ? 'cursor-pointer rounded-full border border-ink bg-ink px-3 py-1.5 text-[13px] text-cream'
                  : 'cursor-pointer rounded-full border border-line-strong px-3 py-1.5 text-[13px] text-ink hover:border-ink/40'
              }
            >
              {copy.home.weekShort(index + 1)} ·{' '}
              {formatWeekDateRange(week.offset, locale)}
            </button>
          ))}
        </div>
      </details>

      {postponeNotice ? (
        <p
          className="mb-4 rounded-md border border-line bg-paper px-4 py-3 text-[14px] text-ink-muted"
          role="status"
        >
          {postponeNotice}
          <button
            type="button"
            className="ml-3 cursor-pointer text-clay"
            onClick={clearPostponeNotice}
          >
            OK
          </button>
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-5 lg:col-span-8">
          <WeeklyPlan
            week={viewedWeek}
            weekIndex={weekIndex}
            currentWeekIndex={mockCurrentWeekIndex}
            totalWeeksAvailable={weeks.length}
            steps={weekSteps}
            onToggle={toggleWeeklyStepComplete}
            onPostpone={postponeWeeklyStep}
            onPrev={() => setWeekIndex((current) => Math.max(0, current - 1))}
            onNext={() =>
              setWeekIndex((current) =>
                Math.min(weeks.length - 1, current + 1),
              )
            }
          />
        </div>

        <div className="flex flex-col gap-5 lg:col-span-4">
          <CoachShortcut />
        </div>

        <div className="flex flex-col gap-5 lg:col-span-8">
          <RecommendationList items={forYou} onOpen={setActiveResource} />
        </div>

        <div className="flex flex-col gap-5 lg:col-span-4">
          <PrioritiesPreview themes={themes} pathProgress={pathProgress} />
        </div>
      </div>

      {activeResource ? (
        <ResourceDetailDialog
          resource={activeResource}
          onClose={() => setActiveResource(null)}
        />
      ) : null}
    </Container>
  )
}
