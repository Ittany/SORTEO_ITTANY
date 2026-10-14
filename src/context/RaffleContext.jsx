import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { useToast } from './ToastContext.jsx'

const RaffleContext = createContext(null)

const initialState = {
  participants: [],
  winners: [],
  winnersCount: 1,
  status: 'idle', // idle | spinning | done
  draws: 0,
}

function nextNumber(participants) {
  return participants.reduce((max, p) => Math.max(max, p.number), 0) + 1
}

/* ---------- useReducer: toda la lógica de estado en un solo lugar ---------- */
function raffleReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        participants: [...state.participants, action.payload],
        winners: [],
        status: 'idle',
      }

    case 'LOAD_MANY': {
      const merged = [...state.participants]
      for (const raw of action.payload) {
        const name = String(raw).trim()
        if (!name) continue
        if (merged.some((p) => p.name.toLowerCase() === name.toLowerCase())) continue
        merged.push({ id: crypto.randomUUID(), name, number: nextNumber(merged) })
      }
      return { ...state, participants: merged, winners: [], status: 'idle' }
    }

    case 'REMOVE':
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.payload),
        winners: state.winners.filter((w) => w.id !== action.payload),
      }

    case 'CLEAR':
      return { ...initialState, winnersCount: state.winnersCount }

    case 'SET_WINNERS_COUNT':
      return { ...state, winnersCount: action.payload }

    case 'START_DRAW':
      return { ...state, status: 'spinning', winners: [] }

    case 'SET_WINNERS':
      return { ...state, status: 'done', winners: action.payload, draws: state.draws + 1 }

    case 'RESET_DRAW':
      return { ...state, status: 'idle', winners: [] }

    default:
      return state
  }
}

export function RaffleProvider({ children }) {
  const [state, dispatch] = useReducer(raffleReducer, initialState)
  const { notify } = useToast()

  const timerRef = useRef(null)

  // Limpieza
  useEffect(() => () => clearTimeout(timerRef.current), [])

  const participants = state.participants

  /* acciones- */

  const addParticipant = useCallback(
    (raw) => {
      const value = String(raw ?? '').trim()

      if (!value) {
        notify('El campo está vacío: escribe un número (7) o un nombre (Ana).', 'error')
        return false
      }

      const isNumeric = /^\d+$/.test(value)

      if (isNumeric) {
        const number = Number(value)
        if (participants.some((p) => p.number === number)) {
          notify(`La pelota N.º ${number} ya está en el bombo.`, 'error')
          return false
        }
        dispatch({
          type: 'ADD',
          payload: { id: crypto.randomUUID(), name: `Pelota ${number}`, number },
        })
        notify(`Pelota N.º ${number} agregada al bombo.`, 'success')
        return true
      }

      if (participants.some((p) => p.name.toLowerCase() === value.toLowerCase())) {
        notify(`"${value}" ya participa en el sorteo.`, 'error')
        return false
      }

      const number = nextNumber(participants)
      dispatch({ type: 'ADD', payload: { id: crypto.randomUUID(), name: value, number } })
      notify(`${value} entra con la pelota N.º ${number}.`, 'success')
      return true
    },
    [participants, notify]
  )

  const loadMany = useCallback(
    (names) => {
      const clean = (names ?? []).map((n) => String(n).trim()).filter(Boolean)
      if (!clean.length) {
        notify('No hay nombres para importar.', 'error')
        return
      }
      dispatch({ type: 'LOAD_MANY', payload: clean })
      notify(`Se agregaron ${clean.length} participantes.`, 'success')
    },
    [notify]
  )

  const removeParticipant = useCallback(
    (id) => {
      dispatch({ type: 'REMOVE', payload: id })
      notify('Pelota retirada del bombo.', 'info', 2200)
    },
    [notify]
  )

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR' })
    notify('Bombo vaciado por completo.', 'info')
  }, [notify])

  const setWinnersCount = useCallback(
    (n) => {
      const value = Math.max(1, Number(n) || 1)
      dispatch({ type: 'SET_WINNERS_COUNT', payload: value })
    },
    []
  )

  const resetDraw = useCallback(() => dispatch({ type: 'RESET_DRAW' }), [])

  const drawWinners = useCallback(() => {
    if (state.status === 'spinning') return

    if (participants.length === 0) {
      notify('No hay pelotas en el bombo. Agrega participantes primero.', 'error')
      return
    }
    if (state.winnersCount > participants.length) {
      notify(
        `Solo hay ${participants.length} participantes para ${state.winnersCount} premios.`,
        'error'
      )
      return
    }

    dispatch({ type: 'START_DRAW' })

    const snapshot = participants
    const count = state.winnersCount

    timerRef.current = setTimeout(() => {
      const pool = [...snapshot]
      const picked = []
      for (let i = 0; i < count; i += 1) {
        const idx = Math.floor(Math.random() * pool.length)
        picked.push(pool.splice(idx, 1)[0])
      }
      dispatch({ type: 'SET_WINNERS', payload: picked })
      notify(`🎉 Ganadores: ${picked.map((p) => p.name).join(' · ')}`, 'success', 6000)
    }, 2400)
  }, [participants, state.status, state.winnersCount, notify])

  const value = useMemo(
    () => ({
      participants: state.participants,
      winners: state.winners,
      winnersCount: state.winnersCount,
      status: state.status,
      draws: state.draws,
      addParticipant,
      loadMany,
      removeParticipant,
      clearAll,
      setWinnersCount,
      drawWinners,
      resetDraw,
    }),
    [
      state,
      addParticipant,
      loadMany,
      removeParticipant,
      clearAll,
      setWinnersCount,
      drawWinners,
      resetDraw,
    ]
  )

  return <RaffleContext.Provider value={value}>{children}</RaffleContext.Provider>
}

export function useRaffle() {
  const ctx = useContext(RaffleContext)
  if (!ctx) throw new Error('useRaffle() debe usarse dentro de <RaffleProvider>')
  return ctx
}