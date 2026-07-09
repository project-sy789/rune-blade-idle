// ============================================================
// classes.ts — Class definitions (Step 7)
// ============================================================

export type ClassId = 'warrior' | 'mage' | 'archer'

export interface ActiveSkill {
  id:          string
  name:        string
  emoji:       string
  desc:        string
  cooldownSec: number       // วินาที
  /** คืนค่า damage multiplier ของ player ATK */
  dmgMultiplier: number
  /** ถ้า > 0 = heal % of max HP */
  healPct:     number
}

export interface ClassPassive {
  atkBonus:    number       // % bonus ATK
  defBonus:    number       // % bonus DEF
  hpBonus:     number       // % bonus Max HP
  critBonus:   number       // เพิ่ม crit chance (0.0–1.0)
  goldBonus:   number       // % bonus gold
  expBonus:    number       // % bonus exp
}

export interface CharacterClass {
  id:      ClassId
  name:    string
  emoji:   string
  desc:    string
  color:   string           // tailwind gradient
  passive: ClassPassive
  skill:   ActiveSkill
}

export const CLASSES: CharacterClass[] = [
  {
    id:    'warrior',
    name:  'นักรบ',
    emoji: '⚔️',
    desc:  'ผู้เชี่ยวชาญการต่อสู้ระยะประชิด มีพลังชีวิตและการโจมตีสูง',
    color: 'from-red-800 to-orange-900',
    passive: { atkBonus: 20, defBonus: 15, hpBonus: 25, critBonus: 0.05, goldBonus: 0, expBonus: 0 },
    skill: {
      id: 'bash', name: 'แบช', emoji: '🪓',
      desc: 'โจมตีหนักพิเศษ 3 เท่าของดาเมจปกติ',
      cooldownSec: 8, dmgMultiplier: 3.0, healPct: 0,
    },
  },
  {
    id:    'mage',
    name:  'นักเวทย์',
    emoji: '🧙',
    desc:  'เชี่ยวชาญเวทมนตร์ ดาเมจระเบิดสูงสุด พลังชีวิตต่ำกว่าชนชั้นอื่น',
    color: 'from-purple-800 to-violet-900',
    passive: { atkBonus: 35, defBonus: 0, hpBonus: -10, critBonus: 0.12, goldBonus: 0, expBonus: 10 },
    skill: {
      id: 'fireball', name: 'ลูกไฟ', emoji: '🔥',
      desc: 'ระเบิดไฟโจมตี 5 เท่า มีโอกาส crit สูง',
      cooldownSec: 12, dmgMultiplier: 5.0, healPct: 0,
    },
  },
  {
    id:    'archer',
    name:  'นักธนู',
    emoji: '🏹',
    desc:  'ยิงไกล แม่นยำสูง รับเซนี่และ EXP โบนัสพิเศษ',
    color: 'from-green-800 to-teal-900',
    passive: { atkBonus: 15, defBonus: 5, hpBonus: 5, critBonus: 0.08, goldBonus: 20, expBonus: 15 },
    skill: {
      id: 'double_strafe', name: 'ดับเบิ้ลสเตรฟ', emoji: '🎯',
      desc: 'ยิงสองครั้งรวดเดียว รวมดาเมจ 4 เท่า',
      cooldownSec: 6, dmgMultiplier: 4.0, healPct: 0,
    },
  },
]

// ─── Boss Definitions (Step 8) ─────────────────────────────────
export interface BossTemplate {
  id:          string
  name:        string
  emoji:       string
  hpMultiplier: number      // คูณ monster baseHp
  atkMultiplier: number
  defMultiplier: number
  expMultiplier: number
  goldMultiplier: number
  killsRequired: number     // kill ธรรมดาเท่าไรถึงจะ spawn
  guaranteedDropId: string  // drop guaranteed 1 ชิ้น
  minLevel:    number
}

export const BOSSES: BossTemplate[] = [
  {
    id: 'poring_king',  name: 'ราชาโพริ่ง',   emoji: '👑',
    hpMultiplier: 12,  atkMultiplier: 2.5, defMultiplier: 2,
    expMultiplier: 8,  goldMultiplier: 10,
    killsRequired: 15, guaranteedDropId: 'iron_sword', minLevel: 1,
  },
  {
    id: 'nightmare',    name: 'ฝันร้าย',        emoji: '🌑',
    hpMultiplier: 15,  atkMultiplier: 3.0, defMultiplier: 2.5,
    expMultiplier: 12, goldMultiplier: 15,
    killsRequired: 20, guaranteedDropId: 'arc_wand', minLevel: 8,
  },
  {
    id: 'dark_lord',    name: 'จอมมืด',         emoji: '☠️',
    hpMultiplier: 20,  atkMultiplier: 3.5, defMultiplier: 3,
    expMultiplier: 18, goldMultiplier: 20,
    killsRequired: 25, guaranteedDropId: 'plate_armor', minLevel: 15,
  },
  {
    id: 'orc_hero',     name: 'ออร์คฮีโร่',     emoji: '👹',
    hpMultiplier: 25,  atkMultiplier: 4.0, defMultiplier: 3.5,
    expMultiplier: 25, goldMultiplier: 30,
    killsRequired: 30, guaranteedDropId: 'angel_wing', minLevel: 22,
  },
]

/** เลือก boss ตาม level */
export function getBossForLevel(level: number): BossTemplate {
  const eligible = BOSSES.filter(b => b.minLevel <= level)
  return eligible[eligible.length - 1] ?? BOSSES[0]
}
