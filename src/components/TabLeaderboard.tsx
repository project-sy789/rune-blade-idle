// ============================================================
// TabLeaderboard.tsx — อันดับผู้เล่น + ชื่อตัวเอง
// ============================================================
import { useState, useEffect } from 'react'
import { supabase, getDeviceId, getDisplayName, setDisplayName } from '../lib/supabase'
import { useGameStore } from '../store/gameStore'
import { CLASSES }      from '../constants/classes'

interface LeaderRow {
  rank:         number
  display_name: string
  level:        number
  total_kills:  number
  gold:         number
  class_id:     string | null
  updated_at:   string
}

export function TabLeaderboard() {
  const [rows,     setRows]     = useState<LeaderRow[]>([])
  const [loading,  setLoading]  = useState(true)
  const [editName, setEditName] = useState(false)
  const [nameInput,setNameInput]= useState(getDisplayName())
  const [myDevId]               = useState(getDeviceId())
  const [myDbId,   setMyDbId]   = useState<string | null>(null)
  const player = useGameStore(s => s.player)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('leaderboard')
      .select('*')
    if (data) setRows(data as LeaderRow[])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // resolve own player id
    supabase.from('players').select('id').eq('device_id', myDevId).single()
      .then(({ data }) => { if (data) setMyDbId(data.id) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveName = async () => {
    const trimmed = nameInput.trim().slice(0, 20) || 'นักผจญภัย'
    setDisplayName(trimmed)
    if (myDbId) {
      await supabase.from('players').update({ display_name: trimmed }).eq('id', myDbId)
    }
    setEditName(false)
    load()
  }

  const clsEmoji = (id: string | null) =>
    id ? (CLASSES.find(c => c.id === id)?.emoji ?? '') : ''

  const timeAgo = (iso: string) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
    if (diff < 1)  return 'เมื่อกี้'
    if (diff < 60) return `${diff}m`
    if (diff < 1440) return `${Math.floor(diff / 60)}h`
    return `${Math.floor(diff / 1440)}d`
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1.5 shrink-0 border-b border-gray-800">
        <span className="text-xs font-bold text-yellow-400">🏆 อันดับผู้เล่น</span>
        <div className="flex gap-2 items-center">
          {editName ? (
            <>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveName()}
                maxLength={20}
                className="bg-gray-800 border border-purple-600 rounded px-2 py-0.5 text-xs text-white w-28"
                autoFocus
              />
              <button onClick={saveName} className="text-[10px] text-green-400 font-bold">✓</button>
              <button onClick={() => setEditName(false)} className="text-[10px] text-gray-500">✕</button>
            </>
          ) : (
            <>
              <span className="text-[10px] text-gray-500">{getDisplayName()}</span>
              <button
                onClick={() => setEditName(true)}
                className="text-[10px] text-purple-400 border border-purple-700/40 rounded px-1.5 py-0.5"
              >
                ✎
              </button>
            </>
          )}
          <button onClick={load} className="text-[10px] text-gray-500 border border-gray-700 rounded px-1.5 py-0.5">
            ↺
          </button>
        </div>
      </div>

      {/* My rank quick stat */}
      <div className="px-3 py-1.5 bg-purple-900/20 border-b border-purple-900/30 shrink-0">
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span>{clsEmoji(player.classId)} {getDisplayName()}</span>
          <span className="text-yellow-400">Lv.{player.level}</span>
          <span>💀 {player.totalKills.toLocaleString()} kills</span>
          <span className="text-yellow-500">🪙 {player.gold.toLocaleString()}</span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto thin-scroll">
        {loading ? (
          <p className="text-center text-gray-600 text-xs pt-6">กำลังโหลด...</p>
        ) : rows.length === 0 ? (
          <p className="text-center text-gray-600 text-xs pt-6">ยังไม่มีผู้เล่น — เล่นก่อนเลย!</p>
        ) : (
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-900/90">
              <tr className="text-gray-500 text-[10px]">
                <th className="px-2 py-1.5 text-left w-8">#</th>
                <th className="px-2 py-1.5 text-left">ชื่อ</th>
                <th className="px-2 py-1.5 text-right">Lv</th>
                <th className="px-2 py-1.5 text-right">Kills</th>
                <th className="px-2 py-1.5 text-right">Online</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isMe = r.display_name === getDisplayName()
                return (
                  <tr
                    key={r.rank}
                    className={`border-b border-gray-800/60 ${isMe ? 'bg-purple-900/20' : ''}`}
                  >
                    <td className="px-2 py-1.5 font-bold text-gray-500">
                      {r.rank <= 3
                        ? ['🥇','🥈','🥉'][r.rank - 1]
                        : r.rank
                      }
                    </td>
                    <td className="px-2 py-1.5 text-white font-semibold truncate max-w-[100px]">
                      {clsEmoji(r.class_id)} {r.display_name}
                      {isMe && <span className="ml-1 text-purple-400 text-[9px]">(คุณ)</span>}
                    </td>
                    <td className="px-2 py-1.5 text-right text-yellow-400 font-bold">{r.level}</td>
                    <td className="px-2 py-1.5 text-right text-gray-400">{r.total_kills.toLocaleString()}</td>
                    <td className="px-2 py-1.5 text-right text-gray-600">{timeAgo(r.updated_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
