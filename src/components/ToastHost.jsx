import { useToast } from '../context/ToastContext'

export default function ToastHost() {
  const { toasts, remove } = useToast()

  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          className={`toast toast--${t.type}`}
          onClick={() => remove(t.id)}
          title="Clic para cerrar"
        >
          <span className="toast__icon">
            {t.type === 'success' ? '✔' : t.type === 'error' ? '✖' : 'ℹ'}
          </span>
          <span>{t.message}</span>
        </button>
      ))}
    </div>
  )
}