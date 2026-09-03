import { useMemo, useState, type ReactNode } from 'react'
import { Button } from './Button'
import { JunoAvatar } from './JunoAvatar'
import { useApp } from '../context/useApp'
import type {
  JourneyScreen,
  ResourceRecommendation,
  SocialPreferences,
} from '../types'
import { cn } from '../lib/cn'
import {
  JourneyStepCompletion,
  ScenarioCards,
  TimelineVisual,
} from './JourneyStepCompletion'
import {
  getJourneySynthesis,
  getOpportunityTypesForStep,
  getSocialJourneyStep,
  getStepCompletionContent,
  useCopy,
  useLocale,
} from '../i18n'
import { getRecommendedResourceCards } from '../lib/lilleRecommendations'
import { makeResourceLabelFns } from '../lib/resourceLabels'

export function JourneyStepContent({
  stepId,
  stepDirection = 'forward',
  reviewMode = false,
  onComplete,
}: {
  stepId: string
  stepDirection?: 'forward' | 'back'
  reviewMode?: boolean
  onComplete: () => void
}) {
  const {
    socialPreferences,
    socialFeedback,
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

  return (
    <div
      key={`${stepId}-${screen.id}`}
      className={
        stepDirection === 'back'
          ? 'guided-step-enter-back pb-4'
          : 'guided-step-enter pb-4'
      }
    >
      <ScreenRenderer
        stepId={stepId}
        screen={screen}
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
      <div>
        {screen.title ? <Title>{screen.title}</Title> : null}
        <div className={screen.title ? 'mt-8' : ''}>
          <TimelineVisual
            title={copy.journeyUi.atWork}
            items={screen.timeline ?? []}
            footer={screen.paragraphs?.[0]}
          />
        </div>
        <Button className="mt-10" onClick={onContinue}>
          {cta}
        </Button>
      </div>
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
      <div className="rounded-lg border border-line bg-paper/60 px-5 py-5">
        <div className="space-y-4 text-[17px] leading-relaxed text-ink-muted">
          {insight.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Button className="mt-8" onClick={onContinue}>
          {cta}
        </Button>
      </div>
    )
  }

  if (screen.type === 'scenario' && screen.responseKey) {
    const selected =
      (responses[screen.responseKey] as string | undefined) ?? null
    return (
      <div>
        <ScenarioCards
          question={screen.question ?? ''}
          options={(screen.options ?? []).map((o) => ({
            id: o.id,
            label: o.label,
            description: o.description,
          }))}
          selected={selected}
          onSelect={(id) => onResponse(screen.responseKey!, id)}
        />
        <Button className="mt-10" disabled={!selected} onClick={onContinue}>
          {cta}
        </Button>
      </div>
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
        onFinish={onComplete}
        finishLabel={
          reviewMode ? copy.journeyUi.closeStep : copy.journeyUi.finishStep
        }
      />
    )
  }

  if (screen.type === 'content') {
    return (
      <ContentBlock title={screen.title} paragraphs={screen.paragraphs ?? []}>
        <Button className="mt-10" onClick={onContinue}>
          {cta}
        </Button>
      </ContentBlock>
    )
  }

  if (screen.type === 'concepts') {
    return (
      <div>
        {screen.title ? <Title>{screen.title}</Title> : null}
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {(screen.options ?? []).map((option, index) => (
            <li
              key={option.id}
              className="rounded-lg border border-line bg-paper px-4 py-4"
            >
              <p className="text-[12px] font-medium tracking-[0.12em] text-clay uppercase">
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
        <Button className="mt-10" onClick={onContinue}>
          {cta}
        </Button>
      </div>
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
      <SynthesisBlock
        title={synthesis.title}
        paragraphs={synthesis.paragraphs}
        bullets={synthesis.bullets}
        tags={synthesis.tags}
        cta={cta}
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

function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.4rem]">
      {children}
    </h1>
  )
}

function ContentBlock({
  title,
  paragraphs,
  children,
}: {
  title?: string
  paragraphs: string[]
  children?: ReactNode
}) {
  return (
    <div>
      {title ? <Title>{title}</Title> : null}
      <div className={cn('space-y-4 text-[17px] leading-relaxed text-ink-muted', title ? 'mt-6' : '')}>
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {children}
    </div>
  )
}

function SynthesisBlock({
  title,
  paragraphs,
  bullets,
  tags,
  cta,
  onContinue,
}: {
  title?: string
  paragraphs: string[]
  bullets?: string[]
  tags?: string[]
  cta: string
  onContinue: () => void
}) {
  const copy = useCopy()

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <JunoAvatar size="md" />
        <p className="text-[15px] font-medium text-ink">{copy.brand.name}</p>
      </div>
      {title ? <Title>{title}</Title> : null}
      <div className={cn('space-y-4 text-[17px] leading-relaxed text-ink', title ? 'mt-6' : 'mt-2')}>
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {bullets && bullets.length > 0 ? (
        <ul className="mt-5 space-y-2 text-[17px] text-ink">
          {bullets.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-clay">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {tags && tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line-strong bg-paper px-3 py-1.5 text-[13px] text-ink-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <Button className="mt-10" onClick={onContinue}>
        {cta}
      </Button>
    </div>
  )
}

function Pill({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'min-h-11 cursor-pointer rounded-full border px-4 py-2.5 text-left text-[15px] transition-colors',
        selected
          ? 'border-ink bg-ink text-cream'
          : 'border-line-strong bg-paper text-ink hover:border-ink/40',
      )}
    >
      {label}
    </button>
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

  return (
    <div>
      <Title>{question}</Title>
      {multi ? (
        <p className="mt-3 text-[15px] text-ink-soft">
          {copy.journeyUi.severalAnswers}
        </p>
      ) : null}
      <div className={cn('mt-7 flex flex-wrap gap-2.5', !multi && 'flex-col')}>
        {options.map((option) => (
          <Pill
            key={option.id}
            label={option.label}
            selected={selected.includes(option.id)}
            onSelect={() => onToggle(option.id)}
          />
        ))}
      </div>
      <Button className="mt-10" disabled={disabled} onClick={onContinue}>
        {cta}
      </Button>
    </div>
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
    <div>
      <ul className="space-y-4">
        {types.map((type) => (
          <li
            key={type.id}
            className="rounded-lg border border-line bg-paper px-5 py-5"
          >
            <p className="text-[12px] font-medium tracking-[0.12em] text-clay uppercase">
              {type.title}
            </p>
            <p className="mt-2 text-[16px] text-ink-muted">{type.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill
                label={copy.journeyUi.speaksToMe}
                selected={feedback[type.id] === 'yes'}
                onSelect={() => setFeedback(type.id, 'yes')}
              />
              <Pill
                label={copy.journeyUi.notReally}
                selected={feedback[type.id] === 'no'}
                onSelect={() => setFeedback(type.id, 'no')}
              />
            </div>
          </li>
        ))}
      </ul>
      <Button className="mt-10" disabled={!allAnswered} onClick={onContinue}>
        {cta}
      </Button>
    </div>
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
      <ContentBlock
        title={copy.journeyUi.nextStepConfirm}
        paragraphs={[actionLabel]}
      >
        <Button
          className="mt-6 min-h-11 px-5 text-[15px]"
          onClick={() => {
            onAddToWeek(pickedResource)
            onPick(pickedResource)
            onContinue()
          }}
        >
          {copy.journeyUi.addToWeek}
        </Button>
        <button
          type="button"
          className="mt-4 cursor-pointer text-[14px] text-ink-muted underline underline-offset-4 hover:text-ink"
          onClick={() => {
            onPick(pickedResource)
            onContinue()
          }}
        >
          {copy.journeyUi.continueWithoutAdding}
        </button>
      </ContentBlock>
    )
  }

  if (pickMode && resources.length === 0) {
    return (
      <ContentBlock
        title={copy.journeyUi.pickWhichFirst}
        paragraphs={[
          copy.journeyUi.noInterestYet,
          copy.journeyUi.goBackToSelect,
        ]}
      >
        <Button className="mt-10" variant="secondary" onClick={onContinue}>
          {cta}
        </Button>
      </ContentBlock>
    )
  }

  return (
    <div>
      {title ? <Title>{title}</Title> : null}
      {intro ? <p className="mt-3 text-[16px] text-ink-muted">{intro}</p> : null}

      <ul className="mt-8 space-y-4">
        {resources.map((resource) => {
          const interested = feedback.interestedIds.includes(resource.id)
          const later = feedback.laterIds.includes(resource.id)
          return (
            <li
              key={resource.id}
              className="rounded-lg border border-line bg-paper px-5 py-5"
            >
              <p className="text-[12px] font-medium tracking-[0.12em] text-clay uppercase">
                {resource.categoryLabel}
              </p>
              <h2 className="mt-2 text-[1.2rem] font-medium text-ink">
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
                  className="mt-4 cursor-pointer text-[15px] font-medium text-clay hover:text-clay-deep"
                  onClick={() => setPickedResource(resource)}
                >
                  {copy.journeyUi.chooseThisOne}
                </button>
              ) : pendingAddId === resource.id ? (
                <div className="mt-4 rounded-md border border-line bg-cream px-4 py-4">
                  <p className="text-[15px] text-ink">
                    {copy.journeyUi.nextStepConfirm}
                  </p>
                  <Button
                    className="mt-4 min-h-11 px-5 text-[15px]"
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    {reasons.map((reason) => (
                      <Pill
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
                      className="cursor-pointer font-medium text-clay hover:text-clay-deep"
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

      {!pickMode ? (
        <Button className="mt-10" onClick={onContinue}>
          {cta}
        </Button>
      ) : null}
    </div>
  )
}