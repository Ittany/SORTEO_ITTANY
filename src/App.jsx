import { useState, useEffect, useMemo, useCallback, useRef, useReducer } from 'react'

/* paleta de colores */
const BALL_COLORS = [
  ['#ef4444', '#b91c1c'], ['#f59e0b', '#b45309'], ['#10b981', '#047857'],
  ['#3b82f6', '#1d4ed8'], ['#8b5cf6', '#6d28d9'], ['#ec4899', '#be185d'],
  ['#06b6d4', '#0e7490'], ['#f97316', '#c2410c'], ['#84cc16', '#4d7c0f'],
  ['#a855f7', '#7e22ce'],
]

const uid = () => Math.random().toString(36).slice(2) + Date.now()

/* reduce== */
const initialState = {
  participants: [],
  winners: [],
  winnersCount: 1,
  status: 'idle',
  draws: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, participants: [...state.participants, action.payload], winners: [] }
    case 'REMOVE':
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.payload),
        winners: state.winners.filter((w) => w.id !== action.payload),
      }
    case 'CLEAR':
      return { ...initialState, winnersCount: state.winnersCount, draws: state.draws }
    case 'SET_COUNT':
      return { ...state, winnersCount: Math.max(1, Number(action.payload) || 1) }
    case 'START':
      return { ...state, status: 'spinning', winners: [] }
    case 'SET_WINNERS':
      return { ...state, status: 'done', winners: action.payload, draws: state.draws + 1 }
    case 'RESET':
      return { ...state, status: 'idle', winners: [] }
    default:
      return state
  }
}

/* ============================================================
   RUEDA SVG — segmentos de colores con los números
   ============================================================ */
const WHEEL_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#a855f7',
]

function Wheel({ participants, spinning, rotation }) {
  const N = Math.max(participants.length, 1)
  const angle = 360 / N
  const cx = 150, cy = 150, R = 140

  const segments = useMemo(() => {
    if (participants.length === 0) return []
    return participants.map((p, i) => {
      const start = i * angle - 90
      const end = start + angle
      const sr = (start * Math.PI) / 180
      const er = (end * Math.PI) / 180
      const x1 = cx + R * Math.cos(sr)
      const y1 = cy + R * Math.sin(sr)
      const x2 = cx + R * Math.cos(er)
      const y2 = cy + R * Math.sin(er)
      const largeArc = angle > 180 ? 1 : 0
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`
      const mid = (start + end) / 2
      const midR = (mid * Math.PI) / 180
      const tx = cx + R * 0.72 * Math.cos(midR)
      const ty = cy + R * 0.72 * Math.sin(midR)
      return {
        d, tx, ty, mid, participant: p,
        color: WHEEL_COLORS[i % WHEEL_COLORS.length],
      }
    })
  }, [participants, angle])

  return (
    <div className={`wheel-wrap ${spinning ? 'wheel-wrap--spinning' : ''}`}>
      {/* Puntero superior */}
      <div className="wheel-pointer" />

      <svg viewBox="0 0 300 300" className="wheel-svg">
        <defs>
          <radialGradient id="hubGrad">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <filter id="wheelGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Aro exterior dorado */}
        <circle cx="150" cy="150" r="147" fill="#0a0e27" stroke="#fbbf24" strokeWidth="5" filter="url(#wheelGlow)" />

        {/* Rotor */}
        <g
          className="wheel-rotor"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '150px 150px' }}
        >
          {segments.length === 0 ? (
            <circle cx="150" cy="150" r={R} fill="#1e293b" stroke="#334155" strokeWidth="2" />
          ) : (
            segments.map((s) => (
              <g key={s.participant.id}>
                <path d={s.d} fill={s.color} stroke="#0a0e27" strokeWidth="1.5" />
                <text
                  x={s.tx}
                  y={s.ty}
                  fill="#ffffff"
                  fontSize={participants.length > 12 ? 9 : participants.length > 8 ? 11 : 14}
                  fontWeight="900"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${s.mid + 90} ${s.tx} ${s.ty})`}
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,.6)' }}
                >
                  {s.participant.number}
                </text>
              </g>
            ))
          )}
        </g>

        {/* Centro con brillo */}
        <circle cx="150" cy="150" r="26" fill="url(#hubGrad)" stroke="#0a0e27" strokeWidth="3" />
        <text x="150" y="150" fontSize="18" textAnchor="middle" dominantBaseline="middle">🎯</text>
      </svg>
    </div>
  )
}

/* ============================================================
   PELOTA 3D — círculo con brillo y sombra
   ============================================================ */
function Ball({ participant, isWinner, onRemove, index }) {
  const [c1, c2] = BALL_COLORS[index % BALL_COLORS.length]
  return (
    <div
      className={`ball-item ${isWinner ? 'ball-item--winner' : ''}`}
      style={{ '--c1': c1, '--c2': c2, animationDelay: `${(index % 6) * 0.15}s` }}
      title={`${participant.name} · Pelota ${participant.number}`}
    >
      <div className="ball-3d">
        <span className="ball-3d__num">{participant.number}</span>
        <span className="ball-3d__shine" />
      </div>
      <span className="ball-item__name">{participant.name}</span>
      <button className="ball-item__remove" onClick={() => onRemove(participant.id)} aria-label="Quitar">
        ×
      </button>
    </div>
  )
}

/* ============================================================
   PÁGINA DE INICIO
   ============================================================ */
function HomePage({ onStart, totalDraws, totalBalls }) {
  return (
    <div className="home">
      {/* Pelotas decorativas flotando */}
      <div className="home__deco">
        {[
          { n: 7, t: '8%', l: '8%', c: ['#ef4444', '#b91c1c'], d: '0s' },
          { n: 13, t: '22%', l: '82%', c: ['#3b82f6', '#1d4ed8'], d: '.6s' },
          { n: 27, t: '62%', l: '6%', c: ['#10b981', '#047857'], d: '1.2s' },
          { n: 39, t: '75%', l: '88%', c: ['#8b5cf6', '#6d28d9'], d: '.3s' },
          { n: 42, t: '12%', l: '48%', c: ['#f59e0b', '#b45309'], d: '.9s' },
        ].map((b) => (
          <div
            key={b.n}
            className="ball-float"
            style={{ top: b.t, left: b.l, '--c1': b.c[0], '--c2': b.c[1], animationDelay: b.d }}
          >
            <div className="ball-3d ball-3d--lg">
              <span className="ball-3d__num">{b.n}</span>
              <span className="ball-3d__shine" />
            </div>
          </div>
        ))}
      </div>

      <header className="home__nav">
        <div className="logo">
          <span className="logo__icon">🎡</span>
          <span className="logo__text">Sorteo<b>ITTANY</b></span>
        </div>
        <button className="btn btn--ghost" onClick={onStart}>Ingresar →</button>
      </header>

      <main className="home__hero">
        <span className="badge">✨ RULETA VIRTUAL · SIN REGISTRO</span>
        <h1 className="home__title">
          Gira, <span className="text-gold">sorteo</span> y gana
        </h1>
        <p className="home__sub">
          Agrega pelotas, define tus ganadores y deja que la ruleta decida por ti.
          Rápido, justo y muy divertido.
        </p>

        <button className="btn btn--gold btn--xl" onClick={onStart}>
          🎲 Comenzar sorteo
        </button>

        <div className="home__stats">
          <div className="stat-card">
            <span className="stat-card__num">{totalBalls}</span>
            <span className="stat-card__lbl">Pelotas totales</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__num">{totalDraws}</span>
            <span className="stat-card__lbl">Sorteos hechos</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__num">∞</span>
            <span className="stat-card__lbl">Diversión</span>
          </div>
        </div>
      </main>

      <footer className="home__footer">
        UNCP · Desarrollo de Aplicaciones Web · Semana 07 — React Hooks
      </footer>
    </div>
  )
}

/* ============================================================
   PÁGINA DEL JUEGO
   ============================================================ */
function GamePage({ state, dispatch, onHome }) {
  const [entry, setEntry] = useState('')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [rotation, setRotation] = useState(0)

  const inputRef = useRef(null)
  const timerRef = useRef(null)
  const toastTimerRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => () => {
    clearTimeout(timerRef.current)
    clearTimeout(toastTimerRef.current)
  }, [])

  const notify = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() })
    clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const add = useCallback(() => {
    const value = entry.trim()
    if (!value) { notify('Escribe un número o un nombre', 'error'); return }
    const isNum = /^\d+$/.test(value)

    if (isNum && state.participants.some((p) => p.number === Number(value))) {
      notify(`La pelota N.º ${value} ya está en el bombo`, 'error'); return
    }
    if (!isNum && state.participants.some((p) => p.name.toLowerCase() === value.toLowerCase())) {
      notify(`"${value}" ya participa`, 'error'); return
    }

    const number = isNum
      ? Number(value)
      : state.participants.reduce((m, p) => Math.max(m, p.number), 0) + 1

    dispatch({
      type: 'ADD',
      payload: { id: uid(), name: isNum ? `Pelota ${number}` : value, number },
    })
    notify(`✓ ${isNum ? `Pelota ${number}` : value} agregada`, 'success')
    setEntry('')
    inputRef.current?.focus()
  }, [entry, state.participants, dispatch, notify])

  const quickAdd = useCallback(() => {
    const base = state.participants.length
    for (let i = 1; i <= 5; i++) {
      const name = `Jugador ${base + i}`
      const num = state.participants.reduce((m, p) => Math.max(m, p.number), 0) + i
      dispatch({ type: 'ADD', payload: { id: uid(), name, number: num } })
    }
    notify('+5 jugadores agregados', 'success')
  }, [state.participants, dispatch, notify])

  const remove = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: id })
    notify('Pelota retirada', 'info')
  }, [dispatch, notify])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return state.participants
    return state.participants.filter(
      (p) => p.name.toLowerCase().includes(q) || String(p.number).includes(q)
    )
  }, [state.participants, query])

  const winnerIds = useMemo(() => new Set(state.winners.map((w) => w.id)), [state.winners])

  const draw = useCallback(() => {
    if (state.status === 'spinning') return
    if (state.participants.length === 0) { notify('El bombo está vacío', 'error'); return }
    if (state.winnersCount > state.participants.length) {
      notify(`Solo hay ${state.participants.length} participantes`, 'error'); return
    }

    dispatch({ type: 'START' })

    // Gira la rueda varias vueltas + ángulo aleatorio
    const extraSpins = 5 + Math.floor(Math.random() * 3)
    const randomAngle = Math.random() * 360
    setRotation((r) => r + extraSpins * 360 + randomAngle)

    timerRef.current = setTimeout(() => {
      const pool = [...state.participants]
      const picked = []
      for (let i = 0; i < state.winnersCount; i++) {
        const idx = Math.floor(Math.random() * pool.length)
        picked.push(pool.splice(idx, 1)[0])
      }
      dispatch({ type: 'SET_WINNERS', payload: picked })
      notify(`🎉 ${picked.map((p) => p.name).join(' · ')}`, 'success')
    }, 2600)
  }, [state, dispatch, notify])

  const spinning = state.status === 'spinning'

  return (
    <div className="game">
      <header className="game__nav">
        <div className="logo">
          <span className="logo__icon">🎡</span>
          <span className="logo__text">Sorteo<b>ITTANY</b></span>
        </div>
        <div className="game__nav-right">
          <span className="pill">🎱 {state.participants.length}</span>
          <span className="pill">🏆 {state.winners.length}</span>
          <button className="btn btn--ghost" onClick={onHome}>🏠 Inicio</button>
        </div>
      </header>

      <main className="game__grid">
        {/* Columna izquierda: agregar + bombo */}
        <section className="panel">
          <h2 className="panel__title">1 · Agrega pelotas</h2>

          <form className="row" onSubmit={(e) => { e.preventDefault(); add() }}>
            <input
              ref={inputRef}
              className="input"
              placeholder="N.º 7  ó  Ana"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              maxLength={20}
            />
            <button className="btn btn--gold" type="submit">+ Agregar</button>
          </form>

          <button className="btn btn--ghost btn--sm" onClick={quickAdd}>⚡ +5 rápido</button>

          <h2 className="panel__title" style={{ marginTop: 20 }}>
            2 · Bombo ({state.participants.length})
          </h2>

          <input
            className="input input--sm"
            placeholder="🔍 Filtrar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {state.participants.length === 0 ? (
            <p className="empty">El bombo está vacío. ¡Agrega tu primera pelota! ☝️</p>
          ) : visible.length === 0 ? (
            <p className="empty">Sin resultados para “{query}”.</p>
          ) : (
            <div className="ball-pit">
              {visible.map((p, i) => (
                <Ball
                  key={p.id}
                  participant={p}
                  isWinner={winnerIds.has(p.id)}
                  onRemove={remove}
                  index={state.participants.indexOf(p) < 0 ? i : state.participants.indexOf(p)}
                />
              ))}
            </div>
          )}

          {state.participants.length > 0 && (
            <button
              className="btn btn--danger btn--sm"
              onClick={() => { dispatch({ type: 'CLEAR' }); notify('Bombo vaciado', 'info') }}
              disabled={spinning}
              style={{ marginTop: 14 }}
            >
              🗑 Vaciar bombo
            </button>
          )}
        </section>

        {/* Columna centro: ruleta */}
        <section className="panel panel--wheel">
          <h2 className="panel__title" style={{ textAlign: 'center' }}>La Ruleta</h2>

          <Wheel
            participants={state.participants}
            spinning={spinning}
            rotation={rotation}
          />

          <div className="wheel-actions">
            <label className="field">
              <span>🏆 Ganadores</span>
              <input
                className="input input--sm"
                type="number"
                min={1}
                max={Math.max(1, state.participants.length)}
                value={state.winnersCount}
                onChange={(e) => dispatch({ type: 'SET_COUNT', payload: e.target.value })}
                disabled={spinning}
              />
            </label>

            <button
              className="btn btn--gold btn--lg"
              onClick={draw}
              disabled={spinning || state.participants.length === 0}
            >
              {spinning ? '🎡 Girando…' : '🎲 ¡SORTEAR!'}
            </button>
          </div>
        </section>

        {/* Columna derecha: ganadores */}
        <section className="panel">
          <h2 className="panel__title">🏅 Ganadores</h2>

          {state.winners.length === 0 ? (
            <p className="empty">
              {spinning
                ? '⏳ Girando la ruleta…'
                : 'Aún no hay ganadores. ¡Presiona SORTEAR!'}
            </p>
          ) : (
            <ol className="winners-list">
              {state.winners.map((w, i) => {
                const [c1, c2] = BALL_COLORS[(i + 3) % BALL_COLORS.length]
                return (
                  <li key={w.id} className="winner-row" style={{ '--c1': c1, '--c2': c2, animationDelay: `${i * 0.1}s` }}>
                    <span className="winner-row__pos">{i + 1}°</span>
                    <div className="ball-3d ball-3d--sm">
                      <span className="ball-3d__num">{w.number}</span>
                      <span className="ball-3d__shine" />
                    </div>
                    <span className="winner-row__name">{w.name}</span>
                  </li>
                )
              })}
            </ol>
          )}

          {state.winners.length > 0 && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => dispatch({ type: 'RESET' })}
              style={{ marginTop: 14 }}
            >
              Limpiar resultado
            </button>
          )}

          {state.draws > 0 && (
            <p className="hint" style={{ marginTop: 20 }}>
              Sorteos realizados: <b>{state.draws}</b>
            </p>
          )}
        </section>
      </main>

      {toast && (
        <div className="toast-host">
          <div className={`toast toast--${toast.type}`}>
            <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* app= */
export default function App() {
  const [view, setView] = useState('home')
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <>
      {view === 'home' ? (
        <HomePage
          onStart={() => setView('game')}
          totalDraws={state.draws}
          totalBalls={state.participants.length}
        />
      ) : (
        <GamePage state={state} dispatch={dispatch} onHome={() => setView('home')} />
      )}
    </>
  )
}