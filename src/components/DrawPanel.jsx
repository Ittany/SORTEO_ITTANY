import { useRaffle } from '../hooks/useRaffle'
import RenderBadge from './RenderBadge'

const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" />
  </svg>
)

const IconDice = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="16" cy="8" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="8" cy="16" r="1" fill="currentColor" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
  </svg>
)

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
  </svg>
)

export default function DrawPanel() {
  const {
    winnersCount,
    setWinnersCount,
    drawWinners,
    status,
    participants,
    clearAll,
  } = useRaffle()
  const spinning = status === 'spinning'

  return (
    <section className="card card--draw">
      <header className="card__head">
        <h2 className="card__title">3 · Configura el sorteo</h2>
        <RenderBadge label="DrawPanel" />
      </header>

      <label className="field">
        <span><IconTrophy /> Cantidad de ganadores</span>
        <input
          className="input"
          type="number"
          min={1}
          max={Math.max(1, participants.length)}
          value={winnersCount}
          onChange={(e) => setWinnersCount(e.target.value)}
          disabled={spinning}
        />
      </label>

      <div className="row">
        <button
          className="btn btn--primary btn--big"
          onClick={drawWinners}
          disabled={spinning || participants.length === 0}
          type="button"
        >
          <IconDice /> {spinning ? 'Girando…' : '¡Sortear!'}
        </button>
        <button
          className="btn btn--danger"
          onClick={clearAll}
          disabled={spinning}
          type="button"
        >
          <IconTrash /> Vaciar bombo
        </button>
      </div>

      <p className="hint">
        Máximo permitido: {participants.length} participante(s).
      </p>
    </section>
  )
}