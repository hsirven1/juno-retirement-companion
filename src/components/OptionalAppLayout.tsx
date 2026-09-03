import type { ReactNode } from 'react'
import { AppLayout } from './AppLayout'
import { useApp } from '../context/useApp'

export function OptionalAppLayout({ children }: { children: ReactNode }) {
  const { onboardingComplete } = useApp()

  if (onboardingComplete) {
    return <AppLayout>{children}</AppLayout>
  }

  return children
}
