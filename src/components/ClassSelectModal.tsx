// ============================================================
// ClassSelectModal.tsx — popup เลือกอาชีพเมื่อ Lv.10
// ============================================================
import { useGameStore }    from '../store/gameStore'
import { CLASSES }         from '../constants/classes'
import { ClassId }         from '../constants/classes'
import { T }               from '../constants/translations'

export function ClassSelectModal() {
  const player      = useGameStore(s => s.player)
  const selectClass = useGameStore(s => s.selectClass)

  // แสดงเฉพาะตอนเลเวล >= 10 และยังไม่มีคลาส
  if (player.level < 10 || player.classId !== null) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-b from-[#1a0a3d] to-[#0f0820] border-t border-purple-600/50 rounded-t-3xl p-5 pb-8 shadow-2xl">
        <div className="w-10 h-1 bg-purple-600 rounded-full mx-auto mb-4" />
        <h2 className="text-center text-lg font-extrabold text-white mb-1">{T.chooseClass}</h2>
        <p className="text-center text-purple-400 text-xs mb-5">{T.chooseClassDesc}</p>

        <div className="flex flex-col gap-3">
          {CLASSES.map(cls => (
            <button
              key={cls.id}
              onClick={() => selectClass(cls.id as ClassId)}
              className={`
                w-full rounded-2xl border border-purple-700/40 bg-gradient-to-r ${cls.color}
                p-4 text-left flex items-start gap-3 active:scale-95 transition-all
                hover:border-purple-400/60
              `}
            >
              <span className="text-4xl shrink-0">{cls.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-white text-base">{cls.name}</p>
                <p className="text-gray-300 text-xs mt-0.5 leading-relaxed">{cls.desc}</p>
                {/* Passive bonuses */}
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
                  {cls.passive.atkBonus   !== 0 && (
                    <span className="text-[10px] text-red-300">⚔️ ATK +{cls.passive.atkBonus}%</span>
                  )}
                  {cls.passive.defBonus   > 0 && (
                    <span className="text-[10px] text-blue-300">🛡 DEF +{cls.passive.defBonus}%</span>
                  )}
                  {cls.passive.hpBonus    !== 0 && (
                    <span className={`text-[10px] ${cls.passive.hpBonus > 0 ? 'text-green-300' : 'text-orange-400'}`}>
                      ❤️ HP {cls.passive.hpBonus > 0 ? '+' : ''}{cls.passive.hpBonus}%
                    </span>
                  )}
                  {cls.passive.critBonus  > 0 && (
                    <span className="text-[10px] text-yellow-300">💥 Crit +{cls.passive.critBonus * 100}%</span>
                  )}
                  {cls.passive.goldBonus  > 0 && (
                    <span className="text-[10px] text-yellow-400">🪙 Gold +{cls.passive.goldBonus}%</span>
                  )}
                  {cls.passive.expBonus   > 0 && (
                    <span className="text-[10px] text-violet-300">⭐ EXP +{cls.passive.expBonus}%</span>
                  )}
                </div>
                {/* Skill */}
                <div className="mt-2 bg-black/30 rounded-lg px-2 py-1">
                  <span className="text-[10px] text-purple-300 font-bold">
                    {cls.skill.emoji} {cls.skill.name}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-1">— {cls.skill.desc}</span>
                  <span className="text-[10px] text-gray-500 ml-1">(CD {cls.skill.cooldownSec}s)</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
