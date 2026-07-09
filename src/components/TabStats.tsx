// ============================================================
// TabStats.tsx — Detailed character status + stat allocation
// ============================================================
import { useGameStore } from '../store/gameStore'
import { T } from '../constants/translations'
import { GAME_CONFIG, itemBonusAtk, itemBonusDef, itemBonusHp } from '../constants/gameConfig'
import { CLASSES } from '../constants/classes'

function StatRow({ label, finalValue, baseValue, equipValue, classText }: { label: string; finalValue: number | string; baseValue?: number; equipValue?: number; classText?: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-gray-200">{label}</span>
        <span className="text-base font-black text-yellow-300">{finalValue}</span>
      </div>
      {(baseValue !== undefined || equipValue !== undefined || classText) && (
        <div className="mt-1 flex flex-wrap gap-1.5 text-[9px]">
          {baseValue !== undefined && <span className="rounded-full bg-gray-800 px-2 py-0.5 text-gray-400">Base {baseValue}</span>}
          {equipValue !== undefined && <span className="rounded-full bg-blue-950/60 px-2 py-0.5 text-blue-300">Equip +{equipValue}</span>}
          {classText && <span className="rounded-full bg-purple-950/60 px-2 py-0.5 text-purple-300">{classText}</span>}
        </div>
      )}
    </div>
  )
}

function AllocateCard({ disabled, icon, title, desc, preview, onClick, tone }: { disabled: boolean; icon: string; title: string; desc: string; preview: string; onClick: () => void; tone: string }) {
  return (
    <button disabled={disabled} onClick={onClick} className={`rounded-2xl border p-3 text-left transition-all active:scale-95 ${disabled ? 'border-gray-700/40 bg-gray-800/30 text-gray-600' : tone}`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs font-black">{title}</p>
          <p className="text-[10px] opacity-70">{desc}</p>
        </div>
      </div>
      <p className="mt-2 rounded-lg bg-black/25 px-2 py-1 text-[10px] font-bold">{preview}</p>
    </button>
  )
}

export function TabStats() {
  const player = useGameStore(s => s.player)
  const equipment = useGameStore(s => s.equipment)
  const allocateStat = useGameStore(s => s.allocateStat)
  const quest = useGameStore(s => s.quest)
  const canAllocate = player.statPoints > 0

  const cls = player.classId ? CLASSES.find(c => c.id === player.classId) : null
  const eqItems = [equipment.weapon, equipment.armor, equipment.accessory].filter(Boolean)
  const eqAtk = eqItems.reduce((sum, item) => sum + itemBonusAtk(item!), 0)
  const eqDef = eqItems.reduce((sum, item) => sum + itemBonusDef(item!), 0)
  const eqHp = eqItems.reduce((sum, item) => sum + itemBonusHp(item!), 0)

  const baseAtk = GAME_CONFIG.atkFormula(player.str, player.baseAtk)
  const baseHp = GAME_CONFIG.maxHpFormula(player.vit, player.baseHp)
  const baseDef = player.baseDef
  const atkMult = cls ? 1 + cls.passive.atkBonus / 100 : 1
  const defMult = cls ? 1 + cls.passive.defBonus / 100 : 1
  const hpMult = cls ? 1 + cls.passive.hpBonus / 100 : 1
  const critChance = (0.10 + (cls?.passive.critBonus ?? 0)) * 100
  const finalAtk = Math.floor((baseAtk + eqAtk) * atkMult)
  const finalDef = Math.floor((baseDef + eqDef) * defMult)
  const finalMaxHp = Math.floor((baseHp + eqHp) * hpMult)
  const nextStrAtk = Math.floor((GAME_CONFIG.atkFormula(player.str + 1, player.baseAtk) + eqAtk) * atkMult)
  const nextVitHp = Math.floor((GAME_CONFIG.maxHpFormula(player.vit + 1, player.baseHp) + eqHp) * hpMult)

  return (
    <div className="h-full overflow-y-auto thin-scroll px-3 py-2 flex flex-col gap-3">
      <div className="rounded-2xl border border-purple-700/40 bg-gradient-to-br from-purple-950/60 to-black/30 p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-black text-white">{player.name}</p>
            <p className="text-[10px] text-gray-400">{cls ? `${cls.emoji} ${cls.name}` : 'ยังไม่เลือกอาชีพ'} · เควสสำเร็จ {quest.completedQuestIds.length}</p>
          </div>
          <div className="rounded-xl bg-black/30 px-3 py-1 text-center">
            <p className="text-[9px] text-gray-500">เลเวล</p>
            <p className="text-lg font-black text-yellow-300">{player.level}</p>
          </div>
        </div>
      </div>

      {canAllocate ? (
        <div className="rounded-2xl border border-yellow-400/40 bg-yellow-400/10 p-3 text-center">
          <p className="text-sm font-bold text-yellow-300">✨ {T.statPoints}: <span className="text-lg text-yellow-100">{player.statPoints}</span></p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-700 bg-gray-800/30 p-2 text-center"><p className="text-xs text-gray-600">{T.noPoints}</p></div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <AllocateCard disabled={!canAllocate} icon="⚔️" title={T.allocateStr} desc={T.strDesc} preview={`ATK ${finalAtk} → ${nextStrAtk} (+${nextStrAtk - finalAtk})`} onClick={() => allocateStat('str')} tone="border-red-600/60 bg-red-900/40 text-red-200" />
        <AllocateCard disabled={!canAllocate} icon="🛡️" title={T.allocateVit} desc={T.vitDesc} preview={`HP ${finalMaxHp} → ${nextVitHp} (+${nextVitHp - finalMaxHp})`} onClick={() => allocateStat('vit')} tone="border-green-600/60 bg-green-900/40 text-green-200" />
      </div>

      {cls && (
        <div className={`rounded-2xl border border-purple-700/40 bg-gradient-to-r ${cls.color} p-3`}>
          <p className="mb-1.5 text-xs font-bold text-purple-100">{cls.emoji} อาชีพ: {cls.name} — {T.classPassive}</p>
          <div className="flex flex-wrap gap-1.5">
            {cls.passive.atkBonus !== 0 && <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] text-red-300">ATK {cls.passive.atkBonus > 0 ? '+' : ''}{cls.passive.atkBonus}%</span>}
            {cls.passive.defBonus > 0 && <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] text-blue-300">DEF +{cls.passive.defBonus}%</span>}
            {cls.passive.hpBonus !== 0 && <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] text-green-300">HP {cls.passive.hpBonus > 0 ? '+' : ''}{cls.passive.hpBonus}%</span>}
            {cls.passive.critBonus > 0 && <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] text-yellow-300">Crit +{cls.passive.critBonus * 100}%</span>}
            {cls.passive.goldBonus > 0 && <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] text-yellow-400">Gold +{cls.passive.goldBonus}%</span>}
            {cls.passive.expBonus > 0 && <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] text-violet-300">EXP +{cls.passive.expBonus}%</span>}
          </div>
          <div className="mt-2 rounded-lg bg-black/30 px-2 py-1"><span className="text-[10px] font-bold text-purple-100">{cls.skill.emoji} {T.classSkill}: {cls.skill.name}</span><span className="ml-1 text-[10px] text-gray-400">CD {cls.skill.cooldownSec}s</span></div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        <StatRow label={T.atk} finalValue={finalAtk} baseValue={baseAtk} equipValue={eqAtk} classText={cls ? `Class ×${atkMult.toFixed(2)}` : undefined} />
        <StatRow label={T.def} finalValue={finalDef} baseValue={baseDef} equipValue={eqDef} classText={cls ? `Class ×${defMult.toFixed(2)}` : undefined} />
        <StatRow label={`${T.hp} สูงสุด`} finalValue={finalMaxHp} baseValue={baseHp} equipValue={eqHp} classText={cls ? `Class ×${hpMult.toFixed(2)}` : undefined} />
        <StatRow label="โอกาสคริติคอล" finalValue={`${critChance.toFixed(0)}%`} baseValue={10} classText={cls?.passive.critBonus ? `Class +${cls.passive.critBonus * 100}%` : undefined} />
      </div>

      <div className="grid grid-cols-4 gap-1.5 text-center">
        <div className="rounded-xl border border-white/5 bg-black/20 py-2"><p className="text-[9px] text-gray-500">STR</p><p className="font-black text-red-300">{player.str}</p></div>
        <div className="rounded-xl border border-white/5 bg-black/20 py-2"><p className="text-[9px] text-gray-500">VIT</p><p className="font-black text-green-300">{player.vit}</p></div>
        <div className="rounded-xl border border-white/5 bg-black/20 py-2"><p className="text-[9px] text-gray-500">Kills</p><p className="font-black text-purple-300">{player.totalKills}</p></div>
        <div className="rounded-xl border border-white/5 bg-black/20 py-2"><p className="text-[9px] text-gray-500">Boss</p><p className="font-black text-yellow-300">{player.bossKills}</p></div>
      </div>
    </div>
  )
}
