import { useToast } from '../hooks/useToast'
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
)

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8h.01M11 12h1v5h1" />
  </svg>
)

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
          type="button"
        >
          <span className="toast__icon">
            {t.type === 'success' ? <IconCheck /> : t.type === 'error' ? <IconX /> : <IconInfo />}
          </span>
          <span>{t.message}</span>
        </button>
      ))}
    </div>
  )
}