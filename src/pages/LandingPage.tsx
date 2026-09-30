import { LandingHeader } from '../components/LandingHeader'
import { LandingProductPreview } from '../components/LandingProductPreview'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { useCopy } from '../i18n'

export function LandingPage() {
  const copy = useCopy()

  return (
    <div className="min-h-svh bg-cream">
      <LandingHeader />

      <main>
        <section className="pb-16 pt-6 sm:pb-24 sm:pt-12">
          <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div>
              <h1 className="max-w-[12ch] font-display text-[2.9rem] leading-[0.98] font-bold tracking-[-0.035em] text-ink sm:text-[4.1rem]">
                {copy.landing.headline}
              </h1>
              <p className="mt-5 max-w-[26rem] text-[19px] leading-snug text-ink-muted sm:text-[20px]">
                {copy.landing.supporting}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button to="/assessment" size="lg">
                  {copy.landing.cta}
                </Button>
                <p className="text-[15px] text-ink-soft">{copy.landing.ctaMicro}</p>
              </div>
            </div>
            <LandingProductPreview />
          </Container>
        </section>

        <section id="how-it-works" className="scroll-mt-8 border-t border-line py-14 sm:py-16">
          <Container>
            <h2 className="font-display text-[1.7rem] font-bold tracking-[-0.025em] text-ink sm:text-[2rem]">
              {copy.landing.howItWorksTitle}
            </h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {copy.landing.steps.map((step) => (
                <li
                  key={step.number}
                  className="flex items-start gap-4 rounded-[22px] bg-paper px-5 py-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-clay-tint font-display text-[18px] font-bold text-clay-ink">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-[18px] font-extrabold tracking-[-0.01em] text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-[15.5px] text-ink-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className="pb-20 pt-6 sm:pb-24">
          <Container className="flex flex-col items-center text-center">
            <h2 className="font-display text-[2rem] font-bold tracking-[-0.03em] text-ink sm:text-[2.5rem]">
              {copy.landing.finalHeadline}
            </h2>
            <Button to="/assessment" size="lg" className="mt-6">
              {copy.landing.cta}
            </Button>
          </Container>
        </section>
      </main>

      <footer className="border-t border-line py-8">
        <Container className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-display text-[1.15rem] font-bold text-ink">{copy.brand.name}</p>
          <p className="text-[15px] text-ink-soft">{copy.brand.tagline}</p>
        </Container>
      </footer>
    </div>
  )
}
