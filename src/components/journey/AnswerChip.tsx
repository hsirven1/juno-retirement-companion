import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

/** Compact follow-up pill / chip for short multi-select answers. */
export function AnswerChip({
  label,
  selected,
  onSelect,
  accent = 'var(--color-clay)',
  accentTint = '#FDF1EF',
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
        'inline-flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2.5 text-left text-[15px] transition-[border-color,background-color,transform] duration-150 sm:text-[16px]',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(225,80,58,0.35)] focus-visible:ring-offset-2',
        'active:scale-[0.985]',
        selected
          ? 'font-bold text-ink'
          : 'border-line-strong bg-paper font-semibold text-ink hover:border-[#DCD1C1] hover:bg-[#FDFBF7]',
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
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
          selected ? 'border-transparent' : 'border-line-strong',
        )}
        style={selected ? { backgroundColor: accent } : undefined}
      >
        {selected ? (
          <Check size={11} strokeWidth={3} className="text-white" />
        ) : null}
      </span>
      <span className="text-pretty">{label}</span>
    </button>
  )
}
