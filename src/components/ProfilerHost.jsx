import { Profiler } from 'react'
import { recordCommit } from '../lib/metricsStore'

function handleRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  recordCommit({ id, phase, actualDuration, baseDuration, commitTime })
}

export default function ProfilerHost({ children }) {
  return (
    <Profiler id="AppTree" onRender={handleRender}>
      {children}
    </Profiler>
  )
}
