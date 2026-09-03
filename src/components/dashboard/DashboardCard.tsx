import { cn } from '../../lib/cn'
import type { ReactNode } from 'react'

export function DashboardCard({
  children,
  className,
  padding = 'md',
}: {
  children: ReactNode
  className?: string
  padding?: 'md' | 'lg'
}) {
  return (
    <section
      className={cn(
        'rounded-lg border border-line bg-paper shadow-[0_12px_32px_-28px_rgba(36,31,26,0.4)]',
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
    <p className="text-[12px] font-medium tracking-[0.16em] text-ink-soft uppercase">
      {children}
    </p>
  )
}
