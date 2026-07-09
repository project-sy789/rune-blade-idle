// ============================================================
// TabAchievements.tsx — achievement list + progress
// ============================================================
import { useGameStore }    from '../store/gameStore'
import { ACHIEVEMENTS }    from '../constants/achievements'
import { AchievementId }   from '../constants/achievements'

function rewardText(r: { type: string; amount?: number }) {
  if (r.type === 'gold')       return `🪙 +${r.amount} เซนี่`
  if (r.type === 'statpoints') return `✨ +${r.amount} พอยต์`
  return '🎁 รางวัลพิเศษ'
}

export function TabAchievements() {
  const unlocked = useGameStore(s => s.unlockedAchievements)
  const total    = ACHIEVEMENTS.filter(a => !a.hidden).length
  const done     = unlocked.length
  const pct      = Math.floor((done / total) * 100)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 pt-2 pb-2 shrink-0 border-b border-gray-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-yellow-400">🏅 Achievement</span>
          <span className="text-[10px] text-gray-500">{done}/{total} ({pct}%)</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-600 to-amber-400 bar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-2 flex flex-col gap-2">
        {ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlocked.includes(ach.id as AchievementId)
          const isHidden   = ach.hidden && !isUnlocked

          return (
            <div
              key={ach.id}
              className={`rounded-xl border p-2.5 flex items-center gap-2.5 transition-all
                ${isUnlocked
                  ? 'glass border-yellow-500/30 neon-border-gold'
                  : 'bg-gray-900/30 border-gray-800/60 opacity-60'
                }`}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0
                ${isUnlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-800'}`}
              >
                {isHidden ? '❓' : ach.emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${isUnlocked ? 'text-yellow-300' : 'text-gray-400'}`}>
                  {isHidden ? '???' : ach.name}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {isHidden ? 'สำเร็จภารกิจลับ' : ach.desc}
                </p>
                {isUnlocked && (
                  <p className="text-[10px] text-green-400 mt-0.5">{rewardText(ach.reward)}</p>
                )}
              </div>

              {/* Badge */}
              {isUnlocked && (
                <span className="text-yellow-400 text-lg shrink-0">✓</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
