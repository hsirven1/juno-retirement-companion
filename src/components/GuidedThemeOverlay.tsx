import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'
import { JourneyStepContent } from './JourneyStepContent'
import { SegmentedStepProgress } from './journey/SegmentedStepProgress'
import { useApp } from '../context/useApp'
import { PATH_SOCIAL } from '../data/paths'
import { getSocialPhaseForStep } from '../data/socialJourney'
import {
  getContextualGreeting,
  getJourneyPhaseLabels,
  getSocialJourney,
  getSocialJourneyStep,
  useCopy,
  useLocale,
} from '../i18n'
import {
  getJourneyScreenSurface,
  getJourneyTheme,
  type JourneySurface,
} from '../lib/journeyTheme'
import { cn } from '../lib/cn'

export function GuidedThemeOverlay() {
  const {
    guidedThemeOpen,
    activeJourneyStepId,
    closeGuidedTheme,
    openChat,
    getJourneyStepState,
    setJourneyStepScreen,
    completeJourneyStep,
  } = useApp()
  const copy = useCopy()
  const { locale } = useLocale()
  const navigate = useNavigate()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [stepDirection, setStepDirection] = useState<'forward' | 'back'>(
    'forward',
  )
  const previousIndexRef = useRef(0)

  const step = activeJourneyStepId
    ? getSocialJourneyStep(activeJourneyStepId, locale)
    : null
  const { screenIndex, status } = activeJourneyStepId
    ? getJourneyStepState(activeJourneyStepId)
    : { screenIndex: 0, status: 'notStarted' as const }
  const totalScreens = step?.screens.length ?? 0
  const isReview = status === 'completed'
  const screen = step?.screens[screenIndex]
  const surface: JourneySurface = screen
    ? getJourneyScreenSurface(screen.type)
    : 'cream'
  const theme = getJourneyTheme('social')
  const phase = activeJourneyStepId
    ? getSocialPhaseForStep(activeJourneyStepId)
    : undefined
  const phaseLabels = getJourneyPhaseLabels(locale)
  const onDark = surface === 'theme' || surface === 'dark'

  useEffect(() => {
    const previous = previousIndexRef.current
    if (screenIndex > previous) setStepDirection('forward')
    else if (screenIndex < previous) setStepDirection('back')
    previousIndexRef.current = screenIndex
  }, [screenIndex])

  useEffect(() => {
    if (!guidedThemeOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeGuidedTheme()
    }
    window.addEventListener('keydown', onKeyDown)

    const focusTimer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>('button, [href], input, textarea')
        ?.focus()
    }, 50)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(focusTimer)
    }
  }, [guidedThemeOpen, closeGuidedTheme])

  if (!guidedThemeOpen || !activeJourneyStepId || !step) return null

  function goBackStep() {
    if (screenIndex <= 0) {
      closeGuidedTheme()
      return
    }
    setJourneyStepScreen(activeJourneyStepId!, screenIndex - 1)
  }

  function askJuno() {
    closeGuidedTheme()
    openChat({
      relatedPathId: PATH_SOCIAL,
      relatedStepId: activeJourneyStepId ?? undefined,
      initialContext: 'social',
      greeting: getContextualGreeting({ initialContext: 'social' }, locale),
    })
  }

  function handleComplete() {
    if (!isReview) {
      completeJourneyStep(activeJourneyStepId!)
    }
    closeGuidedTheme()
    void navigate('/home')
  }

  const panelStyle =
    surface === 'theme'
      ? {
          backgroundColor: theme.solid,
          color: '#fff',
          ['--journey-solid' as string]: theme.solid,
          ['--journey-tint' as string]: theme.tint,
          ['--journey-ink' as string]: theme.ink,
        }
      : surface === 'tint'
        ? {
            backgroundColor: theme.tint,
            ['--journey-solid' as string]: theme.solid,
            ['--journey-tint' as string]: theme.tint,
            ['--journey-ink' as string]: theme.ink,
          }
        : surface === 'dark'
          ? {
              backgroundColor: '#241c18',
              color: '#fff',
              ['--journey-solid' as string]: theme.solid,
              ['--journey-tint' as string]: theme.tint,
              ['--journey-ink' as string]: theme.ink,
            }
          : surface === 'soft'
            ? {
                backgroundColor: 'var(--color-cream-deep)',
                ['--journey-solid' as string]: theme.solid,
                ['--journey-tint' as string]: theme.tint,
                ['--journey-ink' as string]: theme.ink,
              }
            : {
                backgroundColor: 'var(--color-cream)',
                ['--journey-solid' as string]: theme.solid,
                ['--journey-tint' as string]: theme.tint,
                ['--journey-ink' as string]: theme.ink,
              }

  const chromeBtn = onDark
    ? 'bg-white/15 text-white hover:bg-white/25'
    : 'bg-[#F0E8DC] text-ink-muted hover:bg-[#E8DFD2] hover:text-ink'

  const progressFill = onDark ? 'rgba(255,255,255,0.92)' : theme.solid
  const progressEmpty = onDark
    ? 'rgba(255,255,255,0.28)'
    : 'var(--color-line-strong)'

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-stretch justify-center md:items-center md:px-6 md:py-8">
      <button
        type="button"
        className="absolute inset-0 hidden bg-[rgba(34,28,24,0.45)] backdrop-blur-[2px] md:block"
        aria-label={copy.guide.close}
        onClick={closeGuidedTheme}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative z-10 flex h-full w-full flex-col shadow-[var(--shadow-overlay)] transition-colors duration-300',
          'md:h-[min(780px,calc(100svh-4rem))] md:max-h-[calc(100svh-4rem)] md:w-[min(620px,92vw)] md:rounded-[26px]',
        )}
        style={panelStyle}
      >
        <header className="flex shrink-0 flex-col gap-2 px-4 pt-3 pb-1 sm:px-6 sm:pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goBackStep}
              className={cn(
                'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors md:size-9',
                chromeBtn,
              )}
              aria-label={
                screenIndex <= 0 ? copy.guide.close : copy.guide.back
              }
            >
              <ArrowLeft size={18} strokeWidth={2} />
            </button>

            <SegmentedStepProgress
              className="mx-1 flex-1"
              total={totalScreens}
              currentIndex={screenIndex}
              partial={1}
              fill={progressFill}
              empty={progressEmpty}
              aria-label={copy.guide.progressLabel(
                screenIndex + 1,
                totalScreens,
              )}
            />

            <button
              type="button"
              onClick={closeGuidedTheme}
              className={cn(
                'flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors md:size-9',
                chromeBtn,
              )}
              aria-label={copy.guide.close}
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {isReview ? (
            <p
              className={cn(
                'flex items-center justify-center gap-2 text-[13px] font-medium',
                onDark ? 'text-white/80' : 'text-sage',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  onDark ? 'bg-white/80' : 'bg-sage',
                )}
                aria-hidden="true"
              />
              {copy.guide.stepCompletedLabel}
            </p>
          ) : null}

          {surface !== 'theme' && surface !== 'dark' ? (
            <h2
              id={titleId}
              className="text-center text-[11px] font-extrabold tracking-[0.1em] uppercase"
              style={{ color: theme.ink }}
            >
              <span
                aria-hidden="true"
                className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
                style={{ backgroundColor: theme.solid }}
              />
              {getSocialJourney(locale).title}
              {phase ? ` · ${phaseLabels[phase.type]}` : null}
              <span className="sr-only"> — {step.title}</span>
            </h2>
          ) : (
            <h2 id={titleId} className="sr-only">
              {getSocialJourney(locale).title}
              {phase ? ` · ${phaseLabels[phase.type]}` : null} — {step.title}
            </h2>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 sm:px-7 sm:py-4">
          <div className="mx-auto flex min-h-full max-w-[34rem] flex-col">
            <JourneyStepContent
              stepId={activeJourneyStepId}
              stepDirection={stepDirection}
              reviewMode={isReview}
              surface={surface}
              onComplete={handleComplete}
            />
          </div>
        </div>

        {screen?.type !== 'stepCompletion' &&
        screen?.type !== 'insight' &&
        screen?.type !== 'synthesis' ? (
          <div
            className={cn(
              'shrink-0 px-5 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6',
            )}
          >
            <button
              type="button"
              onClick={askJuno}
              className={cn(
                'cursor-pointer text-[13px] underline underline-offset-4 transition-colors',
                onDark
                  ? 'text-white/60 decoration-white/25 hover:text-white'
                  : 'text-ink-soft decoration-line hover:text-ink',
              )}
            >
              {copy.guide.askJuno}
            </button>
          </div>
        ) : (
          <div className="pb-[max(0.5rem,env(safe-area-inset-bottom))]" />
        )}
      </div>
    </div>,
    document.body,
  )
}
