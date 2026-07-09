// ============================================================
// SkillButton.tsx — ปุ่มสกิล active + cooldown timer
// ============================================================
import { useState, useEffect } from 'react'
import { useGameStore }        from '../store/gameStore'
import { CLASSES }             from '../constants/classes'
import { T }                   from '../constants/translations'

export function SkillButton() {
  const player          = useGameStore(s => s.player)
  const skillCooldownEnd = useGameStore(s => s.skillCooldownEnd)
  const useSkill        = useGameStore(s => s.useSkill)
  const [now, setNow]   = useState(Date.now())

  // tick ทุก 100ms เพื่ออัพเดต cooldown display
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(id)
  }, [])

  const cls = player.classId ? CLASSES.find(c => c.id === player.classId) : null
  if (!cls) return null

  const remaining = Math.max(0, Math.ceil((skillCooldownEnd - now) / 1000))
  const isReady   = remaining === 0
  const pct       = isReady ? 100 : ((cls.skill.cooldownSec - remaining) / cls.skill.cooldownSec) * 100

  return (
    <button
      onClick={useSkill}
      disabled={!isReady}
      className={`
        relative flex-1 py-2.5 rounded-xl font-bold text-sm overflow-hidden transition-all active:scale-95
        ${isReady
          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-orange-900/40'
          : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
        }
      `}
    >
      {/* Cooldown fill bar */}
      {!isReady && (
        <div
          className="absolute inset-0 bg-yellow-700/20 origin-left transition-all"
          style={{ width: `${pct}%` }}
        />
      )}
      <span className="relative z-10">
        {cls.skill.emoji}{' '}
        {isReady ? cls.skill.name : T.skillCooldown(remaining)}
      </span>
    </button>
  )
}
