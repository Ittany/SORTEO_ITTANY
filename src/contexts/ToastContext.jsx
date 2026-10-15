import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const ToastContext = createContext(null)

let seq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const notify = useCallback((message, type = 'info', ttl = 3200) => {
    const id = ++seq
    setToasts((t) => [...t.slice(-4), { id, message, type }])
    timers.current.set(id, setTimeout(() => remove(id), ttl))
    return id
  }, [remove])

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach(clearTimeout)
      map.clear()
    }
  }, [])

  const value = useMemo(
    () => ({ toasts, notify, remove, addToast: notify, removeToast: remove }),
    [toasts, notify, remove]
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}