import {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from 'react'

const uid = () => Math.random().toString(36).slice(2) + Date.now()

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
    case 'ADD_MANY':
      return { ...state, participants: [...state.participants, ...action.payload], winners: [] }
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
      return {
        ...state,
        status: 'done',
        winners: action.payload,
        draws: state.draws + 1,
      }
    case 'RESET':
      return { ...state, status: 'idle', winners: [] }
    default:
      return state
  }
}

export const RaffleContext = createContext(null)

export function RaffleProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  const addParticipant = useCallback((raw) => {
    const value = String(raw ?? '').trim()
    if (!value) return false
    const current = stateRef.current.participants
    const isNum = /^\d+$/.test(value)

    if (isNum && current.some((p) => p.number === Number(value))) return false
    if (!isNum && current.some((p) => p.name.toLowerCase() === value.toLowerCase())) return false

    const number = isNum
      ? Number(value)
      : current.reduce((m, p) => Math.max(m, p.number), 0) + 1

    dispatch({
      type: 'ADD',
      payload: { id: uid(), name: isNum ? `Pelota ${number}` : value, number },
    })
    return true
  }, [])

  const loadMany = useCallback((list) => {
    const current = stateRef.current.participants
    const base = current.length
    const nuevos = list.map((raw, i) => {
      const value = String(raw ?? '').trim() || `Invitado ${base + i + 1}`
      const isNum = /^\d+$/.test(value)
      const number = isNum
        ? Number(value)
        : current.reduce((m, p) => Math.max(m, p.number), 0) + i + 1
      return { id: uid(), name: isNum ? `Pelota ${number}` : value, number }
    })
    dispatch({ type: 'ADD_MANY', payload: nuevos })
  }, [])

  const removeParticipant = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), [])
  const clearAll = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const setWinnersCount = useCallback((n) => dispatch({ type: 'SET_COUNT', payload: n }), [])

  const drawWinners = useCallback(() => {
    const snap = stateRef.current
    if (snap.status === 'spinning') return
    if (snap.participants.length === 0) return

    dispatch({ type: 'START' })

    const pool = [...snap.participants]
    const count = Math.min(snap.winnersCount, pool.length)
    const picked = []
    for (let i = 0; i < count; i += 1) {
      const idx = Math.floor(Math.random() * pool.length)
      picked.push(pool.splice(idx, 1)[0])
    }

    setTimeout(() => {
      dispatch({ type: 'SET_WINNERS', payload: picked })
    }, 2600)
  }, [])

  const resetDraw = useCallback(() => dispatch({ type: 'RESET' }), [])

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
      dispatch,
    }),
    [state, addParticipant, loadMany, removeParticipant, clearAll, setWinnersCount, drawWinners, resetDraw]
  )

  return (
    <RaffleContext.Provider value={value}>
      {children}
    </RaffleContext.Provider>
  )
}