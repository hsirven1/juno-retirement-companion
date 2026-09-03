import { cn } from '../../lib/cn'

/** Thin segmented progress — one segment per screen / micro-step. No XP. */
export function SegmentedStepProgress({
  total,
  currentIndex,
  partial = 0,
  fill = 'var(--color-clay)',
  empty = 'var(--color-line-strong)',
  className,
  'aria-label': ariaLabel,
}: {
  total: number
  /** 0-based index of the active segment */
  currentIndex: number
  /** 0–1 fill within the current segment */
  partial?: number
  fill?: string
  empty?: string
  className?: string
  'aria-label'?: string
}) {
  const clampedPartial = Math.min(1, Math.max(0, partial))

  return (
    <div
      className={cn('flex w-full gap-1.5', className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={Math.min(total, currentIndex + 1)}
      aria-label={ariaLabel}
    >
      {Array.from({ length: total }, (_, index) => {
        let background = empty
        if (index < currentIndex) {
          background = fill
        } else if (index === currentIndex) {
          if (clampedPartial <= 0) background = empty
          else if (clampedPartial >= 1) background = fill
          else {
            const pct = Math.round(clampedPartial * 100)
            background = `linear-gradient(90deg, ${fill} ${pct}%, ${empty} ${pct}%)`
          }
        }
        return (
          <span
            key={index}
            aria-hidden="true"
            className="h-[5px] min-w-0 flex-1 rounded-full"
            style={{ background }}
          />
        )
      })}
    </div>
  )
}
