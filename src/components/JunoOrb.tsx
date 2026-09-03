import { cn } from '../lib/cn'

/**
 * CSS Juno character — radial orb + two vertical eye pills.
 * Eyes are percentage-positioned for true symmetry at every size.
 */
export function JunoOrb({
  size = 44,
  className,
  glow = false,
}: {
  size?: number
  className?: string
  /** Optional glow for dark panels. */
  glow?: boolean
}) {
  const breathe = size >= 44
  // Vertical pills (~11.5% × 16.5%) — taller than wide, matching the handoff.
  // Horizontal ovals read as sleepy / sideways; keep these upright.
  const eyeW = Math.max(3, Math.round(size * 0.115))
  const eyeH = Math.max(4, Math.round(size * 0.165))
  // Soft vertical pill (design: border-radius 50% / 4–6px)
  const eyeRadius = `${Math.max(2, Math.round(eyeW * 0.55))}px`

  return (
    <span
      className={cn(
        'relative inline-block shrink-0 overflow-hidden rounded-full',
        glow ? 'shadow-[0_10px_26px_rgba(225,80,58,0.42)]' : '',
        className,
      )}
      style={{
        width: size,
        height: size,
        background:
          size >= 50
            ? 'radial-gradient(circle at 32% 28%, #F8B39A, #E1503A 74%)'
            : 'radial-gradient(circle at 32% 28%, #F8B39A, #E1503A 72%)',
        animation: breathe
          ? 'juno-breathe 5.5s ease-in-out infinite alternate'
          : undefined,
      }}
      aria-hidden="true"
    >
      {/*
        Gaze: both eyes share the same top (40.5%) so they are level.
        Left/right use mirrored percentages so the pair is centered
        on the vertical midline — straight-ahead, calm, attentive.
      */}
      <span
        className="absolute"
        style={{
          width: eyeW,
          height: eyeH,
          top: '40.5%',
          left: '29%',
          borderRadius: eyeRadius,
          background: '#3A1B12',
        }}
      />
      <span
        className="absolute"
        style={{
          width: eyeW,
          height: eyeH,
          top: '40.5%',
          left: '58%',
          borderRadius: eyeRadius,
          background: '#3A1B12',
        }}
      />
    </span>
  )
}
