import { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import { useCopy } from '../i18n'
import { JunoOrb } from './JunoOrb'

const JUNO_ICON_SRC = '/brand/juno-icon.png'

const sizes = {
  /** Public landing — more prominent lockup */
  landing: {
    icon: 40,
    wordmark: 30,
    gap: 12,
    /** Optical nudge: cheek mass sits low-right, so lift icon slightly */
    iconOffsetY: -1,
  },
  /** In-app / onboarding nav — compact */
  nav: {
    icon: 28,
    wordmark: 22,
    gap: 10,
    iconOffsetY: 0,
  },
} as const

export type JunoLogoSize = keyof typeof sizes

interface LogoProps {
  to?: string
  className?: string
  size?: JunoLogoSize
}

/**
 * Official brand lockup: PNG icon + serif wordmark.
 * Conversational Juno avatars remain separate (JunoOrb / JunoAvatar).
 */
export function Logo({ to = '/', className, size = 'nav' }: LogoProps) {
  const copy = useCopy()
  const [failed, setFailed] = useState(false)
  const tokens = sizes[size]

  return (
    <Link
      to={to}
      className={cn('inline-flex items-center text-ink', className)}
      style={{ gap: tokens.gap }}
      aria-label={copy.brand.name}
    >
      <span
        className="relative inline-flex shrink-0 items-center justify-center"
        style={{
          width: tokens.icon,
          height: tokens.icon,
          transform: `translateY(${tokens.iconOffsetY}px)`,
        }}
      >
        {failed ? (
          <JunoOrb size={tokens.icon} />
        ) : (
          <img
            src={JUNO_ICON_SRC}
            alt=""
            width={tokens.icon}
            height={tokens.icon}
            decoding="async"
            className="block size-full object-contain"
            onError={() => setFailed(true)}
          />
        )}
      </span>
      <span
        className="font-display font-medium whitespace-nowrap leading-none tracking-[-0.02em]"
        style={{
          fontSize: tokens.wordmark,
          /* Optical baseline with Newsreader lowercase — slight lift vs box center */
          transform: 'translateY(0.5px)',
        }}
      >
        {copy.brand.name}
      </span>
    </Link>
  )
}
