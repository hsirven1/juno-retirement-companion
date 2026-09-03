import { ArrowUp } from 'lucide-react'
import { useApp } from '../../context/useApp'
import { getSuggestionPills, useCopy, useLocale } from '../../i18n'
import { profile } from '../../data/profile'
import { JunoOrb } from '../JunoOrb'

/**
 * Home chat preview — Variant 1b uses a light card (not the dark immersive panel).
 * Clicking anywhere still opens the existing chat overlay.
 */
export function CoachShortcut() {
  const { openChat } = useApp()
  const copy = useCopy()
  const { chatLocale } = useLocale()
  const pills = getSuggestionPills(chatLocale).slice(0, 2)

  return (
    <section className="relative rounded-[24px] border border-line bg-paper p-6 shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={() => openChat()}
        className="absolute inset-0 z-10 cursor-pointer rounded-[inherit]"
        aria-label={copy.home.coachOpen}
      />

      <div className="relative z-0">
        <div className="flex items-center gap-3">
          <JunoOrb size={54} />
          <div className="min-w-0 flex-1">
            <p className="text-[20px] font-[800] leading-tight text-ink">
              {copy.brand.name}
            </p>
            <p className="mt-0.5 text-[14px] text-ink-soft">
              {copy.home.coachSubtitle}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-[18px] rounded-bl-md bg-[#F6EFE5] px-[19px] py-[17px]">
          <p className="text-[17px] leading-[1.5] text-[#3B342E]">
            {copy.home.coachPreview(profile.firstName)}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {pills.map((pill, index) => (
            <span
              key={pill.label}
              className={
                index === 0
                  ? 'rounded-full bg-clay-tint px-4 py-2.5 text-[15px] font-bold text-clay-ink'
                  : 'rounded-full border-[1.5px] border-line-strong px-4 py-2.5 text-[15px] font-bold text-ink'
              }
            >
              {pill.label}
            </span>
          ))}
        </div>

        <div className="pointer-events-none mt-4 flex min-h-11 items-center gap-3 rounded-full border border-line bg-cream py-1.5 pr-1.5 pl-5">
          <span className="flex-1 text-[16px] text-[#9A9088]">
            {copy.home.coachPlaceholder}
          </span>
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-clay text-on-coral"
            aria-hidden="true"
          >
            <ArrowUp size={16} strokeWidth={2.4} />
          </span>
        </div>
      </div>
    </section>
  )
}
