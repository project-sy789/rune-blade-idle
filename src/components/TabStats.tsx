// ============================================================
// TabStats.tsx — v3: class passive display + stat allocate
// ============================================================
import { useGameStore } from '../store/gameStore'
import { T }            from '../constants/translations'
import { GAME_CONFIG, itemBonusAtk, itemBonusDef, itemBonusHp } from '../constants/gameConfig'
import { CLASSES }      from '../constants/classes'

function StatRow({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-purple-900/30">
      <div>
        <span className="text-sm text-gray-200 font-semibold">{label}</span>
        {sub && <p className="text-[10px] text-gray-600">{sub}</p>}
      </div>
      <span className="text-yellow-400 font-bold">{value}</span>
    </div>
  )
}

export function TabStats() {
  const player       = useGameStore(s => s.player)
  const equipment    = useGameStore(s => s.equipment)
  const allocateStat = useGameStore(s => s.allocateStat)
  const canAllocate  = player.statPoints > 0

  const cls      = player.classId ? CLASSES.find(c => c.id === player.classId) : null
  const eqAtk    = (equipment.weapon    ? itemBonusAtk(equipment.weapon)    : 0)
                 + (equipment.armor     ? itemBonusAtk(equipment.armor)     : 0)
                 + (equipment.accessory ? itemBonusAtk(equipment.accessory) : 0)
  const eqDef    = (equipment.weapon    ? itemBonusDef(equipment.weapon)    : 0)
                 + (equipment.armor     ? itemBonusDef(equipment.armor)     : 0)
                 + (equipment.accessory ? itemBonusDef(equipment.accessory) : 0)
  const eqHp     = (equipment.weapon    ? itemBonusHp(equipment.weapon)    : 0)
                 + (equipment.armor     ? itemBonusHp(equipment.armor)     : 0)
                 + (equipment.accessory ? itemBonusHp(equipment.accessory) : 0)

  const atkMult  = cls ? 1 + cls.passive.atkBonus / 100 : 1
  const defMult  = cls ? 1 + cls.passive.defBonus / 100 : 1
  const hpMult   = cls ? 1 + cls.passive.hpBonus  / 100 : 1
  const critChance = (0.10 + (cls?.passive.critBonus ?? 0)) * 100

  const finalAtk  = Math.floor((GAME_CONFIG.atkFormula(player.str, player.baseAtk) + eqAtk) * atkMult)
  const finalDef  = Math.floor((player.baseDef + eqDef) * defMult)
  const finalMaxHp = Math.floor((GAME_CONFIG.maxHpFormula(player.vit, player.baseHp) + eqHp) * hpMult)

  return (
    <div className="h-full overflow-y-auto thin-scroll px-3 py-2 flex flex-col gap-3">

      {/* Stat point banner */}
      {canAllocate ? (
        <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl p-3 text-center">
          <p className="text-yellow-300 font-bold text-sm">
            ✨ {T.statPoints}: <span className="text-yellow-400 text-lg">{player.statPoints}</span>
          </p>
        </div>
      ) : (
        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-2 text-center">
          <p className="text-gray-600 text-xs">{T.noPoints}</p>
        </div>
      )}

      {/* Allocate buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          disabled={!canAllocate}
          onClick={() => allocateStat('str')}
          className={`rounded-xl p-3 flex flex-col items-center gap-1 border transition-all active:scale-95
            ${canAllocate
              ? 'bg-red-900/40 border-red-600/60 text-red-300 hover:bg-red-800/50'
              : 'bg-gray-800/30 border-gray-700/40 text-gray-600 cursor-not-allowed'}`}
        >
          <span className="text-2xl">⚔️</span>
          <span className="font-bold text-xs">{T.allocateStr}</span>
          <span className="text-[10px] opacity-70">{T.strDesc}</span>
        </button>
        <button
          disabled={!canAllocate}
          onClick={() => allocateStat('vit')}
          className={`rounded-xl p-3 flex flex-col items-center gap-1 border transition-all active:scale-95
            ${canAllocate
              ? 'bg-green-900/40 border-green-600/60 text-green-300 hover:bg-green-800/50'
              : 'bg-gray-800/30 border-gray-700/40 text-gray-600 cursor-not-allowed'}`}
        >
          <span className="text-2xl">🛡️</span>
          <span className="font-bold text-xs">{T.allocateVit}</span>
          <span className="text-[10px] opacity-70">{T.vitDesc}</span>
        </button>
      </div>

      {/* Class passive display */}
      {cls && (
        <div className={`rounded-xl border border-purple-700/40 bg-gradient-to-r ${cls.color} p-3`}>
          <p className="text-xs text-purple-200 font-bold mb-1.5">
            {cls.emoji} อาชีพ: {cls.name} — {T.classPassive}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {cls.passive.atkBonus !== 0 && <span className="text-[10px] text-red-300">⚔️ ATK {cls.passive.atkBonus > 0 ? '+' : ''}{cls.passive.atkBonus}%</span>}
            {cls.passive.defBonus > 0   && <span className="text-[10px] text-blue-300">🛡 DEF +{cls.passive.defBonus}%</span>}
            {cls.passive.hpBonus  !== 0 && <span className="text-[10px] text-green-300">❤️ HP {cls.passive.hpBonus > 0 ? '+' : ''}{cls.passive.hpBonus}%</span>}
            {cls.passive.critBonus > 0  && <span className="text-[10px] text-yellow-300">💥 Crit +{cls.passive.critBonus * 100}%</span>}
            {cls.passive.goldBonus > 0  && <span className="text-[10px] text-yellow-400">🪙 Gold +{cls.passive.goldBonus}%</span>}
            {cls.passive.expBonus  > 0  && <span className="text-[10px] text-violet-300">⭐ EXP +{cls.passive.expBonus}%</span>}
          </div>
          <div className="mt-2 bg-black/30 rounded-lg px-2 py-1">
            <span className="text-[10px] text-purple-200 font-bold">{cls.skill.emoji} {T.classSkill}: {cls.skill.name}</span>
            <span className="text-[10px] text-gray-400 ml-1">CD {cls.skill.cooldownSec}s</span>
          </div>
        </div>
      )}

      {/* Stats table */}
      <div className="bg-gray-900/60 border border-purple-900/40 rounded-xl px-3 py-1">
        <p className="text-xs text-purple-400 font-bold pt-2 pb-1">{T.currentStats}</p>
        <StatRow label={T.level}         value={player.level} />
        <StatRow label="STR"             value={player.str}   sub="กำลัง" />
        <StatRow label="VIT"             value={player.vit}   sub="ความทน" />
        <StatRow label={T.atk}           value={finalAtk}     sub={cls ? `×${atkMult.toFixed(2)}` : undefined} />
        <StatRow label={T.def}           value={finalDef}     sub={cls ? `×${defMult.toFixed(2)}` : undefined} />
        <StatRow label={`${T.hp} (Max)`} value={finalMaxHp}   sub={cls ? `×${hpMult.toFixed(2)}` : undefined} />
        <StatRow label="Crit Chance"     value={`${critChance.toFixed(0)}%`} />
      </div>
    </div>
  )
}
