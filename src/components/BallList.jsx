import { memo, useCallback, useMemo, useState } from 'react'
import { useRaffle } from '../context/RaffleContext'
import RenderBadge from './RenderBadge'

/* React.memo: solo se re-renderiza si cambian sus props.
   Gracias a useCallback en el padre, `onRemove` mantiene su referencia. */
const Ball = memo(function Ball({ participant, isWinner, onRemove }) {
  return (
    <li className={`ball ${isWinner ? 'ball--winner' : ''}`}>
      <span className="ball__number">{participant.number}</span>
      <span className="ball__name">{participant.name}</span>
      <button
        className="ball__remove"
        onClick={() => onRemove(participant.id)}
        aria-label={`Quitar ${participant.name}`}
      >
        ×
      </button>
      <RenderBadge label="Ball" />
    </li>
  )
})

export default function BallList() {
  const { participants, winners, removeParticipant } = useRaffle()
  const [query, setQuery] = useState('')

  // useMemo: derivado de winners. Solo se recalcula si winners cambia.
  const winnerIds = useMemo(() => new Set(winners.map((w) => w.id)), [winners])

  // useMemo: filtro. No se recalcula si query/participants no cambian.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return participants
    return participants.filter(
      (p) => p.name.toLowerCase().includes(q) || String(p.number).includes(q)
    )
  }, [participants, query])

  // useCallback: referencia estable para que React.memo funcione
  const handleRemove = useCallback((id) => removeParticipant(id), [removeParticipant])

  return (
    <section className="card">
      <h2>
        2 · Bombo ({participants.length})
        <RenderBadge label="BallList" />
      </h2>

      <input
        className="input"
        placeholder="🔍 Filtrar pelotas…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {participants.length === 0 ? (
        <p className="empty">El bombo está vacío. Agrega tu primera pelota ☝️</p>
      ) : visible.length === 0 ? (
        <p className="empty">Ninguna pelota coincide con “{query}”.</p>
      ) : (
        <ul className="ball-grid">
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