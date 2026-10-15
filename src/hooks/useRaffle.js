import { useContext } from 'react'
import { RaffleContext } from '../contexts/RaffleContext'

export function useRaffle() {
  const ctx = useContext(RaffleContext)
  if (!ctx) throw new Error('useRaffle() debe usarse dentro de <RaffleProvider>')
  return ctx
}