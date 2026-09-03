import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import { useCopy } from '../i18n'
import { JunoOrb } from './JunoOrb'

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
        'inline-flex items-center gap-2.5 text-ink',
        className,
      )}
    >
      <JunoOrb size={24} />
      <span className="font-display text-[25px] font-medium leading-none tracking-[-0.02em] lowercase">
        {copy.brand.name}
      </span>
    </Link>
  )
}
