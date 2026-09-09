import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from '../components/Container'
import { MentorMatchCard } from '../components/mentor/MentorMatchCard'
import { useApp } from '../context/useApp'
import { useCopy } from '../i18n'

export function MentorMatchPage() {
  const navigate = useNavigate()
  const copy = useCopy()
  const {
    getMentorMatches,
    selectMentor,
    setMentorShortlistIds,
    completeOnboarding,
  } = useApp()

  const matches = useMemo(() => getMentorMatches(3), [getMentorMatches])

  useEffect(() => {
    completeOnboarding()
    if (matches.length > 0) {
      setMentorShortlistIds(matches.map((m) => m.mentor.id))
    }
  }, [completeOnboarding, matches, setMentorShortlistIds])

  function handleSelect(mentorId: string) {
    selectMentor(
      mentorId,
      matches.map((m) => m.mentor.id),
    )
    void navigate('/home')
  }

  return (
    <Container width="wide" className="py-4 sm:py-5 lg:py-6">
      <h1 className="max-w-[36rem] font-display text-[1.55rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[1.8rem]">
        {copy.mentors.matchTitle}
      </h1>
      <p className="mt-1.5 max-w-[34rem] text-[14.5px] leading-snug text-ink-muted sm:text-[15px]">
        {copy.mentors.matchLead}
      </p>

      <div className="mt-4 grid gap-3.5 lg:mt-5 lg:grid-cols-3 lg:gap-4">
        {matches.map((match, index) => (
          <MentorMatchCard
            key={match.mentor.id}
            match={match}
            featured={index === 0}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </Container>
  )
}
