import { Check } from 'lucide-react'
import { Button } from './Button'
import { useCopy } from '../i18n'
import { cn } from '../lib/cn'

export function JourneyStepCompletion({
  accomplishment,
  junoRetains,
  tags,
  nextTime,
  onFinish,
  finishLabel,
}: {
  accomplishment: string
  junoRetains: string
  tags?: string[]
  nextTime: string
  onFinish: () => void
  finishLabel?: string
}) {
  const copy = useCopy()

  return (
    <div>
      <div className="mb-6 flex size-14 items-center justify-center rounded-full border border-sage/25 bg-sage/8">
        <Check size={26} strokeWidth={2.2} className="text-sage" aria-hidden="true" />
      </div>

      <h1 className="font-display text-[2rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.35rem]">
        {copy.journeyUi.bravo}
      </h1>

      <p className="mt-4 text-[17px] leading-relaxed text-ink-muted">
        {copy.journeyUi.advancedOn}{' '}
        <span className="text-ink">{accomplishment}</span>
      </p>

      <div className="mt-8 rounded-lg border border-line bg-paper px-5 py-5">
        <p className="text-[11px] font-medium tracking-[0.14em] text-ink-soft uppercase">
          {copy.journeyUi.junoRetains}
        </p>
        <p className="mt-3 text-[16px] leading-relaxed text-ink">{junoRetains}</p>
        {tags && tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line-strong bg-cream px-3 py-1 text-[13px] text-ink-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-lg border border-line bg-cream px-5 py-5">
        <p className="text-[11px] font-medium tracking-[0.14em] text-ink-soft uppercase">
          {copy.journeyUi.nextTime}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{nextTime}</p>
      </div>

      <Button className="mt-10 min-h-12 w-full sm:w-auto" onClick={onFinish}>
        {finishLabel ?? copy.journeyUi.finishStep}
      </Button>
    </div>
  )
}

export function TimelineVisual({
  title,
  items,
  footer,
}: {
  title?: string
  items: { time: string; label: string }[]
  footer?: string
}) {
  return (
    <div className="rounded-lg border border-line bg-paper px-5 py-5">
      {title ? (
        <p className="text-[11px] font-medium tracking-[0.14em] text-clay uppercase">
          {title}
        </p>
      ) : null}
      <ol className={cn('space-y-0', title ? 'mt-4' : '')}>
        {items.map((item, index) => (
          <li
            key={item.time}
            className={cn(
              'flex gap-4 py-3',
              index < items.length - 1 ? 'border-b border-line' : '',
            )}
          >
            <span className="w-[3.25rem] shrink-0 text-[13px] font-medium tabular-nums text-ink-soft">
              {item.time}
            </span>
            <span className="relative flex-1 pl-4 text-[15px] leading-snug text-ink before:absolute before:top-[0.55rem] before:left-0 before:size-1.5 before:rounded-full before:bg-clay/70">
              {item.label}
            </span>
          </li>
        ))}
      </ol>
      {footer ? (
        <p className="mt-4 border-t border-line pt-4 text-[15px] leading-relaxed text-ink-muted">
          {footer}
        </p>
      ) : null}
    </div>
  )
}

export function ScenarioCards({
  question,
  options,
  selected,
  onSelect,
}: {
  question: string
  options: { id: string; label: string; description?: string }[]
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <h2 className="font-display text-[1.65rem] font-medium leading-snug tracking-[-0.02em] text-ink sm:text-[1.85rem]">
        {question}
      </h2>
      <ul className="mt-7 space-y-3">
        {options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={selected === option.id}
              className={cn(
                'w-full cursor-pointer rounded-lg border px-5 py-4 text-left transition-colors',
                selected === option.id
                  ? 'border-ink bg-ink text-cream'
                  : 'border-line bg-paper text-ink hover:border-ink/35',
              )}
            >
              <p className="text-[12px] font-medium tracking-[0.1em] uppercase opacity-80">
                {option.label.split(' — ')[0] ?? option.label}
              </p>
              {option.description ? (
                <p
                  className={cn(
                    'mt-1.5 text-[15px] leading-snug',
                    selected === option.id ? 'text-cream/90' : 'text-ink-muted',
                  )}
                >
                  {option.description}
                </p>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
