// ============================================================
// gameStore.ts — v4: + achievements + bossKills + spriteAnims
// ============================================================
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  GAME_CONFIG, spawnMonsterInStage, rollDrops,
  InventoryItem, itemBonusAtk, itemBonusDef, itemBonusHp,
  ITEM_TEMPLATES, STAGES, MonsterTemplate,
} from '../constants/gameConfig'
import { ClassId, CharacterClass, CLASSES, getBossForLevel } from '../constants/classes'
import {
  ACHIEVEMENTS, AchievementId, AchievementContext,
} from '../constants/achievements'
import { T } from '../constants/translations'

// ─── Types ───────────────────────────────────────────────────
export interface Player {
  name:       string
  level:      number
  exp:        number
  gold:       number
  baseHp:     number
  currentHp:  number
  baseAtk:    number
  baseDef:    number
  str:        number
  vit:        number
  statPoints: number
  classId:    ClassId | null
  totalKills: number
  bossKills:  number
}

export interface Equipment {
  weapon?:    InventoryItem
  armor?:     InventoryItem
  accessory?: InventoryItem
}

export interface Monster {
  template:  MonsterTemplate
  currentHp: number
  maxHp:     number
  atk:       number
  def:       number
  isBoss:    boolean
}

export interface FieldMob extends Monster {
  uid:   string
  x:     number
  y:     number
  scale: number
  slot:  number
}

export type LogType = 'attack'|'receive'|'kill'|'levelup'|'system'|'drop'|'enhance'|'skill'|'boss'|'achievement'

export interface LogEntry { id: number; text: string; type: LogType }
export interface FloatDamage { id: number; value: number; x: number; y: number; isCrit: boolean; isSkill?: boolean }
export interface OfflineResult { seconds: number; kills: number; exp: number; gold: number }
export interface AchievementPopup { id: string; name: string; emoji: string; reward: string }

export interface GameState {
  player:           Player
  equipment:        Equipment
  inventory:        InventoryItem[]
  monster:          Monster
  fieldMobs:        FieldMob[]
  log:              LogEntry[]
  floats:           FloatDamage[]
  lastLogin:        number
  currentStageId:   string
  isAutoBattle:     boolean
  offlineResult:    OfflineResult | null
  killsSinceBoss:   number
  skillCooldownEnd: number
  unlockedAchievements: AchievementId[]
  achievementPopups:    AchievementPopup[]
  logIdCounter:     number
  floatIdCounter:   number
  offlineSeconds:   number   // last offline duration for achievement check

  tickBattle:             () => void
  useSkill:               () => void
  selectClass:            (id: ClassId) => void
  allocateStat:           (stat: 'str' | 'vit') => void
  equipItem:              (uid: string) => void
  unequipSlot:            (slot: keyof Equipment) => void
  enhanceItem:            (uid: string) => void
  setStage:               (stageId: string) => void
  dismissOfflineResult:   () => void
  removeFloat:            (id: number) => void
  clearLog:               () => void
  setAutoBattle:          (v: boolean) => void
  computeOfflineProgress: (nowMs: number) => void
  saveLastLogin:          () => void
  addLog:                 (text: string, type: LogType) => void
  dismissAchievementPopup:(id: string) => void
  checkAchievements:      () => void
}

// ─── Helpers ─────────────────────────────────────────────────
let _logId   = Date.now()
let _floatId = Date.now() + 1

function getCharClass(id: ClassId | null): CharacterClass | null {
  return id ? CLASSES.find(c => c.id === id) ?? null : null
}
function getEquipBonus(eq: Equipment) {
  const items = [eq.weapon, eq.armor, eq.accessory].filter(Boolean) as InventoryItem[]
  return {
    atk: items.reduce((s, i) => s + itemBonusAtk(i), 0),
    def: items.reduce((s, i) => s + itemBonusDef(i), 0),
    hp:  items.reduce((s, i) => s + itemBonusHp(i), 0),
  }
}
function getMaxHp(p: Player, eq: Equipment) {
  const cls = getCharClass(p.classId)
  return Math.floor((GAME_CONFIG.maxHpFormula(p.vit, p.baseHp) + getEquipBonus(eq).hp) * (cls ? 1 + cls.passive.hpBonus / 100 : 1))
}
function getAtk(p: Player, eq: Equipment) {
  const cls = getCharClass(p.classId)
  return Math.floor((GAME_CONFIG.atkFormula(p.str, p.baseAtk) + getEquipBonus(eq).atk) * (cls ? 1 + cls.passive.atkBonus / 100 : 1))
}
function getDef(p: Player, eq: Equipment) {
  const cls = getCharClass(p.classId)
  return Math.floor((p.baseDef + getEquipBonus(eq).def) * (cls ? 1 + cls.passive.defBonus / 100 : 1))
}
function getCrit(p: Player) {
  const cls = getCharClass(p.classId)
  return 0.10 + (cls?.passive.critBonus ?? 0)
}
function calcDmg(atk: number, def: number, crit: number) {
  const base = Math.max(1, atk - def + Math.floor(Math.random() * 5 - 2))
  const isCrit = Math.random() < crit
  return { dmg: isCrit ? Math.floor(base * 1.8) : base, isCrit }
}
function spawnBoss(stageId: string, playerLevel: number): Monster {
  const bossT   = getBossForLevel(playerLevel)
  const base    = spawnMonsterInStage(stageId, playerLevel)
  const maxHp   = Math.floor(base.maxHp  * bossT.hpMultiplier)
  return {
    template: { ...base.template, id: bossT.id, name: bossT.name, emoji: bossT.emoji,
      expReward:  Math.floor(base.template.expReward  * bossT.expMultiplier),
      goldReward: Math.floor(base.template.goldReward * bossT.goldMultiplier),
      dropTable:  [{ templateId: bossT.guaranteedDropId, chance: 1.0 }] },
    currentHp: maxHp, maxHp,
    atk: Math.floor(base.atk * bossT.atkMultiplier),
    def: Math.floor(base.def * bossT.defMultiplier),
    isBoss: true,
  }
}

const FIELD_SPAWNS = [
  { x: 18, y: 26, scale: 0.82 },
  { x: 76, y: 24, scale: 0.78 },
  { x: 14, y: 58, scale: 0.9 },
  { x: 78, y: 60, scale: 0.95 },
  { x: 50, y: 18, scale: 0.7 },
  { x: 30, y: 74, scale: 0.72 },
  { x: 66, y: 76, scale: 0.72 },
]

function withFieldMeta(monster: Monster, slot: number): FieldMob {
  const spawn = FIELD_SPAWNS[slot % FIELD_SPAWNS.length]
  return {
    ...monster,
    uid: `${monster.template.id}_${Date.now()}_${slot}_${Math.random().toString(36).slice(2, 6)}`,
    slot,
    x: spawn.x,
    y: spawn.y,
    scale: monster.isBoss ? spawn.scale * 1.25 : spawn.scale,
  }
}

function spawnFieldMob(stageId: string, playerLevel: number, slot: number): FieldMob {
  return withFieldMeta({ ...spawnMonsterInStage(stageId, playerLevel), isBoss: false }, slot)
}

function spawnField(stageId: string, playerLevel: number, active?: Monster): FieldMob[] {
  return FIELD_SPAWNS.map((_, slot) =>
    slot === 0 && active ? withFieldMeta(active, slot) : spawnFieldMob(stageId, playerLevel, slot)
  )
}

function buildAchievementContext(
  s: GameState, inGuild: boolean, offlineSec: number
): AchievementContext {
  const allItems = [
    ...s.inventory,
    ...[s.equipment.weapon, s.equipment.armor, s.equipment.accessory].filter(Boolean) as InventoryItem[],
  ]
  return {
    totalKills:    s.player.totalKills,
    level:         s.player.level,
    bossKills:     s.player.bossKills,
    inventoryLen:  s.inventory.length,
    hasEquipped:   !!(s.equipment.weapon || s.equipment.armor || s.equipment.accessory),
    maxEnhance:    allItems.length > 0 ? Math.max(...allItems.map(i => i.enhanceLevel)) : 0,
    classId:       s.player.classId,
    gold:          s.player.gold,
    unlockedStages: STAGES.filter(st => st.minLevel <= s.player.level).map(st => st.id),
    inGuild,
    offlineSeconds: offlineSec,
  }
}

function rewardLabel(reward: { type: string; amount?: number }): string {
  if (reward.type === 'gold')       return `+${reward.amount} เซนี่`
  if (reward.type === 'statpoints') return `+${reward.amount} พอยต์สถานะ`
  return '🎁 รางวัลพิเศษ'
}

// ─── Store ───────────────────────────────────────────────────
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: { ...GAME_CONFIG.INITIAL_PLAYER, classId: null, totalKills: 0, bossKills: 0 },
      equipment: {}, inventory: [],
      monster: { ...spawnMonsterInStage('prontera', 1), isBoss: false },
      fieldMobs: spawnField('prontera', 1, { ...spawnMonsterInStage('prontera', 1), isBoss: false }),
      log: [], floats: [],
      lastLogin: Date.now(),
      currentStageId: 'prontera',
      isAutoBattle: true,
      offlineResult: null,
      killsSinceBoss: 0,
      skillCooldownEnd: 0,
      unlockedAchievements: [] as AchievementId[],
      achievementPopups: [] as AchievementPopup[],
      logIdCounter: _logId, floatIdCounter: _floatId,
      offlineSeconds: 0,

      addLog: (text, type) =>
        set(s => ({ log: [{ id: _logId++, text, type }, ...s.log].slice(0, GAME_CONFIG.MAX_LOG_LINES), logIdCounter: _logId })),

      setAutoBattle:        (v)  => set({ isAutoBattle: v }),
      saveLastLogin:        ()   => set({ lastLogin: Date.now() }),
      dismissOfflineResult: ()   => set({ offlineResult: null }),
      removeFloat:          (id) => set(s => ({ floats: s.floats.filter(f => f.id !== id) })),
      clearLog:             ()   => set({ log: [] }),
      dismissAchievementPopup: (id) => set(s => ({ achievementPopups: s.achievementPopups.filter(p => p.id !== id) })),

      checkAchievements: () => {
        const s = get()
        const ctx = buildAchievementContext(s, false, s.offlineSeconds)
        const newUnlocks: AchievementId[] = []
        const newPopups: AchievementPopup[] = []

        for (const ach of ACHIEVEMENTS) {
          if (s.unlockedAchievements.includes(ach.id)) continue
          if (!ach.check(ctx)) continue

          newUnlocks.push(ach.id)
          newPopups.push({ id: ach.id, name: ach.name, emoji: ach.emoji, reward: rewardLabel(ach.reward) })

          // Apply reward
          set(sv => {
            let p = { ...sv.player }
            if (ach.reward.type === 'gold')       p.gold       += ach.reward.amount ?? 0
            if (ach.reward.type === 'statpoints') p.statPoints += ach.reward.amount ?? 0
            return { player: p }
          })
          get().addLog(`🏅 Achievement: ${ach.name} — ${rewardLabel(ach.reward)}`, 'achievement')
        }

        if (newUnlocks.length > 0) {
          set(s => ({
            unlockedAchievements: [...s.unlockedAchievements, ...newUnlocks],
            achievementPopups:    [...s.achievementPopups,    ...newPopups],
          }))
        }
      },

      selectClass: (id) => {
        const s = get()
        if (s.player.level < 10) return
        const cls = CLASSES.find(c => c.id === id)
        if (!cls) return
        set({ player: { ...s.player, classId: id } })
        get().addLog(T.classSelected(cls.name), 'system')
        setTimeout(() => get().checkAchievements(), 50)
      },

      setStage: (stageId) => {
        const s = get()
        const stage = STAGES.find(st => st.id === stageId)
        if (!stage || stage.minLevel > s.player.level) return
        const active = { ...spawnMonsterInStage(stageId, s.player.level), isBoss: false }
        set({
          currentStageId: stageId,
          monster: active,
          fieldMobs: spawnField(stageId, s.player.level, active),
          killsSinceBoss: 0,
        })
      },

      allocateStat: (stat) =>
        set(s => {
          if (s.player.statPoints <= 0) return s
          const p = { ...s.player }
          p.statPoints--
          if (stat === 'str') p.str++
          if (stat === 'vit') p.vit++
          const nm = getMaxHp(p, s.equipment)
          if (p.currentHp > nm) p.currentHp = nm
          return { player: p }
        }),

      equipItem: (uid) =>
        set(s => {
          const item = s.inventory.find(i => i.uid === uid)
          if (!item) return s
          const tmpl = ITEM_TEMPLATES.find(t => t.id === item.templateId)
          if (!tmpl) return s
          const slot = (tmpl.type === 'weapon' ? 'weapon' : tmpl.type === 'armor' ? 'armor' : 'accessory') as keyof Equipment
          const old  = s.equipment[slot]
          const inv  = s.inventory.filter(i => i.uid !== uid)
          if (old) inv.push(old)
          return { equipment: { ...s.equipment, [slot]: item }, inventory: inv }
        }),

      unequipSlot: (slot) =>
        set(s => {
          const item = s.equipment[slot]
          if (!item) return s
          return { equipment: { ...s.equipment, [slot]: undefined }, inventory: [...s.inventory, item] }
        }),

      enhanceItem: (uid) =>
        set(s => {
          const all = [...s.inventory, ...[s.equipment.weapon, s.equipment.armor, s.equipment.accessory].filter(Boolean) as InventoryItem[]]
          const item = all.find(i => i.uid === uid)
          if (!item || item.enhanceLevel >= 10) return s
          const cost = GAME_CONFIG.ENHANCE_GOLD_COST(item.enhanceLevel)
          if (s.player.gold < cost) { get().addLog(T.notEnoughGold, 'system'); return s }
          const ok   = Math.random() < (GAME_CONFIG.ENHANCE_SUCCESS_RATE[item.enhanceLevel + 1] ?? 0.05)
          const tmpl = ITEM_TEMPLATES.find(t => t.id === item.templateId)
          const name = tmpl?.name ?? item.templateId
          const p    = { ...s.player, gold: s.player.gold - cost }
          const upd  = (i: InventoryItem) => i.uid === uid ? { ...i, enhanceLevel: ok ? i.enhanceLevel + 1 : i.enhanceLevel } : i
          if (ok) get().addLog(T.enhanceSuccess(name, item.enhanceLevel + 1), 'enhance')
          else    get().addLog(T.enhanceFail(name), 'enhance')
          const newState = {
            player: p,
            inventory: s.inventory.map(upd),
            equipment: {
              weapon:    s.equipment.weapon    ? upd(s.equipment.weapon)    as InventoryItem : undefined,
              armor:     s.equipment.armor     ? upd(s.equipment.armor)     as InventoryItem : undefined,
              accessory: s.equipment.accessory ? upd(s.equipment.accessory) as InventoryItem : undefined,
            },
          }
          setTimeout(() => get().checkAchievements(), 50)
          return newState
        }),

      useSkill: () => {
        const s = get()
        const cls = getCharClass(s.player.classId)
        if (!cls || Date.now() < s.skillCooldownEnd) return
        set(sv => {
          let p = { ...sv.player }
          let fieldMobs = (sv.fieldMobs?.length ? [...sv.fieldMobs] : spawnField(sv.currentStageId, sv.player.level, sv.monster))
          let m = { ...fieldMobs[0] } as FieldMob
          let inv = [...sv.inventory]
          let ks = sv.killsSinceBoss
          const floats: FloatDamage[] = []
          let newLog = [...sv.log]
          const push = (text: string, type: LogType) => {
            newLog = [{ id: _logId++, text, type }, ...newLog].slice(0, GAME_CONFIG.MAX_LOG_LINES)
          }

          const skillDmg = Math.floor(getAtk(p, sv.equipment) * cls.skill.dmgMultiplier)
          m.currentHp = Math.max(0, m.currentHp - skillDmg)
          fieldMobs[0] = m
          push(T.skillUsed(cls.skill.name, skillDmg, m.template.name), 'skill')
          floats.push({ id: _floatId++, value: skillDmg, x: 55 + Math.random() * 10, y: 20 + Math.random() * 10, isCrit: true, isSkill: true })

          if (m.currentHp <= 0) {
            const stage = STAGES.find(st => st.id === sv.currentStageId) ?? STAGES[0]
            const gm = 1 + stage.goldBonus / 100 + (cls.passive.goldBonus / 100)
            const em = 1 + stage.expBonus / 100 + (cls.passive.expBonus / 100)
            const eg = Math.floor(m.template.expReward * em)
            const gg = Math.floor(m.template.goldReward * gm)
            p.exp += eg; p.gold += gg; p.totalKills++
            if (m.isBoss) p.bossKills++
            push(T.monsterDefeated(m.template.name), m.isBoss ? 'boss' : 'kill')
            push(T.gainExp(eg), 'system'); push(T.gainGold(gg), 'system')

            for (const d of rollDrops(m.template)) {
              const t = ITEM_TEMPLATES.find(x => x.id === d.templateId)
              if (t) { inv.push(d); push(T.itemDrop(t.name), 'drop') }
            }
            while (p.exp >= GAME_CONFIG.expToNextLevel(p.level)) {
              p.exp -= GAME_CONFIG.expToNextLevel(p.level)
              p.level++; p.statPoints += GAME_CONFIG.STAT_POINTS_PER_LEVEL
              p.baseHp += 15; p.baseAtk += 3; p.baseDef += 1; p.currentHp = getMaxHp(p, sv.equipment)
              push(T.levelUp(p.level), 'levelup'); push(T.gotStatPoints(GAME_CONFIG.STAT_POINTS_PER_LEVEL), 'system')
            }

            if (!m.isBoss) ks++; else ks = 0
            const bossT = getBossForLevel(p.level)
            if (ks >= bossT.killsRequired && !m.isBoss) {
              const boss = spawnBoss(sv.currentStageId, p.level)
              m = withFieldMeta(boss, 0)
              fieldMobs[0] = m
              push(T.bossAppears(m.template.name), 'boss')
              ks = 0
            } else {
              m = spawnFieldMob(sv.currentStageId, p.level, 0)
              fieldMobs[0] = m
              push(T.newMonster, 'system')
            }
            setTimeout(() => get().checkAchievements(), 50)
          }

          return { player: p, monster: fieldMobs[0], fieldMobs, inventory: inv, log: newLog, floats: [...sv.floats, ...floats], killsSinceBoss: ks, logIdCounter: _logId, floatIdCounter: _floatId }
        })
        set({ skillCooldownEnd: Date.now() + (getCharClass(get().player.classId)?.skill.cooldownSec ?? 10) * 1000 })
      },

      tickBattle: () => {
        set(s => {
          if (!s.isAutoBattle) return s

          let p = { ...s.player }
          let fieldMobs = (s.fieldMobs?.length ? [...s.fieldMobs] : spawnField(s.currentStageId, s.player.level, s.monster))
          let m = { ...fieldMobs[0] } as FieldMob
          let inv = [...s.inventory]
          const floats: FloatDamage[] = []
          let newLog = [...s.log]
          let ks = s.killsSinceBoss

          const push = (text: string, type: LogType) => {
            newLog = [{ id: _logId++, text, type }, ...newLog].slice(0, GAME_CONFIG.MAX_LOG_LINES)
          }
          const cls   = getCharClass(p.classId)
          const stage = STAGES.find(st => st.id === s.currentStageId) ?? STAGES[0]
          const gm    = 1 + stage.goldBonus / 100 + (cls?.passive.goldBonus ?? 0) / 100
          const em    = 1 + stage.expBonus  / 100 + (cls?.passive.expBonus  ?? 0) / 100

          // 1) Player auto-targets the nearest/slot-0 mob.
          const { dmg: pd, isCrit } = calcDmg(getAtk(p, s.equipment), m.def, getCrit(p))
          m.currentHp = Math.max(0, m.currentHp - pd)
          fieldMobs[0] = m
          push(T.playerAttacks(pd, m.template.name), 'attack')
          floats.push({ id: _floatId++, value: pd, x: 58 + Math.random() * 10, y: 30 + Math.random() * 10, isCrit })

          // 2) Resolve target death, rewards, drops, boss spawning, and respawn only that field slot.
          if (m.currentHp <= 0) {
            const eg = Math.floor(m.template.expReward  * em)
            const gg = Math.floor(m.template.goldReward * gm)
            push(T.monsterDefeated(m.template.name), m.isBoss ? 'boss' : 'kill')
            if (m.isBoss) { push(T.bossDefeated(m.template.name), 'boss'); p.bossKills++ }
            push(T.gainExp(eg), 'system')
            push(T.gainGold(gg), 'system')
            p.exp += eg
            p.gold += gg
            p.totalKills++
            if (!m.isBoss) ks++
            else ks = 0

            const drops = rollDrops(m.template)
            for (const d of drops) {
              const t = ITEM_TEMPLATES.find(x => x.id === d.templateId)
              if (t) { inv.push(d); push(T.itemDrop(t.name), 'drop') }
            }

            while (p.exp >= GAME_CONFIG.expToNextLevel(p.level)) {
              p.exp -= GAME_CONFIG.expToNextLevel(p.level)
              p.level++
              p.statPoints += GAME_CONFIG.STAT_POINTS_PER_LEVEL
              p.baseHp += 15
              p.baseAtk += 3
              p.baseDef += 1
              p.currentHp = getMaxHp(p, s.equipment)
              push(T.levelUp(p.level), 'levelup')
              push(T.gotStatPoints(GAME_CONFIG.STAT_POINTS_PER_LEVEL), 'system')
            }

            const bossT = getBossForLevel(p.level)
            if (ks >= bossT.killsRequired && !m.isBoss) {
              const boss = spawnBoss(s.currentStageId, p.level)
              m = withFieldMeta(boss, 0)
              fieldMobs[0] = m
              push(T.bossAppears(m.template.name), 'boss')
              ks = 0
            } else {
              m = spawnFieldMob(s.currentStageId, p.level, 0)
              fieldMobs[0] = m
              push(T.newMonster, 'system')
            }
            setTimeout(() => get().checkAchievements(), 50)
          }

          // 3) Every living mob on the field contributes swarm damage.
          const livingMobs = fieldMobs.filter(mob => mob.currentHp > 0)
          const swarmAtk = livingMobs.reduce((sum, mob, index) => sum + Math.max(1, Math.floor(mob.atk * (index === 0 ? 1 : 0.35))), 0)
          const { dmg: md } = calcDmg(swarmAtk, getDef(p, s.equipment), 0)
          p.currentHp = Math.max(0, p.currentHp - md)
          push(`💥 มอนสเตอร์ ${livingMobs.length} ตัวรุมโจมตี ${md} ดาเมจ`, 'receive')

          if (p.currentHp <= 0) {
            p.currentHp = Math.floor(getMaxHp(p, s.equipment) * 0.5)
            push(T.playerDied, 'system')
            const freshTarget = { ...spawnMonsterInStage(s.currentStageId, p.level), isBoss: false }
            fieldMobs = spawnField(s.currentStageId, p.level, freshTarget)
            m = fieldMobs[0]
          }

          return {
            player: p,
            monster: fieldMobs[0],
            fieldMobs,
            inventory: inv,
            log: newLog,
            floats: [...s.floats, ...floats],
            killsSinceBoss: ks,
            logIdCounter: _logId,
            floatIdCounter: _floatId,
          }
        })
      },

      computeOfflineProgress: (nowMs) => {
        const s = get()
        const diffMs  = nowMs - s.lastLogin
        const diffSec = Math.min(Math.floor(diffMs / 1000), GAME_CONFIG.MAX_OFFLINE_SECS)
        if (diffSec < 10) return
        const totalTicks = Math.floor(diffSec / (GAME_CONFIG.ATTACK_INTERVAL_MS / 1000))
        let p = { ...s.player }
        let kills = 0, totalExp = 0, totalGold = 0
        const cls   = getCharClass(p.classId)
        const stage = STAGES.find(st => st.id === s.currentStageId) ?? STAGES[0]
        const gm    = 1 + stage.goldBonus / 100 + (cls?.passive.goldBonus ?? 0) / 100
        const em    = 1 + stage.expBonus  / 100 + (cls?.passive.expBonus  ?? 0) / 100
        let mHp = spawnMonsterInStage(s.currentStageId, p.level).maxHp
        for (let t = 0; t < totalTicks; t++) {
          const { dmg } = calcDmg(getAtk(p, s.equipment), Math.floor(p.baseDef * 0.4), 0)
          mHp -= dmg
          if (mHp <= 0) {
            const mm = spawnMonsterInStage(s.currentStageId, p.level)
            const eg = Math.floor(mm.template.expReward  * em)
            const gg = Math.floor(mm.template.goldReward * gm)
            p.exp += eg; p.gold += gg; totalExp += eg; totalGold += gg; kills++; p.totalKills++
            while (p.exp >= GAME_CONFIG.expToNextLevel(p.level)) {
              p.exp -= GAME_CONFIG.expToNextLevel(p.level); p.level++; p.statPoints += GAME_CONFIG.STAT_POINTS_PER_LEVEL
              p.baseHp += 15; p.baseAtk += 3; p.baseDef += 1
            }
            mHp = spawnMonsterInStage(s.currentStageId, p.level).maxHp
          }
        }
        p.currentHp = getMaxHp(p, s.equipment)
        set({ player: p, monster: { ...spawnMonsterInStage(s.currentStageId, p.level), isBoss: false }, lastLogin: nowMs, offlineSeconds: diffSec, offlineResult: { seconds: diffSec, kills, exp: totalExp, gold: totalGold } })
        setTimeout(() => get().checkAchievements(), 100)
      },
    }),
    {
      name: 'rune-blade-save-v4',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        player: s.player, equipment: s.equipment, inventory: s.inventory,
        lastLogin: s.lastLogin, currentStageId: s.currentStageId,
        killsSinceBoss: s.killsSinceBoss, unlockedAchievements: s.unlockedAchievements,
        log: s.log.slice(0, 20),
      }),
    },
  ),
)
