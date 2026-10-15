import { useRaffle } from '../hooks/useRaffle'
import { colorForNumber } from '../utils/ballColors'
import RenderBadge from './RenderBadge'

const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4v2a4 4 0 0 0 4 4M17 6h3v2a4 4 0 0 1-4 4" />
  </svg>
)

export default function WinnersPanel() {
  const { winners, status, resetDraw } = useRaffle()

  if (status !== 'done' || winners.length === 0) return null

  return (
    <section className="card card--winners">
      <header className="card__head">
        <h2 className="card__title"><IconTrophy /> Ganadores</h2>
        <RenderBadge label="Winners" />
      </header>

      <ol className="winners-list">
        {winners.map((w, i) => {
          const [c1, c2] = colorForNumber(w.number)
          return (
            <li key={w.id} className="winner-row">
              <span className="winner-row__pos">{i + 1}°</span>
              <div className="ball-3d ball-3d--sm" style={{ '--c1': c1, '--c2': c2 }}>
                <span className="ball-3d__num">{w.number}</span>
                <span className="ball-3d__shine" />
              </div>
              <span className="winner-row__name">{w.name}</span>
            </li>
          )
        })}
      </ol>

      <button className="btn" onClick={resetDraw}>Limpiar resultado</button>
    </section>
  )
}