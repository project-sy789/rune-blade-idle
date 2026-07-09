// ============================================================
// usePushNotifications.ts — PWA Push + Boss spawn notify
// ============================================================
import { useEffect, useRef } from 'react'
import { useGameStore }      from '../store/gameStore'

const APP_BASE_URL = import.meta.env.BASE_URL || '/'

async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker.register(`${APP_BASE_URL}sw.js`, { scope: APP_BASE_URL })
  } catch { return null }
}

export function usePushNotifications() {
  const log        = useGameStore(s => s.log)
  const lastBossId = useRef(0)
  const regRef     = useRef<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    registerSW().then(reg => { regRef.current = reg })
  }, [])

  useEffect(() => {
    const latest = log[0]
    if (!latest || latest.id === lastBossId.current) return
    if (latest.type !== 'boss') return
    if (latest.text.indexOf('ปรากฏ') === -1) return
    lastBossId.current = latest.id

    if (document.visibilityState === 'hidden' && regRef.current) {
      regRef.current.showNotification('☠️ Boss ปรากฏ!', {
        body: latest.text,
        icon: `${APP_BASE_URL}icon.svg`,
        tag:  'boss-spawn',
      })
    }
  }, [log])
}

export async function requestPushPermission(): Promise<string> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission === 'granted') return 'granted'
  return Notification.requestPermission()
}

export function getPushPermission(): string {
  if (!('Notification' in window)) return 'denied'
  return Notification.permission
}
