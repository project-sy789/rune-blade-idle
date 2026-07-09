// ============================================================
// sounds.ts — Procedural SFX via Web Audio API (no assets)
// ============================================================
import { Howl, Howler } from 'howler'

export function setSfxMuted(v: boolean) {
  Howler.mute(v)
  localStorage.setItem('rune_blade_sfx_muted', v ? '1' : '0')
}
export function getSfxMuted() {
  return localStorage.getItem('rune_blade_sfx_muted') === '1'
}

function sign(x: number) { return x > 0 ? 1 : x < 0 ? -1 : 0 }

function pcmToWav(samples: Float32Array, sr: number): ArrayBuffer {
  const buf  = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buf)
  const ws   = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)) }
  ws(0, 'RIFF'); view.setUint32(4, 36 + samples.length * 2, true)
  ws(8, 'WAVE'); ws(12, 'fmt '); view.setUint32(16, 16, true)
  view.setUint16(20, 1, true); view.setUint16(22, 1, true)
  view.setUint32(24, sr, true); view.setUint32(28, sr * 2, true)
  view.setUint16(32, 2, true);  view.setUint16(34, 16, true)
  ws(36, 'data'); view.setUint32(40, samples.length * 2, true)
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
  }
  return buf
}

function makeTone(freq: number, dur: number, type: 'sq' | 'sin' | 'saw', gain = 0.3): Howl {
  const sr     = 22050
  const frames = Math.floor(sr * dur)
  const data   = new Float32Array(frames)
  for (let i = 0; i < frames; i++) {
    const t   = i / sr
    const env = Math.exp(-t * (4 / dur))
    const phi = 2 * Math.PI * freq * t
    const raw = type === 'sq'  ? sign(Math.sin(phi))
              : type === 'sin' ? Math.sin(phi)
              : ((freq * t) % 1) * 2 - 1
    data[i] = raw * env * gain
  }
  const url = URL.createObjectURL(new Blob([pcmToWav(data, sr)], { type: 'audio/wav' }))
  return new Howl({ src: [url], format: ['wav'], volume: 0.7 })
}

// ── Lazy init ────────────────────────────────────────────────
let _s: Record<string, Howl> | null = null
function S() {
  if (_s) return _s
  _s = {
    attack:      makeTone(220, 0.08, 'sq',  0.22),
    crit:        makeTone(440, 0.14, 'sq',  0.32),
    hit:         makeTone(110, 0.10, 'saw', 0.20),
    die:         makeTone(80,  0.25, 'saw', 0.28),
    levelup:     makeTone(523, 0.40, 'sin', 0.48),
    itemdrop:    makeTone(659, 0.20, 'sin', 0.32),
    bossSpawn:   makeTone(55,  0.50, 'saw', 0.42),
    skill:       makeTone(330, 0.20, 'sq',  0.38),
    enhance:     makeTone(784, 0.25, 'sin', 0.38),
    enhanceFail: makeTone(100, 0.30, 'saw', 0.28),
  }
  return _s
}

let _muted = getSfxMuted()
Howler.mute(_muted)

export const SFX = {
  attack:      () => { if (!_muted) S().attack.play() },
  crit:        () => { if (!_muted) S().crit.play() },
  hit:         () => { if (!_muted) S().hit.play() },
  die:         () => { if (!_muted) S().die.play() },
  levelup:     () => { if (!_muted) S().levelup.play() },
  itemdrop:    () => { if (!_muted) S().itemdrop.play() },
  bossSpawn:   () => { if (!_muted) S().bossSpawn.play() },
  skill:       () => { if (!_muted) S().skill.play() },
  enhance:     () => { if (!_muted) S().enhance.play() },
  enhanceFail: () => { if (!_muted) S().enhanceFail.play() },
  toggle:      () => {
    _muted = !_muted
    setSfxMuted(_muted)
    Howler.mute(_muted)
    return _muted
  },
  isMuted:     () => _muted,
  warmup:      () => S(),
}
