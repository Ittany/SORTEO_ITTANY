import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useFetch — efecto secundario controlado.
 *
 * Puntos clave del paso 2:
 *  1. async/await DENTRO de useEffect (no se puede pasar una función async
 *     directamente al useEffect porque devolvería una Promise, no un cleanup).
 *  2. Array de dependencias explícito.
 *  3. Función de limpieza con AbortController → evita memory leaks y
 *     "setState en componente desmontado".
 */
export function useFetch(url, { enabled = true } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const abortRef = useRef(null)

  useEffect(() => {
    if (!enabled || !url) return

    const controller = new AbortController()
    abortRef.current = controller
    let alive = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`)
        const json = await res.json()
        if (alive) setData(json)
      } catch (err) {
        // AbortError es una cancelación esperada, NO un error real
        if (err.name === 'AbortError') return
        if (alive) setError(err)
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()

    // 🔒 LIMPIEZA
    return () => {
      alive = false
      controller.abort()
    }
  }, [url, enabled, reloadKey])

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  return { data, loading, error, refetch }
}