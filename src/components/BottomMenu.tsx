// ============================================================
// BottomMenu.tsx — v5: 7 tabs (+ Achievements)
// ============================================================
import { useState }          from 'react'
import { TabStats }          from './TabStats'
import { TabInventory }      from './TabInventory'
import { TabLog }            from './TabLog'
import { TabMap }            from './TabMap'
import { TabLeaderboard }    from './TabLeaderboard'
import { TabGuild }          from './TabGuild'
import { TabAchievements }   from './TabAchievements'
import { T }                 from '../constants/translations'
import { useGameStore }      from '../store/gameStore'

const TABS = [
  { id: 'stats',        label: T.tabStats,     icon: '📊' },
  { id: 'inventory',    label: T.tabInventory, icon: '🎒' },
  { id: 'map',          label: T.tabMap,       icon: '🗺' },
  { id: 'achievements', label: 'รางวัล',        icon: '🏅' },
  { id: 'rank',         label: 'อันดับ',         icon: '🏆' },
  { id: 'guild',        label: 'กิลด์',          icon: '⚔️' },
  { id: 'log',          label: T.tabLog,       icon: '📜' },
] as const

type TabId = typeof TABS[number]['id']

export function BottomMenu() {
  const [active, setActive] = useState<TabId>('stats')
  const newAch = useGameStore(s => s.achievementPopups.length)

  return (
    <section
      className="shrink-0 flex flex-col glass-purple border-t border-purple-900/40"
      style={{ height: '48%' }}
    >
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-purple-900/30 overflow-x-auto scrollbar-none">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`
              relative flex-1 min-w-[48px] py-1.5 flex flex-col items-center gap-0.5
              text-[9px] font-semibold transition-all shrink-0
              ${active === tab.id
                ? 'text-purple-300 border-b-2 border-purple-400 bg-purple-900/20'
                : 'text-gray-500 hover:text-gray-300'
              }
            `}
          >
            <span className="text-sm leading-none">{tab.icon}</span>
            <span className="truncate w-full text-center px-0.5">{tab.label}</span>
            {tab.id === 'achievements' && newAch > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {active === 'stats'        && <TabStats />}
        {active === 'inventory'    && <TabInventory />}
        {active === 'map'          && <TabMap />}
        {active === 'achievements' && <TabAchievements />}
        {active === 'rank'         && <TabLeaderboard />}
        {active === 'guild'        && <TabGuild />}
        {active === 'log'          && <TabLog />}
      </div>
    </section>
  )
}
