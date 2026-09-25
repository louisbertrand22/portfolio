import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

/** Timeline rail that draws itself as the timeline scrolls through the viewport. */
export default function TimelineProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

  return (
    <div ref={ref} className="timeline-progress" aria-hidden="true">
      <motion.div className="timeline-progress-bar" style={{ scaleY }} />
    </div>
  )
}
