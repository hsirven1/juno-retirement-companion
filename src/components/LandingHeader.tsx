import { HashLink } from './HashLink'
import { Logo } from './Logo'
import { Container } from './Container'
import { useApp } from '../context/useApp'
import { useNavigate } from 'react-router-dom'
import { useCopy, LanguageSelector } from '../i18n'

export function LandingHeader() {
  const { enterAsReturningUser } = useApp()
  const navigate = useNavigate()
  const copy = useCopy()

  return (
    <header className="relative z-10">
      <Container
        width="wide"
        className="flex items-center justify-between gap-3 py-6 sm:gap-6"
      >
        <span className="sm:hidden">
          <Logo size="nav" />
        </span>
        <span className="hidden sm:block">
          <Logo size="landing" />
        </span>
        <nav
          className="flex items-center gap-3 sm:gap-8"
          aria-label={copy.nav.landing}
        >
          <span className="hidden sm:inline">
            <HashLink href="#how-it-works">{copy.nav.howItWorks}</HashLink>
          </span>
          <LanguageSelector />
          <button
            type="button"
            className="cursor-pointer text-[15px] text-ink-muted sm:text-[16px] transition-colors hover:text-ink"
            onClick={() => {
              enterAsReturningUser()
              void navigate('/home')
            }}
          >
            {copy.nav.signIn}
          </button>
        </nav>
      </Container>
    </header>
  )
}
