import { useEffect, useState } from 'react'
import { PILLARS, PILLAR_ORDER } from '../data/pillars'
import { useCopy, useLocale } from '../i18n'
import { PillarGlyph } from './pillars/PillarGlyph'

const STEP_MS = 900

/**
 * Short transition between the last Bilan answer and the result page:
 * the four pillars draw themselves in while a caption cycles.
 */
export function BilanPreparing({ onDone }: { onDone: () => void }) {
  const copy = useCopy()
  const { locale } = useLocale()
  const steps = copy.assessment.preparingSteps
  const [step, setStep] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const done = window.setTimeout(onDone, 1200)
      return () => window.clearTimeout(done)
    }
    const timers = steps.map((_, index) =>
      window.setTimeout(() => setStep(index), index * STEP_MS),
    )
    timers.push(window.setTimeout(onDone, steps.length * STEP_MS + 250))
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [onDone, steps])

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
      aria-live="polite"
      aria-busy="true"
    >
      <ul className="grid grid-cols-2 gap-3 sm:gap-4" aria-hidden="true">
        {PILLAR_ORDER.map((id, index) => {
          const pillar = PILLARS[id]
          return (
            <li
              key={id}
              className="tile-rise glyph-draw flex size-[104px] flex-col items-center justify-center gap-2 rounded-[26px] sm:size-[128px]"
              style={{
                backgroundColor: `var(${pillar.theme.tintVar})`,
                color: `var(${pillar.theme.solidVar})`,
                ['--d' as string]: `${index * 260}ms`,
              }}
            >
              <PillarGlyph id={id} size={46} strokeWidth={2.3} />
              <span
                className="px-2 text-[12px] leading-tight font-extrabold"
                style={{ color: `var(${pillar.theme.inkVar})` }}
              >
                {pillar.title[locale]}
              </span>
            </li>
          )
        })}
      </ul>

      <p className="mt-10 font-display text-[1.75rem] leading-tight font-semibold tracking-[-0.02em] text-ink sm:text-[2.1rem]">
        {copy.assessment.generatingTitle}
      </p>
      <p className="mt-3 h-8 overflow-hidden text-[18px] font-semibold text-ink-muted">
        <span key={step} className="caption-swap inline-block">
          {steps[step]}
        </span>
      </p>
    </div>
  )
}
