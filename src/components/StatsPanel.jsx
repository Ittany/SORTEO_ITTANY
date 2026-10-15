import { useMemo, useState } from 'react'
import { useRaffle } from '../hooks/useRaffle'
import RenderBadge from './RenderBadge'

const ITERACIONES = 4_000_000

const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="M3 3v18h18" />
    <path d="M7 15V9M12 15V5M17 15v-7" />
  </svg>
)

export default function StatsPanel() {
  const { participants, winnersCount } = useRaffle()
  const [heavy, setHeavy] = useState(false)
  const [broken, setBroken] = useState(false)

  const stats = useMemo(() => {
    const total = participants.length
    const prob = total > 0 ? Math.min(1, winnersCount / total) : 0
    const sum = participants.reduce((acc, p) => acc + p.number, 0)
    return { total, prob, sum, avg: total ? sum / total : 0 }
  }, [participants, winnersCount])

  const heavyResult = useMemo(() => {
    if (!heavy) return null
    const t0 = performance.now()
    let acc = 0
    for (let i = 0; i < ITERACIONES; i += 1) acc += Math.sqrt(i)
    return { ms: performance.now() - t0, sample: acc.toFixed(2) }
  }, [heavy, participants.length])

  if (broken) throw new Error('Error de prueba lanzado desde StatsPanel')

  return (
    <section className="card card--stats">
      <header className="card__head">
        <h2 className="card__title">
          <IconChart /> Métricas del bombo
        </h2>
        <RenderBadge label="Stats" />
      </header>

      <div className="grid-4">
        <div className="metric"><span>Pelotas</span><b>{stats.total}</b></div>
        <div className="metric"><span>Premios</span><b>{winnersCount}</b></div>
        <div className="metric"><span>Prob. ganar</span><b>{(stats.prob * 100).toFixed(1)}%</b></div>
        <div className="metric"><span>N.º promedio</span><b>{stats.avg.toFixed(1)}</b></div>
      </div>

      <label className="check">
        <input
          type="checkbox"
          checked={heavy}
          onChange={(e) => setHeavy(e.target.checked)}
        />
        Activar cálculo pesado ({ITERACIONES.toLocaleString('es-PE')} iteraciones)
      </label>

      {heavyResult && (
        <p className="hint">
          Último cálculo: <b>{heavyResult.ms.toFixed(1)} ms</b> · muestra {heavyResult.sample}
          <br />
          Agrega una pelota y verás que se recalcula. Cambia el tema o escribe en el filtro y
          verás que <b>NO</b> se recalcula.
        </p>
      )}

      <button
        className="btn btn--ghost"
        type="button"
        onClick={() => setBroken(true)}
      >
        Probar ErrorBoundary
      </button>
    </section>
  )
}