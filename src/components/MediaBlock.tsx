import { cn } from '../lib/cn'
import type { ResourceThemeTokens } from '../lib/resourceTheme'

type Aspect = 'card' | 'hero' | 'thumb' | 'square' | 'compact'

const aspectClass: Record<Aspect, string> = {
  card: 'aspect-[16/10]',
  hero: 'aspect-[3/2]',
  thumb: 'aspect-square',
  square: 'aspect-square',
  compact: 'aspect-[2.2/1]',
}

/**
 * Image slot with graceful CSS fallback when no photography exists.
 * Never invents fake venue photos — tint + abstract shapes only.
 * `variant` shifts composition so cards don’t look identical.
 */
export function MediaBlock({
  theme,
  imageUrl,
  alt = '',
  aspect = 'card',
  className,
  radius = 'lg',
  variant = 0,
}: {
  theme: ResourceThemeTokens
  imageUrl?: string | null
  alt?: string
  aspect?: Aspect
  className?: string
  radius?: 'sm' | 'md' | 'lg'
  variant?: number
}) {
  const radiusClass =
    radius === 'sm'
      ? 'rounded-[14px]'
      : radius === 'md'
        ? 'rounded-[16px]'
        : 'rounded-[18px]'

  const v = ((variant % 4) + 4) % 4

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectClass[aspect],
        radiusClass,
        className,
      )}
      style={{
        backgroundColor: `var(${theme.tintVar})`,
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-center"
        />
      ) : (
        <PlaceholderShapes theme={theme} variant={v} />
      )}
    </div>
  )
}

function PlaceholderShapes({
  theme,
  variant,
}: {
  theme: ResourceThemeTokens
  variant: number
}) {
  const solid = `var(${theme.solidVar})`

  if (variant === 1) {
    return (
      <>
        <div
          aria-hidden="true"
          className="absolute -right-[20%] top-[-10%] size-[70%] rounded-full opacity-[0.2]"
          style={{ backgroundColor: solid }}
        />
        <div
          aria-hidden="true"
          className="absolute left-[8%] bottom-[-30%] size-[55%] rounded-[32%] opacity-[0.16]"
          style={{ backgroundColor: solid }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 25% 30%, rgba(255,255,255,0.4), transparent 50%)',
          }}
        />
      </>
    )
  }

  if (variant === 2) {
    return (
      <>
        <div
          aria-hidden="true"
          className="absolute left-[12%] top-[12%] size-[38%] rounded-full opacity-[0.22]"
          style={{ backgroundColor: solid }}
        />
        <div
          aria-hidden="true"
          className="absolute right-[10%] bottom-[8%] size-[48%] rounded-full opacity-[0.14]"
          style={{ backgroundColor: solid }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.28), transparent 55%)',
          }}
        />
      </>
    )
  }

  if (variant === 3) {
    return (
      <>
        <div
          aria-hidden="true"
          className="absolute -left-[25%] bottom-[-20%] size-[75%] rounded-[40%] opacity-[0.18]"
          style={{ backgroundColor: solid }}
        />
        <div
          aria-hidden="true"
          className="absolute right-[-8%] top-[5%] size-[42%] rounded-full opacity-[0.2]"
          style={{ backgroundColor: solid }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 80% 70%, rgba(255,255,255,0.32), transparent 50%)',
          }}
        />
      </>
    )
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute -left-[18%] top-[18%] size-[58%] rounded-full opacity-[0.18]"
        style={{ backgroundColor: solid }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-[12%] -bottom-[22%] size-[52%] rounded-full opacity-[0.22]"
        style={{ backgroundColor: solid }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.35), transparent 55%)',
        }}
      />
    </>
  )
}
