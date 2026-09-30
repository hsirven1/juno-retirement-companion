import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { OnboardingHeader } from '../components/OnboardingHeader'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { PillarInsightTile } from '../components/pillars/PillarCard'
import { buildBilanSummary, buildPillarInsights } from '../data/insights'
import { computePillarPriority } from '../lib/pillarRecommendations'
import { usePersonalizationProfile } from '../lib/useResourceHub'
import { useApp } from '../context/useApp'
import { useCopy, useLocale } from '../i18n'

export function RetirementMapPage() {
  const { onboardingComplete, completeOnboarding, answers, profile } = useApp()
  const navigate = useNavigate()
  const copy = useCopy()
  const { locale } = useLocale()

  const personalization = usePersonalizationProfile()
  const priority = useMemo(
    () => computePillarPriority(personalization),
    [personalization],
  )
  const hasAnswers = Object.keys(answers).length > 0
  const summary = hasAnswers
    ? buildBilanSummary(personalization, priority, locale)
    : copy.map.profileSummaryFallback
  const insights = buildPillarInsights(personalization, locale)

  function openSpace() {
    completeOnboarding()
    void navigate('/home')
  }

  return (
    <div className={onboardingComplete ? '' : 'min-h-svh bg-cream'}>
      {onboardingComplete ? null : <OnboardingHeader />}

      <Container width="wide" className="py-8 sm:py-12">
        <header className="max-w-[46rem]">
          <p className="text-[12.5px] font-extrabold tracking-[0.14em] text-clay-ink uppercase">
            {copy.map.eyebrow}
          </p>
          <h1 className="mt-2 font-display text-[2.2rem] leading-[1.02] font-bold tracking-[-0.03em] text-ink sm:text-[3rem]">
            {copy.map.opening(profile.firstName)}
          </h1>
          <p className="mt-4 text-[19px] leading-snug text-ink-muted sm:text-[21px]">
            {summary}
          </p>
        </header>

        <section className="mt-10 sm:mt-12" aria-labelledby="bilan-pillars-title">
          <h2
            id="bilan-pillars-title"
            className="font-display text-[1.45rem] font-bold tracking-[-0.02em] text-ink sm:text-[1.7rem]"
          >
            {copy.map.prioritiesLabel}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {priority.order.map((id, index) => (
              <PillarInsightTile
                key={id}
                id={id}
                insight={insights[id]}
                highlighted={priority.highlighted.includes(id)}
                className="tile-rise"
                style={{ ['--d' as string]: `${index * 90}ms` }}
              />
            ))}
          </ul>
        </section>

        <section className="mt-10 flex flex-col items-start gap-5 rounded-[28px] bg-paper px-6 py-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
          <div>
            <h2 className="font-display text-[1.45rem] leading-tight font-bold tracking-[-0.02em] text-ink sm:text-[1.65rem]">
              {copy.map.readyTitle}
            </h2>
            <p className="mt-1 text-[16px] text-ink-muted">{copy.map.readyLead}</p>
          </div>
          <Button
            onClick={openSpace}
            size="lg"
            className="w-full shrink-0 gap-2 sm:w-auto"
          >
            {copy.map.hubCta}
            <ArrowRight size={19} strokeWidth={2.2} aria-hidden="true" />
          </Button>
        </section>
      </Container>
    </div>
  )
}
