import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/**
 * Counts up to the first number found in `value` when it scrolls into view,
 * keeping the surrounding text and the thousands separator of the original
 * ("12 000", "4 001", "6 mois"…). The final render is always `value` itself.
 */
export default function CountUp({ value, duration = 1.4 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px 0px' })
  const reduceMotion = useReducedMotion()

  const match = value.match(/\d[\d\s\u00a0\u202f,.]*\d|\d/)
  const target = match ? Number(match[0].replace(/\D/g, '')) : NaN
  const separator = match?.[0].match(/[\s\u00a0\u202f,.]/)?.[0]
  const animated = match !== null && Number.isFinite(target) && !reduceMotion

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!animated || !inView) return
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: v => setCurrent(Math.round(v)),
    })
    return () => controls.stop()
  }, [animated, inView, target, duration])

  if (!animated || !match) return <span ref={ref}>{value}</span>

  const digits = String(current)
  const grouped = separator ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : digits
  const start = match.index ?? 0
  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {current === target ? value : value.slice(0, start) + grouped + value.slice(start + match[0].length)}
    </span>
  )
}
