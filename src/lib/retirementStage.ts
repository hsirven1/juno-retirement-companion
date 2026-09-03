import type { AssessmentAnswers, AssessmentQuestion, RetirementStage } from '../types'

export function getRetirementStage(
  answers: AssessmentAnswers,
): RetirementStage {
  const journey = answers.journey
  if (typeof journey !== 'string' || journey.length === 0) return 'unknown'
  return journey.startsWith('À la retraite') ? 'retired' : 'pre'
}

export function questionPrompt(
  question: AssessmentQuestion,
  stage: RetirementStage,
): string {
  if (stage !== 'unknown' && question.stagePrompts) {
    return question.stagePrompts[stage]
  }
  return question.prompt
}

export function questionHelper(
  question: AssessmentQuestion,
  stage: RetirementStage,
): string | undefined {
  if (stage !== 'unknown' && question.stageHelpers) {
    return question.stageHelpers[stage]
  }
  return question.helper
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
