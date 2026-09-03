import type { ReactNode } from 'react'

/**
 * Renders copy with optional **highlight** segments in the journey accent.
 * Presentation-only — content strings stay in i18n / synthesis builders.
 */
export function HighlightedCopy({
  text,
  className,
  highlightClassName = 'font-bold',
  highlightColor = 'var(--journey-solid, var(--color-clay))',
}: {
  text: string
  className?: string
  highlightClassName?: string
  highlightColor?: string
}): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)
  if (parts.length === 1 && !parts[0].startsWith('**')) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span
              key={index}
              className={highlightClassName}
              style={{ color: highlightColor }}
            >
              {part.slice(2, -2)}
            </span>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </span>
  )
}
