// ============================================================
// achievements.ts — Achievement definitions + milestone rewards
// ============================================================
import { InventoryItem } from './gameConfig'

export type AchievementId =
  | 'first_kill' | 'kill_10' | 'kill_100' | 'kill_1000' | 'kill_5000'
  | 'level_5' | 'level_10' | 'level_20' | 'level_30' | 'level_50'
  | 'first_boss' | 'boss_5' | 'boss_20'
  | 'first_item' | 'first_equip' | 'enhance_5' | 'enhance_10'
  | 'first_class' | 'gold_1000' | 'gold_10000' | 'gold_100000'
  | 'all_stages' | 'first_guild' | 'offline_1h'

export type RewardType = 'gold' | 'statpoints' | 'item' | 'title'

export interface AchievementReward {
  type:       RewardType
  amount?:    number
  itemId?:    string
  titleText?: string
}

export interface Achievement {
  id:          AchievementId
  name:        string
  desc:        string
  emoji:       string
  reward:      AchievementReward
  hidden?:     boolean
  /** ตรวจสอบว่า unlock แล้วหรือยัง */
  check: (ctx: AchievementContext) => boolean
}

export interface AchievementContext {
  totalKills:   number
  level:        number
  bossKills:    number
  inventoryLen: number
  hasEquipped:  boolean
  maxEnhance:   number
  classId:      string | null
  gold:         number
  unlockedStages: string[]
  inGuild:      boolean
  offlineSeconds: number
}

export const ACHIEVEMENTS: Achievement[] = [
  // ─── Kills ──────────────────────────────────────────────────
  {
    id: 'first_kill', name: 'นักล่ามือใหม่', emoji: '⚔️',
    desc: 'สังหารมอนสเตอร์ครั้งแรก',
    reward: { type: 'gold', amount: 100 },
    check: c => c.totalKills >= 1,
  },
  {
    id: 'kill_10', name: 'นักล่า', emoji: '🗡️',
    desc: 'สังหารมอนสเตอร์ 10 ตัว',
    reward: { type: 'statpoints', amount: 2 },
    check: c => c.totalKills >= 10,
  },
  {
    id: 'kill_100', name: 'นักรบผ่านศึก', emoji: '⚔️',
    desc: 'สังหารมอนสเตอร์ 100 ตัว',
    reward: { type: 'gold', amount: 500 },
    check: c => c.totalKills >= 100,
  },
  {
    id: 'kill_1000', name: 'จอมนักล่า', emoji: '🏹',
    desc: 'สังหารมอนสเตอร์ 1,000 ตัว',
    reward: { type: 'statpoints', amount: 5 },
    check: c => c.totalKills >= 1000,
  },
  {
    id: 'kill_5000', name: 'ตำนานนักล่า', emoji: '👑',
    desc: 'สังหารมอนสเตอร์ 5,000 ตัว',
    reward: { type: 'gold', amount: 9999 },
    check: c => c.totalKills >= 5000,
  },
  // ─── Level ──────────────────────────────────────────────────
  {
    id: 'level_5', name: 'ก้าวแรก', emoji: '🌱',
    desc: 'ถึงเลเวล 5',
    reward: { type: 'gold', amount: 200 },
    check: c => c.level >= 5,
  },
  {
    id: 'level_10', name: 'นักผจญภัยตัวจริง', emoji: '🌟',
    desc: 'ถึงเลเวล 10 — ปลดล็อคอาชีพ!',
    reward: { type: 'statpoints', amount: 5 },
    check: c => c.level >= 10,
  },
  {
    id: 'level_20', name: 'นักรบเอก', emoji: '💎',
    desc: 'ถึงเลเวล 20',
    reward: { type: 'statpoints', amount: 8 },
    check: c => c.level >= 20,
  },
  {
    id: 'level_30', name: 'ผู้เชี่ยวชาญ', emoji: '🔥',
    desc: 'ถึงเลเวล 30',
    reward: { type: 'gold', amount: 5000 },
    check: c => c.level >= 30,
  },
  {
    id: 'level_50', name: 'ตำนาน', emoji: '⚡',
    desc: 'ถึงเลเวล 50',
    reward: { type: 'statpoints', amount: 20 },
    check: c => c.level >= 50,
    hidden: true,
  },
  // ─── Boss ───────────────────────────────────────────────────
  {
    id: 'first_boss', name: 'ผู้พิชิตบอส', emoji: '☠️',
    desc: 'สังหาร Boss ครั้งแรก',
    reward: { type: 'gold', amount: 1000 },
    check: c => c.bossKills >= 1,
  },
  {
    id: 'boss_5', name: 'นักล่าบอส', emoji: '🏆',
    desc: 'สังหาร Boss 5 ครั้ง',
    reward: { type: 'statpoints', amount: 5 },
    check: c => c.bossKills >= 5,
  },
  {
    id: 'boss_20', name: 'จอมบอสเบรกเกอร์', emoji: '💀',
    desc: 'สังหาร Boss 20 ครั้ง',
    reward: { type: 'gold', amount: 8888 },
    check: c => c.bossKills >= 20,
    hidden: true,
  },
  // ─── Items ──────────────────────────────────────────────────
  {
    id: 'first_item', name: 'ไอเทมแรก', emoji: '🎁',
    desc: 'ได้รับไอเทมครั้งแรก',
    reward: { type: 'gold', amount: 50 },
    check: c => c.inventoryLen >= 1,
  },
  {
    id: 'first_equip', name: 'นักรบมีเกราะ', emoji: '🛡️',
    desc: 'สวมใส่ไอเทมครั้งแรก',
    reward: { type: 'statpoints', amount: 2 },
    check: c => c.hasEquipped,
  },
  {
    id: 'enhance_5', name: 'ช่างตีบวก', emoji: '🔨',
    desc: 'ตีบวกไอเทมถึง +5',
    reward: { type: 'gold', amount: 2000 },
    check: c => c.maxEnhance >= 5,
  },
  {
    id: 'enhance_10', name: 'ช่างฝีมือระดับเทพ', emoji: '⚡',
    desc: 'ตีบวกไอเทมถึง +10',
    reward: { type: 'statpoints', amount: 10 },
    check: c => c.maxEnhance >= 10,
    hidden: true,
  },
  // ─── Class / Gold / Social ──────────────────────────────────
  {
    id: 'first_class', name: 'เลือกเส้นทาง', emoji: '🎖️',
    desc: 'เลือกอาชีพแล้ว',
    reward: { type: 'statpoints', amount: 3 },
    check: c => c.classId !== null,
  },
  {
    id: 'gold_1000', name: 'คนรวย', emoji: '🪙',
    desc: 'สะสมเซนี่ 1,000',
    reward: { type: 'statpoints', amount: 1 },
    check: c => c.gold >= 1000,
  },
  {
    id: 'gold_10000', name: 'เศรษฐีเซนี่', emoji: '💰',
    desc: 'สะสมเซนี่ 10,000',
    reward: { type: 'gold', amount: 1000 },
    check: c => c.gold >= 10000,
  },
  {
    id: 'gold_100000', name: 'จอมทรัพย์', emoji: '👑',
    desc: 'สะสมเซนี่ 100,000',
    reward: { type: 'statpoints', amount: 15 },
    check: c => c.gold >= 100000,
    hidden: true,
  },
  {
    id: 'all_stages', name: 'นักเดินทาง', emoji: '🗺️',
    desc: 'ปลดล็อคทุกพื้นที่',
    reward: { type: 'gold', amount: 3000 },
    check: c => c.unlockedStages.length >= 5,
  },
  {
    id: 'first_guild', name: 'สมาชิกกิลด์', emoji: '⚔️',
    desc: 'เข้าร่วมกิลด์แล้ว',
    reward: { type: 'gold', amount: 500 },
    check: c => c.inGuild,
  },
  {
    id: 'offline_1h', name: 'นักผจญภัยพักผ่อน', emoji: '💤',
    desc: 'ออฟไลน์ไปอย่างน้อย 1 ชั่วโมง',
    reward: { type: 'gold', amount: 300 },
    check: c => c.offlineSeconds >= 3600,
  },
]

export const ACHIEVEMENT_MAP = Object.fromEntries(
  ACHIEVEMENTS.map(a => [a.id, a])
) as Record<AchievementId, Achievement>
