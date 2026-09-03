import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { OptionButton } from '../components/OptionButton'
import { useApp } from '../context/useApp'
import {
  getLocalizedGuidedPath,
  getLocalizedPhaseLabel,
  useCopy,
  useLocale,
} from '../i18n'
import { cn } from '../lib/cn'
import type { AnswerValue, GuidedStep } from '../types'

export function GuidedPathGeneric() {
  const { pathId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { pathProgress, startPath, completeGuidedStep, openChat, resources } =
    useApp()
  const copy = useCopy()
  const { locale } = useLocale()

  const path = useMemo(
    () => getLocalizedGuidedPath(pathId, locale),
    [pathId, locale],
  )
  const progress = pathProgress[pathId]

  const requestedStepId = searchParams.get('step')
  const currentStepId =
    requestedStepId ?? progress?.currentStepId ?? path?.steps[0]?.id ?? null

  const stepIndex =
    path?.steps.findIndex((step) => step.id === currentStepId) ?? 0
  const step = path?.steps[stepIndex]

  useEffect(() => {
    if (path) startPath(path.id)
  }, [path, startPath])

  if (!path || !step) {
    return (
      <Container width="reading" className="py-16">
        <p className="text-ink-muted">{copy.journeyUi.pathNotFound}</p>
        <Button to="/plan" className="mt-6">
          {copy.journeyUi.backToPlan}
        </Button>
      </Container>
    )
  }

  const total = path.steps.length
  const number = stepIndex + 1

  function goNext(response?: AnswerValue) {
    completeGuidedStep(path!.id, step!.id, response)
    const next = path!.steps[stepIndex + 1]
    if (!next) {
      void navigate('/plan')
      return
    }
    if (step!.type === 'resourceDiscovery') {
      void navigate(
        step!.discoverFilter
          ? `/discover?filter=${step!.discoverFilter}`
          : '/discover',
      )
      return
    }
    void navigate(`/guide/${path!.id}?step=${next.id}`)
  }

  return (
    <div className="min-h-[calc(100svh-5rem)] bg-cream">
      <Container width="reading" className="py-6 sm:py-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => void navigate(-1)}
            className="inline-flex cursor-pointer items-center gap-2 text-[14px] text-ink-muted hover:text-ink"
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            {copy.journeyUi.back}
          </button>
          <p className="text-[13px] text-ink-soft">
            {copy.guide.progress(number, total)}
          </p>
        </div>

        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          {path.steps.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                'h-1 flex-1 rounded-full',
                index < stepIndex
                  ? 'bg-sage'
                  : index === stepIndex
                    ? 'bg-clay'
                    : 'bg-line-strong',
              )}
            />
          ))}
        </div>

        <p className="mt-8 text-[12px] font-medium tracking-[0.14em] text-ink-soft uppercase">
          {path.title}
        </p>
        <p className="mt-2 text-[13px] text-clay">
          {getLocalizedPhaseLabel(step.phase, locale)}
        </p>

        <GuidedStepView
          step={step}
          resources={resources.filter((item) =>
            step.resourceIds?.includes(item.id),
          )}
          onContinue={goNext}
          onAskJuno={() =>
            openChat({
              relatedPathId: path.id,
              relatedStepId: step.id,
              initialContext: path.themeId,
              greeting: copy.guide.chatGreeting(path.title, step.title),
            })
          }
        />
      </Container>
    </div>
  )
}

function GuidedStepView({
  step,
  resources,
  onContinue,
  onAskJuno,
}: {
  step: GuidedStep
  resources: Array<{
    id: string
    title: string
    metadata: string
    homeSnippet: string
  }>
  onContinue: (response?: AnswerValue) => void
  onAskJuno: () => void
}) {
  const copy = useCopy()
  const [single, setSingle] = useState<string | null>(null)
  const [multi, setMulti] = useState<string[]>([])

  const paragraphs = useMemo(
    () => step.content.split('\n\n').filter(Boolean),
    [step.content],
  )

  const canContinue =
    step.type === 'singleChoice'
      ? Boolean(single)
      : step.type === 'multiChoice'
        ? multi.length > 0
        : true

  function toggleMulti(id: string) {
    setMulti((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  return (
    <div className="mt-6 pb-16">
      <h1 className="font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.35rem]">
        {step.title}
      </h1>

      <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink-muted">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <p className="mt-4 text-[13px] text-ink-soft">
        {copy.guide.minutes(step.estimatedMinutes)}
      </p>

      {step.type === 'singleChoice' && step.options ? (
        <ul className="mt-8 space-y-3">
          {step.options.map((option) => (
            <li key={option.id}>
              <OptionButton
                label={option.label}
                selected={single === option.id}
                onSelect={() => setSingle(option.id)}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {step.type === 'multiChoice' && step.options ? (
        <ul className="mt-8 space-y-3">
          {step.options.map((option) => (
            <li key={option.id}>
              <OptionButton
                label={option.label}
                selected={multi.includes(option.id)}
                onSelect={() => toggleMulti(option.id)}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {step.type === 'resourceDiscovery' ? (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {resources.map((item) => (
            <li key={item.id} className="py-4">
              <p className="text-[17px] text-ink">{item.title}</p>
              <p className="mt-1 text-[14px] text-ink-soft">{item.metadata}</p>
              <p className="mt-2 text-[15px] text-ink-muted">{item.homeSnippet}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button
          disabled={!canContinue}
          onClick={() => {
            if (step.type === 'singleChoice' && single) onContinue(single)
            else if (step.type === 'multiChoice') onContinue(multi)
            else onContinue()
          }}
        >
          {step.ctaLabel ?? copy.guide.continue}
        </Button>
        <button
          type="button"
          onClick={onAskJuno}
          className="cursor-pointer text-[15px] text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
        >
          {copy.guide.askJuno}
        </button>
      </div>

      {step.type === 'resourceDiscovery' ? (
        <p className="mt-6 text-[14px] text-ink-soft">
          <Link to="/discover" className="text-clay hover:text-clay-deep">
            {copy.journeyUi.seeAllResources}
          </Link>
        </p>
      ) : null}
    </div>
  )
}
