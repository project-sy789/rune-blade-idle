// ============================================================
// quests.ts — Auto quest chain config
// ============================================================

export type QuestObjectiveType = 'kill' | 'level' | 'gold'

export interface QuestDefinition {
  id: string
  title: string
  description: string
  stageId: string
  objective: {
    type: QuestObjectiveType
    monsterId?: string
    required: number
  }
  reward: {
    exp: number
    gold: number
    statPoints?: number
  }
}

export const QUESTS: QuestDefinition[] = [
  {
    id: 'q_prontera_01',
    title: 'เริ่มต้นนักผจญภัย',
    description: 'กำจัดโพริ่งในทุ่งหญ้าพรอนเทร่า',
    stageId: 'prontera',
    objective: { type: 'kill', monsterId: 'poring', required: 5 },
    reward: { exp: 60, gold: 40, statPoints: 1 },
  },
  {
    id: 'q_prontera_02',
    title: 'ล้างรังเฟเบร',
    description: 'กำจัดเฟเบรที่รบกวนเส้นทางการค้า',
    stageId: 'prontera',
    objective: { type: 'kill', monsterId: 'fabre', required: 6 },
    reward: { exp: 100, gold: 75 },
  },
  {
    id: 'q_payon_01',
    title: 'กระต่ายป่าเพย์ออน',
    description: 'ล่าลูนาติคในป่าเพย์ออน',
    stageId: 'payon_forest',
    objective: { type: 'kill', monsterId: 'lunatic', required: 7 },
    reward: { exp: 180, gold: 120, statPoints: 1 },
  },
  {
    id: 'q_payon_02',
    title: 'วิญญาณต้นไม้',
    description: 'กำจัดวิลโลว์เพื่อเปิดทางเข้าป่าลึก',
    stageId: 'payon_forest',
    objective: { type: 'kill', monsterId: 'willow', required: 8 },
    reward: { exp: 260, gold: 180 },
  },
  {
    id: 'q_izlude_01',
    title: 'ลาดตระเวนชายฝั่ง',
    description: 'กำจัดมอนสเตอร์ใดก็ได้ในชายฝั่งอิซลูด',
    stageId: 'izlude_coast',
    objective: { type: 'kill', required: 10 },
    reward: { exp: 340, gold: 260, statPoints: 1 },
  },
  {
    id: 'q_geffen_01',
    title: 'พลังเวทเกฟเฟ่น',
    description: 'เก็บเลเวลให้ถึง 12 เพื่อรับรองพลังเวท',
    stageId: 'geffen_field',
    objective: { type: 'level', required: 12 },
    reward: { exp: 420, gold: 300 },
  },
  {
    id: 'q_morroc_01',
    title: 'แมลงทะเลทราย',
    description: 'กำจัดขโมยแมลงในทะเลทรายมอร็อค',
    stageId: 'morroc',
    objective: { type: 'kill', monsterId: 'thief_bug', required: 12 },
    reward: { exp: 640, gold: 480, statPoints: 1 },
  },
  {
    id: 'q_clock_01',
    title: 'เสียงนาฬิกามรณะ',
    description: 'กำจัดสเกเลตันในหอนาฬิกาอัลเดบารัน',
    stageId: 'aldebaran_clock',
    objective: { type: 'kill', monsterId: 'skeleton', required: 14 },
    reward: { exp: 900, gold: 700 },
  },
  {
    id: 'q_glast_01',
    title: 'ซากปราสาทต้องสาป',
    description: 'กำจัดซอมบี้ในปราสาทกลาสต์เฮม',
    stageId: 'glast_heim',
    objective: { type: 'kill', monsterId: 'zombie', required: 16 },
    reward: { exp: 1250, gold: 950, statPoints: 1 },
  },
  {
    id: 'q_orc_01',
    title: 'กวาดล้างหมู่บ้านออร์ค',
    description: 'กำจัดออร์คเพื่อยึดคืนค่ายหน้า',
    stageId: 'orc_village',
    objective: { type: 'kill', monsterId: 'orc', required: 18 },
    reward: { exp: 1800, gold: 1400 },
  },
  {
    id: 'q_turtle_01',
    title: 'สมบัติเกาะเต่า',
    description: 'สะสมเงินให้ครบเพื่อเปิดทางสู่เกาะเต่า',
    stageId: 'turtle_island',
    objective: { type: 'gold', required: 5000 },
    reward: { exp: 2200, gold: 1800, statPoints: 2 },
  },
  {
    id: 'q_niflheim_01',
    title: 'ประตูสู่โลกมืด',
    description: 'กำจัดมอนสเตอร์ใดก็ได้ในประตูนีฟล์เฮม',
    stageId: 'niflheim_gate',
    objective: { type: 'kill', required: 25 },
    reward: { exp: 3500, gold: 3000, statPoints: 3 },
  },
]

export function getQuestById(id: string | null | undefined): QuestDefinition | undefined {
  return id ? QUESTS.find(q => q.id === id) : undefined
}

export function getNextQuest(completedQuestIds: string[]): QuestDefinition | undefined {
  return QUESTS.find(q => !completedQuestIds.includes(q.id))
}
