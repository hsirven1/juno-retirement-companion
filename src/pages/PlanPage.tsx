import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { SegmentedStepProgress } from '../components/journey/SegmentedStepProgress'
import { useApp } from '../context/useApp'
import { PATH_SOCIAL } from '../data/paths'
import {
  getSocialPhaseForStep,
  SOCIAL_STEP_ORDER,
} from '../data/socialJourney'
import {
  getCurrentSocialStepId,
  getSocialJourneyStatus,
  getStepProgressStatus,
} from '../lib/journeyScheduling'
import { getJourneyTheme } from '../lib/journeyTheme'
import {
  getJourneyPhaseLabels,
  getLocalizedActiveThemes,
  getLocalizedGuidedPath,
  getSocialJourney,
  getSocialJourneyStep,
  useCopy,
  useLocale,
} from '../i18n'
import { cn } from '../lib/cn'

export function PlanPage() {
  const {
    onboardingComplete,
    completeOnboarding,
    activeThemeIds,
    pathProgress,
    startPath,
    openGuidedStep,
    getJourneyStepState,
  } = useApp()
  const navigate = useNavigate()
  const copy = useCopy()
  const { locale } = useLocale()
  const socialJourney = getSocialJourney(locale)
  const journeyPhaseLabels = getJourneyPhaseLabels(locale)
  const themes = getLocalizedActiveThemes(activeThemeIds, locale)

  function startJourney() {
    completeOnboarding()
    void navigate('/home')
  }

  function openTheme(pathId: string, stepId?: string) {
    startPath(pathId)
    if (pathId === PATH_SOCIAL) {
      const socialProgress = pathProgress[PATH_SOCIAL]
      const current =
        stepId ?? getCurrentSocialStepId(socialProgress) ?? 'social-step-1'
      openGuidedStep(current)
      return
    }
    void navigate(stepId ? `/guide/${pathId}?step=${stepId}` : `/guide/${pathId}`)
  }

  const socialProgress = pathProgress[PATH_SOCIAL]
  const socialStatus = getSocialJourneyStatus(socialProgress)
  const activeSocialStep = getCurrentSocialStepId(socialProgress)
  const socialTheme = themes.find((t) => t.pathId === PATH_SOCIAL)
  const otherThemes = themes.filter((t) => t.pathId !== PATH_SOCIAL)

  const completedSocialCount = socialProgress?.completedStepIds.length ?? 0
  const weekNumber = Math.min(
    SOCIAL_STEP_ORDER.length,
    Math.max(1, completedSocialCount + (socialStatus === 'in_action' ? 0 : 1)),
  )
  const currentStep = activeSocialStep
    ? getSocialJourneyStep(activeSocialStep, locale)
    : null
  const currentPhase = activeSocialStep
    ? getSocialPhaseForStep(activeSocialStep)
    : socialJourney.phases[0]
  const currentStepState = activeSocialStep
    ? getJourneyStepState(activeSocialStep)
    : null
  const socialThemeTokens = getJourneyTheme('social')
  const socialInMotion =
    socialStatus === 'in_progress' ||
    socialStatus === 'in_action' ||
    socialProgress?.status === 'in_progress' ||
    completedSocialCount > 0

  const segmentPartial =
    currentStep && currentStepState && currentStep.screens.length > 0
      ? (currentStepState.screenIndex + 1) / currentStep.screens.length
      : socialStatus === 'in_action'
        ? 1
        : 0.15

  let readyAssigned = false

  return (
    <div className="py-10 sm:py-14">
      <Container width="wide">
        <h1 className="font-display text-[2.2rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.75rem]">
          {copy.plan.title}
        </h1>
        <p className="mt-3 max-w-[36rem] text-[17px] text-ink-muted sm:text-[18px]">
          {copy.plan.subtitle}
        </p>

        {socialTheme ? (
          <section
            className="mt-10 rounded-[22px] border border-line bg-paper p-6 sm:p-8"
            aria-labelledby="active-journey-title"
          >
            <p
              className="text-[12px] font-extrabold tracking-[0.1em] uppercase"
              style={{ color: socialThemeTokens.ink }}
            >
              <span
                aria-hidden="true"
                className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
                style={{ backgroundColor: socialThemeTokens.solid }}
              />
              {socialInMotion
                ? copy.plan.statusInProgress
                : copy.plan.statusExplore}{' '}
              · {socialTheme.title}
            </p>

            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 flex-1">
                <h2
                  id="active-journey-title"
                  className="text-[1.55rem] font-extrabold leading-snug tracking-[-0.02em] text-ink sm:text-[1.85rem]"
                >
                  {copy.plan.weekPhaseTitle(
                    weekNumber,
                    currentPhase
                      ? journeyPhaseLabels[currentPhase.type]
                      : journeyPhaseLabels.discover,
                  )}
                </h2>
                <p className="mt-2 max-w-[34rem] text-[16px] leading-relaxed text-ink-muted sm:text-[17px]">
                  {currentStep?.description ??
                    currentStep?.title ??
                    socialJourney.description}
                </p>
              </div>
              <Button
                className="min-h-11 shrink-0 px-6 text-[16px] font-bold sm:min-h-12"
                onClick={() =>
                  openTheme(
                    PATH_SOCIAL,
                    activeSocialStep ??
                      socialProgress?.currentStepId ??
                      'social-step-1',
                  )
                }
              >
                {socialInMotion ? copy.plan.resume : copy.plan.start}
              </Button>
            </div>

            <div className="mt-7">
              <SegmentedStepProgress
                total={SOCIAL_STEP_ORDER.length}
                currentIndex={Math.min(
                  completedSocialCount,
                  SOCIAL_STEP_ORDER.length - 1,
                )}
                partial={
                  socialStatus === 'in_action' ? 1 : segmentPartial
                }
                fill={socialThemeTokens.solid}
                empty={socialThemeTokens.tint}
                aria-label={copy.plan.stepsProgress(
                  completedSocialCount,
                  SOCIAL_STEP_ORDER.length,
                )}
              />
              <div className="mt-3 flex justify-between gap-2 text-[12px] font-medium text-ink-soft sm:text-[13px]">
                {socialJourney.phases.map((phase) => (
                  <span key={phase.id} className="min-w-0 flex-1 first:text-left last:text-right even:text-center">
                    {journeyPhaseLabels[phase.type]}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-6 border-t border-line pt-7 sm:grid-cols-3">
              {socialJourney.phases.map((phase) => (
                <div key={phase.id}>
                  <p
                    className="text-[12px] font-extrabold tracking-[0.1em] uppercase"
                    style={{ color: socialThemeTokens.ink }}
                  >
                    {journeyPhaseLabels[phase.type]}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {phase.steps.map((step) => {
                      const stepStatus = getStepProgressStatus(
                        step.id,
                        socialProgress,
                        activeSocialStep,
                      )
                      return (
                        <li
                          key={step.id}
                          className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-muted sm:text-[15px]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-[13px]"
                            style={{
                              color:
                                stepStatus === 'upcoming'
                                  ? undefined
                                  : socialThemeTokens.solid,
                            }}
                          >
                            {stepStatus === 'completed'
                              ? '✓'
                              : stepStatus === 'current'
                                ? '●'
                                : '○'}
                          </span>
                          <span
                            className={
                              stepStatus === 'current'
                                ? 'font-semibold text-ink'
                                : stepStatus === 'completed'
                                  ? 'text-ink'
                                  : undefined
                            }
                          >
                            {step.title}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {otherThemes.length > 0 ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {otherThemes.map((theme) => {
              const path = getLocalizedGuidedPath(theme.pathId, locale)
              if (!path) return null
              const progress = pathProgress[path.id]
              const tokens = getJourneyTheme(theme.id)
              const isStarted = progress?.status === 'in_progress'
              const isDone = progress?.status === 'completed'
              let statusLabel: string = copy.plan.statusAvailable
              if (isDone) statusLabel = copy.plan.statusCompleted
              else if (isStarted) statusLabel = copy.plan.statusInProgress
              else if (!readyAssigned) {
                statusLabel = copy.plan.statusReady
                readyAssigned = true
              } else {
                statusLabel = copy.plan.statusSuggested
              }

              const totalMinutes = path.steps.reduce(
                (sum, s) => sum + (s.estimatedMinutes ?? 6),
                0,
              )
              const weeks = Math.max(4, path.steps.length)
              const minsPerWeek = Math.max(
                5,
                Math.round(totalMinutes / weeks),
              )
              const stepId =
                progress?.currentStepId ?? path.steps[0]?.id ?? undefined
              const cta = isStarted
                ? copy.plan.resume
                : isDone
                  ? copy.plan.review
                  : copy.plan.start

              return (
                <li key={theme.id}>
                  <article
                    className="relative flex h-full min-h-[210px] flex-col overflow-hidden rounded-[22px] p-5 sm:p-6"
                    style={{ backgroundColor: tokens.tint }}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-8 -right-6 size-28 rounded-full opacity-40"
                      style={{ backgroundColor: tokens.solid }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-10 -left-8 size-32 rounded-full opacity-25"
                      style={{ backgroundColor: tokens.solid }}
                    />

                    <p
                      className="relative text-[11px] font-extrabold tracking-[0.1em] uppercase"
                      style={{ color: tokens.ink }}
                    >
                      {statusLabel}
                    </p>
                    <h3 className="relative mt-3 text-[1.25rem] font-extrabold leading-snug tracking-[-0.02em] text-ink">
                      {theme.title}
                    </h3>
                    <p className="relative mt-2 text-[14px] text-ink-muted">
                      {copy.plan.themeMeta(weeks, minsPerWeek)}
                    </p>

                    <div className="relative mt-auto pt-6">
                      <button
                        type="button"
                        onClick={() => openTheme(path.id, stepId)}
                        className={cn(
                          'min-h-10 cursor-pointer rounded-full bg-paper px-5 text-[15px] font-bold text-ink shadow-sm transition-colors hover:bg-cream',
                        )}
                      >
                        {cta}
                      </button>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        ) : null}

        {!onboardingComplete ? (
          <div className="mt-12">
            <Button onClick={startJourney}>{copy.plan.startCta}</Button>
          </div>
        ) : null}
      </Container>
    </div>
  )
}
