import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'

/** Large selectable answer row — selection must be unmistakable. */
export function QuizOption({
  label,
  selected,
  onSelect,
  accent = 'var(--color-clay)',
  accentTint = '#FDF1EF',
  multi = false,
}: {
  label: string
  selected: boolean
  onSelect: () => void
  accent?: string
  accentTint?: string
  /** When true, uses checkbox semantics visually (square-ish feel via check). */
  multi?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      role={multi ? 'checkbox' : 'radio'}
      aria-checked={selected}
      className={cn(
        'group flex w-full min-h-[64px] cursor-pointer items-center gap-3.5 rounded-[18px] border-2 px-4 py-3.5 text-left transition-[border-color,background-color,transform,box-shadow] duration-150 sm:gap-4 sm:px-5 sm:py-4',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[rgba(225,80,58,0.35)] focus-visible:ring-offset-2',
        'active:scale-[0.99]',
        selected
          ? 'font-bold text-ink shadow-[0_1px_0_rgba(34,28,24,0.04)]'
          : 'border-line bg-paper font-semibold text-ink hover:border-[#DCD1C1] hover:bg-[#FDFBF7]',
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
          'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150',
          selected
            ? 'border-transparent'
            : 'border-line-strong bg-transparent group-hover:border-[#B9AB9C]',
        )}
        style={selected ? { backgroundColor: accent } : undefined}
      >
        {selected ? (
          <Check size={14} strokeWidth={3} className="text-white" />
        ) : null}
      </span>
      <span className="min-w-0 flex-1 text-[16px] leading-snug sm:text-[18px]">
        {label}
      </span>
    </button>
  )
}
