import { cn } from '../../lib/cn'
import type { ReactNode } from 'react'

type Surface = 'paper' | 'coral' | 'sunken'

const surfaceClasses: Record<Surface, string> = {
  paper: 'border-line bg-paper shadow-[var(--shadow-card)]',
  coral: 'border-transparent bg-clay text-on-coral shadow-none',
  sunken: 'border-transparent bg-cream-deep shadow-none',
}

export function DashboardCard({
  children,
  className,
  padding = 'md',
  surface = 'paper',
}: {
  children: ReactNode
  className?: string
  padding?: 'md' | 'lg'
  /** Explicit surface — avoids bg-* class conflicts with Tailwind source order. */
  surface?: Surface
}) {
  return (
    <section
      className={cn(
        'rounded-[22px]',
        surfaceClasses[surface],
        padding === 'lg' ? 'p-6 sm:p-8 lg:p-9' : 'p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function CardEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[12px] font-[800] tracking-[0.11em] text-ink-label uppercase">
      {children}
    </p>
  )
}
