import { useRenderCount } from '../hooks/useRenderCount'

export default function RenderBadge({ label }) {
  const count = useRenderCount()
  return (
    <span className="render-badge" title={`${label} · ${count} renders`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
           strokeLinecap="round" strokeLinejoin="round" width="12" height="12" aria-hidden="true">
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 3v6h-6" />
      </svg>
      <span>{label}</span>
      <b>{count}</b>
    </span>
  )
}