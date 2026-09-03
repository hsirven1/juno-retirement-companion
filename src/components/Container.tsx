import { cn } from '../lib/cn'
import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  width?: 'wide' | 'reading' | 'narrow'
}

const widths = {
  wide: 'max-w-[1120px]',
  reading: 'max-w-[760px]',
  narrow: 'max-w-[640px]',
}

export function Container({
  children,
  className,
  width = 'wide',
}: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-6 sm:px-8', widths[width], className)}>
      {children}
    </div>
  )
}
