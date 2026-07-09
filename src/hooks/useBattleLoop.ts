// ============================================================
// useBattleLoop.ts — Game Loop Hook (setInterval + offline)
// ============================================================
import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { GAME_CONFIG } from '../constants/gameConfig'

export function useBattleLoop() {
  const tickBattle             = useGameStore(s => s.tickBattle)
  const isAutoBattle           = useGameStore(s => s.isAutoBattle)
  const saveLastLogin          = useGameStore(s => s.saveLastLogin)
  const computeOfflineProgress = useGameStore(s => s.computeOfflineProgress)
  const hasCheckedOffline      = useRef(false)

  // ── Offline check (run once on mount) ──────────────────────
  useEffect(() => {
    if (!hasCheckedOffline.current) {
      hasCheckedOffline.current = true
      computeOfflineProgress(Date.now())
    }
  }, [computeOfflineProgress])

  // ── Auto-battle loop ────────────────────────────────────────
  useEffect(() => {
    if (!isAutoBattle) return
    const id = setInterval(() => {
      tickBattle()
    }, GAME_CONFIG.ATTACK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [isAutoBattle, tickBattle])

  // ── Periodic save of lastLogin ──────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      saveLastLogin()
    }, GAME_CONFIG.SAVE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [saveLastLogin])

  // ── Save on page hide/unload ────────────────────────────────
  useEffect(() => {
    const handle = () => saveLastLogin()
    window.addEventListener('visibilitychange', handle)
    window.addEventListener('pagehide', handle)
    return () => {
      window.removeEventListener('visibilitychange', handle)
      window.removeEventListener('pagehide', handle)
    }
  }, [saveLastLogin])
}
