import { useRaffle } from '../context/RaffleContext'
import RenderBadge from './RenderBadge'

export default function RouletteWheel() {
  const { status, winners } = useRaffle()
  const spinning = status === 'spinning'

  return (
    <section className="card card--center">
      <h2>Ruleta <RenderBadge label="Wheel" /></h2>

      <div className={`wheel ${spinning ? 'wheel--spinning' : ''}`}>
        <div className="wheel__ring" />
        <div className="wheel__center">
          {spinning ? 'Girando…' : winners.length ? '🎉' : 'Listo'}
        </div>
      </div>

      <p className="wheel__caption">
        {spinning
          ? 'Mezclando pelotas…'
          : winners.length
          ? `${winners.length} ganador(es) seleccionado(s)`
          : 'Agrega pelotas y presiona ¡Sortear!'}
      </p>
    </section>
  )
}