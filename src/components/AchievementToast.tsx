// ============================================================
// AchievementToast.tsx — popup notification เมื่อ unlock
// ============================================================
import { useEffect }    from 'react'
import { useGameStore } from '../store/gameStore'

export function AchievementToast() {
  const popups  = useGameStore(s => s.achievementPopups)
  const dismiss = useGameStore(s => s.dismissAchievementPopup)

  // Auto-dismiss after 3.5s
  useEffect(() => {
    if (popups.length === 0) return
    const id = setTimeout(() => dismiss(popups[0].id), 3500)
    return () => clearTimeout(id)
  }, [popups, dismiss])

  if (popups.length === 0) return null
  const p = popups[0]

  return (
    <div
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm"
      onClick={() => dismiss(p.id)}
    >
      <div className="glass-purple rounded-2xl border border-yellow-500/40 neon-border-gold p-3 flex items-center gap-3 shadow-2xl shadow-yellow-500/20">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-yellow-500/30">
          {p.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-yellow-400 font-bold tracking-widest uppercase">🏅 Achievement Unlocked!</p>
          <p className="text-sm font-extrabold text-white truncate">{p.name}</p>
          <p className="text-[10px] text-green-300 mt-0.5">{p.reward}</p>
        </div>
      </div>
    </div>
  )
}
