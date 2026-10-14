import { useRaffle } from '../context/RaffleContext'
import RenderBadge from './RenderBadge'

export default function WinnersPanel() {
  const { winners, status, resetDraw } = useRaffle()

  if (status !== 'done' || winners.length === 0) return null

  return (
    <section className="card card--winners">
      <h2>🏅 Ganadores <RenderBadge label="Winners" /></h2>

      <ol className="winners">
        {winners.map((w, i) => (
          <li key={w.id}>
            <span className="winners__pos">{i + 1}°</span>
            <span className="winners__ball">{w.number}</span>
            <span className="winners__name">{w.name}</span>
          </li>
        ))}
      </ol>

      <button className="btn" onClick={resetDraw}>Limpiar resultado</button>
    </section>
  )
}