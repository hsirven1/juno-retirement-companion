import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { useApp } from '../context/useApp'
import { PATH_SOCIAL } from '../data/paths'
import {
  getCurrentSocialStepId,
  getSocialJourneyStatus,
  getStepProgressStatus,
} from '../lib/journeyScheduling'
import {
  getJourneyPhaseLabels,
  getLocalizedActiveThemes,
  getLocalizedGuidedPath,
  getSocialJourney,
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

  return (
    <div className="py-12 sm:py-16">
      <Container width="reading">
          <h1 className="font-display text-[2.2rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.7rem]">
            {copy.plan.title}
          </h1>
          <p className="mt-4 max-w-[36rem] text-[18px] text-ink-muted">
            {copy.plan.subtitle}
          </p>

          <ul className="mt-12 space-y-6">
            {themes.map((theme) => {
              const path = getLocalizedGuidedPath(theme.pathId, locale)
              if (!path) return null
              const progress = pathProgress[path.id]
              const isSocial = path.id === PATH_SOCIAL
              const socialStatus = isSocial
                ? getSocialJourneyStatus(progress)
                : null
              const status =
                socialStatus === 'in_action'
                  ? copy.plan.statusInAction
                  : progress?.status === 'completed'
                    ? copy.plan.statusCompleted
                    : progress?.status === 'in_progress' || socialStatus === 'in_progress'
                      ? copy.plan.statusInProgress
                      : copy.plan.statusExplore
              const cta =
                progress?.status === 'in_progress' || socialStatus === 'in_progress'
                  ? copy.plan.continue
                  : copy.plan.start
              const stepId =
                progress?.currentStepId ?? path.steps[0]?.id ?? undefined
              const activeSocialStep = isSocial
                ? getCurrentSocialStepId(progress)
                : null

              return (
                <li
                  key={theme.id}
                  className="rounded-lg border border-line bg-paper p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="font-display text-[1.55rem] leading-snug text-ink">
                      {theme.title}
                    </h2>
                    <span
                      className={cn(
                        'text-[14px]',
                        status === copy.plan.statusInProgress ||
                          status === copy.plan.statusInAction
                          ? 'text-clay'
                          : 'text-ink-soft',
                      )}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="mt-3 text-[17px] leading-relaxed text-ink-muted">
                    {isSocial ? socialJourney.description : path.description}
                  </p>

                  {isSocial ? (
                    <div className="mt-6 space-y-5">
                      {socialJourney.phases.map((phase) => (
                        <div key={phase.id}>
                          <p className="text-[12px] font-medium tracking-[0.12em] text-ink-soft uppercase">
                            {phase.title}
                          </p>
                          <p className="mt-0.5 text-[13px] text-ink-muted">
                            {journeyPhaseLabels[phase.type]}
                          </p>
                          <ul className="mt-3 space-y-2">
                            {phase.steps.map((step) => {
                              const stepStatus = getStepProgressStatus(
                                step.id,
                                progress,
                                activeSocialStep,
                              )
                              return (
                                <li
                                  key={step.id}
                                  className="flex items-start gap-2 text-[14px] text-ink-muted"
                                >
                                  <span aria-hidden="true" className="mt-0.5 shrink-0">
                                    {stepStatus === 'completed'
                                      ? '✓'
                                      : stepStatus === 'current'
                                        ? '●'
                                        : '○'}
                                  </span>
                                  <span
                                    className={
                                      stepStatus === 'current'
                                        ? 'font-medium text-ink'
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
                  ) : progress?.status === 'in_progress' ? (
                    <p className="mt-3 text-[14px] text-ink-soft">
                      {copy.plan.stepsProgress(
                        progress.completedStepIds.length,
                        path.steps.length,
                      )}
                    </p>
                  ) : null}

                  <div className="mt-5">
                    <Button
                      variant="secondary"
                      className="min-h-11 px-5 text-[16px]"
                      onClick={() => openTheme(path.id, stepId)}
                    >
                      {cta}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>

          {!onboardingComplete ? (
            <div className="mt-14">
              <Button onClick={startJourney}>{copy.plan.startCta}</Button>
            </div>
          ) : null}
        </Container>
    </div>
  )
}
