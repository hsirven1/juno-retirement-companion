import { Link } from 'react-router-dom'
import { MentorAvatar } from './MentorAvatar'
import { getMentorCopy } from '../../lib/mentorCopy'
import { useCopy, useLocale } from '../../i18n'
import type { MentorMatchResult } from '../../types'

/** Compact mentor card for Discover — human profile, not marketplace. */
export function DiscoverMentorCard({ match }: { match: MentorMatchResult }) {
  const copy = useCopy()
  const { locale } = useLocale()
  const { mentor, matchReasons } = match
  const mentorCopy = getMentorCopy(mentor, locale)
  const reason = matchReasons[0]?.shortLabel ?? matchReasons[0]?.text

  return (
    <Link
      to={`/mentors/${mentor.id}`}
      className="flex h-full flex-col rounded-[22px] border border-line bg-paper p-5 transition-colors hover:border-line-strong hover:bg-cream-deep/40"
    >
      <div className="flex items-start gap-3.5">
        <MentorAvatar id={mentor.id} firstName={mentor.firstName} size={56} />
        <div className="min-w-0">
          <h3 className="text-[1.15rem] font-extrabold tracking-[-0.02em] text-ink">
            {mentor.firstName}, {mentor.age}
          </h3>
          <p className="mt-0.5 text-[14px] text-ink-muted">
            {mentorCopy.formerCareer} · {mentor.city}
          </p>
        </div>
      </div>

      {reason ? (
        <p className="mt-4 flex-1 text-[15px] leading-snug text-ink-muted">
          {reason}
        </p>
      ) : (
        <p className="mt-4 flex-1 text-[15px] leading-snug text-ink-muted">
          « {mentorCopy.quote} »
        </p>
      )}

      <p className="mt-4 text-[14px] font-bold text-clay-ink">
        {copy.mentors.viewProfile} →
      </p>
    </Link>
  )
}
