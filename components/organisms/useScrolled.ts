'use client'

import { useSyncExternalStore } from 'react'

/**
 * ¿La página ya se movió hacia abajo? Mismo hook que usa el navbar de Nakoa:
 * el snapshot es un booleano, así que solo se re-renderiza al cruzar el umbral
 * y no en cada evento de scroll.
 */
export function useScrolled(threshold = 24) {
  return useSyncExternalStore(
    callback => {
      window.addEventListener('scroll', callback, { passive: true })
      return () => window.removeEventListener('scroll', callback)
    },
    () => window.scrollY > threshold,
    () => false,
  )
}
