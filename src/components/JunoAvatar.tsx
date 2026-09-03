import { cn } from '../lib/cn'
import { JunoOrb } from './JunoOrb'

const SIZE_PX = {
  sm: 32,
  md: 36,
  lg: 44,
} as const

/**
 * Named size wrapper around the CSS Juno orb.
 * Keeps existing call sites (chat overlay, journey) on the same face.
 */
export function JunoAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <JunoOrb
      size={SIZE_PX[size]}
      className={cn('shrink-0', className)}
    />
  )
}
