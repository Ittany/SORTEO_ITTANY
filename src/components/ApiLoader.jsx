import { useEffect, useRef, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useRaffle } from '../contexts/RaffleContext'
import { useToast } from '../contexts/ToastContext'
import RenderBadge from './RenderBadge'

const URL_EJEMPLO = 'https://jsonplaceholder.typicode.com/users'

export default function ApiLoader() {
  const { loadMany } = useRaffle()
  const { notify } = useToast()
  const [enabled, setEnabled] = useState(false)

  const { data, loading, error, refetch } = useFetch(URL_EJEMPLO, { enabled })

  // useRef: guarda el último payload procesado.
  // Evita que el doble-effect de StrictMode importe los datos 2 veces.
  const processedRef = useRef(null)

  useEffect(() => {
    if (!data || processedRef.current === data) return
    processedRef.current = data

    const names = data.map((u) => u.name)
    loadMany(names)
    notify(`${names.length} participantes importados desde la API.`, 'success')
    setEnabled(false)
  }, [data, loadMany, notify])

  return (
    <section className="card">
      <h2>🌐 Importar desde API <RenderBadge label="ApiLoader" /></h2>

      <p className="hint">
        <code>useFetch</code> usa <b>async/await</b> dentro de <code>useEffect</code>,
        array de dependencias y <b>AbortController</b> en la limpieza.
        Abre <b>DevTools → Network</b>: en StrictMode verás la petición cancelarse
        y repetirse (doble montaje en desarrollo).
      </p>

      <div className="row">
        <button
          className="btn btn--primary"
          onClick={() => setEnabled(true)}
          disabled={loading}
        >
          {loading ? '⏳ Cargando…' : '⬇️ Importar 10 participantes'}
        </button>

        {error && (
          <button className="btn" onClick={refetch}>🔄 Reintentar</button>
        )}
      </div>

      {error && (
        <p className="field-error">
          Error al consultar la API: {error.message}
        </p>
      )}

      {data && !loading && (
        <p className="hint">✔ Última importación: {data.length} registros.</p>
      )}
    </section>
  )
}
