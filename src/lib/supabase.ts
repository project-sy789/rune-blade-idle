// ============================================================
// supabase.ts — client singleton + device ID
// ============================================================
import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://hmfhdgrezidwkbzxsvtp.supabase.co'
export const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1yV0SBQMaR5RgAm7-E5Y7Q_GZPA7Jp2'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { params: { eventsPerSecond: 10 } },
})

// ─── Stable anonymous device ID ─────────────────────────────
const DEVICE_KEY = 'rune_blade_device_id'
export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY)
  if (!id) {
    id = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(DEVICE_KEY, id)
  }
  return id
}

// ─── Display name (editable) ────────────────────────────────
const NAME_KEY = 'rune_blade_display_name'
export function getDisplayName(): string {
  return localStorage.getItem(NAME_KEY) ?? 'นักผจญภัย'
}
export function setDisplayName(name: string) {
  localStorage.setItem(NAME_KEY, name)
}
