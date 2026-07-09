// ============================================================
// PixelSprite.tsx — animated SVG pixel art character display
// ============================================================
import { useEffect, useRef } from 'react'
import { getSprite, spriteToDataUrl } from '../constants/sprites'
import { CLASSES } from '../constants/classes'

interface PixelSpriteProps {
  id:        string          // 'warrior' | 'mage' | 'archer' | monster id
  size?:     number          // px, default 64
  animate?:  'idle' | 'attack' | 'hurt' | 'none'
  className?: string
}

const MONSTER_SPRITE_MAP: Record<string, string> = {
  poring:     'poring',
  fabre:      'slime',
  lunatic:    'slime',
  willow:     'slime',
  thief_bug:  'slime',
  zombie:     'slime',
  skeleton:   'boss',
  orc:        'boss',
  poring_king:'boss',
  nightmare:  'boss',
  dark_lord:  'boss',
  orc_hero:   'boss',
}

export function PixelSprite({ id, size = 64, animate = 'idle', className = '' }: PixelSpriteProps) {
  const spriteId = MONSTER_SPRITE_MAP[id] ?? id
  const svg      = getSprite(spriteId)
  const dataUrl  = spriteToDataUrl(svg)
  const ref      = useRef<HTMLDivElement>(null)

  // CSS animation classes per state
  const animStyle: React.CSSProperties = {
    imageRendering: 'pixelated',
    width:  size,
    height: size,
  }

  const wrapStyle: React.CSSProperties = {
    width:    size,
    height:   size,
    display:  'inline-block',
    position: 'relative',
  }

  // Determine animation class
  const animClass =
    animate === 'idle'   ? 'sprite-idle' :
    animate === 'attack' ? 'sprite-attack' :
    animate === 'hurt'   ? 'sprite-hurt' : ''

  return (
    <div ref={ref} style={wrapStyle} className={`${className} ${animClass}`}>
      <img
        src={dataUrl}
        alt={id}
        style={animStyle}
        draggable={false}
      />
      {/* Shadow */}
      <div style={{
        position:     'absolute',
        bottom:       -4,
        left:         '50%',
        transform:    'translateX(-50%)',
        width:        size * 0.6,
        height:       size * 0.12,
        borderRadius: '50%',
        background:   'rgba(0,0,0,0.25)',
        filter:       'blur(2px)',
      }} />
    </div>
  )
}

/** Get sprite key from player classId */
export function classSprite(classId: string | null): string {
  if (!classId) return 'warrior'
  const cls = CLASSES.find(c => c.id === classId)
  return cls ? classId : 'warrior'
}
