// ============================================================
// CombatZone.tsx — v5: PixelSprite characters
// ============================================================
import { useGameStore }    from '../store/gameStore'
import { FloatingNumbers } from './FloatingNumbers'
import { SkillButton }     from './SkillButton'
import { ParticleCanvas }  from './ParticleCanvas'
import { PixelSprite, classSprite } from './PixelSprite'
import { T }               from '../constants/translations'
import {
  GAME_CONFIG, STAGES,
  itemBonusAtk, itemBonusDef, itemBonusHp,
} from '../constants/gameConfig'
import { CLASSES, getBossForLevel } from '../constants/classes'

function EntityCard({
  name, spriteId, currentHp, maxHp, isPlayer, isBoss,
}: {
  name: string; spriteId: string; currentHp: number; maxHp: number
  isPlayer?: boolean; isBoss?: boolean
}) {
  const pct    = maxHp > 0 ? Math.min(100, (currentHp / maxHp) * 100) : 0
  const lowHp  = pct < 25

  const border  = isBoss ? 'border-yellow-500/50 neon-border-gold' : isPlayer ? 'border-blue-600/30 neon-border' : 'border-red-700/30'
  const barCol  = isPlayer
    ? 'bg-gradient-to-r from-blue-600 to-cyan-400'
    : isBoss ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
    : lowHp   ? 'bg-gradient-to-r from-red-700 to-red-400 animate-pulse'
    : 'bg-gradient-to-r from-red-600 to-rose-400'

  return (
    <div className={`flex-1 rounded-2xl glass p-2 flex flex-col items-center gap-1.5 min-w-0 ${border} ${isBoss ? 'boss-warn-bg' : ''}`}>
      {/* Pixel sprite */}
      <PixelSprite
        id={spriteId}
        size={48}
        animate={isPlayer ? 'idle' : isBoss ? 'attack' : 'idle'}
      />
      <div className="text-center w-full">
        {isBoss && <p className="boss-shimmer text-[9px] font-black tracking-widest">☠️ BOSS</p>}
        <p className="text-xs font-bold text-white truncate w-full">{name}</p>
      </div>
      <div className="w-full">
        <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
          <span>HP</span>
          <span className={lowHp && !isPlayer ? 'text-red-400 animate-pulse' : ''}>
            {Math.max(0, currentHp)}/{maxHp}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-gray-800/80 overflow-hidden">
          <div className={`h-full rounded-full bar-fill ${barCol}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

export function CombatZone() {
  const player         = useGameStore(s => s.player)
  const monster        = useGameStore(s => s.monster)
  const equipment      = useGameStore(s => s.equipment)
  const isAuto         = useGameStore(s => s.isAutoBattle)
  const setAuto        = useGameStore(s => s.setAutoBattle)
  const currentStageId = useGameStore(s => s.currentStageId)
  const killsSinceBoss = useGameStore(s => s.killsSinceBoss)

  const stage      = STAGES.find(st => st.id === currentStageId) ?? STAGES[0]
  const cls        = player.classId ? CLASSES.find(c => c.id === player.classId) : null
  const eqItems    = [equipment.weapon, equipment.armor, equipment.accessory].filter(Boolean)
  const totalEqHp  = eqItems.reduce((s, i) => s + itemBonusHp(i!),  0)
  const totalEqAtk = eqItems.reduce((s, i) => s + itemBonusAtk(i!), 0)
  const totalEqDef = eqItems.reduce((s, i) => s + itemBonusDef(i!), 0)
  const hpMult     = cls ? 1 + cls.passive.hpBonus / 100 : 1
  const maxHp      = Math.floor((GAME_CONFIG.maxHpFormula(player.vit, player.baseHp) + totalEqHp) * hpMult)

  const bossTemplate  = getBossForLevel(player.level)
  const killsToNext   = Math.max(0, bossTemplate.killsRequired - killsSinceBoss)
  const bossProgress  = Math.min(100, (killsSinceBoss / bossTemplate.killsRequired) * 100)

  // Get monster sprite id
  const monsterSpriteId = monster.isBoss ? 'boss' : monster.template.id

  return (
    <section className="flex-1 min-h-0 flex flex-col px-3 py-2 gap-1.5 relative overflow-hidden">
      {/* BG grid */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#A78BFA 1px,transparent 1px),linear-gradient(90deg,#A78BFA 1px,transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <ParticleCanvas />

      {/* Stage strip */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[10px] text-purple-400 font-semibold">{stage.emoji} {stage.name}</span>
        <div className="flex items-center gap-2">
          {cls && (
            <span className="glass rounded-full px-2 py-0.5 text-[9px] text-purple-300 font-bold border border-purple-700/30">
              {cls.emoji} {cls.name}
            </span>
          )}
          <span className={`text-[9px] font-semibold ${isAuto ? 'text-green-400' : 'text-gray-500'}`}>
            {isAuto ? '⚔️ ON' : '💤 OFF'}
          </span>
        </div>
      </div>

      {/* VS Row */}
      <div className="relative z-10 flex items-center gap-2">
        <EntityCard
          name={player.name}
          spriteId={classSprite(player.classId)}
          currentHp={player.currentHp}
          maxHp={maxHp}
          isPlayer
        />
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-base font-black grad-text-gold">VS</span>
          <div className="w-px h-4 bg-purple-700/60" />
        </div>
        <EntityCard
          name={monster.template.name}
          spriteId={monsterSpriteId}
          currentHp={monster.currentHp}
          maxHp={monster.maxHp}
          isBoss={monster.isBoss}
        />
        <FloatingNumbers />
      </div>

      {/* Equip bonus */}
      {eqItems.length > 0 && (
        <div className="relative z-10 flex gap-3 justify-center text-[10px]">
          {totalEqAtk > 0 && <span className="text-red-400">⚔️+{totalEqAtk}</span>}
          {totalEqDef > 0 && <span className="text-blue-400">🛡+{totalEqDef}</span>}
          {totalEqHp  > 0 && <span className="text-green-400">❤️+{totalEqHp}</span>}
        </div>
      )}

      {/* Boss progress */}
      {!monster.isBoss ? (
        <div className="relative z-10">
          <div className="flex justify-between text-[9px] text-gray-600 mb-0.5">
            <span>บอสถัดไป</span>
            <span className="text-orange-500/80">{T.killsToNextBoss(killsToNext)}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-800/80 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-orange-700 to-yellow-500 bar-fill" style={{ width: `${bossProgress}%` }} />
          </div>
        </div>
      ) : (
        <p className="relative z-10 text-center text-[10px] font-black boss-shimmer animate-pulse tracking-widest">
          ☠️ BOSS BATTLE ☠️
        </p>
      )}

      {/* Action buttons */}
      <div className="relative z-10 flex gap-2">
        <button
          onClick={() => setAuto(!isAuto)}
          className={`flex-1 py-2 rounded-xl font-bold text-xs tracking-wide btn-press
            ${isAuto
              ? 'bg-gradient-to-r from-green-700 to-emerald-500 text-white shadow-lg shadow-green-900/40'
              : 'glass text-gray-400 border border-gray-700/50'}`}
        >
          {isAuto ? `🤖 ${T.autoBattle}` : `▶️ เปิดบอท`}
        </button>
        <SkillButton />
      </div>
    </section>
  )
}
