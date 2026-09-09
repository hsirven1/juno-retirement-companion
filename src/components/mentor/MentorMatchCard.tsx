import { Link } from 'react-router-dom'
import { Button } from '../Button'
import { MentorAvatar } from './MentorAvatar'
import { getMentorCopy, mentorYearsLabel } from '../../lib/mentorCopy'
import { useCopy, useLocale } from '../../i18n'
import { cn } from '../../lib/cn'
import type { MentorMatchResult } from '../../types'

export function MentorMatchCard({
  match,
  featured = false,
  onSelect,
}: {
  match: MentorMatchResult
  featured?: boolean
  onSelect: (mentorId: string) => void
}) {
  const copy = useCopy()
  const { locale } = useLocale()
  const { mentor, matchReasons } = match
  const mentorCopy = getMentorCopy(mentor, locale)

  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-[18px] border bg-paper p-4 sm:p-5',
        featured ? 'border-clay/35 shadow-[var(--shadow-card)]' : 'border-line',
      )}
    >
      <div className="min-h-[1rem]">
        {featured ? (
          <p className="text-[10.5px] font-extrabold tracking-[0.1em] text-clay uppercase">
            {copy.mentors.bestMatch}
          </p>
        ) : null}
      </div>

      <div className="mt-1.5 flex items-start gap-3">
        <MentorAvatar id={mentor.id} firstName={mentor.firstName} size={52} />
        <div className="min-w-0">
          <h2 className="text-[1.15rem] font-extrabold tracking-[-0.02em] text-ink">
            {mentor.firstName}, {mentor.age}
          </h2>
          <p className="text-[13.5px] leading-snug text-ink-muted">
            {mentor.city}
          </p>
          <p className="mt-1 text-[13.5px] leading-snug text-ink">
            {mentorCopy.formerCareer}
          </p>
          <p className="text-[12.5px] text-ink-soft">
            {mentorYearsLabel(mentor.yearsRetired, locale)}
          </p>
        </div>
      </div>

      <blockquote className="mt-3 line-clamp-2 border-l-[3px] border-clay/35 pl-3 font-display text-[0.98rem] leading-snug text-ink">
        « {mentorCopy.quote} »
      </blockquote>

      {matchReasons.length > 0 ? (
        <div className="mt-3">
          <p className="text-[10.5px] font-extrabold tracking-[0.1em] text-ink-label uppercase">
            {copy.mentors.commonGround}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {matchReasons.slice(0, 3).map((reason) => (
              <li
                key={reason.id}
                className="rounded-full border border-line bg-cream-deep px-2.5 py-1 text-[12.5px] font-semibold leading-none text-ink"
              >
                {reason.shortLabel}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-3 min-h-[3.25rem]" aria-hidden="true" />
      )}

      <div className="mt-auto flex flex-col gap-2 pt-4">
        <Button
          className="min-h-10 w-full px-4 text-[15px] font-bold"
          onClick={() => onSelect(mentor.id)}
        >
          {copy.mentors.choose(mentor.firstName)}
        </Button>
        <Button
          to={`/mentors/${mentor.id}`}
          variant="secondary"
          className="min-h-10 w-full px-4 text-[15px] font-bold"
        >
          {copy.mentors.viewProfile}
        </Button>
      </div>
    </article>
  )
}

export function MentorEmptyHomeCard() {
  const copy = useCopy()
  return (
    <section className="rounded-[22px] border border-line bg-paper p-6 shadow-[var(--shadow-card)] sm:p-7">
      <p className="text-[12px] font-extrabold tracking-[0.11em] text-ink-label uppercase">
        {copy.mentors.yourMentor}
      </p>
      <h2 className="mt-3 font-display text-[1.55rem] font-medium tracking-[-0.02em] text-ink">
        {copy.mentors.findSomeoneTitle}
      </h2>
      <p className="mt-2 max-w-[34rem] text-[16px] text-ink-muted">
        {copy.mentors.findSomeoneBody}
      </p>
      <div className="mt-5">
        <Button to="/mentors/match" className="min-h-11 px-5 text-[16px] font-bold">
          {copy.mentors.seeMatches}
        </Button>
      </div>
    </section>
  )
}

export function HomeMentorCard({
  mentorId,
  firstName,
  age,
  city,
  formerCareer,
  onMessage,
  onSchedule,
  nextCall,
  onModifyCall,
}: {
  mentorId: string
  firstName: string
  age: number
  city: string
  formerCareer: string
  onMessage: () => void
  onSchedule: () => void
  nextCall?: { day: string; time: string } | null
  onModifyCall?: () => void
}) {
  const copy = useCopy()

  return (
    <section className="rounded-[22px] border border-line bg-paper p-5 shadow-[var(--shadow-card)]">
      <p className="text-[11px] font-extrabold tracking-[0.1em] text-ink-label uppercase">
        {copy.mentors.yourMentor}
      </p>
      <div className="mt-3 flex items-start gap-3">
        <MentorAvatar id={mentorId} firstName={firstName} size={48} />
        <div className="min-w-0">
          <h2 className="text-[1.15rem] font-extrabold tracking-[-0.02em] text-ink">
            {firstName}, {age}
          </h2>
          <p className="mt-0.5 text-[14px] leading-snug text-ink-muted">
            {formerCareer} · {city}
          </p>
        </div>
      </div>

      {nextCall ? (
        <div className="mt-4 rounded-[14px] bg-cream-deep px-3.5 py-3">
          <p className="text-[11px] font-extrabold tracking-[0.1em] text-ink-label uppercase">
            {copy.home.nextCallLabel}
          </p>
          <p className="mt-1.5 text-[15px] font-bold capitalize text-ink">
            {nextCall.day}
          </p>
          <p className="text-[15px] text-ink-muted">{nextCall.time}</p>
          {onModifyCall ? (
            <button
              type="button"
              onClick={onModifyCall}
              className="mt-2 cursor-pointer text-[13px] font-bold text-clay-ink hover:text-clay-deep"
            >
              {copy.home.bookingModify}
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-2">
        <Button
          className="min-h-11 w-full px-4 text-[15px] font-bold"
          onClick={onMessage}
        >
          {copy.mentors.talkTo(firstName)}
        </Button>
        {!nextCall ? (
          <Button
            variant="secondary"
            className="min-h-11 w-full px-4 text-[15px] font-bold"
            onClick={onSchedule}
          >
            {copy.home.scheduleCall}
          </Button>
        ) : null}
        <Link
          to={`/mentors/${mentorId}`}
          className="pt-1 text-center text-[13px] font-bold text-ink-muted underline underline-offset-4 hover:text-ink"
        >
          {copy.mentors.viewProfile}
        </Link>
      </div>
    </section>
  )
}
