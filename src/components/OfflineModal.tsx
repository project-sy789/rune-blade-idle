// ============================================================
// OfflineModal.tsx — popup แสดงผลออฟไลน์
// ============================================================
import { useGameStore }   from '../store/gameStore'
import { T }              from '../constants/translations'

export function OfflineModal() {
  const result  = useGameStore(s => s.offlineResult)
  const dismiss = useGameStore(s => s.dismissOfflineResult)

  if (!result) return null

  const hours = Math.floor(result.seconds / 3600)
  const mins  = Math.floor((result.seconds % 3600) / 60)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#1a0a3d] to-[#0f0820] border border-purple-600/50 rounded-2xl p-6 shadow-2xl shadow-purple-900/60">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-3xl mb-1">⏰</p>
          <h2 className="text-lg font-extrabold text-white">{T.offlineProgress}</h2>
          <p className="text-purple-400 text-sm mt-0.5">{T.offlineGone(hours, mins)}</p>
        </div>

        {/* Rewards grid */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: '💀', label: 'สังหาร',  value: result.kills.toLocaleString() },
            { icon: '⭐', label: 'EXP',     value: `+${result.exp.toLocaleString()}` },
            { icon: '🪙', label: 'เซนี่',   value: `+${result.gold.toLocaleString()}` },
          ].map(r => (
            <div
              key={r.label}
              className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-2 text-center"
            >
              <p className="text-2xl leading-none mb-1">{r.icon}</p>
              <p className="text-xs text-gray-400">{r.label}</p>
              <p className="text-yellow-300 font-bold text-sm">{r.value}</p>
            </div>
          ))}
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 text-white font-bold rounded-xl text-sm transition-all active:scale-95"
        >
          {T.offlineDismiss}
        </button>
      </div>
    </div>
  )
}
