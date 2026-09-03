import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import { useCopy } from '../i18n'

interface LogoProps {
  to?: string
  className?: string
}

export function Logo({ to = '/', className }: LogoProps) {
  const copy = useCopy()

  return (
    <Link
      to={to}
      className={cn(
        'font-display text-[1.35rem] font-medium tracking-[-0.02em] text-ink',
        className,
      )}
    >
      {copy.brand.name}
    </Link>
  )
}
