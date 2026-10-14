import { useEffect, useRef } from 'react'
import { useRaffle } from '../context/RaffleContext'
import { useForm } from '../hooks/useForm'
import RenderBadge from './RenderBadge'

export default function BallForm() {
  const { addParticipant, loadMany, participants } = useRaffle()
  const { values, errors, handleChange, reset, setFieldError } = useForm({ entry: '' })

  // useRef → accedemos al nodo DOM sin guardarlo en estado.
  // Si esto fuera useState, cada focus provocaría un re-render.
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!values.entry.trim()) {
      setFieldError('entry', 'Escribe un número (7) o un nombre (Ana).')
      inputRef.current?.focus()
      return
    }

    const ok = addParticipant(values.entry)
    if (ok) reset()

    // Foco inmediato SIN re-render adicional
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  // Demostración de batch update: 5 pelotas en un solo commit
  const quickAdd = () => {
    const base = participants.length
    loadMany(Array.from({ length: 5 }, (_, i) => `Invitado ${base + i + 1}`))
  }

  return (
    <section className="card">
      <h2>1 · Agrega pelotas al bombo <RenderBadge label="BallForm" /></h2>

      <form className="row" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          name="entry"
          value={values.entry}
          onChange={handleChange}
          placeholder="N.º 7  ó  Ana"
          autoComplete="off"
          className={errors.entry ? 'input input--error' : 'input'}
        />
        <button className="btn btn--primary" type="submit">+ Agregar</button>
        <button className="btn" type="button" onClick={quickAdd}>+5 rápido</button>
      </form>

      {errors.entry && <p className="field-error">{errors.entry}</p>}

      <p className="hint">
        Si escribes un <b>número</b>, se crea esa pelota exacta (y se rechaza si ya existe).
        Si escribes un <b>nombre</b>, se le asigna el siguiente número libre.
      </p>
    </section>
  )
}