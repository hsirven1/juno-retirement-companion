import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Compass,
  Footprints,
  HandHeart,
  HeartHandshake,
  Lightbulb,
  type LucideIcon,
  Sparkles,
  Sunrise,
  Users,
  Waves,
} from 'lucide-react'
import { OnboardingHeader } from '../components/OnboardingHeader'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { MentorAvatar } from '../components/mentor/MentorAvatar'
import {
  buildBilanPriorities,
  buildBilanSynthesis,
} from '../data/insights'
import { useApp } from '../context/useApp'
import { useCopy, useLocale } from '../i18n'
import { cn } from '../lib/cn'

const priorityVisual: Record<
  string,
  { Icon: LucideIcon; tint: string; ink: string }
> = {
  social: {
    Icon: Users,
    tint: 'bg-[var(--theme-social-tint)]',
    ink: 'text-[var(--theme-social-ink)]',
  },
  structure: {
    Icon: Sunrise,
    tint: 'bg-[var(--theme-rythme-tint)]',
    ink: 'text-[var(--theme-rythme-ink)]',
  },
  travel: {
    Icon: Compass,
    tint: 'bg-[var(--theme-learn-tint)]',
    ink: 'text-[var(--theme-learn-ink)]',
  },
  useful: {
    Icon: HandHeart,
    tint: 'bg-[var(--theme-contribute-tint)]',
    ink: 'text-[var(--theme-contribute-ink)]',
  },
  learn: {
    Icon: BookOpen,
    tint: 'bg-[var(--theme-learn-tint)]',
    ink: 'text-[var(--theme-learn-ink)]',
  },
  active: {
    Icon: Footprints,
    tint: 'bg-[var(--theme-active-tint)]',
    ink: 'text-[var(--theme-active-ink)]',
  },
  projects: {
    Icon: Lightbulb,
    tint: 'bg-[var(--theme-contribute-tint)]',
    ink: 'text-[var(--theme-contribute-ink)]',
  },
  alone: {
    Icon: HeartHandshake,
    tint: 'bg-[var(--theme-social-tint)]',
    ink: 'text-[var(--theme-social-ink)]',
  },
  pace: {
    Icon: Waves,
    tint: 'bg-[var(--theme-rythme-tint)]',
    ink: 'text-[var(--theme-rythme-ink)]',
  },
  explore: {
    Icon: Sparkles,
    tint: 'bg-[var(--theme-learn-tint)]',
    ink: 'text-[var(--theme-learn-ink)]',
  },
  support: {
    Icon: HeartHandshake,
    tint: 'bg-[var(--theme-contribute-tint)]',
    ink: 'text-[var(--theme-contribute-ink)]',
  },
}

const fallbackVisual = {
  Icon: Sparkles,
  tint: 'bg-cream-deep',
  ink: 'text-clay-ink',
}

export function RetirementMapPage() {
  const {
    onboardingComplete,
    completeOnboarding,
    answers,
    profile,
    getMentorMatches,
  } = useApp()
  const navigate = useNavigate()
  const copy = useCopy()
  const { locale } = useLocale()

  const synthesis = buildBilanSynthesis(answers, locale)
  const priorities = buildBilanPriorities(answers, locale)
  const mentorPreviews = getMentorMatches(3)
  const summaryText = synthesis || copy.map.profileSummaryFallback
  const [leadSentence, ...restSentences] = splitSentences(summaryText)

  function startMatching() {
    completeOnboarding()
    void navigate('/mentors/match')
  }

  return (
    <div className={onboardingComplete ? '' : 'min-h-svh bg-cream'}>
      {onboardingComplete ? null : <OnboardingHeader />}

      <div className="py-6 sm:py-8 lg:py-9">
        <Container width="wide">
          <p className="text-[12px] font-extrabold tracking-[0.14em] text-ink-label uppercase">
            {copy.map.eyebrow}
          </p>
          <h1 className="mt-1.5 max-w-[36rem] font-display text-[1.85rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.2rem]">
            {copy.map.opening(profile.firstName)}
          </h1>

          <div className="mt-6 grid items-start gap-5 lg:mt-7 lg:grid-cols-2 lg:gap-8">
            <figure className="relative overflow-hidden rounded-[4px] border border-line/80 bg-paper px-5 py-5 shadow-[0_1px_0_rgba(34,28,24,0.03)] sm:px-6 sm:py-6">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[3px] bg-clay"
              />
              <figcaption className="pl-1 text-[11px] font-extrabold tracking-[0.14em] text-clay uppercase">
                {copy.map.profileSummaryLabel}
              </figcaption>
              <blockquote className="mt-3 space-y-3 pl-1 font-display text-[1.12rem] leading-[1.55] text-ink sm:text-[1.2rem] sm:leading-[1.55]">
                <p>{leadSentence}</p>
                {restSentences.length > 0 ? (
                  <p className="text-[1.02rem] text-ink-muted sm:text-[1.08rem]">
                    {restSentences.join(' ')}
                  </p>
                ) : null}
              </blockquote>
            </figure>

            <section>
              <h2 className="text-[11px] font-extrabold tracking-[0.12em] text-ink-label uppercase">
                {copy.map.prioritiesLabel}
              </h2>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                {priorities.map((item) => {
                  const visual = priorityVisual[item.id] ?? fallbackVisual
                  const Icon = visual.Icon
                  return (
                    <li
                      key={item.id}
                      className="flex items-start gap-3 rounded-[14px] border border-line/90 bg-paper/80 px-3.5 py-3.5"
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full',
                          visual.tint,
                          visual.ink,
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="size-[17px]" strokeWidth={1.9} />
                      </span>
                      <span className="pt-1 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[16px]">
                        {item.label}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
          </div>

          <section className="mt-6 overflow-hidden rounded-[22px] border border-clay/15 bg-gradient-to-br from-clay-tint/55 via-paper to-paper px-5 py-5 shadow-[var(--shadow-card)] sm:mt-7 sm:px-7 sm:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
              <div className="min-w-0 flex-1">
                <h2 className="max-w-[34rem] font-display text-[1.4rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.6rem]">
                  {copy.map.mentorRevealTitle}
                </h2>
                <p className="mt-2 max-w-[32rem] text-[14.5px] leading-relaxed text-ink-muted sm:text-[15.5px]">
                  {copy.map.mentorRevealLead}
                </p>

                {mentorPreviews.length > 0 ? (
                  <ul className="mt-4 flex items-center">
                    {mentorPreviews.map((match, index) => (
                      <li
                        key={match.mentor.id}
                        className="relative flex items-center"
                        style={{ marginLeft: index === 0 ? 0 : -10 }}
                      >
                        <MentorAvatar
                          id={match.mentor.id}
                          firstName={match.mentor.firstName}
                          size={42}
                          className="ring-[2.5px] ring-paper"
                        />
                      </li>
                    ))}
                    <li className="ml-3 flex flex-wrap items-center gap-x-1.5 text-[14px] font-semibold text-ink">
                      {mentorPreviews.map((match, index) => (
                        <span key={match.mentor.id}>
                          {match.mentor.firstName}
                          {index < mentorPreviews.length - 1 ? (
                            <span className="text-ink-soft">,</span>
                          ) : null}
                        </span>
                      ))}
                    </li>
                  </ul>
                ) : null}
              </div>

              <div className="shrink-0 lg:w-[15.5rem]">
                <Button
                  className="min-h-12 w-full px-6 text-[16.5px] font-bold shadow-[0_10px_28px_-16px_rgba(185,58,38,0.55)]"
                  onClick={startMatching}
                >
                  {copy.map.cta}
                </Button>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </div>
  )
}

function splitSentences(text: string): string[] {
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
  return parts.length > 0 ? parts : [text]
}
