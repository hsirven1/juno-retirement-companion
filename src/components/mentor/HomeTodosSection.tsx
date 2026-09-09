import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { getMentorById } from '../../data/mentors'
import { useCopy } from '../../i18n'
import { cn } from '../../lib/cn'
import type { TodoItem, TodoStatus } from '../../types'

function sourceLabel(
  todo: TodoItem,
  copy: ReturnType<typeof useCopy>,
): string {
  if (todo.source === 'mentor') {
    const mentor = todo.relatedMentorId
      ? getMentorById(todo.relatedMentorId)
      : undefined
    return copy.home.todoSourceMentor(mentor?.firstName ?? 'mentor')
  }
  if (todo.source === 'juno') return copy.home.todoSourceJuno
  if (todo.source === 'resource') return copy.home.todoSourceResource
  if (todo.source === 'exercise') return copy.home.todoSourceExercise
  return copy.home.todoSourceUser
}

function TodoRow({
  todo,
  onStatus,
  showDivider,
}: {
  todo: TodoItem
  onStatus: (id: string, status: TodoStatus) => void
  showDivider?: boolean
}) {
  const copy = useCopy()
  const done = todo.status === 'done'
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <li
      className={cn(
        'relative py-3',
        showDivider && 'border-t border-line/90',
        done && 'opacity-65',
      )}
    >
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          aria-label={done ? copy.home.todosReopen : copy.home.todosDone}
          className={cn(
            'mt-0.5 flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] transition-colors',
            done
              ? 'border-clay bg-clay'
              : 'border-line-strong bg-transparent hover:border-clay',
          )}
          onClick={() => onStatus(todo.id, done ? 'todo' : 'done')}
        >
          {done ? (
            <span className="block size-1.5 rounded-full bg-on-coral" />
          ) : null}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-[14.5px] leading-snug text-ink sm:text-[15px]',
              done && 'line-through decoration-ink-soft',
            )}
          >
            {todo.title}
          </p>
          <p className="mt-0.5 text-[12px] text-ink-soft">
            {sourceLabel(todo, copy)}
          </p>
        </div>

        {todo.status !== 'done' ? (
          <div className="relative shrink-0">
            <button
              type="button"
              aria-label={copy.home.todoMoreActions}
              aria-expanded={menuOpen}
              className="flex size-7 cursor-pointer items-center justify-center rounded-full text-ink-soft hover:bg-cream-deep hover:text-ink"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MoreHorizontal className="size-4" strokeWidth={2} />
            </button>
            {menuOpen ? (
              <>
                <button
                  type="button"
                  aria-label={copy.home.close}
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute top-8 right-0 z-20 min-w-[8.5rem] rounded-[12px] border border-line bg-paper py-1 shadow-[var(--shadow-card)]">
                  {todo.status === 'todo' ? (
                    <button
                      type="button"
                      className="block w-full cursor-pointer px-3 py-2 text-left text-[13px] font-semibold text-ink hover:bg-cream-deep"
                      onClick={() => {
                        onStatus(todo.id, 'later')
                        setMenuOpen(false)
                      }}
                    >
                      {copy.home.todosLater}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="block w-full cursor-pointer px-3 py-2 text-left text-[13px] font-semibold text-ink hover:bg-cream-deep"
                      onClick={() => {
                        onStatus(todo.id, 'todo')
                        setMenuOpen(false)
                      }}
                    >
                      {copy.home.todosReopen}
                    </button>
                  )}
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            className="shrink-0 cursor-pointer px-1 text-[12px] font-semibold text-ink-soft hover:text-ink"
            onClick={() => onStatus(todo.id, 'todo')}
          >
            {copy.home.todosReopen}
          </button>
        )}
      </div>
    </li>
  )
}

export function HomeTodosSection({
  todos,
  onStatus,
  onAdd,
}: {
  todos: TodoItem[]
  onStatus: (id: string, status: TodoStatus) => void
  onAdd: (title: string) => void
}) {
  const copy = useCopy()
  const [draft, setDraft] = useState('')
  const [adding, setAdding] = useState(false)

  const active = todos.filter((t) => t.status === 'todo')
  const later = todos.filter((t) => t.status === 'later')
  const done = todos.filter((t) => t.status === 'done')

  function submitAdd() {
    const title = draft.trim()
    if (!title) return
    onAdd(title)
    setDraft('')
    setAdding(false)
  }

  return (
    <section className="rounded-[18px] border border-line bg-paper px-4 py-3.5 sm:px-4 sm:py-4">
      <h2 className="text-[11px] font-extrabold tracking-[0.11em] text-ink-label uppercase">
        {copy.home.todosTitle}
      </h2>

      {active.length === 0 && later.length === 0 && done.length === 0 ? (
        <p className="mt-3 text-[14px] text-ink-soft">{copy.home.todosEmpty}</p>
      ) : null}

      {active.length > 0 ? (
        <ul className="mt-1">
          {active.map((todo, index) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onStatus={onStatus}
              showDivider={index > 0}
            />
          ))}
        </ul>
      ) : null}

      {adding ? (
        <form
          className="mt-2 border-t border-line/90 pt-3"
          onSubmit={(event) => {
            event.preventDefault()
            submitAdd()
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.home.todosAddPlaceholder}
            className="min-h-10 w-full rounded-full border border-line bg-cream px-3.5 text-[14px] text-ink outline-none focus:border-line-strong focus:bg-paper"
            autoFocus
          />
          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-clay px-3.5 py-1.5 text-[13px] font-bold text-cream hover:bg-clay-deep"
            >
              {copy.home.todosAdd}
            </button>
            <button
              type="button"
              className="cursor-pointer px-2 text-[13px] font-semibold text-ink-muted"
              onClick={() => {
                setAdding(false)
                setDraft('')
              }}
            >
              {copy.home.close}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="mt-1 cursor-pointer py-1.5 text-[13.5px] font-bold text-clay-ink hover:text-clay-deep"
          onClick={() => setAdding(true)}
        >
          + {copy.home.todosAdd}
        </button>
      )}

      {later.length > 0 ? (
        <details className="mt-2 border-t border-line/90 pt-2">
          <summary className="cursor-pointer text-[12.5px] font-bold text-ink-muted">
            {copy.home.todosLaterSection} ({later.length})
          </summary>
          <ul>
            {later.map((todo, index) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onStatus={onStatus}
                showDivider={index > 0}
              />
            ))}
          </ul>
        </details>
      ) : null}

      {done.length > 0 ? (
        <details className="mt-1 border-t border-dashed border-line/90 pt-2">
          <summary className="cursor-pointer text-[12.5px] font-bold text-ink-soft">
            {copy.home.todosCompleted} ({done.length})
          </summary>
          <ul>
            {done.map((todo, index) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onStatus={onStatus}
                showDivider={index > 0}
              />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  )
}
