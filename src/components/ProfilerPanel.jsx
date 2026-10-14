import { useState, useSyncExternalStore } from 'react'
import { subscribe, getCommits, clearCommits } from '../lib/metricsStore'

export default function ProfilerPanel() {
  const commits = useSyncExternalStore(subscribe, getCommits)
  const [open, setOpen] = useState(true)

  const last = commits[commits.length - 1]
  const avg = commits.length
    ? commits.reduce((a, c) => a + c.actualDuration, 0) / commits.length
    : 0
  const max = Math.max(0.001, ...commits.map((c) => c.actualDuration))

  return (
    <aside className={`profiler-panel ${open ? '' : 'profiler-panel--closed'}`}>
      <header className="profiler-panel__head">
        <strong>⚙️ Profiler · AppTree</strong>
        <div>
          <button onClick={clearCommits} title="Limpiar métricas">🗑</button>
          <button onClick={() => setOpen((o) => !o)}>{open ? '▾' : '▸'}</button>
        </div>
      </header>

      {open && (
        <>
          <div className="profiler-panel__stats">
            <div><span>Commits</span><b>{commits.length}</b></div>
            <div><span>Último</span><b>{last ? `${last.actualDuration.toFixed(2)} ms` : '—'}</b></div>
            <div><span>Fase</span><b>{last ? last.phase : '—'}</b></div>
            <div><span>Promedio</span><b>{avg.toFixed(2)} ms</b></div>
          </div>

          <ul className="profiler-panel__list">
            {commits.slice(-8).reverse().map((c, i) => (
              <li key={`${c.commitTime}-${i}`}>
                <span className="profiler-panel__phase">{c.phase === 'mount' ? 'M' : 'U'}</span>
                <span className="profiler-panel__bar">
                  <i style={{ width: `${Math.max(3, (c.actualDuration / max) * 100)}%` }} />
                </span>
                <span className="profiler-panel__ms">{c.actualDuration.toFixed(2)}ms</span>
              </li>
            ))}
          </ul>

          <p className="profiler-panel__hint">
            Compara con DevTools → <b>Profiler</b> → ⏺ Record.
            <br />Si un commit dura mucho, revisa <b>StatsPanel</b>.
          </p>
        </>
      )}
    </aside>
  )
}