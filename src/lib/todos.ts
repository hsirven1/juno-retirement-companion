import type { TodoItem, TodoSource, TodoStatus } from '../types'

export function createTodoItem(args: {
  title: string
  source: TodoSource
  status?: TodoStatus
  relatedMentorId?: string
  relatedResourceId?: string
  relatedExerciseStepId?: string
  dueDate?: string
}): TodoItem {
  return {
    id: `todo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: args.title,
    status: args.status ?? 'todo',
    source: args.source,
    relatedMentorId: args.relatedMentorId,
    relatedResourceId: args.relatedResourceId,
    relatedExerciseStepId: args.relatedExerciseStepId,
    dueDate: args.dueDate,
    createdAt: new Date().toISOString(),
  }
}
