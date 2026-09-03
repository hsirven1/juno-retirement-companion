import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ArrowUp, X } from 'lucide-react'
import { JunoAvatar } from './JunoAvatar'
import { Button } from './Button'
import { useApp } from '../context/useApp'
import {
  getContextualGreeting,
  getSuggestionPills,
  useCopy,
  useLocale,
} from '../i18n'
import { profile } from '../data/profile'
import { cn } from '../lib/cn'
import type { ChatMessage } from '../types'

export function JunoChatOverlay() {
  const {
    chatOpen,
    chatOptions,
    closeChat,
    messages,
    sendMessage,
    respondToSuggestion,
  } = useApp()
  const copy = useCopy()
  const { chatLocale } = useLocale()
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const autoSentRef = useRef<string | null>(null)

  const greeting = getContextualGreeting(
    {
      initialContext: chatOptions?.initialContext,
      relatedPriorityId: chatOptions?.relatedPriorityId,
      greeting: chatOptions?.greeting,
      firstName: profile.firstName,
    },
    chatLocale,
  )

  useEffect(() => {
    if (!chatOpen) {
      autoSentRef.current = null
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeChat()
    }
    window.addEventListener('keydown', onKeyDown)

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50)

    if (
      chatOptions?.initialPrompt &&
      autoSentRef.current !== chatOptions.initialPrompt
    ) {
      autoSentRef.current = chatOptions.initialPrompt
      sendMessage(chatOptions.initialPrompt)
    }

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(focusTimer)
    }
  }, [chatOpen, chatOptions, closeChat, sendMessage])

  useEffect(() => {
    if (!chatOpen) return
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, chatOpen])

  if (!chatOpen) return null

  function submit(text: string) {
    sendMessage(text)
    setDraft('')
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    submit(draft)
  }

  function handleActionNavigate() {
    closeChat()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-stretch justify-center md:items-center md:px-6 md:py-8">
      <button
        type="button"
        className="absolute inset-0 hidden bg-ink/35 backdrop-blur-[2px] md:block"
        aria-label={copy.coach.close}
        onClick={closeChat}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex h-full w-full flex-col bg-cream shadow-[0_24px_80px_-32px_rgba(36,31,26,0.55)] md:h-[min(860px,calc(100svh-4rem))] md:max-h-[calc(100svh-4rem)] md:w-[min(1040px,92vw)] md:rounded-xl md:border md:border-line"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <JunoAvatar size="md" />
            <div>
              <h2
                id={titleId}
                className="text-[1.05rem] font-medium tracking-[-0.01em] text-ink"
              >
                {copy.brand.name}
              </h2>
              <p className="mt-0.5 text-[13px] text-ink-soft">
                {copy.coach.panelSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeChat}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-paper hover:text-ink"
            aria-label={copy.coach.close}
          >
            <X size={22} strokeWidth={1.7} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <JunoAvatar size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-ink">
                    {copy.brand.name}
                  </p>
                  <div className="mt-2 max-w-[34rem] rounded-2xl rounded-tl-md bg-paper px-4 py-3">
                    <p className="text-[15px] leading-snug text-ink">{greeting}</p>
                  </div>
                </div>
              </div>

              <SuggestionPills onSelect={submit} />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onRespond={respondToSuggestion}
                  onNavigate={handleActionNavigate}
                />
              ))}
              <SuggestionPills onSelect={submit} compact />
              <div ref={endRef} />
            </div>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className="shrink-0 border-t border-line bg-cream px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6"
        >
          <label htmlFor="juno-chat-input" className="sr-only">
            {copy.coach.inputLabel}
          </label>
          <div className="flex min-h-12 items-end gap-2 rounded-full border border-line-strong bg-paper px-2 py-1.5 pl-4">
            <textarea
              ref={inputRef}
              id="juno-chat-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  submit(draft)
                }
              }}
              rows={1}
              placeholder={copy.coach.placeholder}
              className="max-h-28 min-h-[2.5rem] w-full resize-none bg-transparent py-2 text-[15px] text-ink placeholder:text-ink-soft focus:outline-none"
            />
            <button
              type="submit"
              className="mb-0.5 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-clay text-cream transition-colors hover:bg-clay-deep disabled:opacity-40"
              disabled={!draft.trim()}
              aria-label={copy.coach.send}
            >
              <ArrowUp size={16} strokeWidth={2.2} />
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}

function SuggestionPills({
  onSelect,
  compact = false,
}: {
  onSelect: (message: string) => void
  compact?: boolean
}) {
  const copy = useCopy()
  const { chatLocale } = useLocale()
  const pills = getSuggestionPills(chatLocale)

  return (
    <div className={cn(compact ? 'pt-1' : '')}>
      {!compact ? (
        <p className="mb-3 text-[12px] font-medium tracking-[0.12em] text-ink-soft uppercase">
          {copy.coach.suggestions}
        </p>
      ) : null}
      <ul className="flex flex-wrap gap-2">
        {pills.map((pill) => (
          <li key={pill.label}>
            <button
              type="button"
              onClick={() => onSelect(pill.message)}
              className="cursor-pointer rounded-full border border-line-strong bg-paper px-3.5 py-2 text-[13px] text-ink transition-colors hover:border-ink/40 hover:bg-cream"
            >
              {pill.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MessageBubble({
  message,
  onRespond,
  onNavigate,
}: {
  message: ChatMessage
  onRespond: (messageId: string, accept: boolean) => void
  onNavigate: () => void
}) {
  const copy = useCopy()
  const paragraphs = message.content.split('\n\n')
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <article className="flex justify-end">
        <div className="max-w-[min(34rem,85%)] rounded-2xl rounded-tr-md bg-ink px-4 py-3 text-[15px] leading-relaxed text-cream">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-2 first:mt-0">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    )
  }

  return (
    <article className="flex items-start gap-3">
      <JunoAvatar size="sm" />
      <div className="min-w-0 max-w-[min(38rem,90%)] flex-1">
        <p className="text-[13px] font-medium text-ink">{copy.brand.name}</p>
        <div className="mt-2 rounded-2xl rounded-tl-md bg-paper px-4 py-3 text-[15px] leading-relaxed text-ink">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-2 first:mt-0">
              {paragraph}
            </p>
          ))}
        </div>

        {message.action ? (
          <Link
            to={message.action.to}
            onClick={onNavigate}
            className="mt-3 inline-flex cursor-pointer text-[14px] font-medium text-clay transition-colors hover:text-clay-deep"
          >
            {message.action.label} →
          </Link>
        ) : null}

        {message.suggestion && message.suggestionStatus === 'pending' ? (
          <div className="mt-3 rounded-lg border border-line bg-paper px-4 py-4">
            <p className="text-[15px] font-medium text-ink">
              {message.suggestion.title}
            </p>
            <p className="mt-1 text-[14px] text-ink-muted">
              {message.suggestion.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                className="min-h-10 px-4 text-[14px]"
                onClick={() => onRespond(message.id, true)}
              >
                {copy.coach.addToPlan}
              </Button>
              <Button
                variant="ghost"
                className="min-h-10 px-4 text-[14px]"
                onClick={() => onRespond(message.id, false)}
              >
                {copy.coach.notNow}
              </Button>
            </div>
          </div>
        ) : null}

        {message.suggestionStatus === 'added' ? (
          <p className="mt-2 text-[14px] text-sage" aria-live="polite">
            {copy.coach.added}
          </p>
        ) : null}

        {message.suggestionStatus === 'dismissed' ? (
          <p className="mt-2 text-[14px] text-ink-muted" aria-live="polite">
            {copy.coach.dismissed}
          </p>
        ) : null}
      </div>
    </article>
  )
}
