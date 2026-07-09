// ============================================================
// CombatZone.tsx — v6: Field map + multi-monster swarm view
// ============================================================
import { useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import { FloatingNumbers } from './FloatingNumbers'
import { SkillButton } from './SkillButton'
import { ParticleCanvas } from './ParticleCanvas'
import { PixelSprite, classSprite } from './PixelSprite'
import { T } from '../constants/translations'
import {
  GAME_CONFIG,
  STAGES,
  itemBonusAtk,
  itemBonusDef,
  itemBonusHp,
  MONSTERS,
} from '../constants/gameConfig'
import { CLASSES, getBossForLevel } from '../constants/classes'

const SWARM_SLOTS = [
  { x: 18, y: 26, scale: 0.82, delay: '-0.1s' },
  { x: 76, y: 24, scale: 0.78, delay: '-0.8s' },
  { x: 14, y: 58, scale: 0.9, delay: '-1.2s' },
  { x: 78, y: 60, scale: 0.95, delay: '-0.4s' },
  { x: 50, y: 18, scale: 0.7, delay: '-1.7s' },
  { x: 30, y: 74, scale: 0.72, delay: '-0.6s' },
  { x: 66, y: 76, scale: 0.72, delay: '-1.4s' },
]

function hpPct(current: number, max: number) {
  return max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0
}

function FieldMonster({
  id,
  name,
  x,
  y,
  scale,
  delay,
  active,
  boss,
  hp,
  maxHp,
}: {
  id: string
  name: string
  x: number
  y: number
  scale: number
  delay: string
  active?: boolean
  boss?: boolean
  hp?: number
  maxHp?: number
}) {
  const percent = hp !== undefined && maxHp ? hpPct(hp, maxHp) : 100
  return (
    <div
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 ${active ? 'field-monster-active' : 'field-monster'} ${boss ? 'field-boss' : ''}`}
      style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${boss ? scale * 1.35 : scale})`, animationDelay: delay }}
    >
      {active && <div className="target-ring" />}
      <PixelSprite id={boss ? 'boss' : id} size={boss ? 58 : 42} animate={boss ? 'attack' : active ? 'hurt' : 'idle'} />
      {active && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-20">
          <p className={`text-[9px] text-center font-bold truncate ${boss ? 'boss-shimmer' : 'text-red-200'}`}>{boss ? '☠️ ' : ''}{name}</p>
          <div className="h-1 rounded-full bg-black/70 overflow-hidden border border-red-900/40">
            <div className={`h-full rounded-full ${boss ? 'bg-yellow-400' : 'bg-red-500'} bar-fill`} style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

export function CombatZone() {
  const player = useGameStore(s => s.player)
  const monster = useGameStore(s => s.monster)
  const equipment = useGameStore(s => s.equipment)
  const isAuto = useGameStore(s => s.isAutoBattle)
  const setAuto = useGameStore(s => s.setAutoBattle)
  const currentStageId = useGameStore(s => s.currentStageId)
  const killsSinceBoss = useGameStore(s => s.killsSinceBoss)

  const stage = STAGES.find(st => st.id === currentStageId) ?? STAGES[0]
  const cls = player.classId ? CLASSES.find(c => c.id === player.classId) : null
  const eqItems = [equipment.weapon, equipment.armor, equipment.accessory].filter(Boolean)
  const totalEqHp = eqItems.reduce((sum, item) => sum + itemBonusHp(item!), 0)
  const totalEqAtk = eqItems.reduce((sum, item) => sum + itemBonusAtk(item!), 0)
  const totalEqDef = eqItems.reduce((sum, item) => sum + itemBonusDef(item!), 0)
  const hpMult = cls ? 1 + cls.passive.hpBonus / 100 : 1
  const maxHp = Math.floor((GAME_CONFIG.maxHpFormula(player.vit, player.baseHp) + totalEqHp) * hpMult)
  const playerHp = hpPct(player.currentHp, maxHp)

  const bossTemplate = getBossForLevel(player.level)
  const killsToNext = Math.max(0, bossTemplate.killsRequired - killsSinceBoss)
  const bossProgress = Math.min(100, (killsSinceBoss / bossTemplate.killsRequired) * 100)

  const swarm = useMemo(() => {
    const pool = MONSTERS.filter(m => stage.monsterIds.includes(m.id))
    const fallback = pool.length > 0 ? pool : MONSTERS
    return SWARM_SLOTS.map((slot, index) => ({
      ...slot,
      template: index === 0 ? monster.template : fallback[index % fallback.length],
      active: index === 0,
    }))
  }, [stage.monsterIds, monster.template])

  const stageTone =
    currentStageId === 'morroc' ? 'from-amber-950 via-orange-950 to-stone-950'
    : currentStageId === 'glast_heim' ? 'from-slate-950 via-gray-950 to-purple-950'
    : currentStageId === 'orc_village' ? 'from-red-950 via-stone-950 to-orange-950'
    : currentStageId === 'payon_forest' ? 'from-emerald-950 via-teal-950 to-green-950'
    : 'from-green-950 via-emerald-950 to-slate-950'

  return (
    <section className="flex-1 min-h-0 flex flex-col px-3 py-2 gap-1.5 relative overflow-hidden">
      <ParticleCanvas />

      <div className="relative z-20 flex items-center justify-between">
        <span className="text-[10px] text-purple-300 font-bold glass rounded-full px-2 py-0.5">
          {stage.emoji} {stage.name}
        </span>
        <span className={`text-[9px] font-bold glass rounded-full px-2 py-0.5 ${isAuto ? 'text-green-300' : 'text-gray-500'}`}>
          {isAuto ? '⚔️ เดินล่าอัตโนมัติ' : '💤 หยุดเดิน'}
        </span>
      </div>

      <div className={`relative z-10 flex-1 min-h-[190px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${stageTone} shadow-2xl shadow-black/30`}> 
        <div className="field-grid" />
        <div className="field-path field-path-a" />
        <div className="field-path field-path-b" />
        <div className="field-vignette" />

        {/* map props */}
        <span className="field-prop" style={{ left: '12%', top: '18%' }}>🌳</span>
        <span className="field-prop" style={{ left: '84%', top: '18%' }}>🌲</span>
        <span className="field-prop" style={{ left: '8%', top: '78%' }}>🪨</span>
        <span className="field-prop" style={{ left: '88%', top: '78%' }}>🌿</span>
        <span className="field-prop opacity-60" style={{ left: '48%', top: '82%' }}>✨</span>

        {/* swarm monsters */}
        {swarm.map((mob, index) => (
          <FieldMonster
            key={`${mob.template.id}-${index}-${monster.isBoss ? 'boss' : 'mob'}`}
            id={mob.template.id}
            name={mob.template.name}
            x={monster.isBoss && index === 0 ? 50 : mob.x}
            y={monster.isBoss && index === 0 ? 28 : mob.y}
            scale={monster.isBoss && index === 0 ? 1.15 : mob.scale}
            delay={mob.delay}
            active={index === 0}
            boss={monster.isBoss && index === 0}
            hp={index === 0 ? monster.currentHp : undefined}
            maxHp={index === 0 ? monster.maxHp : undefined}
          />
        ))}

        {/* player */}
        <div className="absolute z-20 left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 field-player">
          <div className="player-aura" />
          <PixelSprite id={classSprite(player.classId)} size={62} animate={isAuto ? 'attack' : 'idle'} />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-24">
            <p className="text-[9px] text-center text-blue-100 font-bold truncate">{player.name}</p>
            <div className="h-1.5 rounded-full bg-black/70 overflow-hidden border border-blue-900/40">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-300 bar-fill" style={{ width: `${playerHp}%` }} />
            </div>
          </div>
        </div>

        <FloatingNumbers />
      </div>

      <div className="relative z-20 grid grid-cols-[1fr_auto] gap-2 items-center">
        <div>
          <div className="flex justify-between text-[9px] text-gray-600 mb-0.5">
            <span>บอสถัดไป</span>
            <span className="text-orange-400">{monster.isBoss ? '☠️ กำลังรุมบอส!' : T.killsToNextBoss(killsToNext)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-800/80 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-orange-700 to-yellow-500 bar-fill" style={{ width: `${monster.isBoss ? 100 : bossProgress}%` }} />
          </div>
          {eqItems.length > 0 && (
            <div className="mt-0.5 flex gap-2 text-[9px]">
              {totalEqAtk > 0 && <span className="text-red-400">⚔️+{totalEqAtk}</span>}
              {totalEqDef > 0 && <span className="text-blue-400">🛡+{totalEqDef}</span>}
              {totalEqHp > 0 && <span className="text-green-400">❤️+{totalEqHp}</span>}
            </div>
          )}
        </div>
        <div className="text-[9px] text-right text-gray-500 leading-tight">
          <div>มอนบนแมพ: {swarm.length}</div>
          <div className="text-purple-400">Auto target: {monster.template.name}</div>
        </div>
      </div>

      <div className="relative z-20 flex gap-2">
        <button
          onClick={() => setAuto(!isAuto)}
          className={`flex-1 py-2 rounded-xl font-bold text-xs tracking-wide btn-press ${isAuto ? 'bg-gradient-to-r from-green-700 to-emerald-500 text-white shadow-lg shadow-green-900/40' : 'glass text-gray-400 border border-gray-700/50'}`}
        >
          {isAuto ? '🤖 เดินล่า / มอนรุม' : '▶️ เริ่มเดินล่า'}
        </button>
        <SkillButton />
      </div>
    </section>
  )
}
