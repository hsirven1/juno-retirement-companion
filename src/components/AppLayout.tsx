import { NavLink, Outlet, Link } from 'react-router-dom'
import { Compass, House, UserRound } from 'lucide-react'
import { Logo } from './Logo'
import { JunoChatOverlay } from './JunoChatOverlay'
import { GuidedThemeOverlay } from './GuidedThemeOverlay'
import { useApp } from '../context/useApp'
import { cn } from '../lib/cn'
import { useCopy, LanguageSelector } from '../i18n'
import type { ReactNode } from 'react'

export function AppLayout({ children }: { children?: ReactNode }) {
  const { profile } = useApp()
  const copy = useCopy()

  const links = [
    {
      to: '/home',
      label: copy.nav.home,
      shortLabel: copy.nav.home,
      icon: House,
    },
    {
      to: '/discover',
      label: copy.nav.discover,
      shortLabel: copy.nav.discoverShort,
      icon: Compass,
    },
    {
      to: '/profile',
      label: copy.nav.profile,
      shortLabel: copy.nav.profileShort,
      icon: UserRound,
    },
  ]

  const initials = (profile.firstName || 'HR')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-[14px]">
        <div className="mx-auto flex h-[76px] max-w-[1240px] items-center gap-6 px-5 sm:px-8 lg:px-9">
          <Logo to="/home" size="nav" className="shrink-0" />

          <nav
            className="hidden min-w-0 flex-1 items-center gap-1.5 md:flex"
            aria-label={copy.nav.main}
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-[16px] transition-colors duration-[160ms]',
                    isActive
                      ? 'bg-clay-tint font-bold text-clay-ink'
                      : 'font-semibold text-ink-muted hover:text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <Link
              to="/profile"
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#E3D6C6] bg-[#EFE4D6] text-[14px] font-[800] text-[#6B5F54] transition-colors hover:bg-cream-deep"
              aria-label={copy.nav.profile}
            >
              {initials}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-28 md:pb-20">
        {children ?? <Outlet />}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/94 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label={copy.nav.mobile}
      >
        <ul className="grid grid-cols-3">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[12px] font-bold tracking-[0.01em]',
                      isActive ? 'text-clay-ink' : 'text-ink-muted',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={22}
                        strokeWidth={isActive ? 2.2 : 1.6}
                        aria-hidden="true"
                        className={isActive ? 'text-clay' : undefined}
                      />
                      {link.shortLabel}
                    </>
                  )}
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
