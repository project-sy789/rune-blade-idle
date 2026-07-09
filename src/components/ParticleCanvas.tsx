// ============================================================
// ParticleCanvas.tsx — fullscreen canvas overlay for particles
// ============================================================
import { useEffect, useRef, useCallback } from 'react'
import {
  Particle, tickParticles, drawParticles,
  createLevelUpBurst, createHitSpark, createBossBurst,
} from '../lib/particles'
import { useGameStore } from '../store/gameStore'

// Global particle bus — components push events here
type ParticleEvent =
  | { type: 'levelup'; x: number; y: number }
  | { type: 'hit'; x: number; y: number; isCrit: boolean }
  | { type: 'boss'; x: number; y: number }

const _listeners: ((e: ParticleEvent) => void)[] = []
export function emitParticle(e: ParticleEvent) {
  _listeners.forEach(fn => fn(e))
}

export function ParticleCanvas() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const particles   = useRef<Particle[]>([])
  const rafRef      = useRef<number>(0)
  const lastLog     = useRef(0)
  const log         = useGameStore(s => s.log)

  // Listen for log changes to detect levelup / boss / hit events
  useEffect(() => {
    const latest = log[0]
    if (!latest || latest.id === lastLog.current) return
    lastLog.current = latest.id
    const canvas = canvasRef.current
    if (!canvas) return
    const cx = canvas.width  * 0.5
    const cy = canvas.height * 0.35

    if (latest.type === 'levelup') {
      particles.current.push(...createLevelUpBurst(cx, cy))
    } else if (latest.type === 'boss') {
      particles.current.push(...createBossBurst(cx, cy))
    } else if (latest.type === 'attack') {
      // hit spark on right side (monster)
      const isCrit = latest.text.includes('!')
      particles.current.push(...createHitSpark(cx * 1.4, cy * 0.9, isCrit))
    } else if (latest.type === 'receive') {
      // hit spark on left side (player)
      particles.current.push(...createHitSpark(cx * 0.6, cy * 0.9, false))
    }
  }, [log])

  // External event bus
  useEffect(() => {
    const handler = (e: ParticleEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      if (e.type === 'levelup') particles.current.push(...createLevelUpBurst(e.x, e.y))
      else if (e.type === 'hit') particles.current.push(...createHitSpark(e.x, e.y, e.isCrit))
      else if (e.type === 'boss') particles.current.push(...createBossBurst(e.x, e.y))
    }
    _listeners.push(handler)
    return () => { const i = _listeners.indexOf(handler); if (i >= 0) _listeners.splice(i, 1) }
  }, [])

  // Animation loop
  const loop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.current = tickParticles(particles.current, 0.05)
    drawParticles(ctx, particles.current)
    rafRef.current = requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [loop])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30"
    />
  )
}
