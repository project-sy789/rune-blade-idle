// ============================================================
// FloatDamage.tsx — ตัวเลขดาเมจลอย
// ============================================================
import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function FloatingNumbers() {
  const floats      = useGameStore(s => s.floats)
  const removeFloat = useGameStore(s => s.removeFloat)

  useEffect(() => {
    floats.forEach(f => {
      const timer = setTimeout(() => removeFloat(f.id), 1300)
      return () => clearTimeout(timer)
    })
  }, [floats, removeFloat])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {floats.map(f => (
        <span
          key={f.id}
          className="absolute animate-floatUp font-extrabold select-none"
          style={{
            left: `${f.x}%`,
            top:  `${f.y}%`,
            fontSize: f.isCrit ? '1.6rem' : '1.1rem',
            color:    f.isCrit ? '#FBBF24' : '#F87171',
            textShadow: f.isCrit
              ? '0 0 8px #FBBF24, 0 2px 4px #000'
              : '0 2px 4px #000',
          }}
        >
          {f.isCrit ? `💥${f.value}!` : `-${f.value}`}
        </span>
      ))}
    </div>
  )
}
