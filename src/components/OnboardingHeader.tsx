import { Logo } from './Logo'
import { Container } from './Container'
import { useCopy } from '../i18n'

interface OnboardingHeaderProps {
  stepLabel?: string
  progress?: number
}

export function OnboardingHeader({ stepLabel, progress }: OnboardingHeaderProps) {
  const copy = useCopy()

  return (
    <header className="border-b border-line/80">
      <Container className="flex items-center justify-between gap-6 py-5" width="wide">
        <Logo />
        {stepLabel ? (
          <p className="text-[17px] font-medium tabular-nums tracking-[0.02em] text-ink">
            {stepLabel}
          </p>
        ) : null}
      </Container>
      {typeof progress === 'number' ? (
        <div
          className="h-2 w-full bg-cream-deep"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label={copy.assessment.progressLabel}
        >
          <div
            className="h-full bg-clay transition-[width] duration-500 ease-out"
            style={{ width: `${Math.max(progress, 0.08) * 100}%` }}
          />
        </div>
      ) : null}
    </header>
  )
}
