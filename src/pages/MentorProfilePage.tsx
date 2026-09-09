import type { ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Container } from '../components/Container'
import { Button } from '../components/Button'
import { MentorAvatar } from '../components/mentor/MentorAvatar'
import { getMentorById } from '../data/mentors'
import { useApp } from '../context/useApp'
import { getMentorCopy, mentorYearsLabel } from '../lib/mentorCopy'
import { useCopy, useLocale } from '../i18n'

export function MentorProfilePage() {
  const { mentorId = '' } = useParams()
  const navigate = useNavigate()
  const copy = useCopy()
  const { locale } = useLocale()
  const { selectMentor, getMentorMatches, mentorShortlistIds } = useApp()

  const mentor = getMentorById(mentorId)
  if (!mentor) {
    return (
      <Container width="reading" className="py-16">
        <p className="text-[18px] text-ink-muted">{copy.mentors.notFound}</p>
        <div className="mt-6">
          <Button to="/mentors/match">{copy.mentors.backToMatches}</Button>
        </div>
      </Container>
    )
  }

  const mentorCopy = getMentorCopy(mentor, locale)
  const match = getMentorMatches(10).find((m) => m.mentor.id === mentor.id)
  const reasons = match?.matchReasons ?? []

  function choose() {
    selectMentor(
      mentor!.id,
      mentorShortlistIds.length > 0
        ? mentorShortlistIds
        : getMentorMatches(3).map((m) => m.mentor.id),
    )
    void navigate('/home')
  }

  return (
    <Container width="reading" className="py-10 sm:py-14">
      <p className="mb-6">
        <Link
          to="/mentors/match"
          className="text-[14px] font-bold text-ink-muted underline underline-offset-4 hover:text-ink"
        >
          ← {copy.mentors.backToMatches}
        </Link>
      </p>

      <div className="flex items-start gap-5">
        <MentorAvatar id={mentor.id} firstName={mentor.firstName} size={88} />
        <div className="min-w-0">
          <h1 className="font-display text-[2.2rem] font-medium tracking-[-0.02em] text-ink sm:text-[2.6rem]">
            {mentor.firstName}, {mentor.age}
          </h1>
          <p className="mt-1 text-[17px] text-ink-muted">{mentor.city}</p>
          <p className="mt-3 text-[17px] text-ink">{mentorCopy.formerCareer}</p>
          <p className="text-[15px] text-ink-soft">
            {mentorYearsLabel(mentor.yearsRetired, locale)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Button className="min-h-11 px-6 text-[16px] font-bold" onClick={choose}>
          {copy.mentors.choose(mentor.firstName)}
        </Button>
      </div>
      <p className="mt-3 text-[13px] text-ink-soft">{copy.mentors.demoNote}</p>

      <blockquote className="mt-10 border-l-[3px] border-clay/40 pl-5 font-display text-[1.25rem] leading-snug text-ink">
        « {mentorCopy.quote} »
      </blockquote>

      <ProfileBlock title={copy.mentors.myJourney}>
        <p>{mentorCopy.retirementStory}</p>
        <p className="mt-3 text-ink-muted">{mentorCopy.shortBio}</p>
      </ProfileBlock>

      <ProfileBlock title={copy.mentors.whatHelped}>
        <ChipList items={mentorCopy.challengeLabels} />
      </ProfileBlock>

      <ProfileBlock title={copy.mentors.weCouldTalk}>
        <ChipList items={mentorCopy.helpTopicLabels} />
      </ProfileBlock>

      <ProfileBlock title={copy.mentors.myInterests}>
        <ChipList items={mentorCopy.interestLabels} />
      </ProfileBlock>

      {reasons.length > 0 ? (
        <ProfileBlock title={copy.mentors.whyPropose}>
          <ul className="space-y-2">
            {reasons.map((reason) => (
              <li key={reason.id}>{reason.text}</li>
            ))}
          </ul>
        </ProfileBlock>
      ) : null}

      <div className="mt-12 border-t border-line pt-8">
        <Button className="min-h-11 px-6 text-[16px] font-bold" onClick={choose}>
          {copy.mentors.choose(mentor.firstName)}
        </Button>
      </div>
    </Container>
  )
}

function ProfileBlock({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2 className="text-[12px] font-extrabold tracking-[0.11em] text-ink-label uppercase">
        {title}
      </h2>
      <div className="mt-4 text-[17px] leading-relaxed text-ink">{children}</div>
    </section>
  )
}

function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-line bg-cream px-3.5 py-1.5 text-[14px] text-ink-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
