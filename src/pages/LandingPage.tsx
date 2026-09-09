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
        <section className="pb-14 pt-6 sm:pb-20 sm:pt-12">
          <Container className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-14">
            <div>
              <h1 className="font-display text-[2.4rem] font-medium leading-[1.12] tracking-[-0.02em] text-ink sm:text-[3.15rem]">
                {copy.landing.headline}
              </h1>
              <p className="mt-5 max-w-[32rem] text-[18px] leading-relaxed text-ink-muted">
                {copy.landing.supporting}
              </p>
              <div className="mt-8">
                <Button to="/assessment">{copy.landing.cta}</Button>
                <p className="mt-4 max-w-[26rem] text-[14px] text-ink-soft">
                  {copy.landing.ctaMicro}
                </p>
              </div>
            </div>
            <LandingProductPreview />
          </Container>
        </section>

        <section className="border-t border-line py-14 sm:py-16">
          <Container>
            <h2 className="font-display text-[1.9rem] font-medium tracking-[-0.02em] text-ink sm:text-[2.2rem]">
              {copy.landing.valueTitle}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {copy.landing.valuePoints.map((point) => (
                <li
                  key={point}
                  className="rounded-[18px] border border-line bg-paper px-5 py-5 text-[16px] font-bold leading-snug text-ink"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <section id="how-it-works" className="scroll-mt-8 py-14 sm:py-16">
          <Container>
            <h2 className="font-display text-[1.9rem] font-medium tracking-[-0.02em] text-ink sm:text-[2.2rem]">
              {copy.landing.howItWorksTitle}
            </h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-8">
              {copy.landing.steps.map((step) => (
                <li key={step.number}>
                  <p className="font-display text-[1.15rem] text-clay">
                    {step.number}
                  </p>
                  <h3 className="mt-2 text-[1.2rem] font-extrabold tracking-[-0.01em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[16px] text-ink-muted">{step.body}</p>
                </li>
              ))}
            </ol>
            <p
              id="about"
              className="mt-12 max-w-[40rem] scroll-mt-8 text-[16px] leading-relaxed text-ink-muted"
            >
              {copy.landing.duoLine}
            </p>
          </Container>
        </section>

        <section className="border-t border-line py-16 sm:py-20">
          <Container className="text-center">
            <h2 className="font-display text-[2rem] font-medium tracking-[-0.02em] text-ink sm:text-[2.35rem]">
              {copy.landing.finalHeadline}
            </h2>
            <div className="mt-7 flex justify-center">
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
