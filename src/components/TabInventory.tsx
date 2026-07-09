// ============================================================
// TabInventory.tsx — v2: Equipment slots + bag + enhance
// ============================================================
import { useState }      from 'react'
import { useGameStore }  from '../store/gameStore'
import { T }             from '../constants/translations'
import {
  ITEM_TEMPLATES, RARITY_COLOR, RARITY_LABEL,
  GAME_CONFIG, InventoryItem,
} from '../constants/gameConfig'

function getTemplate(item: InventoryItem) {
  return ITEM_TEMPLATES.find(t => t.id === item.templateId)!
}

function ItemCard({
  item, isEquipped, onEquip, onUnequip, onEnhance, gold,
}: {
  item: InventoryItem
  isEquipped?: boolean
  onEquip?: () => void
  onUnequip?: () => void
  onEnhance?: () => void
  gold: number
}) {
  const tmpl     = getTemplate(item)
  if (!tmpl) return null
  const rarColor = RARITY_COLOR[tmpl.rarity]
  const costNext = GAME_CONFIG.ENHANCE_GOLD_COST(item.enhanceLevel)
  const canEnh   = item.enhanceLevel < 10 && gold >= costNext

  return (
    <div className={`rounded-xl border bg-gray-900/60 p-2.5 flex flex-col gap-2 ${rarColor.split(' ')[1]}`}>
      {/* Top row */}
      <div className="flex items-start gap-2">
        <span className="text-2xl leading-none mt-0.5">{tmpl.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-sm text-white truncate">{tmpl.name}</span>
            {item.enhanceLevel > 0 && (
              <span className="text-yellow-400 font-extrabold text-xs">+{item.enhanceLevel}</span>
            )}
          </div>
          <span className={`text-[10px] ${rarColor.split(' ')[0]}`}>{RARITY_LABEL[tmpl.rarity]}</span>
          <p className="text-[10px] text-gray-500 mt-0.5">{tmpl.desc}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-2 text-[10px] text-gray-400">
        {tmpl.bonusAtk > 0  && <span className="text-red-300">⚔️ +{tmpl.bonusAtk + item.enhanceLevel * 3}</span>}
        {tmpl.bonusDef > 0  && <span className="text-blue-300">🛡 +{tmpl.bonusDef + item.enhanceLevel * 2}</span>}
        {tmpl.bonusHp  > 0  && <span className="text-green-300">❤️ +{tmpl.bonusHp  + item.enhanceLevel * 10}</span>}
      </div>

      {/* Action buttons */}
      <div className="flex gap-1.5">
        {isEquipped ? (
          <button
            onClick={onUnequip}
            className="flex-1 py-1 rounded-lg bg-gray-700 text-gray-300 text-xs font-semibold hover:bg-gray-600 transition-colors active:scale-95"
          >
            {T.unequip}
          </button>
        ) : (
          <button
            onClick={onEquip}
            className="flex-1 py-1 rounded-lg bg-blue-700/60 border border-blue-500/40 text-blue-200 text-xs font-semibold hover:bg-blue-600/60 transition-colors active:scale-95"
          >
            {T.equip}
          </button>
        )}
        <button
          disabled={!canEnh}
          onClick={onEnhance}
          className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors active:scale-95 ${
            item.enhanceLevel >= 10
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : canEnh
                ? 'bg-yellow-600/70 border border-yellow-500/50 text-yellow-200 hover:bg-yellow-500/70'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          {item.enhanceLevel >= 10 ? 'MAX' : `+${item.enhanceLevel + 1} (${costNext}🪙)`}
        </button>
      </div>
    </div>
  )
}

export function TabInventory() {
  const player      = useGameStore(s => s.player)
  const equipment   = useGameStore(s => s.equipment)
  const inventory   = useGameStore(s => s.inventory)
  const equipItem   = useGameStore(s => s.equipItem)
  const unequipSlot = useGameStore(s => s.unequipSlot)
  const enhanceItem = useGameStore(s => s.enhanceItem)
  const [tab, setTab] = useState<'equip' | 'bag'>('equip')

  const equippedUids = new Set(
    [equipment.weapon?.uid, equipment.armor?.uid, equipment.accessory?.uid].filter(Boolean)
  )

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub tabs */}
      <div className="flex shrink-0 border-b border-gray-800 px-3 pt-2 gap-3">
        {(['equip', 'bag'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-1.5 text-xs font-bold border-b-2 transition-all ${
              tab === t ? 'text-yellow-300 border-yellow-400' : 'text-gray-500 border-transparent'
            }`}
          >
            {t === 'equip' ? `🛡 ${T.equippedSection}` : `🎒 ${T.bagSection} (${inventory.length})`}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-2">
        {tab === 'equip' ? (
          /* ── Equipment slots ── */
          <div className="flex flex-col gap-2">
            {(['weapon', 'armor', 'accessory'] as const).map(slot => {
              const item = equipment[slot]
              const label = slot === 'weapon' ? T.weaponSlot : slot === 'armor' ? T.armorSlot : T.accessorySlot
              return (
                <div key={slot} className="bg-gray-900/40 border border-gray-800 rounded-xl p-2">
                  <p className="text-[10px] text-purple-400 font-semibold mb-1.5">{label}</p>
                  {item ? (
                    <ItemCard
                      item={item}
                      isEquipped
                      onUnequip={() => unequipSlot(slot)}
                      onEnhance={() => enhanceItem(item.uid)}
                      gold={player.gold}
                    />
                  ) : (
                    <p className="text-center text-gray-700 text-xs py-2">{T.empty}</p>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* ── Bag ── */
          inventory.length === 0 ? (
            <p className="text-center text-gray-600 text-xs pt-8">{T.inventoryEmpty}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {inventory.map(item => (
                <ItemCard
                  key={item.uid}
                  item={item}
                  isEquipped={equippedUids.has(item.uid)}
                  onEquip={() => equipItem(item.uid)}
                  onEnhance={() => enhanceItem(item.uid)}
                  gold={player.gold}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
