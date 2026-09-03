import { useCopy } from '../i18n'
import { cn } from '../lib/cn'

export function WeekPreview() {
  const copy = useCopy()
  const items = copy.landing.weekPreviewItems

  return (
    <aside
      className="relative mx-auto w-full max-w-[420px] rounded-lg border border-line bg-paper px-7 py-8 shadow-[0_18px_40px_-28px_rgba(36,31,26,0.35)]"
      aria-label={copy.landing.weekPreviewLabel}
    >
      <p className="text-[12px] font-medium tracking-[0.18em] text-ink-soft uppercase">
        {copy.landing.weekPreviewEyebrow}
      </p>
      <p className="mt-2 font-display text-[1.45rem] leading-snug text-ink">
        {copy.landing.weekPreviewTitle}
      </p>
      <ol className="mt-7 space-y-0">
        {items.map((item, index) => (
          <li
            key={item.title}
            className={cn(
              'grid grid-cols-[5.5rem_1.25rem_1fr] items-start gap-3 py-3.5',
              index < items.length - 1 ? 'border-b border-line' : '',
            )}
          >
            <span className="pt-0.5 text-[13px] font-medium tracking-[0.04em] text-ink-soft">
              {item.day}
            </span>
            <span className="pt-1" aria-hidden="true">
              <AgendaMark status={item.status} />
            </span>
            <p
              className={cn(
                'text-[17px] leading-snug text-ink',
                item.status === 'done' ? 'text-ink-muted' : '',
              )}
            >
              {item.title}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[13px] tracking-[0.04em] text-ink-soft">
        {copy.landing.weekPreviewCaption}
      </p>
    </aside>
  )
}

function AgendaMark({ status }: { status: 'todo' | 'open' | 'done' }) {
  if (status === 'done') {
    return (
      <span className="flex size-[18px] items-center justify-center rounded-[4px] border border-sage bg-sage text-cream">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path
            d="M1.5 5.2 3.8 7.5 8.5 2.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }

  if (status === 'open') {
    return (
      <span className="mt-[3px] block size-[12px] rounded-full border border-line-strong" />
    )
  }

  return (
    <span className="block size-[18px] rounded-[4px] border border-line-strong" />
  )
}
