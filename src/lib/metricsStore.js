let commits = []
const listeners = new Set()
let flushScheduled = false

/**
 * React llama a onRender DURANTE el commit. Si notificamos a los
 * listeners aquí mismo, useSyncExternalStore programa un setState
 * mientras React sigue haciendo commit → warning:
 *   "Cannot update a component while rendering a different component"
 *
 * Solución: agrupar todas las notificaciones del mismo tick en un
 * microtask y notificar una sola vez al terminar el commit.
 */
function scheduleFlush() {
  if (flushScheduled) return
  flushScheduled = true
  queueMicrotask(() => {
    flushScheduled = false
    listeners.forEach((l) => l())
  })
}

export function recordCommit(entry) {
  commits = [...commits, entry]
  if (commits.length > 40) commits = commits.slice(-40)
  scheduleFlush()
}

export function clearCommits() {
  commits = []
  scheduleFlush()
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getCommits() {
  return commits
}