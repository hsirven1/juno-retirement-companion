import { cn } from '../../lib/cn'

/** Abstract circle composition for editorial / scenario visuals. */
export function AbstractComposition({
  variant = 'orbit',
  tone = 'on-solid',
  className,
}: {
  variant?: 'orbit' | 'cluster' | 'timeline' | 'links'
  tone?: 'on-solid' | 'on-tint' | 'muted'
  className?: string
}) {
  const ink =
    tone === 'on-solid'
      ? 'bg-white/90'
      : tone === 'on-tint'
        ? 'bg-[color-mix(in_srgb,var(--journey-solid)_45%,transparent)]'
        : 'bg-ink/15'
  const soft =
    tone === 'on-solid'
      ? 'bg-white/35'
      : tone === 'on-tint'
        ? 'bg-[color-mix(in_srgb,var(--journey-solid)_22%,transparent)]'
        : 'bg-ink/8'
  const ring =
    tone === 'on-solid'
      ? 'border-white/55'
      : tone === 'on-tint'
        ? 'border-[color-mix(in_srgb,var(--journey-solid)_40%,transparent)]'
        : 'border-ink/20'

  if (variant === 'timeline') {
    return (
      <div
        aria-hidden="true"
        className={cn('relative mx-auto h-36 w-full max-w-[280px]', className)}
      >
        <span className={cn('absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2', soft)} />
        {[18, 42, 66, 88].map((left, i) => (
          <span
            key={left}
            className={cn(
              'absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full',
              i === 1 ? ink : soft,
            )}
            style={{ left: `${left}%` }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'links') {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'relative mx-auto flex h-24 w-24 items-center justify-center',
          className,
        )}
      >
        <span className={cn('absolute size-16 rounded-full', soft)} />
        <span className={cn('absolute size-9 rounded-full', ink)} />
        <span
          className={cn('absolute top-1 left-0 size-5 rounded-full', soft)}
        />
        <span
          className={cn('absolute right-0 bottom-2 size-4 rounded-full', soft)}
        />
      </div>
    )
  }

  if (variant === 'cluster') {
    return (
      <div
        aria-hidden="true"
        className={cn('relative mx-auto h-28 w-28', className)}
      >
        <span className={cn('absolute top-2 left-3 size-10 rounded-full', soft)} />
        <span className={cn('absolute top-8 right-2 size-14 rounded-full', ink)} />
        <span className={cn('absolute bottom-1 left-8 size-8 rounded-full', soft)} />
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative mx-auto flex w-full max-w-[280px] items-center justify-center',
        className ?? 'h-44 sm:h-52',
      )}
    >
      <span
        className={cn(
          'absolute size-44 rounded-full border border-dashed',
          ring,
        )}
      />
      <span className={cn('absolute size-28 rounded-full', ink)} />
      <span
        className={cn('absolute top-6 left-[18%] size-7 rounded-full', soft)}
      />
      <span
        className={cn('absolute top-16 right-[14%] size-5 rounded-full', soft)}
      />
      <span
        className={cn('absolute bottom-10 left-[22%] size-4 rounded-full', soft)}
      />
      <span
        className={cn('absolute right-[28%] bottom-8 size-6 rounded-full', soft)}
      />
    </div>
  )
}
