import { useEffect, useRef } from 'react'

/**
 * Makes an element gently follow the cursor while hovered, then spring back
 * into place on leave — the "magnetic button" effect. Skipped on touch
 * devices and when reduced motion is requested.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduced) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      el.style.transition = 'transform 0.15s ease-out'
      el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`
    }
    const handleLeave = () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      el.style.transform = 'translate(0, 0)'
    }

    el.addEventListener('mousemove', handleMove, { passive: true })
    el.addEventListener('mouseleave', handleLeave, { passive: true })
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
      el.style.transform = ''
      el.style.transition = ''
    }
  }, [strength])

  return ref
}
