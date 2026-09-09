import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { MentorAvatar } from './MentorAvatar'
import { useCopy, useLocale } from '../../i18n'
import { getMentorCopy } from '../../lib/mentorCopy'
import { buildMentorHomePreview } from '../../lib/mentorHomePreview'
import { cn } from '../../lib/cn'
import type { Mentor, MentorMatchingProfile } from '../../types'

type ChatLine = {
  id: string
  from: 'mentor' | 'you'
  text: string
}

function buildOpeningMessages(
  mentor: Mentor,
  userFirstName: string,
  locale: 'fr' | 'en',
  matching?: MentorMatchingProfile | null,
): ChatLine[] {
  const copy = getMentorCopy(mentor, locale)
  const preview = buildMentorHomePreview(
    mentor,
    userFirstName,
    locale,
    matching,
  )

  return [
    {
      id: 'm1',
      from: 'mentor',
      text: preview,
    },
    {
      id: 'm2',
      from: 'mentor',
      text:
        locale === 'en'
          ? `For me, starting small helped. ${copy.quote}`
          : `Pour moi, commencer petit a aidé. ${copy.quote}`,
    },
  ]
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

/** Prototype mentor conversation — not Juno AI, not a real messaging backend. */
export function MentorChatOverlay({
  mentor,
  userFirstName,
  open,
  onClose,
  initialDraft = '',
  matching,
}: {
  mentor: Mentor
  userFirstName: string
  open: boolean
  onClose: () => void
  initialDraft?: string
  matching?: MentorMatchingProfile | null
}) {
  const copy = useCopy()
  const { locale } = useLocale()
  const titleId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState(initialDraft)
  const [replyIndex, setReplyIndex] = useState(0)

  const opening = useMemo(
    () => buildOpeningMessages(mentor, userFirstName, locale, matching),
    [mentor, userFirstName, locale, matching],
  )
  const [lines, setLines] = useState<ChatLine[]>(opening)

  useEffect(() => {
    if (!open) return
    setLines(buildOpeningMessages(mentor, userFirstName, locale, matching))
    setDraft(initialDraft)
    setReplyIndex(0)
  }, [open, mentor, userFirstName, locale, matching, initialDraft])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [lines, open])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

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
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-ink/35"
        aria-label={copy.mentors.chatClose}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-[440px] flex-col rounded-t-[24px] border border-line bg-paper shadow-[var(--shadow-card)] sm:rounded-[24px]"
      >
        <header className="flex items-center gap-3 border-b border-line px-5 py-4">
          <MentorAvatar
            id={mentor.id}
            firstName={mentor.firstName}
            size={44}
          />
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-[17px] font-extrabold text-ink">
              {mentor.firstName}
            </h2>
            <p className="text-[12px] text-ink-soft">
              {copy.mentors.chatPrototypeNote}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full px-3 py-2 text-[14px] font-bold text-ink-muted hover:bg-cream-deep hover:text-ink"
          >
            {copy.mentors.chatClose}
          </button>
        </header>

        <div
          ref={listRef}
          className="flex-1 space-y-3 overflow-y-auto px-5 py-5"
        >
          {lines.map((line) => (
            <div
              key={line.id}
              className={cn(
                'max-w-[88%] rounded-[18px] px-4 py-3 text-[15px] leading-relaxed',
                line.from === 'mentor'
                  ? 'rounded-bl-md bg-[#F3EBE2] text-ink'
                  : 'ml-auto rounded-br-md bg-clay-tint text-clay-ink',
              )}
            >
              {line.text}
            </div>
          ))}
          <p className="pt-1 text-center text-[12px] text-ink-soft">
            {copy.mentors.chatEmptyHint}
          </p>
        </div>

        <form
          className="flex gap-2 border-t border-line p-4"
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
        >
          <label className="sr-only" htmlFor="mentor-chat-input">
            {copy.mentors.chatPlaceholder(mentor.firstName)}
          </label>
          <input
            id="mentor-chat-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.mentors.chatPlaceholder(mentor.firstName)}
            className="min-h-11 flex-1 rounded-full border border-line bg-cream px-4 text-[15px] text-ink outline-none focus:border-line-strong"
          />
          <button
            type="submit"
            className="min-h-11 cursor-pointer rounded-full bg-ink px-4 text-[14px] font-bold text-cream disabled:opacity-40"
            disabled={!draft.trim()}
          >
            {copy.mentors.chatSend}
          </button>
        </form>
      </div>
    </div>
  )
}
