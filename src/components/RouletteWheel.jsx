import { useRaffle } from '../hooks/useRaffle'
import RenderBadge from './RenderBadge'

export default function RouletteWheel() {
  const { status, winners } = useRaffle()
  const spinning = status === 'spinning'

  return (
    <section className="card card--wheel card--center">
      <header className="card__head card__head--center">
        <h2 className="card__title">La Ruleta</h2>
        <RenderBadge label="Wheel" />
      </header>

      <div className={`wheel ${spinning ? 'wheel--spinning' : ''}`}>
        {/* Indicador fijo en el borde superior */}
        <div className="wheel__indicator" aria-hidden="true" />
        <div className="wheel__ring" />
        <div className="wheel__center">
          {spinning ? 'Girando…' : winners.length ? '¡Listo!' : 'Listo'}
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