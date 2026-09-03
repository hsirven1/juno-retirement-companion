import { messages as fr } from './fr'
import { messages as en } from './en'
import type { Locale } from '../types'
import { DEFAULT_LOCALE } from '../types'

export type Messages = typeof fr

/** Same shape as `Messages`, but with literal string values widened. */
type SameShape<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends (...args: infer A) => infer R
        ? (...args: A) => SameShape<R>
        : T extends readonly (infer U)[]
          ? readonly SameShape<U>[]
          : { readonly [K in keyof T]: SameShape<T[K]> }

/** Every catalog must mirror the French one, key for key. */
const enShapeCheck: SameShape<Messages> = en
void enShapeCheck

const catalogs: Record<Locale, Messages> = {
  fr,
  en: en as unknown as Messages,
}

export function getMessages(locale: Locale = DEFAULT_LOCALE): Messages {
  return catalogs[locale] ?? catalogs[DEFAULT_LOCALE]
}
