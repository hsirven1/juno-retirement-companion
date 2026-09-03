import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-clay text-cream hover:bg-clay-deep border border-transparent active:bg-clay-deep disabled:bg-clay-deep disabled:text-ink-label disabled:opacity-100',
  secondary:
    'bg-transparent text-ink border-[1.5px] border-line-strong hover:border-line-strong/90 hover:bg-cream-deep active:bg-cream-deep disabled:border-line-strong disabled:text-ink-soft disabled:opacity-70',
  ghost: 'bg-transparent text-ink border border-transparent hover:bg-cream-deep',
}

interface CommonProps {
  variant?: Variant
  className?: string
  children: ReactNode
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined }

type ButtonAsLink = CommonProps & { to: string; type?: never }

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    'inline-flex items-center justify-center min-h-[44px] px-6 text-[17px] font-medium tracking-[0.01em] rounded-full transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
    variantClasses[variant],
    className,
  )

  if ('to' in props && props.to) {
    const { to } = props
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  const buttonProps = props as ButtonAsButton
  return (
    <button className={classes} type={buttonProps.type ?? 'button'} {...buttonProps}>
      {children}
    </button>
  )
}
