import { useCallback } from 'react'
import RenderBadge from './RenderBadge'
import { useTheme } from '../hooks/useTheme'    
import { useRaffle } from '../hooks/useRaffle'  
/* Iconos SVG inline (sin emojis) */
const IconWheel = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
  </svg>
)

const IconBall = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
  </svg>
)

const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" />
  </svg>
)

const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
)

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { participants, draws } = useRaffle()

  const handleToggle = useCallback(() => toggleTheme(), [toggleTheme])

  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__icon" aria-hidden="true">
          <IconWheel />
        </span>
        <div>
          <h1 className="header__title">My Ruleta</h1>
          <p className="header__sub">
            UNCP · Desarrollo de Aplicaciones Web · Semana 07 — Hooks
          </p>
        </div>
      </div>

      <div className="header__meta">
        <span className="pill">
          <IconBall />
          <span>{participants.length} pelotas</span>
        </span>

        <span className="pill">
          <IconTrophy />
          <span>{draws} sorteos</span>
        </span>

        <button
          className="btn"
          onClick={handleToggle}
          type="button"
          aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
          <span>{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
        </button>

        <RenderBadge label="Header" />
      </div>
    </header>
  )
}