import { memo, useCallback, useMemo, useState } from 'react'
import { useRaffle } from '../hooks/useRaffle'
import { colorForNumber } from '../utils/ballColors'
import RenderBadge from './RenderBadge'

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
       strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const Ball = memo(function Ball({ participant, isWinner, onRemove }) {
  const [c1, c2] = colorForNumber(participant.number)
  return (
    <li className={`ball-item ${isWinner ? 'ball-item--winner' : ''}`}>
      <div className="ball-3d" style={{ '--c1': c1, '--c2': c2 }}>
        <span className="ball-3d__num">{participant.number}</span>
        <span className="ball-3d__shine" />
      </div>
      <span className="ball-item__name">{participant.name}</span>
      <button
        className="ball-item__remove"
        onClick={() => onRemove(participant.id)}
        aria-label={`Quitar ${participant.name}`}
      >
        <IconX />
      </button>
    </li>
  )
})

export default function BallList() {
  const { participants, winners, removeParticipant } = useRaffle()
  const [query, setQuery] = useState('')

  const winnerIds = useMemo(() => new Set(winners.map((w) => w.id)), [winners])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return participants
    return participants.filter(
      (p) => p.name.toLowerCase().includes(q) || String(p.number).includes(q)
    )
  }, [participants, query])

  const handleRemove = useCallback((id) => removeParticipant(id), [removeParticipant])

  return (
    <section className="card card--balllist">
      <header className="card__head">
        <h2 className="card__title">2 · Bombo ({participants.length})</h2>
        <RenderBadge label="BallList" />
      </header>

      <div className="search">
        <span className="search__icon" aria-hidden="true"><IconSearch /></span>
        <input
          className="input"
          placeholder="Filtrar pelotas..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {participants.length === 0 ? (
        <p className="empty">El bombo está vacío. Agrega tu primera pelota.</p>
      ) : visible.length === 0 ? (
        <p className="empty">Sin resultados para «{query}».</p>
      ) : (
        <ul className="ball-pit">
          {visible.map((p) => (
            <Ball
              key={p.id}
              participant={p}
              isWinner={winnerIds.has(p.id)}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}
    </section>
  )
}