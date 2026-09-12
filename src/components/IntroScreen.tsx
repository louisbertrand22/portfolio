import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import F1Car from './F1Car'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!<>-_/[]{}—=+*^?#'
const SCRAMBLE_DURATION = 900

// F1-style start sequence: the car drops in from above and lands while 5 lights come on one
// by one, holds through the pause, then darts off to the right once they go out together
// ("lights out and away we go"), and the curtain lifts.
const LIGHTS_COUNT = 5
const LIGHT_INTERVAL = 200
const LIGHTS_OUT_AT = LIGHTS_COUNT * LIGHT_INTERVAL + 300
const CAR_DROP_DELAY = 0.15
const CAR_DURATION = 950
const TOTAL_DURATION = LIGHTS_OUT_AT + CAR_DURATION + 150

function scrambleFrame(text: string, revealCount: number) {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') { out += ' '; continue }
    out += i < revealCount ? text[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  }
  return out
}

interface IntroScreenProps {
  name: string
  subtitle: string
  onComplete: () => void
}

/** One-shot loading curtain: the name decodes in, a counter ticks to 100%, then the panel lifts to reveal the page. */
export default function IntroScreen({ name, subtitle, onComplete }: IntroScreenProps) {
  const [display, setDisplay] = useState(() => scrambleFrame(name, 0))
  const [lights, setLights] = useState(0)
  const [lightsOut, setLightsOut] = useState(false)
  const [phase, setPhase] = useState<'loading' | 'exit'>('loading')
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    let rafId: number
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const scrambleProgress = Math.min(1, elapsed / SCRAMBLE_DURATION)
      setDisplay(scrambleProgress >= 1 ? name : scrambleFrame(name, Math.floor(scrambleProgress * name.length)))
      setLights(Math.min(LIGHTS_COUNT, Math.floor(elapsed / LIGHT_INTERVAL)))
      setLightsOut(elapsed >= LIGHTS_OUT_AT)
      const overallProgress = Math.min(1, elapsed / TOTAL_DURATION)
      if (overallProgress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setPhase('exit')
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [name])

  return (
    <motion.div
      className="intro-screen"
      animate={{ y: phase === 'exit' ? '-100%' : '0%' }}
      transition={{ duration: 0.85, delay: phase === 'exit' ? 0.15 : 0, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => { if (phase === 'exit') onComplete() }}
    >
      <motion.div
        className="intro-content"
        animate={{ opacity: phase === 'exit' ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="intro-name">{display}</span>
        <span className="intro-subtitle">{subtitle}</span>
      </motion.div>
      <motion.div
        className="intro-car"
        aria-hidden="true"
        initial={{ y: '-75vh', x: '0vw' }}
        animate={{ y: 0, x: lightsOut ? '120vw' : '0vw' }}
        transition={{
          y: { type: 'spring', stiffness: 260, damping: 22, delay: CAR_DROP_DELAY },
          x: { duration: CAR_DURATION / 1000, ease: 'easeIn' },
        }}
      >
        <F1Car />
      </motion.div>
      <div className="intro-footer">
        <div className="intro-lights" aria-hidden="true">
          {Array.from({ length: LIGHTS_COUNT }, (_, i) => (
            <span key={i} className={`intro-light ${!lightsOut && i < lights ? 'lit' : ''}`} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
