import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

/** Large selectable answer row for quiz screens. */
export function QuizOption({
  label,
  selected,
  onSelect,
  accent = 'var(--color-clay)',
  accentTint = 'var(--color-clay-tint)',
}: {
  label: string
  selected: boolean
  onSelect: () => void
  accent?: string
  accentTint?: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex w-full min-h-16 cursor-pointer items-start gap-4 rounded-[18px] border-2 px-5 py-4 text-left transition-colors',
        selected
          ? 'font-bold text-ink'
          : 'border-line bg-paper font-semibold text-ink hover:border-line-strong hover:bg-paper',
      )}
      style={
        selected
          ? {
              borderColor: accent,
              backgroundColor: accentTint,
            }
          : undefined
      }
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          selected ? 'border-transparent' : 'border-line-strong bg-transparent',
        )}
        style={selected ? { backgroundColor: accent } : undefined}
      >
        {selected ? (
          <Check size={14} strokeWidth={3} className="text-white" />
        ) : null}
      </span>
      <span className="text-[17px] leading-snug sm:text-[19px]">{label}</span>
    </button>
  )
}
