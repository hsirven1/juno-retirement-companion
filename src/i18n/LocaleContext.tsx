import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import type { Locale } from './types'
import { DEFAULT_LOCALE, isLocale, LOCALE_BCP47 } from './types'
import { getMessages, type Messages } from './messages'
import { useApp } from '../context/useApp'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: Messages
  /** Alias used by chat / future AI layer */
  chatLocale: Locale
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * Reads/writes locale via App persistence.
 * Must be rendered inside AppProvider.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const { locale, setLocale: setAppLocale } = useApp()

  const setLocale = useCallback(
    (next: Locale) => {
      if (!isLocale(next)) return
      setAppLocale(next)
    },
    [setAppLocale],
  )

  useEffect(() => {
    document.documentElement.lang = LOCALE_BCP47[locale] ?? locale
  }, [locale])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      messages: getMessages(locale),
      chatLocale: locale,
    }),
    [locale, setLocale],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return ctx
}

/** Localized UI chrome (former `copy` object). */
export function useCopy(): Messages {
  return useLocale().messages
}

/** Safe messages lookup outside React (pass locale explicitly). */
export function messagesFor(locale: Locale | undefined): Messages {
  return getMessages(locale && isLocale(locale) ? locale : DEFAULT_LOCALE)
}
