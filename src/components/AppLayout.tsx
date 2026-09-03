import { NavLink, Outlet } from 'react-router-dom'
import { Compass, House, Map, Search } from 'lucide-react'
import { Logo } from './Logo'
import { JunoChatOverlay } from './JunoChatOverlay'
import { GuidedThemeOverlay } from './GuidedThemeOverlay'
import { useApp } from '../context/useApp'
import { cn } from '../lib/cn'
import { useCopy, LanguageSelector } from '../i18n'
import type { ReactNode } from 'react'

export function AppLayout({ children }: { children?: ReactNode }) {
  const { openChat, chatOpen, guidedThemeOpen } = useApp()
  const copy = useCopy()

  const links = [
    {
      to: '/home',
      label: copy.nav.home,
      shortLabel: copy.nav.home,
      icon: House,
    },
    {
      to: '/plan',
      label: copy.nav.plan,
      shortLabel: copy.nav.planShort,
      icon: Map,
    },
    {
      to: '/discover',
      label: copy.nav.discover,
      shortLabel: copy.nav.discoverShort,
      icon: Search,
    },
    {
      to: '/profile',
      label: copy.nav.profile,
      shortLabel: copy.nav.profileShort,
      icon: Compass,
    },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <header className="border-b border-line bg-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-8 px-6 py-5 sm:px-8">
          <Logo to="/home" />
          <LanguageSelector className="md:hidden" />
          <nav className="hidden items-center gap-8 md:flex" aria-label={copy.nav.main}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'text-[17px] transition-colors hover:text-ink',
                    isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <LanguageSelector />
            <button
              type="button"
              onClick={() => openChat()}
              className="cursor-pointer rounded-md border border-line-strong px-4 py-2 text-[15px] text-ink transition-colors hover:border-ink/40 hover:bg-paper"
            >
              {copy.nav.talkToJuno}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-28 md:pb-20">
        {children ?? <Outlet />}
      </main>

      {!chatOpen && !guidedThemeOpen ? (
        <button
          type="button"
          onClick={() => openChat()}
          className="fixed right-4 bottom-[5.5rem] z-30 inline-flex min-h-11 cursor-pointer items-center rounded-full bg-clay px-4 text-[14px] font-medium text-cream shadow-[0_12px_30px_-12px_rgba(36,31,26,0.45)] transition-colors hover:bg-clay-deep md:right-5 md:bottom-8 md:min-h-12 md:px-5 md:text-[15px]"
        >
          {copy.nav.talkToJuno}
        </button>
      ) : null}

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label={copy.nav.mobile}
      >
        <ul className="grid grid-cols-4">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[12px] tracking-[0.01em]',
                      isActive ? 'text-ink' : 'text-ink-muted',
                    )
                  }
                >
                  <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                  {link.shortLabel}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <JunoChatOverlay />
      <GuidedThemeOverlay />
    </div>
  )
}
