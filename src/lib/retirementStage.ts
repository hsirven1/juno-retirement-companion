import type {
  AssessmentAnswers,
  AssessmentQuestion,
  LocalizedText,
  RetirementStage,
} from '../types'
import { assessmentQuestions } from '../data/assessment'
import type { Locale } from '../i18n/types'

export function localizeText(
  text: LocalizedText | undefined,
  locale: Locale,
): string | undefined {
  if (!text) return undefined
  return locale === 'en' ? text.en : text.fr
}

export function getVisibleQuestions(
  answers: AssessmentAnswers,
): AssessmentQuestion[] {
  return assessmentQuestions.filter(
    (question) => !question.showIf || question.showIf(answers),
  )
}

export function getRetirementStage(
  answers: AssessmentAnswers,
): RetirementStage {
  const stage = answers.retirementStage ?? answers.journey
  if (typeof stage !== 'string' || stage.length === 0) return 'unknown'

  // New stable ids
  if (stage === 'still_working' || stage === 'retiring_soon') return 'pre'
  if (stage === 'recently_retired' || stage === 'retired_years') return 'retired'

  // Legacy FR labels from Phase 1–2 bilan
  if (stage.startsWith('À la retraite') || /retired/i.test(stage)) {
    return 'retired'
  }
  return 'pre'
}

export function questionPrompt(
  question: AssessmentQuestion,
  stage: RetirementStage,
  locale: Locale,
): string {
  if (stage !== 'unknown' && question.stagePrompts) {
    return localizeText(question.stagePrompts[stage], locale) ?? ''
  }
  return localizeText(question.prompt, locale) ?? ''
}

export function questionHelper(
  question: AssessmentQuestion,
  stage: RetirementStage,
  locale: Locale,
): string | undefined {
  if (stage !== 'unknown' && question.stageHelpers) {
    return localizeText(question.stageHelpers[stage], locale)
  }
  return localizeText(question.helper, locale)
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

export function asString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
}

export function formatWeekRange(date = new Date()): string {
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + mondayOffset)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ]

  const start = monday.getDate()
  const end = sunday.getDate()
  const startMonth = months[monday.getMonth()]
  const endMonth = months[sunday.getMonth()]

  if (monday.getMonth() === sunday.getMonth()) {
    return `Semaine du ${start} au ${end} ${endMonth}`
  }
  return `Semaine du ${start} ${startMonth} au ${end} ${endMonth}`
}
