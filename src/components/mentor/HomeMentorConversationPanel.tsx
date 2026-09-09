import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Send, UserRound } from 'lucide-react'
import { Button } from '../Button'
import { MentorAvatar } from './MentorAvatar'
import { useCopy, useLocale } from '../../i18n'
import { cn } from '../../lib/cn'

type ChatLine = {
  id: string
  from: 'mentor' | 'you'
  text: string
}

const demoReplies = {
  fr: [
    'Oui, c’est souvent comme ça au début. On peut en parler tranquillement.',
    'Si vous voulez, on peut regarder ensemble une activité près de chez vous — sans pression.',
  ],
  en: [
    'Yes, that is often how it feels at first. We can talk it through calmly.',
    'If you like, we can look at one activity near you together — no pressure.',
  ],
} as const

/** Inline mentor conversation on Home — prototype only, no modal, no backend. */
export function HomeMentorConversationPanel({
  mentorId,
  firstName,
  age,
  city,
  formerCareer,
  previewMessage,
  onSchedule,
  nextCall,
  onModifyCall,
  className,
}: {
  mentorId: string
  firstName: string
  age: number
  city: string
  formerCareer: string
  previewMessage: string
  onSchedule: () => void
  nextCall?: { day: string; time: string } | null
  onModifyCall?: () => void
  className?: string
}) {
  const copy = useCopy()
  const { locale } = useLocale()
  const listRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState('')
  const [replyIndex, setReplyIndex] = useState(0)
  const [lines, setLines] = useState<ChatLine[]>([
    { id: 'm1', from: 'mentor', text: previewMessage },
  ])

  useEffect(() => {
    setLines([{ id: 'm1', from: 'mentor', text: previewMessage }])
    setDraft('')
    setReplyIndex(0)
  }, [mentorId, previewMessage])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [lines])

  function send() {
    const text = draft.trim()
    if (!text) return

    const next: ChatLine[] = [
      ...lines,
      { id: `u-${Date.now()}`, from: 'you', text },
    ]
    const replies = demoReplies[locale]
    const reply = replies[Math.min(replyIndex, replies.length - 1)]
    if (reply) {
      next.push({
        id: `m-${Date.now()}`,
        from: 'mentor',
        text: reply,
      })
      setReplyIndex((n) => Math.min(n + 1, replies.length - 1))
    }
    setLines(next)
    setDraft('')
  }

  return (
    <section
      className={cn(
        'flex flex-col rounded-[22px] border border-line/80 bg-paper p-5 shadow-[var(--shadow-card-hover)] ring-1 ring-clay/10 sm:p-6',
        className,
      )}
    >
      <p className="text-[11px] font-extrabold tracking-[0.1em] text-ink-label uppercase">
        {copy.mentors.yourMentor}
      </p>

      <div className="mt-2.5 flex items-start gap-3">
        <MentorAvatar id={mentorId} firstName={firstName} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[1.2rem] font-extrabold tracking-[-0.02em] text-ink">
                {firstName}, {age}
              </h2>
              <p className="mt-0.5 text-[14px] leading-snug text-ink-muted">
                {formerCareer} · {city}
              </p>
            </div>
            <Link
              to={`/mentors/${mentorId}`}
              className="inline-flex shrink-0 items-center gap-1.5 pt-0.5 text-[13px] font-semibold text-ink-muted transition-colors hover:text-ink"
            >
              <UserRound className="size-[15px]" strokeWidth={2} aria-hidden />
              {copy.mentors.viewProfile}
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={listRef}
        className="mt-4 h-[220px] space-y-2.5 overflow-y-auto rounded-[18px] border border-line/90 bg-cream-deep/45 px-3.5 py-3.5 sm:h-[280px] lg:h-[340px]"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={cn(
              'max-w-[92%] rounded-[14px] border px-3 py-2 text-[14px] leading-snug sm:text-[14.5px]',
              line.from === 'mentor'
                ? 'rounded-bl-md border-line/90 bg-paper text-ink'
                : 'ml-auto rounded-br-md border-line/70 bg-clay-tint text-clay-ink',
            )}
          >
            {line.from === 'mentor' ? (
              <p className="mb-1 text-[11px] font-bold text-ink-soft">
                {firstName}
              </p>
            ) : null}
            <p>{line.text}</p>
          </div>
        ))}
      </div>

      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={copy.mentors.chatPlaceholder(firstName)}
          className="min-h-11 min-w-0 flex-1 rounded-full border border-line bg-cream px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-line-strong focus:bg-paper"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label={copy.mentors.chatSend}
          className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-clay text-cream transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Send className="size-[17px]" strokeWidth={2.1} aria-hidden />
        </button>
      </form>

      {nextCall ? (
        <div className="mt-3 rounded-[14px] border border-line/80 bg-cream-deep/40 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <Calendar className="size-[14px] text-clay-ink" strokeWidth={2} aria-hidden />
            <p className="text-[10.5px] font-extrabold tracking-[0.1em] text-ink-label uppercase">
              {copy.home.nextCallLabel}
            </p>
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-[14px] font-bold capitalize text-ink">
              {nextCall.day}
            </p>
            <p className="text-[14px] text-ink-muted">{nextCall.time}</p>
            {onModifyCall ? (
              <button
                type="button"
                onClick={onModifyCall}
                className="cursor-pointer text-[13px] font-bold text-clay-ink hover:text-clay-deep"
              >
                {copy.home.bookingModify}
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="pt-4">
          <Button
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 px-5 text-[15px] font-bold sm:w-auto"
            onClick={onSchedule}
          >
            <Calendar className="size-[17px]" strokeWidth={2} aria-hidden />
            {copy.home.scheduleCall}
          </Button>
        </div>
      )}
    </section>
  )
}
