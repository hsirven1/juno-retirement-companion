import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, X } from 'lucide-react'
import { JourneyStepContent } from './JourneyStepContent'
import { useApp } from '../context/useApp'
import { PATH_SOCIAL } from '../data/paths'
import {
  getContextualGreeting,
  getSocialJourney,
  getSocialJourneyStep,
  useCopy,
  useLocale,
} from '../i18n'
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
    if (isReview) {
      closeGuidedTheme()
      return
    }
    completeJourneyStep(activeJourneyStepId!)
    closeGuidedTheme()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-stretch justify-center md:items-center md:px-6 md:py-8">
      <button
        type="button"
        className="absolute inset-0 hidden bg-ink/35 backdrop-blur-[2px] md:block"
        aria-label={copy.guide.close}
        onClick={closeGuidedTheme}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex h-full w-full flex-col bg-cream shadow-[0_24px_80px_-32px_rgba(36,31,26,0.55)] md:h-[min(860px,calc(100svh-4rem))] md:max-h-[calc(100svh-4rem)] md:w-[min(1040px,92vw)] md:rounded-xl md:border md:border-line"
      >
        <header className="flex shrink-0 flex-col gap-3 border-b border-line px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goBackStep}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-paper hover:text-ink"
              aria-label={
                screenIndex <= 0 ? copy.guide.close : copy.guide.back
              }
            >
              <ArrowLeft size={20} strokeWidth={1.7} />
            </button>

            <div className="min-w-0 text-center">
              <h2
                id={titleId}
                className="text-[12px] font-medium tracking-[0.14em] text-ink-soft uppercase"
              >
                {getSocialJourney(locale).title}
              </h2>
              <p className="mt-0.5 truncate text-[13px] text-ink-muted">
                {step.title}
              </p>
            </div>

            <button
              type="button"
              onClick={closeGuidedTheme}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-paper hover:text-ink"
              aria-label={copy.guide.close}
            >
              <X size={22} strokeWidth={1.7} />
            </button>
          </div>

          {isReview ? (
            <p className="flex items-center justify-center gap-2 text-[13px] font-medium text-sage">
              <span className="size-1.5 rounded-full bg-sage" aria-hidden="true" />
              {copy.guide.stepCompletedLabel}
            </p>
          ) : null}

          <div
            className="flex justify-center gap-1.5"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalScreens}
            aria-valuenow={screenIndex + 1}
            aria-label={copy.guide.progressLabel(screenIndex + 1, totalScreens)}
          >
            {step.screens.map((screen, index) => (
              <span
                key={screen.id}
                className={cn(
                  'size-1.5 rounded-full transition-colors sm:size-2',
                  index <= screenIndex ? 'bg-clay' : 'bg-line-strong',
                )}
                aria-hidden="true"
              />
            ))}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto flex min-h-full max-w-[36rem] flex-col">
            <JourneyStepContent
              stepId={activeJourneyStepId}
              stepDirection={stepDirection}
              reviewMode={isReview}
              onComplete={handleComplete}
            />
          </div>
        </div>

        <div className="shrink-0 border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          <button
            type="button"
            onClick={askJuno}
            className="cursor-pointer text-[14px] text-ink-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          >
            {copy.guide.askJuno}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
