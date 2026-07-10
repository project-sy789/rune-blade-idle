// ============================================================
// OpenWorldMap.tsx — large roaming world renderer
// ============================================================

interface Palette {
  ground1: string
  ground2: string
  highland: string
  road: string
  roadEdge: string
  water: string
  waterFoam: string
  forest: string
  rock: string
  landmark: string
  mist: string
}

const PALETTES: Record<string, Palette> = {
  prontera: { ground1: '#4e9a47', ground2: '#8bc45a', highland: '#6aa64a', road: '#b98a54', roadEdge: '#6e4b2d', water: '#3aa0b8', waterFoam: '#baf7ff', forest: '#246b39', rock: '#75664c', landmark: '#f0d05d', mist: '#ddffd4' },
  payon_forest: { ground1: '#1f6d4f', ground2: '#3ca45d', highland: '#2b7d41', road: '#80643d', roadEdge: '#44331f', water: '#289fa7', waterFoam: '#b2fff1', forest: '#15472d', rock: '#526b4c', landmark: '#f1b856', mist: '#c5ffd8' },
  izlude_coast: { ground1: '#2aa7a0', ground2: '#dfc16a', highland: '#62b37a', road: '#d6ad68', roadEdge: '#7b5b31', water: '#1297d4', waterFoam: '#c9fbff', forest: '#2f8b63', rock: '#74868b', landmark: '#ffe28a', mist: '#d7fbff' },
  geffen_field: { ground1: '#49369b', ground2: '#7954d8', highland: '#5a45ad', road: '#7a708a', roadEdge: '#3e3448', water: '#7e4ee1', waterFoam: '#e1caff', forest: '#34246e', rock: '#5b526d', landmark: '#e9c7ff', mist: '#ecd9ff' },
  morroc: { ground1: '#bb8025', ground2: '#dda33a', highland: '#a76620', road: '#ca8432', roadEdge: '#754017', water: '#58a4b9', waterFoam: '#e2fbff', forest: '#8c6b2b', rock: '#86572c', landmark: '#f8c45b', mist: '#ffe9b3' },
  aldebaran_clock: { ground1: '#6f685d', ground2: '#9b8160', highland: '#77706c', road: '#78562f', roadEdge: '#372a1d', water: '#b98d35', waterFoam: '#ffe6ad', forest: '#4e4a42', rock: '#4a4640', landmark: '#ffd36c', mist: '#f3dfbd' },
  glast_heim: { ground1: '#3b4350', ground2: '#5c626d', highland: '#424855', road: '#57545b', roadEdge: '#282a31', water: '#573392', waterFoam: '#d0b0ff', forest: '#26313d', rock: '#2d3440', landmark: '#d9d3c8', mist: '#dcd9ff' },
  orc_village: { ground1: '#5e3b20', ground2: '#755126', highland: '#6a3f1d', road: '#8d4e21', roadEdge: '#3d1d0c', water: '#833032', waterFoam: '#ffa68a', forest: '#3f421e', rock: '#4a3a2a', landmark: '#f06b35', mist: '#ffd1ac' },
  turtle_island: { ground1: '#218b62', ground2: '#72ad3d', highland: '#4f9f4c', road: '#b6ca6d', roadEdge: '#647035', water: '#22a8bd', waterFoam: '#c3fff4', forest: '#1f6b48', rock: '#556f52', landmark: '#e2eb6d', mist: '#dcffe7' },
  niflheim_gate: { ground1: '#211634', ground2: '#422160', highland: '#301847', road: '#51327a', roadEdge: '#130a1f', water: '#5d2dab', waterFoam: '#d8b8ff', forest: '#111827', rock: '#0f172a', landmark: '#d78cff', mist: '#ead7ff' },
}

const DEFAULT = PALETTES.prontera

function WorldObject({ x, y, icon, size = 12 }: { x: number; y: number; icon: string; size?: number }) {
  return <text x={x} y={y} fontSize={size} textAnchor="middle" dominantBaseline="middle" className="open-world-object">{icon}</text>
}

export function OpenWorldMap({ stageId }: { stageId: string }) {
  const p = PALETTES[stageId] ?? DEFAULT
  const ruin = stageId === 'glast_heim' || stageId === 'niflheim_gate'
  const coast = stageId === 'izlude_coast' || stageId === 'turtle_island'
  const desert = stageId === 'morroc'

  return (
    <svg className="open-world-art" viewBox="0 0 240 180" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="owGround" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.ground2} />
          <stop offset="0.48" stopColor={p.ground1} />
          <stop offset="1" stopColor={p.highland} />
        </linearGradient>
        <linearGradient id="owWater" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={p.water} stopOpacity="0.78" />
          <stop offset="0.5" stopColor={p.waterFoam} stopOpacity="0.72" />
          <stop offset="1" stopColor={p.water} stopOpacity="0.78" />
        </linearGradient>
        <filter id="owSoft"><feGaussianBlur stdDeviation="1.4" /></filter>
      </defs>

      <rect width="240" height="180" fill="url(#owGround)" />
      <path d="M-15 48 C24 19 52 35 83 20 C118 3 146 15 181 5 C208 -2 224 4 255 -10 L255 -20 L-15 -20 Z" fill={p.highland} opacity="0.42" />
      <path d="M-18 166 C28 139 63 159 98 133 C132 108 158 118 190 96 C214 80 232 78 260 63 L260 205 L-18 205 Z" fill={p.rock} opacity="0.34" />
      <path d="M-14 100 C25 76 55 89 82 66 C113 40 142 55 174 33 C201 15 223 13 260 3" stroke={p.roadEdge} strokeWidth="24" strokeLinecap="round" fill="none" opacity="0.56" />
      <path d="M-14 100 C25 76 55 89 82 66 C113 40 142 55 174 33 C201 15 223 13 260 3" stroke={p.road} strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.88" />
      <path d="M-8 101 C28 81 56 88 84 66 C115 43 143 56 174 35 C202 18 224 15 254 5" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="10 9" strokeLinecap="round" fill="none" />

      <path d={coast ? 'M176 -10 C161 33 181 66 162 100 C144 132 158 154 139 195' : 'M24 -10 C47 29 38 55 64 85 C91 115 83 141 105 194'} stroke="url(#owWater)" strokeWidth={coast ? 28 : 18} strokeLinecap="round" fill="none" opacity={desert ? 0.3 : 0.82} />
      <path d={coast ? 'M182 -10 C167 33 187 66 168 100 C150 132 164 154 145 195' : 'M28 -10 C51 29 42 55 68 85 C95 115 87 141 109 194'} stroke="rgba(255,255,255,0.34)" strokeWidth="2" strokeDasharray="7 12" fill="none" opacity={desert ? 0.18 : 0.68} />

      <g opacity="0.28" filter="url(#owSoft)">
        <ellipse cx="42" cy="42" rx="32" ry="12" fill={p.mist} />
        <ellipse cx="176" cy="126" rx="40" ry="16" fill={p.mist} />
      </g>

      <g opacity="0.46">
        {Array.from({ length: 48 }).map((_, i) => {
          const x = (i * 41 + 17) % 238
          const y = (i * 29 + 11) % 176
          const color = i % 5 === 0 ? p.landmark : i % 2 === 0 ? p.forest : p.rock
          return <path key={i} d={`M${x} ${y} l5 -2.8 l5 2.8 l-5 2.8 Z`} fill={color} opacity={i % 5 === 0 ? 0.34 : 0.24} />
        })}
      </g>

      <WorldObject x={38} y={30} icon={ruin ? '🏚️' : coast ? '⚓' : desert ? '⛺' : '🏘️'} size={16} />
      <WorldObject x={199} y={40} icon={ruin ? '🪦' : coast ? '⛵' : desert ? '🌵' : '🌲'} size={16} />
      <WorldObject x={58} y={142} icon={ruin ? '💀' : coast ? '🌴' : desert ? '🏺' : '🌳'} size={16} />
      <WorldObject x={184} y={136} icon={stageId === 'aldebaran_clock' ? '🕰️' : stageId === 'geffen_field' ? '🔮' : stageId === 'orc_village' ? '🛖' : '🗿'} size={17} />
      <WorldObject x={122} y={82} icon="✨" size={10} />
    </svg>
  )
}
