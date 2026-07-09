// ============================================================
// TabInventory.tsx — Equipment, bag filters, compare, enhance
// ============================================================
import { useMemo, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { T } from '../constants/translations'
import {
  GAME_CONFIG,
  InventoryItem,
  ItemRarity,
  ItemType,
  ITEM_TEMPLATES,
  RARITY_COLOR,
  RARITY_LABEL,
  itemBonusAtk,
  itemBonusDef,
  itemBonusHp,
} from '../constants/gameConfig'

type BagFilter = 'all' | ItemType

const SLOT_LABEL: Record<ItemType, string> = {
  weapon: 'อาวุธ',
  armor: 'ชุดเกราะ',
  accessory: 'เครื่องประดับ',
}

const RARITY_ORDER: Record<ItemRarity, number> = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
}

function getTemplate(item: InventoryItem) {
  return ITEM_TEMPLATES.find(t => t.id === item.templateId)
}

function itemPower(item: InventoryItem) {
  return itemBonusAtk(item) * 3 + itemBonusDef(item) * 2 + Math.floor(itemBonusHp(item) / 10) + item.enhanceLevel * 8
}

function StatChip({ label, value, tone }: { label: string; value: number; tone: string }) {
  if (value <= 0) return null
  return <span className={`rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-bold ${tone}`}>{label} +{value}</span>
}

function CompareLine({ label, next, current }: { label: string; next: number; current: number }) {
  const diff = next - current
  const tone = diff > 0 ? 'text-green-300' : diff < 0 ? 'text-red-300' : 'text-gray-500'
  return (
    <div className="flex justify-between text-[10px]">
      <span className="text-gray-500">{label}</span>
      <span className={tone}>{current} → {next} ({diff >= 0 ? '+' : ''}{diff})</span>
    </div>
  )
}

function ItemCard({
  item,
  equippedInSlot,
  isEquipped,
  onEquip,
  onUnequip,
  onEnhance,
  gold,
}: {
  item: InventoryItem
  equippedInSlot?: InventoryItem
  isEquipped?: boolean
  onEquip?: () => void
  onUnequip?: () => void
  onEnhance?: () => void
  gold: number
}) {
  const tmpl = getTemplate(item)
  if (!tmpl) return null
  const rarColor = RARITY_COLOR[tmpl.rarity]
  const costNext = GAME_CONFIG.ENHANCE_GOLD_COST(item.enhanceLevel)
  const canEnh = item.enhanceLevel < 10 && gold >= costNext
  const currentAtk = equippedInSlot ? itemBonusAtk(equippedInSlot) : 0
  const currentDef = equippedInSlot ? itemBonusDef(equippedInSlot) : 0
  const currentHp = equippedInSlot ? itemBonusHp(equippedInSlot) : 0
  const power = itemPower(item)

  return (
    <div className={`rounded-2xl border bg-gray-950/65 p-2.5 flex flex-col gap-2 ${rarColor.split(' ')[1]}`}>
      <div className="flex items-start gap-2">
        <div className="relative shrink-0 grid h-11 w-11 place-items-center rounded-xl bg-black/30 border border-white/10 text-2xl">
          {tmpl.emoji}
          {item.enhanceLevel > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-yellow-500 px-1 text-[10px] font-black text-black">+{item.enhanceLevel}</span>}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-bold text-white">{tmpl.name}</p>
            <span className="shrink-0 rounded-full bg-purple-950/70 px-2 py-0.5 text-[9px] font-bold text-purple-200">BP {power}</span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <span className={`text-[10px] ${rarColor.split(' ')[0]}`}>{RARITY_LABEL[tmpl.rarity]}</span>
            <span className="text-[10px] text-gray-500">{SLOT_LABEL[tmpl.type]}</span>
          </div>
          <p className="mt-1 text-[10px] leading-snug text-gray-500">{tmpl.desc}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <StatChip label="ATK" value={itemBonusAtk(item)} tone="text-red-300" />
        <StatChip label="DEF" value={itemBonusDef(item)} tone="text-blue-300" />
        <StatChip label="HP" value={itemBonusHp(item)} tone="text-green-300" />
      </div>

      {!isEquipped && equippedInSlot && (
        <div className="rounded-xl border border-white/5 bg-black/20 px-2 py-1.5">
          <p className="mb-1 text-[9px] font-bold text-gray-400">เทียบกับของที่ใส่อยู่</p>
          <CompareLine label="ATK" current={currentAtk} next={itemBonusAtk(item)} />
          <CompareLine label="DEF" current={currentDef} next={itemBonusDef(item)} />
          <CompareLine label="HP" current={currentHp} next={itemBonusHp(item)} />
        </div>
      )}

      <div className="flex gap-1.5">
        {isEquipped ? (
          <button onClick={onUnequip} className="flex-1 rounded-lg bg-gray-700 py-1 text-xs font-semibold text-gray-200 active:scale-95">{T.unequip}</button>
        ) : (
          <button onClick={onEquip} className="flex-1 rounded-lg border border-blue-500/40 bg-blue-700/60 py-1 text-xs font-semibold text-blue-100 active:scale-95">{equippedInSlot ? 'สลับใส่' : T.equip}</button>
        )}
        <button
          disabled={!canEnh}
          onClick={onEnhance}
          className={`flex-1 rounded-lg py-1 text-xs font-semibold active:scale-95 ${item.enhanceLevel >= 10 ? 'bg-gray-800 text-gray-600' : canEnh ? 'border border-yellow-500/50 bg-yellow-600/70 text-yellow-100' : 'bg-gray-800 text-gray-600'}`}
        >
          {item.enhanceLevel >= 10 ? 'ตีบวก MAX' : `ตีบวก +${item.enhanceLevel + 1} (${costNext})`}
        </button>
      </div>
    </div>
  )
}

export function TabInventory() {
  const player = useGameStore(s => s.player)
  const equipment = useGameStore(s => s.equipment)
  const inventory = useGameStore(s => s.inventory)
  const equipItem = useGameStore(s => s.equipItem)
  const unequipSlot = useGameStore(s => s.unequipSlot)
  const enhanceItem = useGameStore(s => s.enhanceItem)
  const [tab, setTab] = useState<'equip' | 'bag'>('equip')
  const [filter, setFilter] = useState<BagFilter>('all')

  const eqItems = [equipment.weapon, equipment.armor, equipment.accessory].filter(Boolean) as InventoryItem[]
  const totalAtk = eqItems.reduce((sum, item) => sum + itemBonusAtk(item), 0)
  const totalDef = eqItems.reduce((sum, item) => sum + itemBonusDef(item), 0)
  const totalHp = eqItems.reduce((sum, item) => sum + itemBonusHp(item), 0)
  const totalPower = eqItems.reduce((sum, item) => sum + itemPower(item), 0)

  const filteredInventory = useMemo(() => {
    return inventory
      .filter(item => filter === 'all' || getTemplate(item)?.type === filter)
      .sort((a, b) => {
        const at = getTemplate(a)
        const bt = getTemplate(b)
        return (RARITY_ORDER[bt?.rarity ?? 'common'] - RARITY_ORDER[at?.rarity ?? 'common']) || itemPower(b) - itemPower(a)
      })
  }, [filter, inventory])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 border-b border-gray-800 px-3 pt-2">
        <div className="flex gap-3">
          {(['equip', 'bag'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`pb-1.5 text-xs font-bold border-b-2 transition-all ${tab === t ? 'text-yellow-300 border-yellow-400' : 'text-gray-500 border-transparent'}`}>
              {t === 'equip' ? `🛡 ${T.equippedSection}` : `🎒 ${T.bagSection} (${inventory.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-2">
        {tab === 'equip' ? (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-1.5 rounded-2xl border border-purple-800/40 bg-purple-950/20 p-2 text-center">
              <div><p className="text-[9px] text-gray-500">พลังรวม</p><p className="text-sm font-black text-purple-200">{totalPower}</p></div>
              <div><p className="text-[9px] text-gray-500">ATK</p><p className="text-sm font-black text-red-300">+{totalAtk}</p></div>
              <div><p className="text-[9px] text-gray-500">DEF</p><p className="text-sm font-black text-blue-300">+{totalDef}</p></div>
              <div><p className="text-[9px] text-gray-500">HP</p><p className="text-sm font-black text-green-300">+{totalHp}</p></div>
            </div>
            {(['weapon', 'armor', 'accessory'] as const).map(slot => {
              const item = equipment[slot]
              const label = slot === 'weapon' ? T.weaponSlot : slot === 'armor' ? T.armorSlot : T.accessorySlot
              return (
                <div key={slot} className="rounded-xl border border-gray-800 bg-gray-900/40 p-2">
                  <p className="mb-1.5 text-[10px] font-semibold text-purple-400">{label}</p>
                  {item ? <ItemCard item={item} isEquipped onUnequip={() => unequipSlot(slot)} onEnhance={() => enhanceItem(item.uid)} gold={player.gold} /> : <p className="py-4 text-center text-xs text-gray-700">{T.empty}</p>}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {(['all', 'weapon', 'armor', 'accessory'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold ${filter === f ? 'border-yellow-400/60 bg-yellow-500/15 text-yellow-200' : 'border-gray-700 bg-gray-900/50 text-gray-500'}`}>
                  {f === 'all' ? 'ทั้งหมด' : SLOT_LABEL[f]}
                </button>
              ))}
            </div>
            {filteredInventory.length === 0 ? (
              <p className="pt-8 text-center text-xs text-gray-600">{T.inventoryEmpty}</p>
            ) : filteredInventory.map(item => {
              const tmpl = getTemplate(item)
              const slot = tmpl?.type
              const equippedInSlot = slot ? equipment[slot] : undefined
              return <ItemCard key={item.uid} item={item} equippedInSlot={equippedInSlot} onEquip={() => equipItem(item.uid)} onEnhance={() => enhanceItem(item.uid)} gold={player.gold} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
