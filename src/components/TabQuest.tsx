// ============================================================
// TabQuest.tsx — Auto quest tracker
// ============================================================
import { useGameStore } from '../store/gameStore'
import { QUESTS, getQuestById } from '../constants/quests'
import { STAGES } from '../constants/gameConfig'

function objectiveText(questId: string | null, progress: number) {
  const quest = getQuestById(questId)
  if (!quest) return 'เควสทั้งหมดสำเร็จแล้ว'
  const objective = quest.objective
  const target = objective.type === 'kill'
    ? objective.monsterId ? `กำจัด ${objective.monsterId}` : 'กำจัดมอนสเตอร์ใดก็ได้'
    : objective.type === 'level'
      ? 'เก็บเลเวล'
      : 'สะสมเซนี่'
  return `${target} ${Math.min(progress, objective.required)}/${objective.required}`
}

export function TabQuest() {
  const player = useGameStore(s => s.player)
  const questState = useGameStore(s => s.quest)
  const currentStageId = useGameStore(s => s.currentStageId)
  const toggleAutoQuest = useGameStore(s => s.toggleAutoQuest)
  const startQuest = useGameStore(s => s.startQuest)
  const activeQuest = getQuestById(questState.activeQuestId)
  const activeStage = activeQuest ? STAGES.find(stage => stage.id === activeQuest.stageId) : null
  const progressPct = activeQuest
    ? Math.min(100, (questState.progress / activeQuest.objective.required) * 100)
    : 100

  return (
    <div className="h-full overflow-y-auto thin-scroll px-3 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-purple-400 font-bold">📜 เควส / ออโต้เควส</p>
        <button
          onClick={toggleAutoQuest}
          className={`rounded-full px-3 py-1 text-[10px] font-bold border active:scale-95 ${questState.autoQuest ? 'bg-green-600/20 border-green-400/40 text-green-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
        >
          {questState.autoQuest ? '🤖 ออโต้เควส ON' : '⏸ ออโต้เควส OFF'}
        </button>
      </div>

      {activeQuest ? (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-yellow-200 truncate">{activeQuest.title}</p>
              <p className="mt-1 text-[11px] text-gray-300 leading-snug">{activeQuest.description}</p>
              <p className="mt-1 text-[10px] text-purple-300">
                🗺 เป้าหมาย: {activeStage?.emoji} {activeStage?.name ?? activeQuest.stageId}
              </p>
              {currentStageId !== activeQuest.stageId && questState.autoQuest && (
                <p className="mt-1 text-[10px] text-cyan-300">ระบบจะย้ายแมพให้อัตโนมัติเมื่อเลเวลถึง</p>
              )}
            </div>
            <span className="shrink-0 rounded-full bg-black/30 px-2 py-1 text-[10px] text-yellow-200 border border-yellow-500/30">
              #{QUESTS.findIndex(q => q.id === activeQuest.id) + 1}/{QUESTS.length}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>{objectiveText(activeQuest.id, questState.progress)}</span>
              <span>{Math.floor(progressPct)}%</span>
            </div>
            <div className="h-2 rounded-full bg-black/50 overflow-hidden border border-yellow-900/40">
              <div className="h-full rounded-full bg-gradient-to-r from-yellow-700 to-amber-300 bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="rounded-xl bg-black/25 border border-white/10 py-1.5 text-violet-200">EXP +{activeQuest.reward.exp}</div>
            <div className="rounded-xl bg-black/25 border border-white/10 py-1.5 text-yellow-200">เซนี่ +{activeQuest.reward.gold}</div>
            <div className="rounded-xl bg-black/25 border border-white/10 py-1.5 text-green-200">พอยต์ +{activeQuest.reward.statPoints ?? 0}</div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-200 font-bold">
          ✅ เควสหลักทั้งหมดสำเร็จแล้ว รอเนื้อเรื่องถัดไป
        </div>
      )}

      <div className="rounded-2xl border border-purple-800/40 bg-black/20 p-2">
        <p className="text-[10px] text-gray-400 font-bold mb-2">รายการเควสทั้งหมด</p>
        <div className="flex flex-col gap-1.5">
          {QUESTS.map(quest => {
            const done = questState.completedQuestIds.includes(quest.id)
            const active = quest.id === questState.activeQuestId
            const stage = STAGES.find(s => s.id === quest.stageId)
            return (
              <button
                key={quest.id}
                disabled={done}
                onClick={() => !done && startQuest(quest.id)}
                className={`text-left rounded-xl border px-2 py-2 active:scale-[0.99] ${done ? 'border-green-700/40 bg-green-900/10 text-green-400' : active ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-100' : 'border-gray-800 bg-gray-900/30 text-gray-300'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold truncate">{done ? '✅' : active ? '▶️' : '📜'} {quest.title}</span>
                  <span className="text-[9px] text-gray-500 shrink-0">{stage?.emoji} Lv.{stage?.minLevel}</span>
                </div>
                <p className="mt-0.5 text-[9px] text-gray-500 truncate">{quest.description}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
