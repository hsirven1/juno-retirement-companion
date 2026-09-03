import { ArrowUp } from 'lucide-react'
import { CardEyebrow, DashboardCard } from './DashboardCard'
import { JunoAvatar } from '../JunoAvatar'
import { useApp } from '../../context/useApp'
import { useCopy } from '../../i18n'
import { profile } from '../../data/profile'

export function CoachShortcut() {
  const { openChat } = useApp()
  const copy = useCopy()

  return (
    <DashboardCard className="relative transition-colors hover:border-ink/20">
      <button
        type="button"
        onClick={() => openChat()}
        className="absolute inset-0 z-10 cursor-pointer rounded-[inherit]"
        aria-label={copy.home.coachOpen}
      />
      <CardEyebrow>{copy.home.coachTitle}</CardEyebrow>

      <div className="mt-5 flex items-start gap-3">
        <JunoAvatar />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium tracking-[0.02em] text-ink">
            {copy.brand.name}
          </p>
          <div className="mt-2 rounded-2xl rounded-tl-md bg-cream px-3.5 py-3">
            <p className="text-[15px] leading-snug text-ink">
              {copy.home.coachPreview(profile.firstName)}
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none mt-5 flex min-h-12 items-center gap-2 rounded-full border border-line-strong bg-cream px-4">
        <span className="flex-1 text-[15px] text-ink-soft">
          {copy.home.coachPlaceholder}
        </span>
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-clay text-cream"
          aria-hidden="true"
        >
          <ArrowUp size={16} strokeWidth={2.2} />
        </span>
      </div>
    </DashboardCard>
  )
}
