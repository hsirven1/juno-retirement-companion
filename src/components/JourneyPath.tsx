import { cn } from '../lib/cn'
import type { LifeAreaStatus } from '../types'

const statusVisual: Record<
  LifeAreaStatus,
  { filled: number; tone: 'clay' | 'sage' | 'muted' }
> = {
  'needs-attention': { filled: 1, tone: 'clay' },
  'worth-exploring': { filled: 2, tone: 'muted' },
  'going-well': { filled: 3, tone: 'sage' },
  'feeling-confident': { filled: 3, tone: 'sage' },
  'a-priority': { filled: 2, tone: 'clay' },
}

const toneFill: Record<'clay' | 'sage' | 'muted', string> = {
  clay: 'bg-clay',
  sage: 'bg-sage',
  muted: 'bg-ink/45',
}

export function StatusMeter({ status }: { status: LifeAreaStatus }) {
  const visual = statusVisual[status]

  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      {[1, 2, 3].map((point) => (
        <span
          key={point}
          className={cn(
            'size-2 rounded-full',
            point <= visual.filled ? toneFill[visual.tone] : 'bg-line-strong',
          )}
        />
      ))}
    </span>
  )
}
