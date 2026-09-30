import { PILLARS } from '../data/pillars'
import { useCopy, useLocale } from '../i18n'
import { cn } from '../lib/cn'
import type { PillarId } from '../types'
import { PillarArt } from './pillars/PillarCard'
import { PillarGlyph } from './pillars/PillarGlyph'

function HeroTile({ id, className }: { id: PillarId; className?: string }) {
  const { locale } = useLocale()
  const pillar = PILLARS[id]
  return (
    <li
      className={cn('relative overflow-hidden rounded-[26px] p-4 sm:rounded-[30px] sm:p-6', className)}
      style={{ backgroundColor: `var(${pillar.theme.tintVar})` }}
    >
      <PillarArt id={id} size={190} strokeWidth={1.6} className="origin-bottom-right scale-[0.66] sm:scale-100" />
      <div className="relative">
        <p
          className="font-display text-[20px] leading-[1.02] font-bold tracking-[-0.025em] sm:text-[29px]"
          style={{ color: `var(${pillar.theme.inkVar})` }}
        >
          {pillar.title[locale]}
        </p>
        <p className="mt-1.5 text-[13px] font-semibold text-ink-muted sm:text-[15px]">
          {pillar.tagline[locale]}
        </p>
      </div>
    </li>
  )
}

/** Landing hero visual: the four pillars, with one personal pick layered on top. */
export function LandingProductPreview() {
  const copy = useCopy()
  const health = PILLARS.health

  return (
    <div className="relative mx-auto w-full max-w-[520px] pb-16 sm:pb-12">
      <div
        role="group"
        aria-label={copy.landing.previewLabel}
        className="grid grid-cols-2 gap-3 sm:gap-4"
      >
        <ul className="flex flex-col gap-3 sm:gap-4">
          <HeroTile id="financial" className="h-[150px] sm:h-[210px]" />
          <HeroTile id="social" className="h-[176px] sm:h-[250px]" />
        </ul>
        <ul className="mt-8 flex flex-col gap-3 sm:mt-12 sm:gap-4">
          <HeroTile id="health" className="h-[176px] sm:h-[250px]" />
          <HeroTile id="projects" className="h-[150px] sm:h-[210px]" />
        </ul>
      </div>

      <div className="absolute bottom-0 left-1/2 w-[82%] max-w-[300px] -translate-x-1/2 sm:left-[8%] sm:translate-x-0">
        <div className="float-soft rounded-[20px] border border-line bg-paper p-4 shadow-[var(--shadow-overlay)]">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-extrabold"
            style={{
              backgroundColor: `var(${health.theme.tintVar})`,
              color: `var(${health.theme.inkVar})`,
            }}
          >
            <PillarGlyph id="health" size={14} strokeWidth={3} aria-hidden="true" />
            {copy.landing.previewForYou}
          </span>
          <p className="mt-2 text-[16px] leading-snug font-extrabold tracking-[-0.01em] text-ink">
            {copy.landing.previewPick}
          </p>
        </div>
      </div>
    </div>
  )
}
