import { Check } from 'lucide-react'
import { Button } from './Button'
import { AbstractComposition } from './journey/AbstractComposition'
import { HighlightedCopy } from './journey/HighlightedCopy'
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
    <div className="flex min-h-full flex-col pb-1 text-center">
      <div className="relative mx-auto flex size-[140px] items-center justify-center sm:size-[160px]">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#E1EFE4]"
        />
        <span
          aria-hidden="true"
          className="absolute top-2 right-3 size-2.5 rounded-full bg-[color-mix(in_srgb,var(--theme-social-solid)_50%,transparent)]"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-5 left-2 size-2 rounded-full bg-[color-mix(in_srgb,var(--theme-contribute-solid)_50%,transparent)]"
        />
        <span
          aria-hidden="true"
          className="absolute top-8 left-4 size-1.5 rounded-full bg-[color-mix(in_srgb,var(--theme-learn-solid)_45%,transparent)]"
        />
        <span className="relative flex size-[68px] items-center justify-center rounded-full bg-sage sm:size-[76px]">
          <Check
            size={30}
            strokeWidth={2.6}
            className="text-white"
            aria-hidden="true"
          />
        </span>
      </div>

      {weekNumber ? (
        <p className="mt-4 text-[11px] font-extrabold tracking-[0.1em] text-sage uppercase sm:mt-5 sm:text-[12px]">
          {copy.journeyUi.weekDone(weekNumber)}
        </p>
      ) : null}

      <h1 className="mt-2 font-display text-[1.65rem] font-medium leading-tight tracking-[-0.02em] text-ink sm:mt-3 sm:text-[1.95rem]">
        {copy.journeyUi.bravo}
      </h1>

      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted sm:text-[16px]">
        {copy.journeyUi.advancedOn}{' '}
        <span className="font-semibold text-ink">{accomplishment}</span>
      </p>

      <div className="mt-6 rounded-[20px] border border-line bg-paper px-5 py-5 text-left sm:mt-7">
        <p className="text-[11px] font-extrabold tracking-[0.12em] text-ink-soft uppercase">
          {copy.journeyUi.junoRetains}
        </p>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink sm:text-[16px]">
          <HighlightedCopy text={junoRetains} />
        </p>
        {tags && tags.length > 0 ? (
          <div className="mt-3.5 flex flex-wrap gap-2">
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

        <div className="mt-4 border-t border-line pt-4">
          <p className="text-[11px] font-extrabold tracking-[0.12em] text-ink-soft uppercase">
            {copy.journeyUi.nextTime}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-muted sm:text-[15px]">
            {nextTime}
          </p>
        </div>
      </div>

      <Button
        className="mt-auto min-h-12 w-full text-[17px] font-bold sm:mt-8"
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
    <div className="rounded-[20px] border border-line/80 bg-paper/90 px-4 py-4 sm:px-5 sm:py-5">
      <AbstractComposition
        variant="timeline"
        tone="on-tint"
        className="mb-1 h-14 sm:h-16"
      />
      {title ? (
        <p
          className="text-[11px] font-extrabold tracking-[0.12em] uppercase"
          style={{ color: 'var(--journey-ink, var(--color-clay-ink))' }}
        >
          {title}
        </p>
      ) : null}
      <ol className={cn('space-y-0', title ? 'mt-3' : '')}>
        {items.map((item, index) => (
          <li
            key={item.time}
            className={cn(
              'flex gap-3 py-2.5 sm:gap-4',
              index < items.length - 1 ? 'border-b border-line' : '',
            )}
          >
            <span className="w-[3rem] shrink-0 text-[12px] font-bold tabular-nums text-ink-soft sm:w-[3.25rem] sm:text-[13px]">
              {item.time}
            </span>
            <span className="relative flex-1 pl-3.5 text-[14px] leading-snug text-ink sm:pl-4 sm:text-[15px]">
              <span
                aria-hidden="true"
                className="absolute top-[0.45rem] left-0 size-1.5 rounded-full"
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
        <p className="mt-3 border-t border-line pt-3 text-[14px] leading-relaxed text-ink-muted sm:text-[15px]">
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
          className="text-[11px] font-extrabold tracking-[0.1em] uppercase sm:text-[12px]"
          style={{ color: 'var(--journey-ink, var(--color-clay-ink))' }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          'text-[1.4rem] font-extrabold leading-snug tracking-[-0.02em] text-ink sm:text-[1.7rem]',
          eyebrow ? 'mt-1.5' : '',
        )}
      >
        {question}
      </h2>
      <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3" role="radiogroup" aria-label={question}>
        {options.map((option, index) => {
          const accent = accents[index % accents.length]
          const isSelected = selected === option.id
          const isGenericLabel = /^option\s+[a-d]$/i.test(option.label.trim())
          const title = isGenericLabel
            ? (option.description ?? option.label)
            : (option.label.split(' — ')[0] ?? option.label)
          const description = isGenericLabel
            ? undefined
            : (option.description ??
              (option.label.includes(' — ')
                ? option.label.split(' — ').slice(1).join(' — ')
                : undefined))

          return (
            <li key={option.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelect(option.id)}
                className={cn(
                  'flex w-full cursor-pointer items-start gap-3 rounded-[18px] border-2 px-3.5 py-3.5 text-left transition-[border-color,background-color,transform] duration-150 sm:gap-4 sm:rounded-[20px] sm:px-4 sm:py-4',
                  'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(225,80,58,0.35)] focus-visible:ring-offset-2',
                  'active:scale-[0.99]',
                  isSelected
                    ? 'font-bold shadow-[0_1px_0_rgba(34,28,24,0.04)]'
                    : 'border-line bg-paper hover:border-[#DCD1C1] hover:bg-[#FDFBF7]',
                )}
                style={
                  isSelected
                    ? {
                        borderColor: 'var(--journey-solid, var(--color-clay))',
                        backgroundColor:
                          'var(--journey-tint, #FDF1EF)',
                      }
                    : undefined
                }
              >
                <span
                  aria-hidden="true"
                  className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-[14px] sm:size-[72px] sm:rounded-2xl"
                  style={{ backgroundColor: accent.tint }}
                >
                  <span
                    className="absolute size-7 rounded-full opacity-45 sm:size-9"
                    style={{ backgroundColor: accent.solid }}
                  />
                  <span
                    className="absolute top-1.5 right-1.5 size-2.5 rounded-full opacity-40 sm:size-3.5"
                    style={{ backgroundColor: accent.solid }}
                  />
                  <span
                    className="absolute bottom-2 left-1.5 size-2 rounded-full opacity-35"
                    style={{ backgroundColor: accent.solid }}
                  />
                </span>
                <span className="min-w-0 flex-1 self-center py-0.5">
                  <span className="block text-[15px] font-extrabold leading-snug text-ink sm:text-[18px]">
                    {title}
                  </span>
                  {description ? (
                    <span className="mt-1 block text-[14px] leading-snug text-ink-muted sm:text-[15px]">
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
