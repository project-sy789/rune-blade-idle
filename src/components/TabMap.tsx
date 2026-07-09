// ============================================================
// TabMap.tsx — Stage/Map selection + stage drops
// ============================================================
import { useGameStore } from '../store/gameStore'
import { ITEM_TEMPLATES, MONSTERS, STAGES } from '../constants/gameConfig'
import { T } from '../constants/translations'

function stageDropPreview(stageId: string, monsterId: string) {
  const stage = STAGES.find(st => st.id === stageId)
  const monster = MONSTERS.find(m => m.id === monsterId)
  const table = stage?.dropOverrides?.[monsterId] ?? monster?.dropTable ?? []
  return table.slice(0, 3).map(entry => {
    const item = ITEM_TEMPLATES.find(t => t.id === entry.templateId)
    return item ? `${item.emoji} ${item.name}` : entry.templateId
  })
}

export function TabMap() {
  const player = useGameStore(s => s.player)
  const currentStageId = useGameStore(s => s.currentStageId)
  const setStage = useGameStore(s => s.setStage)

  return (
    <div className="h-full overflow-y-auto thin-scroll px-3 py-3 flex flex-col gap-2">
      <p className="text-xs text-purple-400 font-bold mb-1">🗺 {T.mapTitle} / ดร็อปแต่ละแมพ</p>
      {STAGES.map(stage => {
        const isActive = stage.id === currentStageId
        const isLocked = stage.minLevel > player.level

        return (
          <div
            key={stage.id}
            className={`rounded-xl border p-3 transition-all ${isActive ? 'border-yellow-500/60 bg-yellow-500/10' : isLocked ? 'border-gray-800 bg-gray-900/30 opacity-50' : 'border-gray-700 bg-gray-900/40 hover:border-purple-600/50'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <span className="text-2xl shrink-0">{stage.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className={`font-bold text-sm truncate ${isActive ? 'text-yellow-300' : 'text-white'}`}>{stage.name}</p>
                  <div className="flex gap-2 mt-0.5 flex-wrap">
                    <span className="text-[10px] text-gray-500">Lv.{stage.minLevel}+</span>
                    {stage.goldBonus > 0 && <span className="text-[10px] text-yellow-500">{T.goldBonusLabel(stage.goldBonus)}</span>}
                    {stage.expBonus > 0 && <span className="text-[10px] text-violet-400">{T.expBonusLabel(stage.expBonus)}</span>}
                  </div>

                  <div className="mt-2 flex flex-col gap-1">
                    {stage.monsterIds.map(monsterId => {
                      const monster = MONSTERS.find(m => m.id === monsterId)
                      const drops = stageDropPreview(stage.id, monsterId)
                      return (
                        <div key={monsterId} className="rounded-lg bg-black/20 border border-white/5 px-2 py-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-gray-300 font-bold truncate">{monster?.emoji} {monster?.name ?? monsterId}</span>
                            <span className="text-[9px] text-gray-500 shrink-0">ดร็อป</span>
                          </div>
                          <p className="mt-0.5 text-[9px] text-amber-200 truncate">{drops.join(' · ') || 'ไม่มีข้อมูลดร็อป'}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                {isActive ? (
                  <span className="text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 rounded-full px-2.5 py-1 font-bold">▶ อยู่นี่</span>
                ) : isLocked ? (
                  <span className="text-[10px] text-gray-600">🔒 Lv.{stage.minLevel}</span>
                ) : (
                  <button onClick={() => setStage(stage.id)} className="text-xs bg-purple-700/50 border border-purple-500/40 text-purple-200 rounded-full px-2.5 py-1 font-semibold hover:bg-purple-600/60 transition-colors active:scale-95">
                    {T.moveHere}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
