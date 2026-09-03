export type Locale = 'fr' | 'en'

export const LOCALES: Locale[] = ['fr', 'en']

export const DEFAULT_LOCALE: Locale = 'fr'

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
}

export const LOCALE_SHORT: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
}

/** BCP 47 tags for Intl date/number formatting */
export const LOCALE_BCP47: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-US',
}

export function isLocale(value: unknown): value is Locale {
  return value === 'fr' || value === 'en'
}
