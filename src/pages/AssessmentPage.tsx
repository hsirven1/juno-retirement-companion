import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingHeader } from '../components/OnboardingHeader'
import { OptionButton, OptionChip } from '../components/OptionButton'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import {
  assessmentQuestions,
  OTHER_INTEREST_ID,
  OTHER_INTEREST_TEXT_KEY,
} from '../data/assessment'
import { useApp } from '../context/useApp'
import { useCopy, useLocale } from '../i18n'
import { cn } from '../lib/cn'
import {
  getRetirementStage,
  getVisibleQuestions,
  localizeText,
  questionHelper,
  questionPrompt,
} from '../lib/retirementStage'
import type { AssessmentQuestion } from '../types'

export function AssessmentPage() {
  const navigate = useNavigate()
  const { answers, setAnswer } = useApp()
  const copy = useCopy()
  const { locale } = useLocale()
  const generatingMessages = copy.assessment.generatingMessages
  const [index, setIndex] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [generatingIndex, setGeneratingIndex] = useState(0)

  const visible = useMemo(() => getVisibleQuestions(answers), [answers])
  const total = visible.length
  const safeIndex = Math.min(index, Math.max(0, total - 1))
  const question = visible[safeIndex] ?? assessmentQuestions[0]
  const isLast = safeIndex === total - 1
  const value = answers[question.id]
  const stage = getRetirementStage(answers)
  const prompt = questionPrompt(question, stage, locale)
  const helper = questionHelper(question, stage, locale)
  const otherOptionId = question.otherOptionId ?? OTHER_INTEREST_ID

  useEffect(() => {
    if (index > total - 1 && total > 0) {
      setIndex(total - 1)
    }
  }, [index, total])

  useEffect(() => {
    if (!generating) return

    const cycle = window.setInterval(() => {
      setGeneratingIndex((current) => (current + 1) % generatingMessages.length)
    }, 850)

    const finish = window.setTimeout(() => {
      void navigate('/retirement-map')
    }, 2600)

    return () => {
      window.clearInterval(cycle)
      window.clearTimeout(finish)
    }
  }, [generating, generatingMessages.length, navigate])

  function goNext() {
    if (isLast) {
      setGenerating(true)
      return
    }
    setIndex((current) => current + 1)
  }

  function selectSingle(optionId: string) {
    setAnswer(question.id, optionId)
  }

  function toggleMultiple(optionId: string) {
    const current = Array.isArray(value) ? value : []
    if (question.exclusiveOption && optionId === question.exclusiveOption) {
      setAnswer(question.id, current.includes(optionId) ? [] : [optionId])
      return
    }
    const withoutExclusive = question.exclusiveOption
      ? current.filter((item) => item !== question.exclusiveOption)
      : current
    const next = withoutExclusive.includes(optionId)
      ? withoutExclusive.filter((item) => item !== optionId)
      : [...withoutExclusive, optionId]
    setAnswer(question.id, next)
  }

  const canContinue = canProceed(question, value, answers[OTHER_INTEREST_TEXT_KEY])

  if (generating) {
    return (
      <div className="flex min-h-svh flex-col bg-cream">
        <OnboardingHeader />
        <div
          className="flex flex-1 flex-col items-center justify-center px-6 text-center"
          aria-live="polite"
          aria-busy="true"
        >
          <p className="font-display text-[2rem] text-ink sm:text-[2.35rem]">
            {copy.assessment.generatingTitle}
          </p>
          <p className="generating-copy mt-5 min-h-8 text-[18px] text-ink-muted">
            {generatingMessages[generatingIndex]}
          </p>
          <span className="mt-10 block h-px w-16 bg-clay/70" aria-hidden="true" />
        </div>
      </div>
    )
  }

  const selectedList = Array.isArray(value) ? value : []
  const showOtherInput =
    Boolean(question.allowOther) && selectedList.includes(otherOptionId)
  const options = question.options ?? []
  const useChips = question.layout === 'chips'

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <OnboardingHeader
        stepLabel={copy.assessment.questionProgress(safeIndex + 1, total)}
        progress={(safeIndex + 1) / Math.max(total, 1)}
      />
      <main className="flex flex-1 flex-col py-12 sm:py-16">
        <Container width="narrow" className="flex flex-1 flex-col">
          <div key={question.id} className="question-enter">
            <h1 className="font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.35rem]">
              {prompt}
            </h1>
            {helper ? (
              <p className="mt-4 text-[17px] text-ink-muted">{helper}</p>
            ) : question.type === 'multiple' ? (
              <p className="mt-4 text-[17px] text-ink-muted">
                {copy.assessment.chooseSeveral}
              </p>
            ) : null}

            <div className="mt-9">
              {question.type === 'single' && question.layout === 'list' ? (
                <div className="flex flex-col gap-2.5">
                  {options.map((option) => {
                    const label = localizeText(option.label, locale) ?? option.id
                    return (
                      <OptionButton
                        key={option.id}
                        label={label}
                        selected={value === option.id}
                        onSelect={() => selectSingle(option.id)}
                      />
                    )
                  })}
                </div>
              ) : null}

              {(question.type === 'multiple' ||
                (question.type === 'single' &&
                  (question.layout === 'grid' || question.layout === 'chips'))) &&
              options.length > 0 ? (
                <div
                  className={
                    useChips
                      ? 'flex flex-wrap gap-2'
                      : 'grid grid-cols-1 gap-2.5 sm:grid-cols-2'
                  }
                >
                  {options.map((option) => {
                    const label = localizeText(option.label, locale) ?? option.id
                    return (
                      <OptionChip
                        key={option.id}
                        label={label}
                        selected={
                          question.type === 'single'
                            ? value === option.id
                            : selectedList.includes(option.id)
                        }
                        onSelect={() =>
                          question.type === 'single'
                            ? selectSingle(option.id)
                            : toggleMultiple(option.id)
                        }
                      />
                    )
                  })}
                  {question.allowOther ? (
                    <OptionChip
                      label={
                        localizeText(question.otherLabel, locale) ??
                        copy.assessment.otherLabel
                      }
                      selected={selectedList.includes(otherOptionId)}
                      onSelect={() => toggleMultiple(otherOptionId)}
                    />
                  ) : null}
                </div>
              ) : null}

              {question.type === 'scale' ? (
                <ScaleQuestion
                  start={localizeText(question.scaleStart, locale) ?? ''}
                  end={localizeText(question.scaleEnd, locale) ?? ''}
                  value={typeof value === 'number' ? value : null}
                  onSelect={(next) => setAnswer(question.id, next)}
                />
              ) : null}

              {showOtherInput ? (
                <input
                  type="text"
                  value={
                    typeof answers[OTHER_INTEREST_TEXT_KEY] === 'string'
                      ? answers[OTHER_INTEREST_TEXT_KEY]
                      : ''
                  }
                  onChange={(event) =>
                    setAnswer(OTHER_INTEREST_TEXT_KEY, event.target.value)
                  }
                  className="mt-4 w-full rounded-md border border-line-strong bg-paper px-4 py-3.5 text-[18px] text-ink placeholder:text-ink-soft"
                  placeholder={copy.assessment.otherPlaceholder}
                />
              ) : null}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            {safeIndex > 0 ? (
              <button
                type="button"
                className="min-h-12 cursor-pointer text-[16px] text-ink-muted transition-colors hover:text-ink"
                onClick={() => setIndex((current) => Math.max(0, current - 1))}
              >
                {copy.assessment.back}
              </button>
            ) : (
              <span />
            )}

            <Button onClick={goNext} disabled={!canContinue}>
              {isLast ? copy.assessment.submit : copy.assessment.continue}
            </Button>
          </div>
        </Container>
      </main>
    </div>
  )
}

function canProceed(
  question: AssessmentQuestion,
  value: unknown,
  otherValue: unknown,
) {
  const otherId = question.otherOptionId ?? OTHER_INTEREST_ID
  if (question.type === 'multiple') {
    if (!Array.isArray(value) || value.length === 0) return false
    if (question.allowOther && value.includes(otherId) && value.length === 1) {
      return typeof otherValue === 'string' && otherValue.trim().length > 0
    }
    return true
  }
  if (question.type === 'scale') {
    return typeof value === 'number'
  }
  if (question.type === 'text') {
    return typeof value === 'string' && value.trim().length > 0
  }
  return typeof value === 'string' && value.length > 0
}

function ScaleQuestion({
  start,
  end,
  value,
  onSelect,
}: {
  start: string
  end: string
  value: number | null
  onSelect: (value: number) => void
}) {
  const copy = useCopy()

  return (
    <div>
      <div className="mb-5 flex justify-between gap-6">
        <span className="max-w-[10rem] text-[17px] font-medium leading-snug text-ink">
          {start}
        </span>
        <span className="max-w-[10rem] text-right text-[17px] font-medium leading-snug text-ink">
          {end}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5].map((point) => (
          <button
            key={point}
            type="button"
            onClick={() => onSelect(point)}
            aria-pressed={value === point}
            aria-label={copy.assessment.scaleAria(point)}
            className={cn(
              'min-h-16 cursor-pointer rounded-md border text-[20px] font-medium transition-colors',
              value === point
                ? 'border-ink bg-ink text-cream'
                : 'border-line-strong bg-paper text-ink hover:border-ink/50 hover:bg-cream-deep',
            )}
          >
            {point}
          </button>
        ))}
      </div>
    </div>
  )
}
