// ============================================================
// TabLog.tsx — บันทึกการต่อสู้ (scrolling combat log)
// ============================================================
import { useGameStore } from '../store/gameStore'
import { T }            from '../constants/translations'

const TYPE_STYLE: Record<string, string> = {
  attack:  'text-red-300',
  receive: 'text-orange-300',
  kill:    'text-green-300 font-bold',
  levelup: 'text-yellow-300 font-extrabold',
  system:  'text-purple-300',
}

export function TabLog() {
  const log      = useGameStore(s => s.log)
  const clearLog = useGameStore(s => s.clearLog)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 shrink-0">
        <span className="text-xs font-bold text-purple-400">📜 {T.combatLogTitle}</span>
        <button
          onClick={clearLog}
          className="text-[10px] text-gray-500 border border-gray-700 rounded px-2 py-0.5 hover:text-gray-300 transition-colors"
        >
          {T.clearLog}
        </button>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-y-auto thin-scroll px-3 pb-2 flex flex-col gap-0.5">
        {log.length === 0 ? (
          <p className="text-gray-600 text-xs text-center mt-6">{T.logEmpty}</p>
        ) : (
          log.map(entry => (
            <p
              key={entry.id}
              className={`text-xs leading-relaxed ${TYPE_STYLE[entry.type] ?? 'text-gray-400'}`}
            >
              {entry.text}
            </p>
          ))
        )}
      </div>
    </div>
  )
}
