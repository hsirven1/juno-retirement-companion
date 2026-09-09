import { cn } from '../lib/cn'

/**
 * CSS Juno character — warm coral orb + face.
 * Keep expression minimal and adult: calm eyes + a tiny curved smile.
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
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Calm eyes: slightly softened vertical pills. */}
        <rect x="26" y="39" width="14" height="18" rx="9" fill="#3A1B12" opacity="0.9" />
        <rect x="60" y="39" width="14" height="18" rx="9" fill="#3A1B12" opacity="0.9" />

        {/* Tiny curved smile (restrained, no teeth). */}
        <path
          d="M40 64 Q50 70 60 64"
          fill="none"
          stroke="#3A1B12"
          strokeOpacity="0.85"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}
