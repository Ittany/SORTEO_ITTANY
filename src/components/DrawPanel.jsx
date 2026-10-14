import { useRaffle } from '../context/RaffleContext'
import RenderBadge from './RenderBadge'

export default function DrawPanel() {
  const { winnersCount, setWinnersCount, drawWinners, status, participants, clearAll } = useRaffle()
  const spinning = status === 'spinning'

  return (
    <section className="card">
      <h2>3 · Configura el sorteo <RenderBadge label="DrawPanel" /></h2>

      <label className="field">
        <span>🏆 Cantidad de ganadores</span>
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
        <button className="btn btn--primary btn--big" onClick={drawWinners} disabled={spinning}>
          {spinning ? '🎡 Girando…' : '🎲 ¡Sortear!'}
        </button>
        <button className="btn btn--danger" onClick={clearAll} disabled={spinning}>
          Vaciar bombo
        </button>
      </div>

      <p className="hint">
        Máximo permitido: {participants.length} participante(s).
      </p>
    </section>
  )
}