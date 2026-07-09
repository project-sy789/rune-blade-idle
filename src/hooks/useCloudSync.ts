// ============================================================
// useCloudSync.ts — auto cloud save + offline restore
// ============================================================
import { useEffect, useRef } from 'react'
import { GAME_SAVE_STORAGE_KEY, useGameStore } from '../store/gameStore'
import { SUPABASE_KEY, SUPABASE_URL, supabase, getDeviceId, getDisplayName } from '../lib/supabase'

const SYNC_INTERVAL_MS = 30_000   // sync ทุก 30 วินาที

function buildCloudPayload() {
  const deviceId    = getDeviceId()
  const displayName = getDisplayName()
  const state = useGameStore.getState()
  const saveData = {
    player:         state.player,
    equipment:      state.equipment,
    inventory:      state.inventory,
    currentStageId: state.currentStageId,
    killsSinceBoss: state.killsSinceBoss,
    lastLogin:      state.lastLogin,
  }

  return {
    device_id:    deviceId,
    display_name: displayName,
    level:        state.player.level,
    gold:         state.player.gold,
    total_kills:  state.player.totalKills,
    class_id:     state.player.classId,
    stage_id:     state.currentStageId,
    save_data:    saveData,
    updated_at:   new Date().toISOString(),
  }
}

export function useCloudSync() {
  const player         = useGameStore(s => s.player)
  const equipment      = useGameStore(s => s.equipment)
  const inventory      = useGameStore(s => s.inventory)
  const currentStageId = useGameStore(s => s.currentStageId)
  const hasLoaded      = useRef(false)

  // ── Load cloud save on mount ─────────────────────────────
  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true

    const load = async () => {
      const deviceId = getDeviceId()
      const { data, error } = await supabase
        .from('players')
        .select('save_data, level, updated_at')
        .eq('device_id', deviceId)
        .single()

      if (error || !data?.save_data) return

      // ใช้ cloud save เฉพาะถ้า level cloud สูงกว่า local
      const localLevel  = useGameStore.getState().player.level
      const cloudLevel  = data.level as number
      if (cloudLevel > localLevel && data.save_data) {
        // rehydrate ผ่าน Zustand persist storage key
        try {
          const cloudSave = data.save_data as Record<string, unknown>
          localStorage.setItem(GAME_SAVE_STORAGE_KEY, JSON.stringify({ state: cloudSave, version: 0 }))
          window.location.reload()
        } catch { /* ignore */ }
      }
    }
    load()
  }, [])

  // ── Periodic push ────────────────────────────────────────
  useEffect(() => {
    const push = async () => {
      await supabase.from('players').upsert(
        buildCloudPayload(),
        { onConflict: 'device_id' },
      )
    }

    const id = setInterval(push, SYNC_INTERVAL_MS)
    // push ทันทีตอน mount
    push()
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.level, player.totalKills])

  // push ตอน unload
  useEffect(() => {
    const handle = () => {
      void fetch(`${SUPABASE_URL}/rest/v1/players?on_conflict=device_id`, {
        method: 'POST',
        keepalive: true,
        headers: {
          apikey: SUPABASE_KEY,
          authorization: `Bearer ${SUPABASE_KEY}`,
          'content-type': 'application/json',
          prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(buildCloudPayload()),
      }).catch(() => {})
    }
    window.addEventListener('pagehide', handle)
    return () => window.removeEventListener('pagehide', handle)
  }, [])
}
