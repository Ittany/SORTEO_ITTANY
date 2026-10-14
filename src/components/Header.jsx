import { useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useRaffle } from '../context/RaffleContext'
import RenderBadge from './RenderBadge'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { participants, draws } = useRaffle()

  // useCallback: referencia estable → no rompe el memo de hijos
  const handleToggle = useCallback(() => toggleTheme(), [toggleTheme])

  return (
    <header className="header">
      <div>
        <h1>🎡 Ruleta de Sorteo</h1>
        <p className="header__sub">
          UNCP · Desarrollo de Aplicaciones Web · Semana 07 — Hooks
        </p>
      </div>

      <div className="header__meta">
        <span className="pill">🎱 {participants.length} pelotas</span>
        <span className="pill">🏆 {draws} sorteos</span>
        <button className="btn" onClick={handleToggle}>
          {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
        <RenderBadge label="Header" />
      </div>
    </header>
  )
}