import { useEffect, useRef } from 'react'
import { useRaffle } from '../hooks/useRaffle' 
import { useForm } from '../hooks/useForm'
import RenderBadge from './RenderBadge'

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />
  </svg>
)

export default function BallForm() {
  const { addParticipant, loadMany, participants } = useRaffle()
  const { values, errors, handleChange, reset, setFieldError } = useForm({ entry: '' })
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values.entry.trim()) {
      setFieldError('entry', 'Escribe un número (7) o un nombre (Ana).')
      inputRef.current?.focus()
      return
    }
    const ok = addParticipant(values.entry)
    if (ok) reset()
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  const quickAdd = () => {
    const base = participants.length
    loadMany(Array.from({ length: 5 }, (_, i) => `Invitado ${base + i + 1}`))
  }

  return (
    <section className="card card--ballform">
      <header className="card__head">
        <h2 className="card__title">1 · Agrega pelotas al bombo</h2>
        <RenderBadge label="BallForm" />
      </header>

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
        <button className="btn btn--primary" type="submit">
          <IconPlus /> Agregar
        </button>
        <button className="btn" type="button" onClick={quickAdd}>
          <IconBolt /> +5 rápido
        </button>
      </form>

      {errors.entry && <p className="field-error">{errors.entry}</p>}

      <p className="hint">
        Si escribes un <b>número</b>, se crea esa pelota exacta (y se rechaza si ya existe).
        Si escribes un <b>nombre</b>, se le asigna el siguiente número libre.
      </p>
    </section>
  )
}