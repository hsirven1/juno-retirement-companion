import { HashLink } from './HashLink'
import { Logo } from './Logo'
import { useApp } from '../context/useApp'
import { useNavigate } from 'react-router-dom'
import { useCopy, LanguageSelector } from '../i18n'

export function LandingHeader() {
  const { enterAsReturningUser } = useApp()
  const navigate = useNavigate()
  const copy = useCopy()

  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-6 px-6 py-6 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-6 sm:gap-8" aria-label={copy.nav.landing}>
          <HashLink href="#how-it-works">{copy.nav.howItWorks}</HashLink>
          <HashLink href="#about">{copy.nav.about}</HashLink>
          <LanguageSelector />
          <button
            type="button"
            className="cursor-pointer text-[16px] text-ink-muted transition-colors hover:text-ink"
            onClick={() => {
              enterAsReturningUser()
              void navigate('/home')
            }}
          >
            {copy.nav.signIn}
          </button>
        </nav>
      </div>
    </header>
  )
}
