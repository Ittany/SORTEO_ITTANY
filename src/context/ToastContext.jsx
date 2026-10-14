import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)

let seq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const notify = useCallback(
    (message, type = 'info', ttl = 3600) => {
      const id = ++seq
      setToasts((list) => [...list.slice(-4), { id, message, type }])
      timersRef.current.set(id, setTimeout(() => remove(id), ttl))
    },
    [remove]
  )

  // Limpieza global
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach(clearTimeout)
      timers.clear()
    }
  }, [])

  const value = useMemo(() => ({ toasts, notify, remove }), [toasts, notify, remove])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast() debe usarse dentro de <ToastProvider>')
  return ctx
}