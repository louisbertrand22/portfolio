import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const HOVER_SELECTOR = 'a, button, [data-cursor="hover"], input, textarea'

/**
 * Custom dot + trailing ring cursor. Only mounts on fine-pointer, hover-
 * capable devices with no reduced-motion preference — everywhere else it
 * renders nothing and the native cursor is left untouched.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isPressing, setIsPressing] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.4 })
  const ringY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.4 })

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduced) return

    setEnabled(true)
    document.documentElement.classList.add('custom-cursor-active')

    const handleMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    const handleOver = (e: MouseEvent) => {
      setIsHovering(!!(e.target as HTMLElement)?.closest?.(HOVER_SELECTOR))
    }
    const handleDown = () => setIsPressing(true)
    const handleUp = () => setIsPressing(false)

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseover', handleOver, { passive: true })
    window.addEventListener('mousedown', handleDown, { passive: true })
    window.addEventListener('mouseup', handleUp, { passive: true })
    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleOver)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        className="cursor-dot-wrap"
        style={{ x, y }}
        animate={{ scale: isPressing ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
        aria-hidden="true"
      >
        <div className="cursor-dot" />
      </motion.div>
      <motion.div
        className="cursor-ring-wrap"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: isHovering ? 1.7 : isPressing ? 0.8 : 1, opacity: isHovering ? 0.7 : 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <div className="cursor-ring" />
      </motion.div>
    </>
  )
}
