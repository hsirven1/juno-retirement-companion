import { cn } from '../lib/cn'

interface OptionButtonProps {
  label: string
  selected: boolean
  onSelect: () => void
  align?: 'left' | 'center'
}

export function OptionButton({
  label,
  selected,
  onSelect,
  align = 'left',
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'w-full min-h-14 cursor-pointer rounded-md border px-5 py-3.5 text-[18px] leading-snug transition-colors duration-150',
        align === 'center' ? 'text-center' : 'text-left',
        selected
          ? 'border-ink bg-ink text-cream'
          : 'border-line-strong bg-paper text-ink hover:border-ink/50 hover:bg-cream-deep',
      )}
    >
      {label}
    </button>
  )
}

export function OptionChip({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'min-h-12 cursor-pointer rounded-md border px-4 py-3 text-left text-[17px] leading-snug transition-colors duration-150',
        selected
          ? 'border-ink bg-ink text-cream'
          : 'border-line-strong bg-paper text-ink hover:border-ink/50 hover:bg-cream-deep',
      )}
    >
      {label}
    </button>
  )
}
