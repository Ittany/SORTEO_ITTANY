import { useRef } from 'react'

/**
 * Cuenta cuántas veces se ha renderizado el componente que lo usa.
 */
export function useRenderCount() {
  const renders = useRef(0)
  renders.current += 1
  return renders.current
}