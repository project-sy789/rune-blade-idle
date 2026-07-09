// ============================================================
// TabGuild.tsx — Guild system (create / join / chat / members)
// ============================================================
import { useState }   from 'react'
import { useGuild }   from '../hooks/useGuild'
import { CLASSES }    from '../constants/classes'

function clsEmoji(id: string | null) {
  return id ? (CLASSES.find(c => c.id === id)?.emoji ?? '') : '🧙'
}

export function TabGuild() {
  const {
    myGuild, members, chatMsgs, loading, error,
    allGuilds, createGuild, joinGuild, leaveGuild, sendChat,
    refreshGuilds,
  } = useGuild()

  const [view,      setView]      = useState<'main'|'create'|'browse'>('main')
  const [guildName, setGuildName] = useState('')
  const [guildTag,  setGuildTag]  = useState('')
  const [chatInput, setChatInput] = useState('')
  const [chatTab,   setChatTab]   = useState<'chat'|'members'>('chat')

  // ── No guild: main screen ──
  if (!myGuild) {
    if (view === 'create') {
      return (
        <div className="h-full overflow-y-auto thin-scroll px-3 py-3 flex flex-col gap-3">
          <button onClick={() => setView('main')} className="text-xs text-gray-500 self-start">← กลับ</button>
          <h3 className="text-sm font-bold text-white">🏰 สร้างกิลด์ใหม่</h3>
          <input
            value={guildName}
            onChange={e => setGuildName(e.target.value)}
            placeholder="ชื่อกิลด์ (สูงสุด 30 ตัว)"
            maxLength={30}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />
          <input
            value={guildTag}
            onChange={e => setGuildTag(e.target.value.toUpperCase().slice(0, 5))}
            placeholder="แท็ก [ABC] (สูงสุด 5 ตัว)"
            maxLength={5}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            disabled={loading || !guildName.trim() || !guildTag.trim()}
            onClick={() => createGuild(guildName.trim(), guildTag.trim())}
            className="py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold text-sm disabled:opacity-50 active:scale-95 transition-all"
          >
            {loading ? 'กำลังสร้าง...' : '✨ สร้างกิลด์'}
          </button>
        </div>
      )
    }

    if (view === 'browse') {
      return (
        <div className="h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-2 pb-1.5 shrink-0">
            <button onClick={() => setView('main')} className="text-xs text-gray-500">← กลับ</button>
            <button onClick={refreshGuilds} className="text-[10px] text-gray-500 border border-gray-700 rounded px-1.5 py-0.5">↺</button>
          </div>
          <div className="flex-1 overflow-y-auto thin-scroll px-3 pb-3 flex flex-col gap-2">
            {allGuilds.length === 0
              ? <p className="text-center text-gray-600 text-xs pt-6">ยังไม่มีกิลด์ — สร้างกิลด์แรก!</p>
              : allGuilds.map(g => (
                <div key={g.id} className="bg-gray-900/60 border border-gray-700 rounded-xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-sm text-white">[{g.tag}] {g.name}</p>
                  </div>
                  <button
                    onClick={() => joinGuild(g.id)}
                    className="text-xs bg-purple-700/50 border border-purple-500/40 text-purple-200 rounded-full px-3 py-1 font-semibold active:scale-95 transition-all"
                  >
                    เข้าร่วม
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      )
    }

    return (
      <div className="h-full flex flex-col items-center justify-center px-6 gap-4">
        <p className="text-5xl">⚔️</p>
        <p className="text-white font-bold text-base">คุณยังไม่อยู่ในกิลด์</p>
        <p className="text-gray-500 text-xs text-center">สร้างกิลด์ของคุณเอง หรือเข้าร่วมกิลด์ที่มีอยู่</p>
        <div className="flex gap-2 w-full">
          <button
            onClick={() => setView('create')}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold text-sm active:scale-95 transition-all"
          >
            🏰 สร้างกิลด์
          </button>
          <button
            onClick={() => { setView('browse'); refreshGuilds() }}
            className="flex-1 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 font-bold text-sm active:scale-95 transition-all"
          >
            🔍 ค้นหากิลด์
          </button>
        </div>
      </div>
    )
  }

  // ── In guild: chat + members ──
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Guild header */}
      <div className="px-3 py-2 bg-purple-900/20 border-b border-purple-800/40 shrink-0 flex items-center justify-between">
        <div>
          <p className="font-bold text-sm text-white">[{myGuild.tag}] {myGuild.name}</p>
          <p className="text-[10px] text-purple-400">{members.length} สมาชิก</p>
        </div>
        <button
          onClick={leaveGuild}
          className="text-[10px] text-red-500 border border-red-800/40 rounded px-1.5 py-0.5"
        >
          ออกจากกิลด์
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex shrink-0 border-b border-gray-800">
        {(['chat', 'members'] as const).map(t => (
          <button
            key={t}
            onClick={() => setChatTab(t)}
            className={`flex-1 py-1.5 text-[10px] font-bold transition-all ${
              chatTab === t ? 'text-purple-300 border-b-2 border-purple-400' : 'text-gray-500'
            }`}
          >
            {t === 'chat' ? '💬 แชท' : `👥 สมาชิก (${members.length})`}
          </button>
        ))}
      </div>

      {chatTab === 'members' ? (
        /* ── Members list ── */
        <div className="flex-1 overflow-y-auto thin-scroll px-3 py-2 flex flex-col gap-1.5">
          {members.map((m, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-800/40">
              <span className="text-base">{clsEmoji(m.players?.class_id ?? null)}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{m.players?.display_name ?? '???'}</p>
                <p className="text-[10px] text-gray-500">Lv.{m.players?.level ?? '?'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Chat ── */
        <>
          <div className="flex-1 overflow-y-auto thin-scroll px-3 py-2 flex flex-col gap-1">
            {chatMsgs.length === 0
              ? <p className="text-center text-gray-600 text-xs pt-4">ยังไม่มีข้อความ — เริ่มแชทก่อนเลย!</p>
              : chatMsgs.map(msg => (
                <div key={msg.id} className="flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-purple-400 text-[10px] font-bold shrink-0">{msg.display_name}</span>
                    <span className="text-gray-600 text-[9px]">
                      {new Date(msg.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-snug ml-0.5">{msg.message}</p>
                </div>
              ))
            }
          </div>
          {/* Input */}
          <div className="shrink-0 flex gap-2 px-3 py-2 border-t border-gray-800">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { sendChat(chatInput); setChatInput('') } }}
              placeholder="พิมพ์ข้อความ..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => { sendChat(chatInput); setChatInput('') }}
              className="bg-purple-600 text-white rounded-xl px-3 py-1.5 text-xs font-bold active:scale-95 transition-all"
            >
              ส่ง
            </button>
          </div>
        </>
      )}
    </div>
  )
}
