// ============================================================
// particles.ts — Canvas particle system (no deps)
// ============================================================

export interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  size: number
  color: string
  type: 'star' | 'spark' | 'ring'
}

export function createLevelUpBurst(cx: number, cy: number): Particle[] {
  const out: Particle[] = []
  const colors = ['#FBBF24', '#F59E0B', '#FDE68A', '#ffffff', '#A78BFA']
  for (let i = 0; i < 40; i++) {
    const angle = (i / 40) * Math.PI * 2
    const speed = 1.5 + Math.random() * 3
    out.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 1, maxLife: 0.6 + Math.random() * 0.6,
      size: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() > 0.5 ? 'star' : 'spark',
    })
  }
  // ring pulse
  out.push({ x: cx, y: cy, vx: 0, vy: 0, life: 1, maxLife: 0.5, size: 10, color: '#A78BFA', type: 'ring' })
  return out
}

export function createHitSpark(cx: number, cy: number, isCrit: boolean): Particle[] {
  const out: Particle[] = []
  const count  = isCrit ? 12 : 6
  const colors = isCrit ? ['#FBBF24', '#F87171', '#FDE68A'] : ['#F87171', '#FDA4AF']
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 0.8 + Math.random() * 2
    out.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      life: 1, maxLife: 0.2 + Math.random() * 0.3,
      size: isCrit ? 4 + Math.random() * 4 : 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: 'spark',
    })
  }
  return out
}

export function createBossBurst(cx: number, cy: number): Particle[] {
  const out: Particle[] = []
  const colors = ['#F87171', '#EF4444', '#FBBF24', '#ffffff']
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2
    const speed = 2 + Math.random() * 4
    out.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 1, maxLife: 0.8 + Math.random() * 0.8,
      size: 4 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.random() > 0.3 ? 'star' : 'ring',
    })
  }
  return out
}

/** tick all particles — returns survivors */
export function tickParticles(particles: Particle[], dt: number): Particle[] {
  return particles
    .map(p => ({
      ...p,
      x:    p.x + p.vx,
      y:    p.y + p.vy,
      vy:   p.vy + 0.12,        // gravity
      vx:   p.vx * 0.95,        // drag
      life: p.life - dt / p.maxLife,
    }))
    .filter(p => p.life > 0)
}

/** draw all particles onto canvas */
export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (const p of particles) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, p.life)
    if (p.type === 'ring') {
      ctx.strokeStyle = p.color
      ctx.lineWidth   = 2
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * (1 - p.life) * 30 + 5, 0, Math.PI * 2)
      ctx.stroke()
    } else if (p.type === 'star') {
      ctx.fillStyle = p.color
      ctx.shadowColor  = p.color
      ctx.shadowBlur   = 8
      // 4-point star
      const s = p.size
      ctx.beginPath()
      ctx.moveTo(p.x,     p.y - s)
      ctx.lineTo(p.x + s * 0.3, p.y - s * 0.3)
      ctx.lineTo(p.x + s, p.y)
      ctx.lineTo(p.x + s * 0.3, p.y + s * 0.3)
      ctx.lineTo(p.x,     p.y + s)
      ctx.lineTo(p.x - s * 0.3, p.y + s * 0.3)
      ctx.lineTo(p.x - s, p.y)
      ctx.lineTo(p.x - s * 0.3, p.y - s * 0.3)
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.fillStyle    = p.color
      ctx.shadowColor  = p.color
      ctx.shadowBlur   = 6
      ctx.beginPath()
      ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
}
