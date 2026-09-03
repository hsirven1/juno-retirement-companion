import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-clay text-cream hover:bg-clay-deep border border-transparent',
  secondary:
    'bg-transparent text-ink border border-line-strong hover:border-ink/40 hover:bg-paper',
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
    'inline-flex items-center justify-center min-h-12 px-6 text-[17px] font-medium tracking-[0.01em] rounded-md transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
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
