// ============================================================
// FieldMapArt.tsx — painted terrain overlays per stage
// ============================================================

interface MapPalette {
  grassA: string
  grassB: string
  road: string
  roadDark: string
  water: string
  waterLight: string
  rock: string
  accent: string
  fog: string
}

const PALETTES: Record<string, MapPalette> = {
  prontera:       { grassA: '#3f8f45', grassB: '#78b84a', road: '#b88956', roadDark: '#735030', water: '#4aa6b8', waterLight: '#9ee7ee', rock: '#77694d', accent: '#f7d35d', fog: '#d9ffd5' },
  payon_forest:   { grassA: '#1f6b4a', grassB: '#2c9a58', road: '#7d633f', roadDark: '#4b3926', water: '#2aa5a8', waterLight: '#91f5e7', rock: '#50674a', accent: '#f0b85a', fog: '#b8ffd8' },
  izlude_coast:   { grassA: '#2d9f92', grassB: '#e7c66a', road: '#d9ae6a', roadDark: '#8a6537', water: '#1f9bd1', waterLight: '#a7f3ff', rock: '#7a8a8d', accent: '#ffe08a', fog: '#d3f8ff' },
  geffen_field:   { grassA: '#493c96', grassB: '#6d4fd1', road: '#7b7187', roadDark: '#43364d', water: '#7c4edb', waterLight: '#dac4ff', rock: '#5b5170', accent: '#e8c5ff', fog: '#ebd8ff' },
  morroc:         { grassA: '#b77922', grassB: '#d89c35', road: '#c98133', roadDark: '#7c461c', water: '#5ca6bb', waterLight: '#d9f4ff', rock: '#8b5b2f', accent: '#f7c45a', fog: '#ffe7b0' },
  aldebaran_clock:{ grassA: '#6f675d', grassB: '#9a8060', road: '#7d5b32', roadDark: '#3f3021', water: '#b88c34', waterLight: '#ffe3a3', rock: '#4f4a43', accent: '#ffd36b', fog: '#f5e3c3' },
  glast_heim:     { grassA: '#394150', grassB: '#59616d', road: '#55545b', roadDark: '#2b2d35', water: '#57348f', waterLight: '#c8a7ff', rock: '#2d3440', accent: '#d9d3c7', fog: '#d7d5ff' },
  orc_village:    { grassA: '#5e3b21', grassB: '#704f25', road: '#8a4d22', roadDark: '#3f1f0e', water: '#803030', waterLight: '#ff9c80', rock: '#4c3d2e', accent: '#f16c35', fog: '#ffd0ab' },
  turtle_island:  { grassA: '#218c62', grassB: '#6aaa3d', road: '#b5c96b', roadDark: '#667338', water: '#24a7bc', waterLight: '#b9fff3', rock: '#557052', accent: '#e0e96b', fog: '#d9ffe5' },
  niflheim_gate:  { grassA: '#211633', grassB: '#40205c', road: '#51327a', roadDark: '#160d22', water: '#5a2ca5', waterLight: '#d4b2ff', rock: '#111827', accent: '#d68cff', fog: '#ead6ff' },
}

const DEFAULT = PALETTES.prontera

export function FieldMapArt({ stageId }: { stageId: string }) {
  const p = PALETTES[stageId] ?? DEFAULT
  return (
    <svg className="field-map-art" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="terrainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.grassB} stopOpacity="0.55" />
          <stop offset="0.52" stopColor={p.grassA} stopOpacity="0.4" />
          <stop offset="1" stopColor={p.rock} stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.road} stopOpacity="0.62" />
          <stop offset="1" stopColor={p.roadDark} stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={p.water} stopOpacity="0" />
          <stop offset="0.5" stopColor={p.waterLight} stopOpacity="0.38" />
          <stop offset="1" stopColor={p.water} stopOpacity="0" />
        </linearGradient>
        <filter id="softBlur"><feGaussianBlur stdDeviation="1.2" /></filter>
      </defs>

      <path d="M-5 26 C18 14 35 23 53 14 C72 4 88 12 106 2 L106 -5 L-5 -5 Z" fill="url(#terrainGrad)" opacity="0.58" />
      <path d="M-8 92 C17 73 37 85 54 69 C74 50 88 58 108 41 L108 108 L-8 108 Z" fill="url(#terrainGrad)" opacity="0.62" />
      <path d="M-4 60 C14 48 25 49 39 38 C54 27 67 35 84 24 C93 18 99 17 108 14" stroke="url(#roadGrad)" strokeWidth="13" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M-4 60 C14 48 25 49 39 38 C54 27 67 35 84 24 C93 18 99 17 108 14" stroke="rgba(255,255,255,0.16)" strokeWidth="2" strokeDasharray="7 7" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M7 -8 C24 20 18 36 35 54 C51 72 45 86 58 108" stroke="url(#waterGrad)" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M10 -8 C26 20 20 36 37 54 C53 72 47 86 60 108" stroke="rgba(255,255,255,0.26)" strokeWidth="1.2" strokeDasharray="4 8" fill="none" opacity="0.7" />

      <g opacity="0.32" filter="url(#softBlur)">
        <ellipse cx="20" cy="25" rx="18" ry="7" fill={p.fog} />
        <ellipse cx="76" cy="73" rx="20" ry="8" fill={p.fog} />
      </g>
      <g opacity="0.46">
        <path d="M13 37 l7 -4 l7 4 l-7 4 Z" fill={p.accent} opacity="0.22" />
        <path d="M67 42 l9 -5 l9 5 l-9 5 Z" fill={p.accent} opacity="0.2" />
        <path d="M31 79 l8 -4 l8 4 l-8 5 Z" fill={p.accent} opacity="0.18" />
      </g>
      <g opacity="0.24">
        {Array.from({ length: 20 }).map((_, i) => {
          const x = (i * 37) % 100
          const y = (i * 19 + 13) % 100
          return <path key={i} d={`M${x} ${y} l3 -1.7 l3 1.7 l-3 1.7 Z`} fill={i % 3 === 0 ? p.accent : '#ffffff'} opacity="0.45" />
        })}
      </g>
    </svg>
  )
}
