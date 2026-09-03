import { cn } from '../lib/cn'
import type { ResourceThemeTokens } from '../lib/resourceTheme'

type Aspect = 'card' | 'hero' | 'thumb' | 'square'

const aspectClass: Record<Aspect, string> = {
  card: 'aspect-[16/10]',
  hero: 'aspect-[3/2]',
  thumb: 'aspect-square',
  square: 'aspect-square',
}

/**
 * Image slot with graceful CSS fallback when no photography exists.
 * Never invents fake venue photos — tint + abstract circles only.
 */
export function MediaBlock({
  theme,
  imageUrl,
  alt = '',
  aspect = 'card',
  className,
  radius = 'lg',
}: {
  theme: ResourceThemeTokens
  imageUrl?: string | null
  alt?: string
  aspect?: Aspect
  className?: string
  radius?: 'sm' | 'md' | 'lg'
}) {
  const radiusClass =
    radius === 'sm'
      ? 'rounded-[14px]'
      : radius === 'md'
        ? 'rounded-[16px]'
        : 'rounded-[18px]'

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
        <>
          <div
            aria-hidden="true"
            className="absolute -left-[18%] top-[18%] size-[58%] rounded-full opacity-[0.18]"
            style={{ backgroundColor: `var(${theme.solidVar})` }}
          />
          <div
            aria-hidden="true"
            className="absolute -right-[12%] -bottom-[22%] size-[52%] rounded-full opacity-[0.22]"
            style={{ backgroundColor: `var(${theme.solidVar})` }}
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
      )}
    </div>
  )
}
