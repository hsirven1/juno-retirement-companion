import { Check } from 'lucide-react'
import { Button } from './Button'
import { AbstractComposition } from './journey/AbstractComposition'
import { useCopy } from '../i18n'
import { cn } from '../lib/cn'

export function JourneyStepCompletion({
  accomplishment,
  junoRetains,
  tags,
  nextTime,
  onFinish,
  finishLabel,
  weekNumber,
}: {
  accomplishment: string
  junoRetains: string
  tags?: string[]
  nextTime: string
  onFinish: () => void
  finishLabel?: string
  weekNumber?: number
}) {
  const copy = useCopy()

  return (
    <div className="flex min-h-full flex-col pb-2 text-center">
      <div className="relative mx-auto mt-2 flex size-[170px] items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#E1EFE4]"
        />
        <span
          aria-hidden="true"
          className="absolute top-3 right-4 size-3 rounded-full bg-[color-mix(in_srgb,var(--theme-social-solid)_50%,transparent)]"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-3 size-2.5 rounded-full bg-[color-mix(in_srgb,var(--theme-contribute-solid)_50%,transparent)]"
        />
        <span
          aria-hidden="true"
          className="absolute top-10 left-5 size-2 rounded-full bg-[color-mix(in_srgb,var(--theme-learn-solid)_45%,transparent)]"
        />
        <span className="relative flex size-[76px] items-center justify-center rounded-full bg-sage shadow-[0_8px_24px_-10px_rgba(47,125,91,0.55)]">
          <Check
            size={34}
            strokeWidth={2.6}
            className="text-white"
            aria-hidden="true"
          />
        </span>
      </div>

      {weekNumber ? (
        <p className="mt-5 text-[12px] font-extrabold tracking-[0.1em] text-sage uppercase">
          {copy.journeyUi.weekDone(weekNumber)}
        </p>
      ) : null}

      <h1 className="mt-3 font-display text-[1.85rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[2.15rem]">
        {copy.journeyUi.bravo}
      </h1>

      <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">
        {copy.journeyUi.advancedOn}{' '}
        <span className="text-ink">{accomplishment}</span>
      </p>

      <div className="mt-8 rounded-[20px] border border-line bg-paper px-5 py-5 text-left">
        <p className="text-[11px] font-extrabold tracking-[0.12em] text-ink-soft uppercase">
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

        <div className="mt-5 border-t border-line pt-5">
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-ink-soft uppercase">
            {copy.journeyUi.nextTime}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
            {nextTime}
          </p>
        </div>
      </div>

      <Button
        className="mt-auto min-h-12 w-full pt-8 text-[17px] font-bold sm:mt-10"
        onClick={onFinish}
      >
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
    <div className="rounded-[20px] border border-line/80 bg-paper/80 px-5 py-5">
      <AbstractComposition variant="timeline" tone="on-tint" className="mb-2 h-20" />
      {title ? (
        <p
          className="text-[11px] font-extrabold tracking-[0.12em] uppercase"
          style={{ color: 'var(--journey-ink, var(--color-clay-ink))' }}
        >
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
            <span className="w-[3.25rem] shrink-0 text-[13px] font-bold tabular-nums text-ink-soft">
              {item.time}
            </span>
            <span className="relative flex-1 pl-4 text-[15px] leading-snug text-ink">
              <span
                aria-hidden="true"
                className="absolute top-[0.55rem] left-0 size-1.5 rounded-full"
                style={{
                  backgroundColor: 'var(--journey-solid, var(--color-clay))',
                }}
              />
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
  eyebrow,
}: {
  question: string
  options: { id: string; label: string; description?: string }[]
  selected: string | null
  onSelect: (id: string) => void
  eyebrow?: string
}) {
  const accents = [
    { tint: '#e3eaf8', solid: '#3563c9' },
    { tint: '#fbe6e9', solid: '#d6455e' },
    { tint: '#e1efe4', solid: '#2f7d5b' },
    { tint: '#ede4fa', solid: '#6d4ac4' },
  ]

  return (
    <div>
      {eyebrow ? (
        <p
          className="text-[12px] font-extrabold tracking-[0.1em] uppercase"
          style={{ color: 'var(--journey-ink, var(--color-clay-ink))' }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          'text-[1.55rem] font-extrabold leading-snug tracking-[-0.02em] text-ink sm:text-[1.85rem]',
          eyebrow ? 'mt-2' : '',
        )}
      >
        {question}
      </h2>
      <ul className="mt-7 space-y-3">
        {options.map((option, index) => {
          const accent = accents[index % accents.length]
          const isSelected = selected === option.id
          const title = option.label.split(' — ')[0] ?? option.label
          const description =
            option.description ??
            (option.label.includes(' — ')
              ? option.label.split(' — ').slice(1).join(' — ')
              : undefined)

          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => onSelect(option.id)}
                aria-pressed={isSelected}
                className={cn(
                  'flex w-full cursor-pointer items-start gap-4 rounded-[20px] border-2 px-4 py-4 text-left transition-colors sm:px-5',
                  isSelected
                    ? 'font-bold'
                    : 'border-line bg-paper hover:border-line-strong',
                )}
                style={
                  isSelected
                    ? {
                        borderColor: 'var(--journey-solid, var(--color-clay))',
                        backgroundColor:
                          'var(--journey-tint, var(--color-clay-tint))',
                      }
                    : undefined
                }
              >
                <span
                  aria-hidden="true"
                  className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl sm:size-24"
                  style={{ backgroundColor: accent.tint }}
                >
                  <span
                    className="absolute size-8 rounded-full opacity-50 sm:size-10"
                    style={{ backgroundColor: accent.solid }}
                  />
                  <span
                    className="absolute top-2 right-2 size-3 rounded-full opacity-40 sm:size-4"
                    style={{ backgroundColor: accent.solid }}
                  />
                  <span
                    className="absolute bottom-3 left-2 size-2.5 rounded-full opacity-35"
                    style={{ backgroundColor: accent.solid }}
                  />
                </span>
                <span className="min-w-0 flex-1 py-0.5">
                  <span className="block text-[17px] font-extrabold leading-snug text-ink sm:text-[20px]">
                    {title}
                  </span>
                  {description ? (
                    <span className="mt-1.5 block text-[15px] leading-snug text-ink-muted sm:text-[17px]">
                      {description}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
