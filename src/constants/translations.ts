// ============================================================
// translations.ts — i18n v3 (+ Classes + Boss + Skills)
// ============================================================

export const T = {
  gameTitle:    'Rune & Blade: Idle Online',
  gameSubtitle: 'ผจญภัยอัตโนมัติ',

  // ─── สถานะ ─────────────────────────────────────────────────
  level:      'เลเวล',
  hp:         'พลังชีวิต',
  atk:        'พลังโจมตี',
  def:        'พลังป้องกัน',
  exp:        'ค่าประสบการณ์',
  expNext:    'EXP ถัดไป',
  gold:       'เซนี่',
  str:        'STR (กำลัง)',
  vit:        'VIT (ความทน)',
  statPoints: 'พอยต์สถานะ',
  heroName:   'นักผจญภัย',

  // ─── การต่อสู้ ──────────────────────────────────────────────
  autoBattle:      'ปล่อยบอท',
  battling:        'กำลังต่อสู้...',
  idle:            'หยุดพัก',
  newMonster:      'มอนสเตอร์ใหม่ปรากฏ!',
  monsterDefeated: (name: string) => `${name} ถูกสังหาร!`,
  gainExp:         (n: number) => `+${n} EXP`,
  gainGold:        (n: number) => `+${n} เซนี่`,
  levelUp:         (lv: number) => `🎉 เลเวลอัพ! เลเวล ${lv}`,
  gotStatPoints:   (n: number) => `+${n} พอยต์สถานะ`,
  playerAttacks:   (dmg: number, name: string) => `⚔️ โจมตี ${name} ด้วยพลัง ${dmg}`,
  monsterAttacks:  (dmg: number, name: string) => `💥 ${name} ตอบโต้ ${dmg} ดาเมจ`,
  playerDied:      '💀 ตัวละครสลบ — ฟื้นฟูแล้ว!',

  // ─── สกิล ──────────────────────────────────────────────────
  skillUsed:      (name: string, dmg: number, target: string) =>
    `🌟 ใช้ ${name} — ดาเมจ ${dmg} ใส่ ${target}!`,
  skillReady:     'พร้อมใช้สกิล!',
  skillCooldown:  (s: number) => `คูลดาวน์ ${s}s`,

  // ─── บอส ───────────────────────────────────────────────────
  bossAppears:    (name: string) => `☠️ บอส ${name} ปรากฏ! ระวัง!`,
  bossDefeated:   (name: string) => `🏆 สังหารบอส ${name}! รับรางวัลพิเศษ!`,
  bossWarning:    'บอสกำลังจะมา!',
  killsToNextBoss:(n: number) => `บอสอีก ${n} kills`,

  // ─── ออฟไลน์ ───────────────────────────────────────────────
  offlineProgress:   'ความคืบหน้าขณะออฟไลน์',
  offlineGone:       (h: number, m: number) => `ออฟไลน์ไป ${h} ชม. ${m} นาที`,
  offlineDismiss:    'รับรางวัล!',

  // ─── คลาส ──────────────────────────────────────────────────
  chooseClass:       'เลือกอาชีพ',
  chooseClassDesc:   'เลเวล 10 ปลดล็อค — เลือกอาชีพที่เหมาะกับสไตล์คุณ!',
  classSelected:     (name: string) => `🎖 เลือกอาชีพ ${name} แล้ว!`,
  className:         'อาชีพ',
  classSkill:        'สกิลพิเศษ',
  classPassive:      'ความสามารถพิเศษ',
  classWarrior:      'นักรบ',
  classMage:         'นักเวทย์',
  classArcher:       'นักธนู',
  noClass:           'ไม่มีอาชีพ',

  // ─── แท็บ ──────────────────────────────────────────────────
  tabStats:     'สถานะ',
  tabInventory: 'กระเป๋า',
  tabLog:       'บันทึก',
  tabMap:       'แผนที่',

  // ─── สถานะตัวละคร ──────────────────────────────────────────
  allocateStr:  '+ กำลัง (STR)',
  allocateVit:  '+ ความทน (VIT)',
  strDesc:      'เพิ่มพลังโจมตี +2',
  vitDesc:      'เพิ่มพลังชีวิต +20',
  noPoints:     'ไม่มีพอยต์สถานะ',
  currentStats: 'สถานะตัวละคร',

  // ─── กระเป๋า ───────────────────────────────────────────────
  inventoryEmpty:    'กระเป๋าว่างเปล่า',
  equippedSection:   'สวมใส่อยู่',
  bagSection:        'ถุงไอเทม',
  equip:             'สวมใส่',
  unequip:           'ถอด',
  enhancement:       'ตีบวก',
  enhanceCost:       (g: number) => `ค่าใช้จ่าย: ${g} เซนี่`,
  enhanceSuccess:    (name: string, lv: number) => `✨ ${name} ตีบวก +${lv} สำเร็จ!`,
  enhanceFail:       (name: string) => `💥 ${name} ตีบวกล้มเหลว...`,
  enhanceMax:        'ตีบวกสูงสุดแล้ว (+10)',
  notEnoughGold:     'เซนี่ไม่พอ!',
  itemDrop:          (name: string) => `🎁 ได้รับ: ${name}!`,
  weaponSlot:        'อาวุธ',
  armorSlot:         'เกราะ',
  accessorySlot:     'เครื่องประดับ',
  empty:             '— ว่าง —',

  // ─── แผนที่ ─────────────────────────────────────────────────
  mapTitle:       'เลือกพื้นที่ล่าสัตว์',
  currentArea:    'พื้นที่ปัจจุบัน',
  moveHere:       'ย้ายมาที่นี่',
  goldBonusLabel: (n: number) => `Gold +${n}%`,
  expBonusLabel:  (n: number) => `EXP +${n}%`,

  // ─── log ───────────────────────────────────────────────────
  combatLogTitle: 'บันทึกการต่อสู้',
  logEmpty:       'ยังไม่มีบันทึก...',
  clearLog:       'ล้างบันทึก',
} as const
