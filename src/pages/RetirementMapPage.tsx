import { useNavigate } from 'react-router-dom'
import { OnboardingHeader } from '../components/OnboardingHeader'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { StatusMeter } from '../components/JourneyPath'
import { profile } from '../data/profile'
import { getMapContent } from '../data/insights'
import { useApp } from '../context/useApp'
import { useCopy } from '../i18n'
import { cn } from '../lib/cn'
import type { LifeAreaStatus } from '../types'

const statusTone: Record<LifeAreaStatus, string> = {
  'needs-attention': 'text-clay',
  'worth-exploring': 'text-ink-muted',
  'going-well': 'text-sage',
  'feeling-confident': 'text-sage',
  'a-priority': 'text-clay',
}

const statusBar: Record<LifeAreaStatus, string> = {
  'needs-attention': 'bg-clay/70',
  'worth-exploring': 'bg-ink/25',
  'going-well': 'bg-sage',
  'feeling-confident': 'bg-sage',
  'a-priority': 'bg-clay',
}

export function RetirementMapPage() {
  const { onboardingComplete, completeOnboarding, answers } = useApp()
  const navigate = useNavigate()
  const copy = useCopy()
  const { summary, themes, areas } = getMapContent(answers)
  const paragraphs = summary.split('\n\n')

  function startWithJuno() {
    completeOnboarding()
    void navigate('/home')
  }

  return (
    <div className={onboardingComplete ? '' : 'min-h-svh bg-cream'}>
      {onboardingComplete ? null : <OnboardingHeader />}
      <div className="py-12 sm:py-16">
        <Container width="reading">
          <p className="text-[12px] font-medium tracking-[0.18em] text-ink-soft uppercase">
            {copy.map.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-[2.15rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
            {copy.map.opening(profile.firstName)}
          </h1>
          <figure className="mt-8 border-l-[3px] border-clay bg-paper px-6 py-7 sm:px-8 sm:py-8">
            <figcaption className="text-[12px] font-medium tracking-[0.16em] text-clay uppercase">
              {copy.map.insightLabel}
            </figcaption>
            <div className="mt-4 space-y-5 font-display text-[1.2rem] leading-relaxed text-ink sm:text-[1.28rem]">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </figure>
        </Container>

        <Container width="reading" className="mt-16 sm:mt-20">
          <h2 className="font-display text-[1.9rem] font-medium tracking-[-0.02em] text-ink">
            {copy.map.title}
          </h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {areas.map((area) => (
              <li key={area.id} className="relative py-7 pl-5 sm:pl-6">
                <span
                  className={cn(
                    'absolute top-7 bottom-7 left-0 w-[3px] rounded-full',
                    statusBar[area.status],
                  )}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                  <h3 className="font-display text-[1.45rem] text-ink">
                    {area.name}
                  </h3>
                  <span className="flex items-center gap-3">
                    <StatusMeter status={area.status} />
                    <p
                      className={cn(
                        'text-[15px] tracking-[0.02em]',
                        statusTone[area.status],
                      )}
                    >
                      {area.statusLabel}
                    </p>
                  </span>
                </div>
                <p className="mt-3 max-w-[38rem] text-[17px] text-ink-muted">
                  {area.insight}
                </p>
              </li>
            ))}
          </ul>
        </Container>

        <Container width="reading" className="mt-16 pb-8 sm:mt-20">
          <h2 className="font-display text-[1.9rem] font-medium tracking-[-0.02em] text-ink">
            {copy.map.themesTitle}
          </h2>
          <p className="mt-3 max-w-[36rem] text-[17px] text-ink-muted">
            {copy.map.bridge}
          </p>
          <ul className="mt-8 space-y-7">
            {themes.map((theme) => (
              <li key={theme.id}>
                <h3 className="font-display text-[1.35rem] text-ink">
                  {theme.title}
                </h3>
                <p className="mt-2 text-[17px] text-ink-muted">
                  {theme.shortReason}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-[34rem] text-[17px] text-ink">
            {copy.map.themesLead}
          </p>
          <div className="mt-8">
            <Button onClick={startWithJuno}>{copy.map.cta}</Button>
          </div>
        </Container>
      </div>
    </div>
  )
}
