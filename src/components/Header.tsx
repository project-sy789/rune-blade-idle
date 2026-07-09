// ============================================================
// Header.tsx — v4: Glassmorphism + SFX mute toggle
// ============================================================
import { useState }    from 'react'
import { useGameStore } from '../store/gameStore'
import { BarDisplay }   from './BarDisplay'
import { T }            from '../constants/translations'
import { GAME_CONFIG, itemBonusHp } from '../constants/gameConfig'
import { CLASSES }      from '../constants/classes'
import { SFX }          from '../lib/sounds'

export function Header() {
  const player    = useGameStore(s => s.player)
  const equipment = useGameStore(s => s.equipment)
  const [muted, setMuted] = useState(SFX.isMuted())

  const cls    = player.classId ? CLASSES.find(c => c.id === player.classId) : null
  const eqHp   = (equipment.weapon    ? itemBonusHp(equipment.weapon)    : 0)
               + (equipment.armor     ? itemBonusHp(equipment.armor)     : 0)
               + (equipment.accessory ? itemBonusHp(equipment.accessory) : 0)
  const hpMult = cls ? 1 + cls.passive.hpBonus / 100 : 1
  const maxHp  = Math.floor((GAME_CONFIG.maxHpFormula(player.vit, player.baseHp) + eqHp) * hpMult)
  const expReq = GAME_CONFIG.expToNextLevel(player.level)

  const toggleMute = () => {
    const now = SFX.toggle()
    setMuted(now)
  }

  return (
    <header className="w-full px-3 pt-safe pt-3 pb-2 glass-purple border-b border-purple-900/40 shrink-0">
      {/* Title row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 flex items-center justify-center text-xl animate-pulseGlow neon-border-gold">
              {cls?.emoji ?? '⚔️'}
            </div>
            {cls && (
              <span className="absolute -bottom-0.5 -right-0.5 text-[8px] bg-purple-600 border border-purple-400/40 rounded-full px-1 leading-4 text-white font-bold">
                {player.level}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {!cls ? (
                <p className="text-base font-bold text-white leading-tight">
                  {T.level} <span className="grad-text-gold">{player.level}</span>
                </p>
              ) : (
                <p className="text-sm font-bold leading-tight">
                  <span className="text-white">{cls.name}</span>
                  <span className="text-gray-500 font-normal mx-1">·</span>
                  <span className="grad-text-gold">Lv.{player.level}</span>
                </p>
              )}
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">
              💀 {player.totalKills.toLocaleString()} kills
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Gold */}
          <div className="flex items-center gap-1 glass rounded-full px-2.5 py-1 neon-border-gold">
            <span className="text-yellow-400 text-sm">🪙</span>
            <span className="text-yellow-300 font-bold text-sm">{player.gold.toLocaleString()}</span>
          </div>
          {/* Mute */}
          <button
            onClick={toggleMute}
            className="w-7 h-7 rounded-full glass flex items-center justify-center text-sm btn-press"
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-1.5">
        <BarDisplay label={T.hp}  current={player.currentHp} max={maxHp}  colorBar="bg-gradient-to-r from-red-600 to-rose-400"    colorBg="bg-red-950/60" />
        <BarDisplay label={T.exp} current={player.exp}       max={expReq} colorBar="bg-gradient-to-r from-violet-600 to-purple-400" colorBg="bg-violet-950/60" />
      </div>

      {/* Alerts */}
      <div className="flex flex-wrap gap-1.5 mt-1.5 justify-center">
        {player.statPoints > 0 && (
          <span className="bg-gradient-to-r from-yellow-500 to-amber-400 text-black text-[10px] font-bold px-3 py-0.5 rounded-full animate-bounce shadow-lg shadow-yellow-500/30">
            ✨ {player.statPoints} {T.statPoints} รอจัดสรร!
          </span>
        )}
        {player.level >= 10 && !player.classId && (
          <span className="bg-gradient-to-r from-purple-600 to-violet-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full animate-pulse shadow-lg shadow-purple-500/30">
            🎖 เลือกอาชีพได้แล้ว!
          </span>
        )}
      </div>
    </header>
  )
}
