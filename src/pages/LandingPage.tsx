import { LandingHeader } from '../components/LandingHeader'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { WeekPreview } from '../components/WeekPreview'
import { lifeAreas } from '../data/lifeAreas'
import { useCopy } from '../i18n'

export function LandingPage() {
  const copy = useCopy()

  return (
    <div className="min-h-svh bg-cream">
      <LandingHeader />

      <main>
      <section className="pb-20 pt-8 sm:pb-28 sm:pt-14">
        <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="text-[12px] font-medium tracking-[0.22em] text-clay uppercase">
              {copy.landing.eyebrow}
            </p>
            <h1 className="mt-5 font-display text-[2.55rem] font-medium leading-[1.12] tracking-[-0.02em] text-ink sm:text-[3.35rem]">
              {copy.landing.headline}
            </h1>
            <p className="mt-6 max-w-[36rem] text-[19px] leading-relaxed text-ink-muted">
              {copy.landing.supporting}
            </p>
            <div className="mt-9">
              <Button to="/assessment">{copy.landing.cta}</Button>
              <p className="mt-4 text-[15px] text-ink-soft">
                {copy.landing.reassurance}
              </p>
            </div>
          </div>
          <WeekPreview />
        </Container>
      </section>

      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <h2 className="max-w-[22ch] font-display text-[2.15rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
            {copy.landing.dimensionsTitle}
          </h2>
          <p className="mt-5 max-w-[38rem] text-[18px] text-ink-muted">
            {copy.landing.dimensionsSupporting}
          </p>
          <ul className="mt-14 divide-y divide-line border-y border-line">
            {lifeAreas.map((area) => (
              <li
                key={area.id}
                className="grid gap-2 py-8 sm:grid-cols-[16rem_1fr] sm:gap-10 sm:py-9"
              >
                <p className="font-display text-[1.45rem] text-ink">{area.name}</p>
                <p className="max-w-[36rem] text-[18px] text-ink-muted">
                  {area.landingDescription}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-8 py-20 sm:py-28">
        <Container>
          <h2 className="font-display text-[2.15rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.6rem]">
            {copy.landing.howItWorksTitle}
          </h2>
          <p className="mt-5 max-w-[38rem] text-[18px] text-ink-muted">
            {copy.landing.howItWorksSupporting}
          </p>
          <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {copy.landing.steps.map((step) => (
              <li key={step.number}>
                <p className="font-display text-[1.2rem] text-clay">{step.number}</p>
                <h3 className="mt-3 font-display text-[1.55rem] leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-[17px] text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="about" className="scroll-mt-8 border-t border-line py-20 sm:py-28">
        <Container width="reading">
          <p className="text-[12px] font-medium tracking-[0.22em] text-ink-soft uppercase">
            {copy.landing.aboutEyebrow}
          </p>
          <h2 className="mt-4 font-display text-[2.15rem] font-medium leading-tight tracking-[-0.02em] text-ink">
            {copy.landing.aboutTitle}
          </h2>
          <p className="mt-6 text-[18px] text-ink-muted">
            {copy.landing.aboutBody}
          </p>
        </Container>
      </section>

      <section className="border-t border-line py-20 sm:py-24">
        <Container className="text-center">
          <h2 className="font-display text-[2.15rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
            {copy.landing.finalHeadline}
          </h2>
          <div className="mt-8 flex justify-center">
            <Button to="/assessment">{copy.landing.cta}</Button>
          </div>
        </Container>
      </section>
      </main>

      <footer className="border-t border-line py-8">
        <Container className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-display text-[1.15rem] text-ink">{copy.brand.name}</p>
          <p className="text-[15px] text-ink-soft">{copy.brand.tagline}</p>
        </Container>
      </footer>
    </div>
  )
}
