// ============================================================
// CombatZone.tsx — v6: Field map + multi-monster swarm view
// ============================================================
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
} from '../constants/gameConfig'
import { CLASSES, getBossForLevel } from '../constants/classes'

const SWARM_DELAYS = ['-0.1s', '-0.8s', '-1.2s', '-0.4s', '-1.7s', '-0.6s', '-1.4s', '-2.0s', '-0.3s', '-1.1s']

const STAGE_PROPS: Record<string, Array<{ icon: string; x: number; y: number; size?: number; opacity?: number }>> = {
  prontera: [
    { icon: '🌳', x: 11, y: 18, size: 24 }, { icon: '🌲', x: 84, y: 17, size: 22 },
    { icon: '🌾', x: 18, y: 54 }, { icon: '🌼', x: 40, y: 73 }, { icon: '🪨', x: 86, y: 78 },
    { icon: '🏕️', x: 63, y: 21, size: 20, opacity: 0.75 }, { icon: '✨', x: 51, y: 84, opacity: 0.65 },
  ],
  payon_forest: [
    { icon: '🌲', x: 10, y: 16, size: 25 }, { icon: '🌳', x: 27, y: 25, size: 24 },
    { icon: '🍄', x: 73, y: 30 }, { icon: '🌿', x: 89, y: 62 }, { icon: '🪵', x: 18, y: 79 },
    { icon: '💧', x: 58, y: 78, opacity: 0.75 }, { icon: '🪨', x: 42, y: 15 },
  ],
  morroc: [
    { icon: '🌵', x: 12, y: 20, size: 25 }, { icon: '🏺', x: 76, y: 22 },
    { icon: '🦂', x: 88, y: 50, opacity: 0.75 }, { icon: '🪨', x: 25, y: 78 }, { icon: '🔥', x: 56, y: 16, opacity: 0.7 },
    { icon: '⛺', x: 70, y: 76, size: 20, opacity: 0.8 },
  ],
  glast_heim: [
    { icon: '🪦', x: 13, y: 22, size: 22 }, { icon: '🏚️', x: 80, y: 20, size: 24 },
    { icon: '🕯️', x: 42, y: 18 }, { icon: '💀', x: 88, y: 72 }, { icon: '🪨', x: 20, y: 80 },
    { icon: '🕸️', x: 61, y: 78, opacity: 0.75 },
  ],
  orc_village: [
    { icon: '🛖', x: 16, y: 20, size: 24 }, { icon: '🔥', x: 78, y: 27 },
    { icon: '🪓', x: 87, y: 62 }, { icon: '🪵', x: 27, y: 78 }, { icon: '🚩', x: 53, y: 17 },
    { icon: '🪨', x: 70, y: 80 },
  ],
}

const GROUP_LABELS = ['เป้าหมาย', 'ฝูงเหนือซ้าย', 'ฝูงเหนือขวา', 'ฝูงใต้ซ้าย', 'ฝูงใต้ขวา', 'เฝ้าทางเข้า']

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
  group,
  pathVariant,
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
  group?: number
  pathVariant?: number
}) {
  const percent = hp !== undefined && maxHp ? hpPct(hp, maxHp) : 100
  return (
    <div
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 ${active ? 'field-monster-active' : 'field-monster'} field-roam-${pathVariant ?? 0} ${boss ? 'field-boss' : ''}`}
      style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) scale(${boss ? scale * 1.35 : scale})`, animationDelay: delay }}
    >
      {active && <div className="target-ring" />}
      {!active && group !== undefined && group > 0 && <div className="mob-shadow" />}
      <PixelSprite id={boss ? 'boss' : id} size={boss ? 58 : 42} animate={boss ? 'attack' : active ? 'hurt' : 'idle'} />
      {active && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-20">
          <p className={`text-[9px] text-center font-bold truncate ${boss ? 'boss-shimmer' : 'text-red-200'}`}>{boss ? '☠️ ' : ''}{name}</p>
          <div className="h-1 rounded-full bg-black/70 overflow-hidden border border-red-900/40">
            <div className={`h-full rounded-full ${boss ? 'bg-yellow-400' : 'bg-red-500'} bar-fill`} style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}
      {!active && group !== undefined && group > 0 && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-1.5 text-[7px] font-bold text-amber-100 border border-white/10 whitespace-nowrap">
          กลุ่ม {group}
        </span>
      )}
    </div>
  )
}

export function CombatZone() {
  const player = useGameStore(s => s.player)
  const monster = useGameStore(s => s.monster)
  const fieldMobs = useGameStore(s => s.fieldMobs)
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

  const swarm = fieldMobs?.length ? fieldMobs : [{
    ...monster,
    uid: 'fallback-target',
    slot: 0,
    x: 50,
    y: 30,
    scale: monster.isBoss ? 1.2 : 0.9,
    group: 0,
    pathVariant: 0,
  }]

  const props = STAGE_PROPS[currentStageId] ?? STAGE_PROPS.prontera
  const mobGroups = Array.from(new Set(swarm.map(mob => mob.group).filter(group => group > 0))).length

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
        <div className="field-biome" />
        <div className="field-grid" />
        <div className="field-path field-path-a" />
        <div className="field-path field-path-b" />
        <div className="field-path field-path-c" />
        <div className="field-river" />
        <div className="field-vignette" />

        {[1, 2, 3, 4].map(group => (
          <div key={group} className={`mob-camp mob-camp-${group}`}>
            <span>{GROUP_LABELS[group]}</span>
          </div>
        ))}

        <div className="hero-route" />
        <div className="route-dot route-dot-a" />
        <div className="route-dot route-dot-b" />
        <div className="route-dot route-dot-c" />

        {props.map((prop, index) => (
          <span
            key={`${prop.icon}-${index}`}
            className="field-prop"
            style={{ left: `${prop.x}%`, top: `${prop.y}%`, fontSize: prop.size ? `${prop.size}px` : undefined, opacity: prop.opacity ?? undefined }}
          >
            {prop.icon}
          </span>
        ))}

        {/* swarm monsters */}
        {swarm.map((mob, index) => (
          <FieldMonster
            key={mob.uid ?? `${mob.template.id}-${index}`}
            id={mob.template.id}
            name={mob.template.name}
            x={mob.isBoss && index === 0 ? 50 : mob.x}
            y={mob.isBoss && index === 0 ? 28 : mob.y}
            scale={mob.isBoss && index === 0 ? 1.15 : mob.scale}
            delay={SWARM_DELAYS[index % SWARM_DELAYS.length]}
            active={index === 0}
            boss={mob.isBoss && index === 0}
            hp={index === 0 ? mob.currentHp : undefined}
            maxHp={index === 0 ? mob.maxHp : undefined}
            group={mob.group}
            pathVariant={mob.pathVariant}
          />
        ))}

        {/* player */}
        <div className="absolute z-20 left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 field-player field-player-roam">
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
          <div>กลุ่มมอน: {mobGroups}</div>
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
