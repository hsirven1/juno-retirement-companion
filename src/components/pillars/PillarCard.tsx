import type { CSSProperties } from 'react'
import { PILLARS } from '../../data/pillars'
import { useCopy, useLocale } from '../../i18n'
import { cn } from '../../lib/cn'
import type { PillarId } from '../../types'
import { PillarGlyph } from './PillarGlyph'

/**
 * Signature pillar art: an oversized line pictogram cropped by the corner
 * of its container, over a soft disc. Purely decorative.
 */
export function PillarArt({
  id,
  className,
  size = 150,
  strokeWidth = 1.7,
  placement = 'corner',
}: {
  id: PillarId
  className?: string
  size?: number
  strokeWidth?: number
  placement?: 'corner' | 'center' | 'top'
}) {
  const pillar = PILLARS[id]
  const glyphPos =
    placement === 'center'
      ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      : placement === 'top'
        ? '-right-[6%] -top-[14%]'
        : '-right-[8%] -bottom-[16%]'
  const discPos =
    placement === 'center'
      ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
      : placement === 'top'
        ? '-right-[2%] -top-[18%]'
        : '-right-[4%] -bottom-[20%]'
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <span
        className={cn('absolute rounded-full', discPos)}
        style={{
          width: size * 0.92,
          height: size * 0.92,
          backgroundColor: `var(${pillar.theme.softVar})`,
          opacity: 0.55,
        }}
      />
      <PillarGlyph
        id={id}
        size={size}
        strokeWidth={strokeWidth}
        className={cn('absolute', glyphPos)}
        style={{ color: `var(${pillar.theme.solidVar})` }}
      />
    </div>
  )
}

/** Small glyph in a white disc — for headers, chips and compact rows. */
export function PillarBadge({
  id,
  size = 40,
  className,
}: {
  id: PillarId
  size?: number
  className?: string
}) {
  const pillar = PILLARS[id]
  return (
    <span
      aria-hidden="true"
      className={cn('flex shrink-0 items-center justify-center rounded-full bg-paper', className)}
      style={{ width: size, height: size, color: `var(${pillar.theme.inkVar})` }}
    >
      <PillarGlyph id={id} size={size * 0.56} strokeWidth={2.6} />
    </span>
  )
}

/** Bilan result tile: one pillar, one short personal insight. */
export function PillarInsightTile({
  id,
  insight,
  highlighted,
  className,
  style,
}: {
  id: PillarId
  insight: string
  highlighted?: boolean
  className?: string
  style?: CSSProperties
}) {
  const copy = useCopy()
  const { locale } = useLocale()
  const pillar = PILLARS[id]
  return (
    <li
      className={cn(
        'relative flex min-h-[180px] flex-col overflow-hidden rounded-[26px] p-5 sm:min-h-[230px] sm:p-6',
        className,
      )}
      style={{ backgroundColor: `var(${pillar.theme.tintVar})`, ...style }}
    >
      <PillarArt id={id} size={150} className="opacity-90" />
      <div className="relative flex items-center gap-2.5">
        <PillarBadge id={id} size={38} />
        <p
          className="text-[12.5px] font-extrabold tracking-[0.1em] uppercase"
          style={{ color: `var(${pillar.theme.inkVar})` }}
        >
          {pillar.title[locale]}
        </p>
      </div>
      <p className="relative mt-5 max-w-[15rem] font-display text-[21px] leading-[1.18] font-semibold tracking-[-0.015em] text-ink sm:text-[23px]">
        {insight}
      </p>
      {highlighted ? (
        <span
          className="relative mt-auto inline-flex w-fit rounded-full px-2.5 py-0.5 pt-1 text-[11.5px] font-extrabold text-[#FFFDF9]"
          style={{ backgroundColor: `var(${pillar.theme.inkVar})` }}
        >
          {copy.map.priorityBadge}
        </span>
      ) : null}
    </li>
  )
}

export function PillarTag({ id }: { id: PillarId }) {
  const { locale } = useLocale()
  const pillar = PILLARS[id]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.08em] uppercase"
      style={{ color: `var(${pillar.theme.inkVar})` }}
    >
      <PillarGlyph id={id} size={14} strokeWidth={3} aria-hidden="true" />
      {pillar.title[locale]}
    </span>
  )
}
