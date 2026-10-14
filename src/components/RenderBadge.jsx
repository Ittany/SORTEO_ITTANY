import { useRenderCount } from '../hooks/useRenderCount'

export default function RenderBadge({ label }) {
  const count = useRenderCount()
  return (
    <span className="render-badge" title={`${label} se ha renderizado ${count} veces`}>
      ⟳ {label}: {count}
    </span>
  )
}