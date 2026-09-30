import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { Container } from '../components/Container'
import { LocalResourceRow, PillarSection } from '../components/dashboard/DashboardCards'
import { ResourceDetailDialog } from '../components/ResourceDetailDialog'
import { PILLAR_ORDER } from '../data/pillars'
import { useApp } from '../context/useApp'
import { isLilleArea } from '../lib/personalizationProfile'
import { useResourceHub } from '../lib/useResourceHub'
import { useCopy } from '../i18n'
import type { ResourceRecommendation } from '../types'

export function HomePage() {
  const { profile } = useApp()
  const copy = useCopy()
  const hub = useResourceHub({ localLimit: 3 })
  const [activeResource, setActiveResource] =
    useState<ResourceRecommendation | null>(null)

  const city = profile.situation.location.split(',')[0]!.trim()
  const inLille = isLilleArea(profile.situation.location)

  return (
    <Container width="wide" className="pt-5 pb-12 sm:pt-7 sm:pb-16">
      <header>
        <h1 className="font-display text-[2.2rem] leading-none font-bold tracking-[-0.035em] text-ink sm:text-[2.7rem]">
          {copy.home.greetingHub(profile.firstName, new Date().getHours())}
        </h1>
        <p className="mt-2 text-[16.5px] text-ink-muted sm:text-[17.5px]">
          {copy.home.welcomeBack}
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:mt-7 lg:grid-cols-2 lg:gap-5">
        {PILLAR_ORDER.map((id) => (
          <PillarSection
            key={id}
            id={id}
            items={hub.home.pillars[id]}
            onOpen={setActiveResource}
          />
        ))}
      </div>

      {hub.home.local.length > 0 ? (
        <section aria-labelledby="home-local-title" className="mt-12 sm:mt-14">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2
                id="home-local-title"
                className="font-display text-[1.45rem] leading-tight font-bold tracking-[-0.02em] text-ink sm:text-[1.7rem]"
              >
                {copy.home.nearYouTitle}
              </h2>
              {inLille && city ? (
                <p className="mt-1 flex items-center gap-1.5 text-[14.5px] font-semibold text-ink-soft">
                  <MapPin size={15} strokeWidth={2} aria-hidden="true" />
                  {city}
                </p>
              ) : null}
            </div>
            <Link
              to="/discover?local=1"
              className="group inline-flex shrink-0 items-center gap-1 text-[15px] font-bold text-clay-ink hover:text-clay-deep"
            >
              {copy.home.seeAll}
              <ArrowRight
                size={16}
                strokeWidth={2.2}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
          {!inLille && city ? (
            <p className="-mt-1 mb-4 text-[15px] text-ink-muted">
              {copy.home.nearYouOtherCity(city)}
            </p>
          ) : null}
          <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {hub.home.local.map((item) => (
              <li key={item.id}>
                <LocalResourceRow item={item} onOpen={setActiveResource} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {activeResource ? (
        <ResourceDetailDialog
          resource={activeResource}
          onClose={() => setActiveResource(null)}
        />
      ) : null}
    </Container>
  )
}
