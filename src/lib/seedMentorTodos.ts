import type { Locale } from '../i18n/types'
import type { TodoItem } from '../types'
import { createTodoItem } from './todos'

function mentorSeedTitle(firstName: string, locale: Locale): string {
  return locale === 'en'
    ? `Ask ${firstName} how they started their first activity`
    : `Demander à ${firstName} comment s’est passée sa première activité`
}

/** Seed a few contextual prototype todos after mentor selection. */
export function buildSeedTodosForMentor(args: {
  mentorId: string
  mentorFirstName: string
  locale: Locale
}): TodoItem[] {
  const { mentorId, mentorFirstName, locale } = args
  const isEn = locale === 'en'

  return [
    createTodoItem({
      title: mentorSeedTitle(mentorFirstName, locale),
      source: 'mentor',
      relatedMentorId: mentorId,
    }),
    createTodoItem({
      title: isEn
        ? 'Look at a low-commitment cultural activity near you'
        : 'Regarder une activité culturelle à faible engagement près de chez vous',
      source: 'juno',
    }),
    createTodoItem({
      title: isEn
        ? 'Note one activity you might try alone the first time'
        : 'Noter une activité que vous pourriez essayer seul(e) la première fois',
      source: 'juno',
    }),
  ]
}

/**
 * Keep mentor-sourced prototype todos aligned with the currently selected mentor.
 * Avoids stale names like "Suggéré par Isabelle" after switching to Anne.
 */
export function alignMentorTodosToSelectedMentor(args: {
  todos: TodoItem[]
  mentorId: string
  mentorFirstName: string
  locale: Locale
}): TodoItem[] {
  const { todos, mentorId, mentorFirstName, locale } = args
  return todos.map((todo) => {
    if (todo.source !== 'mentor') return todo
    if (
      todo.relatedMentorId === mentorId &&
      todo.title.includes(mentorFirstName)
    ) {
      return todo
    }
    return {
      ...todo,
      relatedMentorId: mentorId,
      title: mentorSeedTitle(mentorFirstName, locale),
    }
  })
}
