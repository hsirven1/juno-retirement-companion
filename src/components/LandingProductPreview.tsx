import { MentorAvatar } from './mentor/MentorAvatar'
import { JunoOrb } from './JunoOrb'
import { getMentorById } from '../data/mentors'
import { useCopy } from '../i18n'

const DEMO_MENTOR_ID = 'mentor-claire'

/**
 * Landing hero visual — suggests a warm conversation with a matched mentor.
 * Demo persona only; not a product dashboard.
 */
export function LandingProductPreview() {
  const copy = useCopy()
  const mentor = getMentorById(DEMO_MENTOR_ID)
  if (!mentor) return null

  return (
    <div
      className="relative mx-auto w-full max-w-[420px]"
      aria-label={copy.landing.previewLabel}
    >
      <div
        className="absolute -inset-3 rounded-[32px] opacity-70 sm:-inset-5"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(232, 145, 120, 0.22), transparent 55%), radial-gradient(circle at 80% 80%, rgba(232, 210, 180, 0.55), transparent 50%)',
        }}
        aria-hidden="true"
      />

      <aside className="relative overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_22px_48px_-30px_rgba(36,31,26,0.4)]">
        <div className="border-b border-line bg-cream-deep/70 px-5 py-4 sm:px-6">
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-ink-label uppercase">
            {copy.landing.previewEyebrow}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <MentorAvatar
              id={mentor.id}
              firstName={mentor.firstName}
              size={52}
            />
            <div className="min-w-0">
              <p className="text-[1.15rem] font-extrabold tracking-[-0.02em] text-ink">
                {mentor.firstName}
              </p>
              <p className="text-[14px] text-ink-muted">
                {copy.landing.previewCareer} · {mentor.city}
              </p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-sage/15 px-2.5 py-1 text-[12px] font-bold text-sage">
              <span
                className="size-1.5 rounded-full bg-sage"
                aria-hidden="true"
              />
              {copy.landing.previewCallStatus}
            </span>
          </div>
        </div>

        <div className="space-y-3 px-5 py-5 sm:px-6 sm:py-6">
          <div className="max-w-[92%] rounded-[18px] rounded-tl-md bg-[#F3EBE2] px-4 py-3.5">
            <p className="text-[15px] leading-relaxed text-ink">
              {copy.landing.previewBubble}
            </p>
          </div>
          <div className="ml-auto max-w-[78%] rounded-[18px] rounded-tr-md bg-clay-tint px-4 py-3.5">
            <p className="text-[15px] leading-relaxed text-clay-ink">
              {copy.landing.previewReply}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-line px-5 py-4 sm:px-6">
          <JunoOrb size={28} />
          <p className="text-[13px] leading-snug text-ink-muted">
            {copy.landing.previewJunoCue}
          </p>
        </div>
      </aside>

      <p className="relative mt-3 text-center text-[12px] text-ink-soft">
        {copy.landing.previewDemoNote}
      </p>
    </div>
  )
}
