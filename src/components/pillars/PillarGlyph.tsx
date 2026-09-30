import type { JSX, SVGProps } from 'react'
import type { PillarId } from '../../types'

export type GlyphProps = SVGProps<SVGSVGElement> & { size?: number | string }

function Svg({ size = 24, strokeWidth = 2.4, children, ...rest }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  )
}

/** Coins with a sprout — savings that keep growing. */
export function FinancialGlyph(props: GlyphProps) {
  return (
    <Svg {...props}>
      <ellipse data-draw pathLength={1} cx="19" cy="22" rx="11" ry="4" />
      <path data-draw pathLength={1} d="M8 22v12c0 2.2 4.9 4 11 4s11-1.8 11-4V22" />
      <path data-draw pathLength={1} d="M8 28c0 2.2 4.9 4 11 4s11-1.8 11-4" />
      <path data-draw pathLength={1} d="M37 30V15" />
      <path data-draw pathLength={1} d="M37 18c0-5 3.5-8.5 8-8.5 0 5-3.5 8.5-8 8.5Z" />
      <path data-draw pathLength={1} d="M37 22c0-3.6-2.6-6-6.5-6 0 3.6 2.6 6 6.5 6Z" />
    </Svg>
  )
}

/** Sun over the water — getting out, moving, swimming. */
export function HealthGlyph(props: GlyphProps) {
  return (
    <Svg {...props}>
      <path data-draw pathLength={1} d="M14 25a10 10 0 0 1 20 0" />
      <path data-draw pathLength={1} d="M24 6v4M10.5 11.5l2.8 2.8M37.5 11.5l-2.8 2.8M5 24h4M39 24h4" />
      <path data-draw pathLength={1} d="M5 32c3.2-3 6.3-3 9.5 0s6.3 3 9.5 0 6.3-3 9.5 0 6.3 3 9.5 0" />
      <path data-draw pathLength={1} d="M9 40c2.5-2.3 5-2.3 7.5 0s5 2.3 7.5 0 5-2.3 7.5 0 5 2.3 7.5 0" />
    </Svg>
  )
}

/** Two speech bubbles, one smiling — conversations and good company. */
export function SocialGlyph(props: GlyphProps) {
  return (
    <Svg {...props}>
      <path
        data-draw
        pathLength={1}
        d="M10 8h17a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H18l-7 6v-6h-1a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Z"
      />
      <path data-draw pathLength={1} d="M13.5 16.5c2.2 3 7.8 3 10 0" />
      <path
        data-draw
        pathLength={1}
        d="M35 17h3a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-1v6l-7-6h-8a4 4 0 0 1-4-4v-1"
      />
    </Svg>
  )
}

/** Paper plane with a looping trail — trips, ideas, new projects. */
export function ProjectsGlyph(props: GlyphProps) {
  return (
    <Svg {...props}>
      <path data-draw pathLength={1} d="M43 6 5 21l14 5 5 14L43 6Z" />
      <path data-draw pathLength={1} d="M19 26 43 6" />
      <path
        d="M15 33c-5 1.5-9.5 0-9.5-3.5 0-2.5 3-3.5 5-2"
        strokeDasharray="0.1 4.2"
        strokeWidth={props.strokeWidth ?? 2.4}
      />
    </Svg>
  )
}

export const PILLAR_GLYPHS: Record<PillarId, (props: GlyphProps) => JSX.Element> = {
  financial: FinancialGlyph,
  health: HealthGlyph,
  social: SocialGlyph,
  projects: ProjectsGlyph,
}

export function PillarGlyph({ id, ...props }: GlyphProps & { id: PillarId }) {
  const Glyph = PILLAR_GLYPHS[id]
  return <Glyph {...props} />
}
