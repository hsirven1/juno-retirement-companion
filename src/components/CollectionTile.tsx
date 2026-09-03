import { cn } from '../lib/cn'

export function CollectionTile({
  title,
  countLabel,
  onClick,
  variant = 'solid',
  solid,
  className,
}: {
  title: string
  countLabel: string
  onClick: () => void
  variant?: 'solid' | 'outline'
  /** CSS color for solid tiles */
  solid?: string
  className?: string
}) {
  const isOutline = variant === 'outline'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex min-h-[140px] flex-col justify-between overflow-hidden rounded-[22px] p-[22px] text-left transition-transform duration-200 hover:-translate-y-0.5 sm:min-h-[168px] sm:p-[26px]',
        isOutline
          ? 'border border-line-strong bg-paper'
          : 'border border-transparent text-on-coral',
        className,
      )}
      style={isOutline ? undefined : { backgroundColor: solid }}
    >
      {!isOutline ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-8 size-36 rounded-full bg-white/15 transition-transform duration-200 group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-14 -left-10 size-40 rounded-full bg-white/12 transition-transform duration-200 group-hover:scale-105"
          />
        </>
      ) : null}

      <span
        className={cn(
          'relative max-w-[15ch] text-[20px] leading-[1.2] font-[800] tracking-[-0.015em] text-pretty sm:text-[24px]',
          isOutline ? 'text-ink' : 'text-white',
        )}
      >
        {title}
      </span>
      <span
        className={cn(
          'relative mt-4 text-[14px] font-bold sm:text-[15px]',
          isOutline ? 'text-clay-ink' : 'text-white/85',
        )}
      >
        {countLabel}
      </span>
    </button>
  )
}
