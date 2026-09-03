import type { JourneyScreenType } from '../types'

export type JourneyThemeTokens = {
  id: string
  solid: string
  tint: string
  ink: string
  solidVar: string
  tintVar: string
  inkVar: string
}

const THEME_MAP: Record<string, JourneyThemeTokens> = {
  social: {
    id: 'social',
    solid: '#d6455e',
    tint: '#fbe6e9',
    ink: '#a82b44',
    solidVar: '--theme-social-solid',
    tintVar: '--theme-social-tint',
    inkVar: '--theme-social-ink',
  },
  actif: {
    id: 'actif',
    solid: '#2f7d5b',
    tint: '#e1efe4',
    ink: '#216245',
    solidVar: '--theme-active-solid',
    tintVar: '--theme-active-tint',
    inkVar: '--theme-active-ink',
  },
  rythme: {
    id: 'rythme',
    solid: '#3563c9',
    tint: '#e3eaf8',
    ink: '#24499c',
    solidVar: '--theme-rythme-solid',
    tintVar: '--theme-rythme-tint',
    inkVar: '--theme-rythme-ink',
  },
  transmettre: {
    id: 'transmettre',
    solid: '#c98a16',
    tint: '#f7ebd8',
    ink: '#8a5d0a',
    solidVar: '--theme-contribute-solid',
    tintVar: '--theme-contribute-tint',
    inkVar: '--theme-contribute-ink',
  },
  envies: {
    id: 'envies',
    solid: '#6d4ac4',
    tint: '#ede4fa',
    ink: '#5b3fa8',
    solidVar: '--theme-learn-solid',
    tintVar: '--theme-learn-tint',
    inkVar: '--theme-learn-ink',
  },
  finances: {
    id: 'finances',
    solid: '#3563c9',
    tint: '#e3eaf8',
    ink: '#24499c',
    solidVar: '--theme-rythme-solid',
    tintVar: '--theme-rythme-tint',
    inkVar: '--theme-rythme-ink',
  },
}

export function getJourneyTheme(themeId: string): JourneyThemeTokens {
  return THEME_MAP[themeId] ?? THEME_MAP.social
}

/** Visual family for guided overlay chrome + panel background. */
export type JourneySurface =
  | 'theme' // A editorial — theme solid
  | 'tint' // B visual explanation
  | 'cream' // C quiz / F resource / G completion
  | 'soft' // D scenario
  | 'dark' // E insight / synthesis

export function getJourneyScreenSurface(
  type: JourneyScreenType,
): JourneySurface {
  switch (type) {
    case 'content':
      return 'theme'
    case 'timeline':
    case 'concepts':
      return 'tint'
    case 'scenario':
    case 'recommendation':
      return 'soft'
    case 'insight':
    case 'synthesis':
      return 'dark'
    case 'singleChoice':
    case 'multiChoice':
    case 'preference':
    case 'resourceSelection':
    case 'stepCompletion':
    default:
      return 'cream'
  }
}
