import { useMemo, useState, type ReactNode } from 'react'
import { Button } from './Button'
import { JunoOrb } from './JunoOrb'
import { QuizOption } from './journey/QuizOption'
import { AnswerChip } from './journey/AnswerChip'
import { AbstractComposition } from './journey/AbstractComposition'
import { HighlightedCopy } from './journey/HighlightedCopy'
import { getChoiceLayout } from './journey/choiceLayout'
import { useApp } from '../context/useApp'
import type {
  JourneyScreen,
  ResourceRecommendation,
  SocialPreferences,
} from '../types'
import { cn } from '../lib/cn'
import type { JourneySurface } from '../lib/journeyTheme'
import {
  JourneyStepCompletion,
  ScenarioCards,
  TimelineVisual,
} from './JourneyStepCompletion'
import {
  getJourneyPhaseLabels,
  getJourneySynthesis,
  getOpportunityTypesForStep,
  getSocialJourneyStep,
  getStepCompletionContent,
  useCopy,
  useLocale,
} from '../i18n'
import { getRecommendedResourceCards } from '../lib/lilleRecommendations'
import { makeResourceLabelFns } from '../lib/resourceLabels'
import { getSocialPhaseForStep, SOCIAL_STEP_ORDER } from '../data/socialJourney'
import { getCompletedSocialStepIds } from '../lib/journeyScheduling'
import { PATH_SOCIAL } from '../data/paths'

export function JourneyStepContent({
  stepId,
  stepDirection = 'forward',
  reviewMode = false,
  surface = 'cream',
  onComplete,
}: {
  stepId: string
  stepDirection?: 'forward' | 'back'
  reviewMode?: boolean
  surface?: JourneySurface
  onComplete: () => void
}) {
  const {
    socialPreferences,
    socialFeedback,
    pathProgress,
    getJourneyStepState,
    setJourneyStepScreen,
    setJourneyStepResponse,
    markSocialInterest,
    dismissSocialResource,
    laterSocialResource,
    addSocialWeekStep,
  } = useApp()
  const { locale } = useLocale()

  const step = getSocialJourneyStep(stepId, locale)
  const { screenIndex, responses } = getJourneyStepState(stepId)

  if (!step) return null
  const journeyStep = step
  const screen = journeyStep.screens[screenIndex]

  if (!screen) return null

  function goNext() {
    if (screenIndex >= journeyStep.screens.length - 1) return
    setJourneyStepScreen(stepId, screenIndex + 1)
  }

  const completedCount = getCompletedSocialStepIds(
    pathProgress[PATH_SOCIAL],
  ).length
  const weekNumber = Math.min(
    SOCIAL_STEP_ORDER.length,
    Math.max(1, completedCount + (reviewMode ? 0 : 1)),
  )
  const phase = getSocialPhaseForStep(stepId)
  const phaseLabels = getJourneyPhaseLabels(locale)
  const progressEyebrow = phase
    ? `${phaseLabels[phase.type]} · ${screenIndex + 1} ${locale === 'en' ? 'of' : 'sur'} ${journeyStep.screens.length}`
    : undefined

  return (
    <div
      key={`${stepId}-${screen.id}`}
      className={
        stepDirection === 'back'
          ? 'guided-step-enter-back flex min-h-full flex-col pb-2'
          : 'guided-step-enter flex min-h-full flex-col pb-2'
      }
    >
      <ScreenRenderer
        stepId={stepId}
        screen={screen}
        surface={surface}
        weekNumber={weekNumber}
        progressEyebrow={progressEyebrow}
        prefs={socialPreferences}
        responses={responses}
        feedback={socialFeedback}
        onResponse={(key, value) => setJourneyStepResponse(stepId, key, value)}
        onInterest={markSocialInterest}
        onDismiss={dismissSocialResource}
        onLater={laterSocialResource}
        onAddToWeek={addSocialWeekStep}
        onContinue={goNext}
        onComplete={onComplete}
        reviewMode={reviewMode}
      />
    </div>
  )
}

function ScreenRenderer({
  stepId,
  screen,
  surface: _surface,
  weekNumber,
  progressEyebrow,
  prefs,
  responses,
  feedback,
  onResponse,
  onInterest,
  onDismiss,
  onLater,
  onAddToWeek,
  onContinue,
  onComplete,
  reviewMode = false,
}: {
  stepId: string
  screen: JourneyScreen
  surface: JourneySurface
  weekNumber: number
  progressEyebrow?: string
  prefs: SocialPreferences
  responses: Record<string, unknown>
  feedback: {
    interestedIds: string[]
    dismissedIds: string[]
    laterIds: string[]
    dismissReasons: Record<string, string>
  }
  onResponse: (key: string, value: import('../types').AnswerValue) => void
  onInterest: (resource: ResourceRecommendation) => void
  onDismiss: (resourceId: string, reason?: string) => void
  onLater: (resourceId: string) => void
  onAddToWeek: (resource: ResourceRecommendation) => void
  onContinue: () => void
  onComplete: () => void
  reviewMode?: boolean
}) {
  const copy = useCopy()
  const { locale } = useLocale()
  const cta = screen.ctaLabel ?? copy.journeyUi.continue

  if (screen.type === 'timeline') {
    return (
      <ScreenShell
        onDark={false}
        cta={
          <ContinueButton inverted={false} onClick={onContinue}>
            {cta}
          </ContinueButton>
        }
      >
        {screen.title ? (
          <Title className="text-ink">{screen.title}</Title>
        ) : null}
        <div className={screen.title ? 'mt-6' : ''}>
          <TimelineVisual
            title={copy.journeyUi.atWork}
            items={screen.timeline ?? []}
            footer={screen.paragraphs?.[0]}
          />
        </div>
      </ScreenShell>
    )
  }

  if (screen.type === 'insight' && screen.synthesisId) {
    const insight = getJourneySynthesis(
      screen.synthesisId,
      prefs,
      responses as Record<string, import('../types').AnswerValue>,
      locale,
    )
    return (
      <InsightScreen
        title={insight.title}
        paragraphs={insight.paragraphs}
        bullets={insight.bullets}
        tags={insight.tags}
        onContinue={onContinue}
      />
    )
  }

  if (screen.type === 'scenario' && screen.responseKey) {
    const selected =
      (responses[screen.responseKey] as string | undefined) ?? null
    return (
      <ScreenShell
        onDark={false}
        cta={
          <ContinueButton
            inverted={false}
            solid
            disabled={!selected}
            onClick={onContinue}
          >
            {cta}
          </ContinueButton>
        }
      >
        <ScenarioCards
          eyebrow={copy.journeyUi.threeWays}
          question={screen.question ?? ''}
          options={(screen.options ?? []).map((o) => ({
            id: o.id,
            label: o.label,
            description: o.description,
          }))}
          selected={selected}
          onSelect={(id) => onResponse(screen.responseKey!, id)}
        />
      </ScreenShell>
    )
  }

  if (screen.type === 'stepCompletion') {
    const completionId = screen.completionId ?? stepId
    const content = getStepCompletionContent(
      completionId,
      prefs,
      responses as Record<string, import('../types').AnswerValue>,
      locale,
    )
    return (
      <JourneyStepCompletion
        accomplishment={content.accomplishment}
        junoRetains={content.junoRetains}
        tags={content.tags}
        nextTime={content.nextTime}
        weekNumber={weekNumber}
        onFinish={onComplete}
        finishLabel={
          reviewMode ? copy.journeyUi.closeStep : copy.journeyUi.finishStep
        }
      />
    )
  }

  if (screen.type === 'content') {
    const lead = (screen.paragraphs ?? [])[0]
    const rest = (screen.paragraphs ?? []).slice(1)
    return (
      <ScreenShell
        onDark
        cta={
          <ContinueButton inverted onClick={onContinue}>
            {cta}
          </ContinueButton>
        }
      >
        <AbstractComposition
          variant="orbit"
          tone="on-solid"
          className="h-36 max-w-[220px] sm:h-44 sm:max-w-[260px]"
        />
        {progressEyebrow ? (
          <p className="mt-3 text-center text-[11px] font-extrabold tracking-[0.1em] text-white/80 uppercase sm:mt-4 sm:text-[12px]">
            {progressEyebrow}
          </p>
        ) : null}
        {screen.title ? (
          <h1 className="mt-2.5 text-center font-display text-[1.75rem] font-medium leading-tight tracking-[-0.02em] text-white sm:mt-3 sm:text-[2.1rem]">
            {screen.title}
          </h1>
        ) : null}
        {lead ? (
          <p className="mt-4 text-center text-[16px] leading-relaxed text-white/90 sm:text-[17px]">
            {lead}
          </p>
        ) : null}
        {rest.length > 0 ? (
          <div className="mt-3 space-y-2 text-center text-[15px] leading-relaxed text-white/80">
            {rest.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        ) : null}
      </ScreenShell>
    )
  }

  if (screen.type === 'concepts') {
    return (
      <ScreenShell
        onDark={false}
        cta={
          <ContinueButton inverted={false} solid onClick={onContinue}>
            {cta}
          </ContinueButton>
        }
      >
        {screen.title ? <Title>{screen.title}</Title> : null}
        <AbstractComposition
          variant="cluster"
          tone="on-tint"
          className={screen.title ? 'mt-4' : ''}
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {(screen.options ?? []).map((option, index) => (
            <li
              key={option.id}
              className="rounded-[18px] border border-line/70 bg-paper/90 px-4 py-4"
            >
              <p
                className="text-[12px] font-extrabold tracking-[0.12em] uppercase"
                style={{ color: 'var(--journey-ink, var(--color-clay-ink))' }}
              >
                {option.label}
              </p>
              {screen.paragraphs?.[index] ? (
                <p className="mt-2 text-[15px] leading-snug text-ink-muted">
                  {screen.paragraphs[index]}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </ScreenShell>
    )
  }

  if (screen.type === 'multiChoice' && screen.responseKey) {
    const selected = (responses[screen.responseKey] as string[] | undefined) ?? []
    return (
      <ChoiceScreen
        question={screen.question ?? ''}
        multi
        options={screen.options ?? []}
        selected={selected}
        onToggle={(id) => {
          if (id === 'rien') {
            onResponse(screen.responseKey!, ['rien'])
            return
          }
          const withoutRien = selected.filter((g) => g !== 'rien')
          const next = withoutRien.includes(id)
            ? withoutRien.filter((g) => g !== id)
            : [...withoutRien, id]
          onResponse(screen.responseKey!, next)
        }}
        onContinue={onContinue}
        cta={cta}
        disabled={selected.length === 0}
      />
    )
  }

  if (screen.type === 'singleChoice' && screen.responseKey) {
    const selected = (responses[screen.responseKey] as string | undefined) ?? null
    return (
      <ChoiceScreen
        question={screen.question ?? ''}
        options={screen.options ?? []}
        selected={selected ? [selected] : []}
        onToggle={(id) => onResponse(screen.responseKey!, id)}
        onContinue={onContinue}
        cta={cta}
        disabled={!selected}
      />
    )
  }

  if (screen.type === 'synthesis' && screen.synthesisId) {
    const synthesis = getJourneySynthesis(
      screen.synthesisId,
      prefs,
      responses as Record<string, import('../types').AnswerValue>,
      locale,
    )
    return (
      <InsightScreen
        title={synthesis.title}
        paragraphs={synthesis.paragraphs}
        bullets={synthesis.bullets}
        tags={synthesis.tags}
        onContinue={onContinue}
      />
    )
  }

  if (screen.type === 'recommendation') {
    return (
      <RecommendationTypesScreen
        prefs={prefs}
        responses={responses}
        onResponse={onResponse}
        onContinue={onContinue}
        cta={cta}
      />
    )
  }

  if (screen.type === 'resourceSelection') {
    const isPickStep = screen.synthesisId === 'pick-first'
    return (
      <ResourcesScreen
        prefs={prefs}
        feedback={feedback}
        pickMode={isPickStep}
        interestedOnly={isPickStep}
        limit={3}
        title={screen.title}
        intro={screen.paragraphs?.[0]}
        onInterest={onInterest}
        onDismiss={onDismiss}
        onLater={onLater}
        onAddToWeek={onAddToWeek}
        onPick={(resource) => {
          onResponse('selectedResourceId', resource.id)
          onResponse(
            'selectedActionLabel',
            resource.id === 'lille-espace-seniors'
              ? copy.journeyUi.seniorsWorkshopsAction
              : copy.journeyUi.contactAction(resource.title),
          )
          onContinue()
        }}
        onContinue={onContinue}
        cta={isPickStep ? copy.journeyUi.continue : cta}
      />
    )
  }

  return null
}

function ScreenShell({
  children,
  cta,
  onDark,
}: {
  children: ReactNode
  cta?: ReactNode
  onDark?: boolean
}) {
  return (
    <div className="flex min-h-full flex-col">
      <div className={cn('flex-1', onDark ? 'text-white' : '')}>{children}</div>
      {cta ? <div className="mt-auto pt-6 sm:pt-7">{cta}</div> : null}
    </div>
  )
}

function ContinueButton({
  children,
  onClick,
  disabled,
  inverted = false,
  solid: _solid = false,
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  inverted?: boolean
  solid?: boolean
}) {
  if (inverted) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="min-h-12 w-full cursor-pointer rounded-full bg-white px-6 text-[17px] font-bold text-[color:var(--journey-ink,#a82b44)] transition-transform active:scale-[0.985] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--journey-solid,#d6455e)] disabled:cursor-not-allowed disabled:bg-white/70 disabled:text-[color:var(--journey-ink,#a82b44)]"
      >
        {children}
      </button>
    )
  }
  return (
    <Button
      className="min-h-12 w-full text-[17px] font-bold"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function Title({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h1
      className={cn(
        'font-display text-[1.65rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.95rem]',
        className,
      )}
    >
      {children}
    </h1>
  )
}

function InsightScreen({
  title,
  paragraphs,
  bullets,
  tags,
  onContinue,
}: {
  title?: string
  paragraphs: string[]
  bullets?: string[]
  tags?: string[]
  onContinue: () => void
}) {
  const copy = useCopy()
  const facts = [
    ...paragraphs,
    ...(bullets ?? []),
  ].filter(Boolean)

  return (
    <ScreenShell
      onDark
      cta={
        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:gap-3">
          <ContinueButton solid onClick={onContinue}>
            {copy.journeyUi.insightConfirm}
          </ContinueButton>
          <button
            type="button"
            onClick={onContinue}
            className="min-h-12 cursor-pointer rounded-full border border-white/35 px-5 text-[16px] font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#241c18] sm:min-w-[10rem]"
          >
            {copy.journeyUi.insightAdjust}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        <JunoOrb size={72} glow className="sm:hidden" />
        <JunoOrb size={88} glow className="hidden sm:inline-block" />
        <p
          className="mt-4 text-[11px] font-extrabold tracking-[0.1em] uppercase sm:mt-5 sm:text-[12px]"
          style={{ color: 'var(--journey-solid, #d6455e)' }}
        >
          {copy.journeyUi.whatIUnderstand}
        </p>
      </div>
      {title ? (
        <h1 className="mt-3 text-center font-display text-[1.55rem] font-medium leading-tight tracking-[-0.02em] text-white sm:mt-4 sm:text-[1.85rem]">
          <HighlightedCopy
            text={title}
            highlightColor="var(--journey-solid, #E1503A)"
          />
        </h1>
      ) : null}
      <ul className="mt-5 space-y-2.5 text-left sm:mt-6 sm:space-y-3">
        {facts.map((p) => (
          <li
            key={p}
            className="rounded-[16px] bg-[#2C2420] px-4 py-3.5 text-[15px] leading-relaxed text-white/92 sm:py-4 sm:text-[16px]"
          >
            <HighlightedCopy
              text={p}
              highlightColor="var(--journey-solid, #E1503A)"
            />
          </li>
        ))}
      </ul>
      {tags && tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] text-white/85 sm:text-[13px]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </ScreenShell>
  )
}

function ChoiceScreen({
  question,
  options,
  selected,
  onToggle,
  onContinue,
  cta,
  disabled,
  multi = false,
}: {
  question: string
  options: { id: string; label: string }[]
  selected: string[]
  onToggle: (id: string) => void
  onContinue: () => void
  cta: string
  disabled: boolean
  multi?: boolean
}) {
  const copy = useCopy()
  const layout = getChoiceLayout(options, multi)

  return (
    <ScreenShell
      cta={
        <ContinueButton solid disabled={disabled} onClick={onContinue}>
          {cta}
        </ContinueButton>
      }
    >
      <p
        className="text-[11px] font-extrabold tracking-[0.1em] uppercase sm:text-[12px]"
        style={{ color: 'var(--journey-ink, var(--color-clay-ink))' }}
      >
        {copy.journeyUi.aQuestion}
      </p>
      <h1 className="mt-1.5 text-[1.4rem] font-extrabold leading-snug tracking-[-0.02em] text-ink sm:text-[1.7rem]">
        {question}
      </h1>
      <p className="mt-1.5 text-[14px] text-ink-soft sm:text-[15px]">
        {multi ? copy.journeyUi.severalAnswers : copy.journeyUi.singleAnswer}
      </p>

      {layout === 'chips' ? (
        <div
          className="mt-5 flex flex-wrap gap-2.5 sm:mt-6"
          role={multi ? 'group' : 'radiogroup'}
          aria-label={question}
        >
          {options.map((option) => (
            <AnswerChip
              key={option.id}
              label={option.label}
              selected={selected.includes(option.id)}
              onSelect={() => onToggle(option.id)}
              accent="var(--journey-solid, var(--color-clay))"
              accentTint="var(--journey-tint, #FDF1EF)"
            />
          ))}
        </div>
      ) : layout === 'scale' ? (
        <div
          className="mt-5 grid gap-2.5 sm:mt-6"
          style={{
            gridTemplateColumns: `repeat(${Math.min(options.length, 4)}, minmax(0, 1fr))`,
          }}
          role="radiogroup"
          aria-label={question}
        >
          {options.map((option) => {
            const isSelected = selected.includes(option.id)
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onToggle(option.id)}
                className={cn(
                  'flex min-h-[64px] cursor-pointer flex-col items-center justify-center rounded-[16px] border-2 px-2 py-3 text-center text-[15px] font-bold transition-[border-color,background-color,transform] duration-150 sm:min-h-[72px] sm:text-[16px]',
                  'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(225,80,58,0.35)] focus-visible:ring-offset-2',
                  'active:scale-[0.98]',
                  isSelected
                    ? 'text-ink'
                    : 'border-line bg-paper text-ink hover:border-[#DCD1C1] hover:bg-[#FDFBF7]',
                )}
                style={
                  isSelected
                    ? {
                        borderColor: 'var(--journey-solid, var(--color-clay))',
                        backgroundColor: 'var(--journey-tint, #FDF1EF)',
                      }
                    : undefined
                }
              >
                {option.label}
              </button>
            )
          })}
        </div>
      ) : (
        <div
          className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:gap-3"
          role={multi ? 'group' : 'radiogroup'}
          aria-label={question}
        >
          {options.map((option) => (
            <QuizOption
              key={option.id}
              label={option.label}
              selected={selected.includes(option.id)}
              onSelect={() => onToggle(option.id)}
              multi={multi}
              accent="var(--journey-solid, var(--color-clay))"
              accentTint="var(--journey-tint, #FDF1EF)"
            />
          ))}
        </div>
      )}
    </ScreenShell>
  )
}

function RecommendationTypesScreen({
  prefs,
  responses,
  onResponse,
  onContinue,
  cta,
}: {
  prefs: SocialPreferences
  responses: Record<string, unknown>
  onResponse: (key: string, value: import('../types').AnswerValue) => void
  onContinue: () => void
  cta: string
}) {
  const copy = useCopy()
  const { locale } = useLocale()
  const types = getOpportunityTypesForStep(prefs, locale)
  const feedback =
    (responses.opportunityTypeFeedback as Record<string, 'yes' | 'no'> | undefined) ??
    prefs.opportunityTypeFeedback ??
    {}

  function setFeedback(typeId: string, value: 'yes' | 'no') {
    onResponse('opportunityTypeFeedback', { ...feedback, [typeId]: value })
  }

  const allAnswered = types.every((t) => feedback[t.id])

  return (
    <ScreenShell
      cta={
        <ContinueButton solid disabled={!allAnswered} onClick={onContinue}>
          {cta}
        </ContinueButton>
      }
    >
      <ul className="space-y-4">
        {types.map((type) => (
          <li
            key={type.id}
            className="rounded-[18px] border border-line bg-paper px-5 py-5"
          >
            <p
              className="text-[12px] font-extrabold tracking-[0.12em] uppercase"
              style={{ color: 'var(--journey-ink, var(--color-clay-ink))' }}
            >
              {type.title}
            </p>
            <p className="mt-2 text-[16px] text-ink-muted">{type.description}</p>
            <div className="mt-4 flex flex-col gap-2">
              <QuizOption
                label={copy.journeyUi.speaksToMe}
                selected={feedback[type.id] === 'yes'}
                onSelect={() => setFeedback(type.id, 'yes')}
                accent="var(--journey-solid, var(--color-clay))"
                accentTint="var(--journey-tint, var(--color-clay-tint))"
              />
              <QuizOption
                label={copy.journeyUi.notReally}
                selected={feedback[type.id] === 'no'}
                onSelect={() => setFeedback(type.id, 'no')}
                accent="var(--journey-solid, var(--color-clay))"
                accentTint="var(--journey-tint, var(--color-clay-tint))"
              />
            </div>
          </li>
        ))}
      </ul>
    </ScreenShell>
  )
}

function ResourcesScreen({
  prefs,
  feedback,
  pickMode,
  interestedOnly,
  limit,
  title,
  intro,
  onInterest,
  onDismiss,
  onLater,
  onAddToWeek,
  onPick,
  onContinue,
  cta,
}: {
  prefs: SocialPreferences
  feedback: {
    interestedIds: string[]
    dismissedIds: string[]
    laterIds: string[]
    dismissReasons: Record<string, string>
  }
  pickMode: boolean
  interestedOnly: boolean
  limit: number
  title?: string
  intro?: string
  onInterest: (resource: ResourceRecommendation) => void
  onDismiss: (resourceId: string, reason?: string) => void
  onLater: (resourceId: string) => void
  onAddToWeek: (resource: ResourceRecommendation) => void
  onPick: (resource: ResourceRecommendation) => void
  onContinue: () => void
  cta: string
}) {
  const copy = useCopy()
  const { locale } = useLocale()
  const { activeThemeIds } = useApp()
  const [dismissingId, setDismissingId] = useState<string | null>(null)
  const [pendingAddId, setPendingAddId] = useState<string | null>(null)
  const [pickedResource, setPickedResource] =
    useState<ResourceRecommendation | null>(null)

  const labels = useMemo(() => makeResourceLabelFns(copy, locale), [copy, locale])

  const resources = useMemo(() => {
    const cards = getRecommendedResourceCards({
      locale,
      activeThemeIds,
      socialPreferences: prefs,
      socialFeedback: feedback,
      journeyRole: interestedOnly ? 'act' : 'explore',
      limit: interestedOnly ? 24 : limit,
      preferConcretePlaces: true,
      typeLabel: labels.typeLabel,
      commitmentLabel: labels.commitmentLabel,
      savedIds: feedback.interestedIds,
    })
    if (interestedOnly) {
      return cards
        .filter((r) => feedback.interestedIds.includes(r.id))
        .slice(0, limit)
    }
    return cards.slice(0, limit)
  }, [
    prefs,
    feedback,
    interestedOnly,
    limit,
    locale,
    labels,
    activeThemeIds,
  ])

  const reasons = copy.journeyUi.dismissReasons

  if (pickMode && pickedResource) {
    const actionLabel = copy.journeyUi.contactAction(pickedResource.title)
    return (
      <ScreenShell
        cta={
          <div className="flex w-full flex-col gap-3">
            <ContinueButton
              solid
              onClick={() => {
                onAddToWeek(pickedResource)
                onPick(pickedResource)
                onContinue()
              }}
            >
              {copy.journeyUi.addToWeek}
            </ContinueButton>
            <button
              type="button"
              className="cursor-pointer text-[14px] text-ink-muted underline underline-offset-4 hover:text-ink"
              onClick={() => {
                onPick(pickedResource)
                onContinue()
              }}
            >
              {copy.journeyUi.continueWithoutAdding}
            </button>
          </div>
        }
      >
        <Title>{copy.journeyUi.nextStepConfirm}</Title>
        <p className="mt-4 text-[17px] text-ink-muted">{actionLabel}</p>
      </ScreenShell>
    )
  }

  if (pickMode && resources.length === 0) {
    return (
      <ScreenShell
        cta={
          <ContinueButton inverted={false} onClick={onContinue}>
            {cta}
          </ContinueButton>
        }
      >
        <Title>{copy.journeyUi.pickWhichFirst}</Title>
        <div className="mt-4 space-y-3 text-[17px] text-ink-muted">
          <p>{copy.journeyUi.noInterestYet}</p>
          <p>{copy.journeyUi.goBackToSelect}</p>
        </div>
      </ScreenShell>
    )
  }

  return (
    <ScreenShell
      cta={
        !pickMode ? (
          <ContinueButton solid onClick={onContinue}>
            {cta}
          </ContinueButton>
        ) : undefined
      }
    >
      {title ? <Title>{title}</Title> : null}
      {intro ? <p className="mt-3 text-[16px] text-ink-muted">{intro}</p> : null}

      <ul className="mt-8 space-y-4">
        {resources.map((resource) => {
          const interested = feedback.interestedIds.includes(resource.id)
          const later = feedback.laterIds.includes(resource.id)
          return (
            <li
              key={resource.id}
              className="rounded-[18px] border border-line bg-paper px-5 py-5"
            >
              <p
                className="text-[12px] font-extrabold tracking-[0.12em] uppercase"
                style={{ color: 'var(--journey-ink, var(--color-clay-ink))' }}
              >
                {resource.categoryLabel}
              </p>
              <h2 className="mt-2 text-[1.2rem] font-bold text-ink">
                {resource.title}
              </h2>
              <p className="mt-2 text-[15px] text-ink-muted">
                {resource.description}
              </p>
              <p className="mt-3 text-[14px] text-ink">
                <span className="text-ink-soft">
                  {copy.journeyUi.whyJunoSuggests}{' '}
                </span>
                {resource.personalizationReason}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(resource.tags ?? []).slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-cream px-2.5 py-1 text-[12px] text-ink-soft"
                  >
                    {tag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>

              {pickMode ? (
                <button
                  type="button"
                  className="mt-4 cursor-pointer text-[15px] font-bold text-clay-ink hover:text-clay-deep"
                  onClick={() => setPickedResource(resource)}
                >
                  {copy.journeyUi.chooseThisOne}
                </button>
              ) : pendingAddId === resource.id ? (
                <div className="mt-4 rounded-[14px] border border-line bg-cream px-4 py-4">
                  <p className="text-[15px] text-ink">
                    {copy.journeyUi.nextStepConfirm}
                  </p>
                  <Button
                    className="mt-4 min-h-11 px-5 text-[15px] font-bold"
                    onClick={() => {
                      onAddToWeek(resource)
                      setPendingAddId(null)
                    }}
                  >
                    {copy.journeyUi.addToWeek}
                  </Button>
                </div>
              ) : dismissingId === resource.id ? (
                <div className="mt-4">
                  <p className="text-[14px] text-ink-muted">
                    {copy.journeyUi.dismissPrompt}
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {reasons.map((reason) => (
                      <QuizOption
                        key={reason.id}
                        label={reason.label}
                        selected={false}
                        onSelect={() => {
                          onDismiss(resource.id, reason.id)
                          setDismissingId(null)
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-3 text-[14px]">
                  {!interested ? (
                    <button
                      type="button"
                      className="cursor-pointer font-bold text-clay-ink hover:text-clay-deep"
                      onClick={() => {
                        onInterest(resource)
                        setPendingAddId(resource.id)
                      }}
                    >
                      {copy.journeyUi.interested}
                    </button>
                  ) : (
                    <span className="text-sage">
                      {copy.journeyUi.interestNoted}
                    </span>
                  )}
                  <button
                    type="button"
                    className="cursor-pointer text-ink-muted hover:text-ink"
                    onClick={() => setDismissingId(resource.id)}
                  >
                    {copy.journeyUi.notForMe}
                  </button>
                  {!later ? (
                    <button
                      type="button"
                      className="cursor-pointer text-ink-muted hover:text-ink"
                      onClick={() => onLater(resource.id)}
                    >
                      {copy.journeyUi.later}
                    </button>
                  ) : (
                    <span className="text-ink-soft">
                      {copy.journeyUi.savedForLater}
                    </span>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </ScreenShell>
  )
}
