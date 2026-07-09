// ============================================================
// useSfx.ts — hook ที่ฟัง log แล้วเล่น SFX อัตโนมัติ
// ============================================================
import { useEffect, useRef } from 'react'
import { useGameStore }      from '../store/gameStore'
import { SFX }               from '../lib/sounds'

export function useSfx() {
  const log        = useGameStore(s => s.log)
  const lastId     = useRef(0)
  const didInit    = useRef(false)

  // Warmup on first interaction
  useEffect(() => {
    const warm = () => {
      if (!didInit.current) {
        SFX.warmup()
        didInit.current = true
      }
    }
    window.addEventListener('pointerdown', warm, { once: true })
    return () => window.removeEventListener('pointerdown', warm)
  }, [])

  useEffect(() => {
    const latest = log[0]
    if (!latest || latest.id === lastId.current) return
    lastId.current = latest.id

    switch (latest.type) {
      case 'attack':
        latest.text.includes('!') ? SFX.crit() : SFX.attack()
        break
      case 'receive':
        SFX.hit()
        break
      case 'kill':
        SFX.die()
        break
      case 'levelup':
        SFX.levelup()
        break
      case 'drop':
        SFX.itemdrop()
        break
      case 'boss':
        if (latest.text.includes('ปรากฏ')) SFX.bossSpawn()
        break
      case 'skill':
        SFX.skill()
        break
      case 'enhance':
        latest.text.includes('สำเร็จ') ? SFX.enhance() : SFX.enhanceFail()
        break
    }
  }, [log])
}
