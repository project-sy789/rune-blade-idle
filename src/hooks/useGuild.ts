// ============================================================
// useGuild.ts — guild CRUD + realtime chat hook
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { supabase, getDeviceId, getDisplayName } from '../lib/supabase'

export interface GuildInfo {
  id:        string
  name:      string
  tag:       string
  leader_id: string | null
}

export interface ChatMessage {
  id:           string
  guild_id:     string
  player_id:    string | null
  display_name: string
  message:      string
  created_at:   string
}

export interface GuildMemberRow {
  player_id:   string
  joined_at:   string
  players: { display_name: string; level: number; class_id: string | null } | null
}

export function useGuild() {
  const [myPlayerId,  setMyPlayerId]  = useState<string | null>(null)
  const [myGuild,     setMyGuild]     = useState<GuildInfo | null>(null)
  const [members,     setMembers]     = useState<GuildMemberRow[]>([])
  const [chatMsgs,    setChatMsgs]    = useState<ChatMessage[]>([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState<string | null>(null)
  const [allGuilds,   setAllGuilds]   = useState<GuildInfo[]>([])

  // ── Resolve own player row ───────────────────────────────
  useEffect(() => {
    const resolve = async () => {
      const { data } = await supabase
        .from('players')
        .select('id')
        .eq('device_id', getDeviceId())
        .single()
      if (data) setMyPlayerId(data.id)
    }
    resolve()
  }, [])

  // ── Load my guild ────────────────────────────────────────
  const loadMyGuild = useCallback(async () => {
    if (!myPlayerId) return
    const { data: membership } = await supabase
      .from('guild_members')
      .select('guild_id')
      .eq('player_id', myPlayerId)
      .single()
    if (!membership) { setMyGuild(null); return }

    const { data: guild } = await supabase
      .from('guilds')
      .select('*')
      .eq('id', membership.guild_id)
      .single()
    if (guild) setMyGuild(guild as GuildInfo)
  }, [myPlayerId])

  // ── Load guild members ───────────────────────────────────
  const loadMembers = useCallback(async () => {
    if (!myGuild) return
    const { data } = await supabase
      .from('guild_members')
      .select('player_id, joined_at, players(display_name, level, class_id)')
      .eq('guild_id', myGuild.id)
      .order('joined_at', { ascending: true })
    if (data) setMembers(data as unknown as GuildMemberRow[])
  }, [myGuild])

  // ── Load chat history ────────────────────────────────────
  const loadChat = useCallback(async () => {
    if (!myGuild) return
    const { data } = await supabase
      .from('guild_chat')
      .select('*')
      .eq('guild_id', myGuild.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setChatMsgs((data as ChatMessage[]).reverse())
  }, [myGuild])

  // ── Load all guilds list ─────────────────────────────────
  const loadAllGuilds = useCallback(async () => {
    const { data } = await supabase.from('guilds').select('*').order('name')
    if (data) setAllGuilds(data as GuildInfo[])
  }, [])

  useEffect(() => { loadMyGuild() }, [loadMyGuild])
  useEffect(() => { if (myGuild) { loadMembers(); loadChat() } }, [myGuild, loadMembers, loadChat])
  useEffect(() => { loadAllGuilds() }, [loadAllGuilds])

  // ── Realtime chat subscription ───────────────────────────
  useEffect(() => {
    if (!myGuild) return
    const channel = supabase
      .channel(`guild_chat_${myGuild.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guild_chat', filter: `guild_id=eq.${myGuild.id}` },
        (payload) => {
          setChatMsgs(prev => [...prev, payload.new as ChatMessage].slice(-50))
        },
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [myGuild])

  // ── Create guild ─────────────────────────────────────────
  const createGuild = async (name: string, tag: string) => {
    if (!myPlayerId) return
    setLoading(true); setError(null)
    try {
      const { data: guild, error: err } = await supabase
        .from('guilds')
        .insert({ name, tag, leader_id: myPlayerId })
        .select()
        .single()
      if (err) { setError(err.message); return }
      await supabase.from('guild_members').insert({ guild_id: guild.id, player_id: myPlayerId })
      setMyGuild(guild as GuildInfo)
      loadAllGuilds()
    } finally { setLoading(false) }
  }

  // ── Join guild ───────────────────────────────────────────
  const joinGuild = async (guildId: string) => {
    if (!myPlayerId) return
    setLoading(true); setError(null)
    try {
      const { error: err } = await supabase
        .from('guild_members')
        .insert({ guild_id: guildId, player_id: myPlayerId })
      if (err) { setError(err.message); return }
      const { data: guild } = await supabase.from('guilds').select('*').eq('id', guildId).single()
      if (guild) setMyGuild(guild as GuildInfo)
    } finally { setLoading(false) }
  }

  // ── Leave guild ──────────────────────────────────────────
  const leaveGuild = async () => {
    if (!myPlayerId || !myGuild) return
    await supabase
      .from('guild_members')
      .delete()
      .eq('guild_id', myGuild.id)
      .eq('player_id', myPlayerId)
    setMyGuild(null); setMembers([]); setChatMsgs([])
  }

  // ── Send chat ────────────────────────────────────────────
  const sendChat = async (message: string) => {
    if (!myPlayerId || !myGuild || !message.trim()) return
    await supabase.from('guild_chat').insert({
      guild_id:     myGuild.id,
      player_id:    myPlayerId,
      display_name: getDisplayName(),
      message:      message.trim(),
    })
  }

  return {
    myPlayerId, myGuild, members, chatMsgs, loading, error,
    allGuilds, createGuild, joinGuild, leaveGuild, sendChat,
    refreshGuilds: loadAllGuilds,
  }
}
