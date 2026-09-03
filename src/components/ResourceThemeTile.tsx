import { cn } from '../lib/cn'
import { useCopy } from '../i18n'
import type { ResourceRecommendation } from '../types'

const THEME_BY_ID: Array<{
  id: string
  solidVar: string
  tintVar: string
  inkVar: string
}> = [
  {
    id: 'social',
    solidVar: '--theme-social-solid',
    tintVar: '--theme-social-tint',
    inkVar: '--theme-social-ink',
  },
  {
    id: 'active',
    solidVar: '--theme-active-solid',
    tintVar: '--theme-active-tint',
    inkVar: '--theme-active-ink',
  },
  {
    id: 'new_rhythm',
    solidVar: '--theme-rythme-solid',
    tintVar: '--theme-rythme-tint',
    inkVar: '--theme-rythme-ink',
  },
  {
    id: 'learn',
    solidVar: '--theme-learn-solid',
    tintVar: '--theme-learn-tint',
    inkVar: '--theme-learn-ink',
  },
  {
    id: 'travel',
    solidVar: '--theme-learn-solid',
    tintVar: '--theme-learn-tint',
    inkVar: '--theme-learn-ink',
  },
  {
    id: 'contribute',
    solidVar: '--theme-contribute-solid',
    tintVar: '--theme-contribute-tint',
    inkVar: '--theme-contribute-ink',
  },
]

function getFirstSupportedTheme(resource: ResourceRecommendation) {
  const themes = new Set(resource.themeIds ?? [])
  for (const candidate of THEME_BY_ID) {
    if (themes.has(candidate.id)) return candidate
  }
  return THEME_BY_ID[0]
}

export function ResourceThemeTile({
  item,
  onOpen,
  className,
}: {
  item: ResourceRecommendation
  onOpen: (item: ResourceRecommendation) => void
  className?: string
}) {
  const theme = getFirstSupportedTheme(item)
  const copy = useCopy()

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={cn(
        'group flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-line bg-paper p-5 text-left transition-transform hover:-translate-y-[2px]',
        className,
      )}
      style={{
        backgroundColor: `var(${theme.tintVar})`,
      }}
    >
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-[18px]"
        style={{
          backgroundColor: `color-mix(in srgb, var(${theme.tintVar}) 85%, white 15%)`,
        }}
      >
        {/* Abstract “media” placeholder (no exported assets). */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 25% 80%, rgba(0,0,0,0.05), transparent 55%), radial-gradient(circle at 80% 30%, rgba(0,0,0,0.06), transparent 55%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-8 top-7 size-28 rounded-full opacity-25"
          style={{ backgroundColor: `var(${theme.solidVar})` }}
        />
        <div
          aria-hidden="true"
          className="absolute right-6 top-10 size-20 rounded-full opacity-25"
          style={{ backgroundColor: `var(${theme.solidVar})` }}
        />
      </div>

      <p
        className="mt-4 text-[12px] font-[800] uppercase tracking-[0.11em]"
        style={{ color: `var(${theme.inkVar})` }}
      >
        {item.categoryLabel}
      </p>

      <h3 className="mt-2 font-display text-[20px] font-[800] leading-snug text-ink">
        {item.title}
      </h3>

      <p className="mt-1 text-[14px] leading-snug text-ink-muted">{item.metadata}</p>
      <p className="mt-3 flex-1 text-[14px] leading-snug text-ink-muted">
        {item.homeSnippet}
      </p>

      <div className="mt-4">
        <span
          className="inline-flex items-center justify-center rounded-full bg-paper px-5 py-2 text-[14px] font-medium transition-colors group-hover:bg-cream-deep"
          style={{ color: 'var(--color-clay-deep)' }}
        >
          {copy.home.discover} <span aria-hidden="true">→</span>
        </span>
      </div>
    </button>
  )
}

