import { cn } from '../lib/cn'
import { useLocale } from '../i18n'
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT, type Locale } from '../i18n'

export function LanguageSelector({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const { locale, setLocale } = useLocale()

  if (compact) {
    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <p className="text-[12px] font-medium tracking-[0.08em] text-ink-soft uppercase">
          {locale === 'fr' ? 'Langue' : 'Language'}
        </p>
        <div className="flex gap-2">
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={cn(
                'cursor-pointer rounded-md px-3 py-1.5 text-[14px] transition-colors',
                locale === code
                  ? 'bg-ink text-cream'
                  : 'text-ink-muted hover:bg-paper hover:text-ink',
              )}
              aria-pressed={locale === code}
            >
              {LOCALE_LABELS[code]}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 text-[14px] tracking-[0.04em]',
        className,
      )}
      role="group"
      aria-label={locale === 'fr' ? 'Langue' : 'Language'}
    >
      {LOCALES.map((code: Locale, index) => (
        <span key={code} className="inline-flex items-center gap-1">
          {index > 0 ? (
            <span className="text-ink-soft" aria-hidden="true">
              |
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              'cursor-pointer rounded px-1.5 py-0.5 transition-colors',
              locale === code
                ? 'font-medium text-ink'
                : 'text-ink-muted hover:text-ink',
            )}
            aria-pressed={locale === code}
            aria-label={LOCALE_LABELS[code]}
          >
            {LOCALE_SHORT[code]}
          </button>
        </span>
      ))}
    </div>
  )
}
