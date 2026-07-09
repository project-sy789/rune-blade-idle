// ============================================================
// gameConfig.ts — ค่าคงที่และสูตรเกม (v2 + Items + Stages)
// ============================================================

export const GAME_CONFIG = {
  // ─── Loop ──────────────────────────────────────────────────
  ATTACK_INTERVAL_MS: 1500,
  SAVE_INTERVAL_MS:   10_000,
  MAX_LOG_LINES:      80,
  MAX_OFFLINE_SECS:   8 * 3600,

  // ─── ตัวละครเริ่มต้น ────────────────────────────────────────
  INITIAL_PLAYER: {
    name:       'นักผจญภัย',
    level:      1,
    exp:        0,
    gold:       0,
    baseHp:     100,
    currentHp:  100,
    baseAtk:    12,
    baseDef:    5,
    str:        5,
    vit:        5,
    statPoints: 0,
  },

  // ─── สูตร ──────────────────────────────────────────────────
  expToNextLevel: (lv: number) => Math.floor(80 * Math.pow(lv, 1.6)),
  maxHpFormula:   (vit: number, baseMod: number) => baseMod + vit * 20,
  atkFormula:     (str: number, baseMod: number) => baseMod + str * 2,
  STAT_POINTS_PER_LEVEL: 3,

  // ─── Enhancement ───────────────────────────────────────────
  ENHANCE_SUCCESS_RATE: [0, 0.95, 0.90, 0.85, 0.75, 0.65, 0.50, 0.40, 0.30, 0.20, 0.10],
  ENHANCE_GOLD_COST:    (lv: number) => Math.max(50, 100 * lv),
} as const

// ─── Item Types ───────────────────────────────────────────────
export type ItemType   = 'weapon' | 'armor' | 'accessory'
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic'

export interface ItemTemplate {
  id:        string
  name:      string
  emoji:     string
  type:      ItemType
  rarity:    ItemRarity
  bonusAtk:  number
  bonusDef:  number
  bonusHp:   number
  desc:      string
}

export interface InventoryItem {
  uid:          string   // unique instance id
  templateId:   string
  enhanceLevel: number  // 0–10
}

export const ITEM_TEMPLATES: ItemTemplate[] = [
  // ─── อาวุธ ──────────────────────────────────────────────
  { id: 'shortsword',  name: 'ดาบสั้น',          emoji: '🗡️',  type: 'weapon',    rarity: 'common',   bonusAtk: 8,  bonusDef: 0,  bonusHp: 0,   desc: 'ดาบสั้นเหล็กธรรมดา' },
  { id: 'iron_sword',  name: 'ดาบเหล็ก',          emoji: '⚔️',  type: 'weapon',    rarity: 'uncommon', bonusAtk: 15, bonusDef: 0,  bonusHp: 0,   desc: 'ดาบเหล็กมาตรฐาน' },
  { id: 'knight_sword',name: 'ดาบอัศวิน',         emoji: '🔱',  type: 'weapon',    rarity: 'rare',     bonusAtk: 28, bonusDef: 0,  bonusHp: 0,   desc: 'ดาบของอัศวินผู้กล้า' },
  { id: 'staff',       name: 'ไม้เท้าเวทย์',      emoji: '🪄',  type: 'weapon',    rarity: 'common',   bonusAtk: 6,  bonusDef: 0,  bonusHp: 20,  desc: 'ไม้เท้าช่วยเพิ่มพลังเวทย์' },
  { id: 'arc_wand',    name: 'คทาอาร์ค',           emoji: '✨',  type: 'weapon',    rarity: 'rare',     bonusAtk: 20, bonusDef: 0,  bonusHp: 40,  desc: 'คทาโบราณมีพลังสูง' },
  { id: 'bow',         name: 'ธนู',               emoji: '🏹',  type: 'weapon',    rarity: 'uncommon', bonusAtk: 12, bonusDef: 0,  bonusHp: 0,   desc: 'ธนูไม้ความแม่นยำสูง' },
  // ─── เกราะ ──────────────────────────────────────────────
  { id: 'cloth_armor', name: 'เกราะผ้า',           emoji: '👕',  type: 'armor',     rarity: 'common',   bonusAtk: 0,  bonusDef: 5,  bonusHp: 30,  desc: 'เกราะผ้าธรรมดา' },
  { id: 'leather_vest',name: 'เสื้อหนัง',          emoji: '🥋',  type: 'armor',     rarity: 'uncommon', bonusAtk: 0,  bonusDef: 10, bonusHp: 60,  desc: 'เกราะหนังป้องกันดี' },
  { id: 'chainmail',   name: 'เกราะโซ่',           emoji: '🛡️',  type: 'armor',     rarity: 'rare',     bonusAtk: 0,  bonusDef: 20, bonusHp: 100, desc: 'เกราะโซ่เหล็กทนทาน' },
  { id: 'plate_armor', name: 'เกราะเพลท',          emoji: '🪬',  type: 'armor',     rarity: 'epic',     bonusAtk: 0,  bonusDef: 35, bonusHp: 180, desc: 'เกราะเหล็กแผ่นหนาสุด' },
  // ─── เครื่องประดับ ─────────────────────────────────────
  { id: 'iron_ring',   name: 'แหวนเหล็ก',          emoji: '💍',  type: 'accessory', rarity: 'common',   bonusAtk: 3,  bonusDef: 3,  bonusHp: 20,  desc: 'แหวนเสริมสถานะเล็กน้อย' },
  { id: 'brave_cape',  name: 'ผ้าคลุมนักรบ',       emoji: '🧣',  type: 'accessory', rarity: 'uncommon', bonusAtk: 5,  bonusDef: 5,  bonusHp: 40,  desc: 'ผ้าคลุมให้กำลังใจ' },
  { id: 'angel_wing',  name: 'ปีกนางฟ้า',          emoji: '🪽',  type: 'accessory', rarity: 'rare',     bonusAtk: 10, bonusDef: 8,  bonusHp: 80,  desc: 'หนึ่งในของหายากมาก' },
]

export const RARITY_COLOR: Record<ItemRarity, string> = {
  common:   'text-gray-300  border-gray-600',
  uncommon: 'text-green-300 border-green-600',
  rare:     'text-blue-300  border-blue-500',
  epic:     'text-purple-300 border-purple-500',
}

export const RARITY_LABEL: Record<ItemRarity, string> = {
  common:   'ธรรมดา',
  uncommon: 'ไม่ธรรมดา',
  rare:     'หายาก',
  epic:     'มหากาพย์',
}

/** คืน bonus ATK จาก item + enhance level */
export function itemBonusAtk(item: InventoryItem): number {
  const t = ITEM_TEMPLATES.find(t => t.id === item.templateId)
  if (!t) return 0
  return t.bonusAtk + item.enhanceLevel * 3
}
export function itemBonusDef(item: InventoryItem): number {
  const t = ITEM_TEMPLATES.find(t => t.id === item.templateId)
  if (!t) return 0
  return t.bonusDef + item.enhanceLevel * 2
}
export function itemBonusHp(item: InventoryItem): number {
  const t = ITEM_TEMPLATES.find(t => t.id === item.templateId)
  if (!t) return 0
  return t.bonusHp + item.enhanceLevel * 10
}

// ─── Monster Templates ────────────────────────────────────────
export interface MonsterTemplate {
  id:      string
  name:    string
  emoji:   string
  baseHp:  number
  baseAtk: number
  baseDef: number
  expReward:  number
  goldReward: number
  minLevel:   number
  dropTable:  DropEntry[]   // ← NEW
}

export interface DropEntry {
  templateId: string
  chance:     number   // 0.0 – 1.0
}

export const MONSTERS: MonsterTemplate[] = [
  {
    id: 'poring',     name: 'โพริ่ง',   emoji: '🟣',
    baseHp: 40,  baseAtk: 3,  baseDef: 1,
    expReward: 10,  goldReward: 5,  minLevel: 1,
    dropTable: [
      { templateId: 'shortsword',   chance: 0.15 },
      { templateId: 'cloth_armor',  chance: 0.12 },
      { templateId: 'iron_ring',    chance: 0.08 },
    ],
  },
  {
    id: 'fabre',      name: 'เฟเบร',    emoji: '🐛',
    baseHp: 70,  baseAtk: 6,  baseDef: 2,
    expReward: 18,  goldReward: 9,  minLevel: 2,
    dropTable: [
      { templateId: 'cloth_armor',  chance: 0.15 },
      { templateId: 'staff',        chance: 0.10 },
      { templateId: 'iron_ring',    chance: 0.10 },
    ],
  },
  {
    id: 'lunatic',    name: 'ลูนาติค',  emoji: '🐰',
    baseHp: 110, baseAtk: 10, baseDef: 4,
    expReward: 28,  goldReward: 14, minLevel: 4,
    dropTable: [
      { templateId: 'bow',          chance: 0.15 },
      { templateId: 'leather_vest', chance: 0.12 },
      { templateId: 'brave_cape',   chance: 0.08 },
    ],
  },
  {
    id: 'willow',     name: 'วิลโลว์',  emoji: '🌿',
    baseHp: 160, baseAtk: 15, baseDef: 6,
    expReward: 42,  goldReward: 20, minLevel: 6,
    dropTable: [
      { templateId: 'iron_sword',   chance: 0.15 },
      { templateId: 'leather_vest', chance: 0.12 },
      { templateId: 'brave_cape',   chance: 0.10 },
    ],
  },
  {
    id: 'thief_bug',  name: 'ขโมยแมลง', emoji: '🐞',
    baseHp: 240, baseAtk: 22, baseDef: 9,
    expReward: 65,  goldReward: 32, minLevel: 9,
    dropTable: [
      { templateId: 'arc_wand',     chance: 0.10 },
      { templateId: 'chainmail',    chance: 0.12 },
      { templateId: 'iron_ring',    chance: 0.15 },
    ],
  },
  {
    id: 'zombie',     name: 'ซอมบี้',   emoji: '🧟',
    baseHp: 380, baseAtk: 32, baseDef: 13,
    expReward: 100, goldReward: 50, minLevel: 13,
    dropTable: [
      { templateId: 'knight_sword', chance: 0.12 },
      { templateId: 'chainmail',    chance: 0.15 },
      { templateId: 'brave_cape',   chance: 0.10 },
    ],
  },
  {
    id: 'skeleton',   name: 'สเกเลตัน', emoji: '💀',
    baseHp: 540, baseAtk: 45, baseDef: 18,
    expReward: 145, goldReward: 70, minLevel: 17,
    dropTable: [
      { templateId: 'knight_sword', chance: 0.15 },
      { templateId: 'plate_armor',  chance: 0.10 },
      { templateId: 'angel_wing',   chance: 0.05 },
    ],
  },
  {
    id: 'orc',        name: 'ออร์ค',    emoji: '👹',
    baseHp: 800, baseAtk: 62, baseDef: 24,
    expReward: 210, goldReward: 100, minLevel: 22,
    dropTable: [
      { templateId: 'plate_armor',  chance: 0.15 },
      { templateId: 'angel_wing',   chance: 0.08 },
      { templateId: 'arc_wand',     chance: 0.12 },
    ],
  },
]

// ─── Stage Definitions ─────────────────────────────────────────
export interface StageInfo {
  id:         string
  name:       string
  emoji:      string
  bgColor:    string    // tailwind gradient classes
  minLevel:   number
  monsterIds: string[]  // ดึง monsters จาก pool นี้
  goldBonus:  number    // % bonus gold ในด่านนี้
  expBonus:   number    // % bonus exp
  isBoss?:    boolean
  bossId?:    string
}

export const STAGES: StageInfo[] = [
  {
    id: 'prontera',
    name: 'ทุ่งหญ้าพรอนเทร่า',
    emoji: '🌾',
    bgColor: 'from-green-950 to-emerald-950',
    minLevel: 1,
    monsterIds: ['poring', 'fabre'],
    goldBonus: 0, expBonus: 0,
  },
  {
    id: 'payon_forest',
    name: 'ป่าเพย์ออน',
    emoji: '🌲',
    bgColor: 'from-teal-950 to-green-950',
    minLevel: 5,
    monsterIds: ['lunatic', 'willow'],
    goldBonus: 10, expBonus: 5,
  },
  {
    id: 'morroc',
    name: 'ทะเลทรายมอร็อค',
    emoji: '🏜️',
    bgColor: 'from-yellow-950 to-orange-950',
    minLevel: 10,
    monsterIds: ['thief_bug', 'willow'],
    goldBonus: 20, expBonus: 10,
  },
  {
    id: 'glast_heim',
    name: 'ปราสาทกลาสต์เฮม',
    emoji: '🏚️',
    bgColor: 'from-gray-950 to-slate-950',
    minLevel: 15,
    monsterIds: ['zombie', 'skeleton'],
    goldBonus: 35, expBonus: 20,
  },
  {
    id: 'orc_village',
    name: 'หมู่บ้านออร์ค',
    emoji: '💀',
    bgColor: 'from-red-950 to-orange-950',
    minLevel: 22,
    monsterIds: ['orc', 'skeleton'],
    goldBonus: 50, expBonus: 30,
  },
]

/** เลือก monster ตาม stage + level */
export function spawnMonsterInStage(
  stageId: string,
  playerLevel: number,
): { template: MonsterTemplate; currentHp: number; maxHp: number; atk: number; def: number } {
  const stage   = STAGES.find(s => s.id === stageId) ?? STAGES[0]
  const pool    = MONSTERS.filter(m => stage.monsterIds.includes(m.id))
  const template = pool[Math.floor(Math.random() * pool.length)] ?? MONSTERS[0]
  const scale   = 1 + (playerLevel - template.minLevel) * 0.08
  const maxHp   = Math.max(template.baseHp, Math.floor(template.baseHp  * scale))
  const atk     = Math.max(template.baseAtk, Math.floor(template.baseAtk * scale))
  const def     = Math.max(template.baseDef, Math.floor(template.baseDef * scale))
  return { template, currentHp: maxHp, maxHp, atk, def }
}

/** roll drops จาก monster kill */
export function rollDrops(monster: MonsterTemplate): InventoryItem[] {
  const drops: InventoryItem[] = []
  for (const entry of monster.dropTable) {
    if (Math.random() < entry.chance) {
      drops.push({
        uid:          `${entry.templateId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        templateId:   entry.templateId,
        enhanceLevel: 0,
      })
    }
  }
  return drops
}
