// ============================================================
// sprites.ts — SVG Pixel-art character sprites
// ============================================================

export const SPRITES: Record<string, string> = {

  // ── นักรบ ──────────────────────────────────────────────────
  warrior: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
    <!-- helmet -->
    <rect x="5" y="1" width="6" height="1" fill="#888"/>
    <rect x="4" y="2" width="8" height="3" fill="#aaa"/>
    <rect x="4" y="2" width="1" height="3" fill="#777"/>
    <rect x="11" y="2" width="1" height="3" fill="#777"/>
    <!-- visor -->
    <rect x="5" y="3" width="2" height="1" fill="#4af"/>
    <rect x="9" y="3" width="2" height="1" fill="#4af"/>
    <!-- body -->
    <rect x="4" y="5" width="8" height="5" fill="#c0392b"/>
    <rect x="4" y="5" width="1" height="5" fill="#922b21"/>
    <rect x="11" y="5" width="1" height="5" fill="#922b21"/>
    <!-- belt -->
    <rect x="4" y="9" width="8" height="1" fill="#7d6608"/>
    <rect x="7" y="9" width="2" height="1" fill="#f1c40f"/>
    <!-- arms -->
    <rect x="2" y="5" width="2" height="4" fill="#c0392b"/>
    <rect x="12" y="5" width="2" height="4" fill="#c0392b"/>
    <!-- sword -->
    <rect x="13" y="2" width="1" height="7" fill="#bdc3c7"/>
    <rect x="13" y="2" width="1" height="1" fill="#f39c12"/>
    <rect x="12" y="5" width="3" height="1" fill="#7f8c8d"/>
    <!-- legs -->
    <rect x="5" y="10" width="3" height="4" fill="#922b21"/>
    <rect x="8" y="10" width="3" height="4" fill="#922b21"/>
    <!-- boots -->
    <rect x="5" y="14" width="3" height="2" fill="#555"/>
    <rect x="8" y="14" width="3" height="2" fill="#555"/>
  </svg>`,

  // ── นักเวทย์ ───────────────────────────────────────────────
  mage: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
    <!-- hat -->
    <rect x="6" y="0" width="4" height="1" fill="#6c3483"/>
    <rect x="5" y="1" width="6" height="1" fill="#7d3c98"/>
    <rect x="4" y="2" width="8" height="2" fill="#9b59b6"/>
    <!-- face -->
    <rect x="5" y="4" width="6" height="3" fill="#f5cba7"/>
    <rect x="6" y="5" width="1" height="1" fill="#2c3e50"/>
    <rect x="9" y="5" width="1" height="1" fill="#2c3e50"/>
    <rect x="7" y="6" width="2" height="1" fill="#c0392b"/>
    <!-- robe -->
    <rect x="3" y="7" width="10" height="5" fill="#7d3c98"/>
    <rect x="3" y="7" width="1" height="5" fill="#6c3483"/>
    <rect x="12" y="7" width="1" height="5" fill="#6c3483"/>
    <!-- rune on robe -->
    <rect x="7" y="8" width="2" height="3" fill="#a569bd"/>
    <rect x="7" y="9" width="2" height="1" fill="#d7bde2"/>
    <!-- staff arm -->
    <rect x="1" y="6" width="2" height="6" fill="#7d3c98"/>
    <!-- staff -->
    <rect x="0" y="1" width="1" height="10" fill="#935116"/>
    <!-- orb -->
    <rect x="0" y="0" width="2" height="2" fill="#3498db"/>
    <rect x="0" y="0" width="1" height="1" fill="#85c1e9"/>
    <!-- legs -->
    <rect x="5" y="12" width="3" height="3" fill="#6c3483"/>
    <rect x="8" y="12" width="3" height="3" fill="#6c3483"/>
    <rect x="4" y="14" width="4" height="2" fill="#4a235a"/>
    <rect x="8" y="14" width="4" height="2" fill="#4a235a"/>
  </svg>`,

  // ── นักธนู ─────────────────────────────────────────────────
  archer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
    <!-- hair/hood -->
    <rect x="5" y="1" width="6" height="2" fill="#27ae60"/>
    <rect x="4" y="2" width="8" height="2" fill="#2ecc71"/>
    <!-- face -->
    <rect x="5" y="4" width="6" height="3" fill="#f5cba7"/>
    <rect x="6" y="5" width="1" height="1" fill="#1a5276"/>
    <rect x="9" y="5" width="1" height="1" fill="#1a5276"/>
    <!-- tunic -->
    <rect x="4" y="7" width="8" height="5" fill="#27ae60"/>
    <rect x="4" y="7" width="1" height="5" fill="#1e8449"/>
    <rect x="11" y="7" width="1" height="5" fill="#1e8449"/>
    <!-- quiver -->
    <rect x="11" y="5" width="2" height="6" fill="#935116"/>
    <rect x="11" y="5" width="1" height="1" fill="#ffd700"/>
    <rect x="12" y="5" width="1" height="1" fill="#ffd700"/>
    <!-- bow arm -->
    <rect x="1" y="5" width="2" height="6" fill="#27ae60"/>
    <!-- bow -->
    <rect x="0" y="3" width="1" height="10" fill="#935116"/>
    <rect x="0" y="3" width="2" height="1" fill="#935116"/>
    <rect x="0" y="12" width="2" height="1" fill="#935116"/>
    <!-- bowstring -->
    <rect x="1" y="4" width="1" height="8" fill="#ecf0f1"/>
    <!-- arrow nocked -->
    <rect x="0" y="7" width="4" height="1" fill="#bdc3c7"/>
    <rect x="3" y="6" width="1" height="3" fill="#e74c3c"/>
    <!-- legs -->
    <rect x="5" y="12" width="3" height="3" fill="#1e8449"/>
    <rect x="8" y="12" width="3" height="3" fill="#1e8449"/>
    <rect x="4" y="14" width="4" height="2" fill="#154360"/>
    <rect x="8" y="14" width="4" height="2" fill="#154360"/>
  </svg>`,

  // ── Poring ─────────────────────────────────────────────────
  poring: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
    <rect x="4" y="4" width="8" height="8" fill="#e74c3c"/>
    <rect x="3" y="5" width="1" height="6" fill="#e74c3c"/>
    <rect x="12" y="5" width="1" height="6" fill="#e74c3c"/>
    <rect x="5" y="3" width="6" height="1" fill="#e74c3c"/>
    <rect x="5" y="12" width="6" height="1" fill="#e74c3c"/>
    <!-- eyes -->
    <rect x="5" y="6" width="2" height="2" fill="#2c3e50"/>
    <rect x="9" y="6" width="2" height="2" fill="#2c3e50"/>
    <rect x="5" y="6" width="1" height="1" fill="#fff"/>
    <rect x="9" y="6" width="1" height="1" fill="#fff"/>
    <!-- smile -->
    <rect x="6" y="9" width="4" height="1" fill="#2c3e50"/>
    <rect x="5" y="8" width="1" height="1" fill="#2c3e50"/>
    <rect x="10" y="8" width="1" height="1" fill="#2c3e50"/>
    <!-- antenna -->
    <rect x="7" y="1" width="1" height="3" fill="#e74c3c"/>
    <rect x="7" y="0" width="2" height="2" fill="#e74c3c"/>
    <!-- feet -->
    <rect x="4" y="13" width="3" height="2" fill="#c0392b"/>
    <rect x="9" y="13" width="3" height="2" fill="#c0392b"/>
    <!-- shine -->
    <rect x="5" y="4" width="2" height="2" fill="rgba(255,255,255,0.3)"/>
  </svg>`,

  // ── Boss skull ─────────────────────────────────────────────
  boss: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
    <!-- skull shape -->
    <rect x="3" y="2" width="10" height="9" fill="#ecf0f1"/>
    <rect x="2" y="4" width="1" height="5" fill="#ecf0f1"/>
    <rect x="13" y="4" width="1" height="5" fill="#ecf0f1"/>
    <rect x="4" y="1" width="8" height="1" fill="#ecf0f1"/>
    <!-- crown -->
    <rect x="3" y="0" width="2" height="2" fill="#f1c40f"/>
    <rect x="7" y="0" width="2" height="3" fill="#f1c40f"/>
    <rect x="11" y="0" width="2" height="2" fill="#f1c40f"/>
    <!-- eyes -->
    <rect x="4" y="4" width="3" height="3" fill="#e74c3c"/>
    <rect x="9" y="4" width="3" height="3" fill="#e74c3c"/>
    <rect x="5" y="4" width="1" height="1" fill="#ff8"/>
    <rect x="10" y="4" width="1" height="1" fill="#ff8"/>
    <!-- nose -->
    <rect x="7" y="7" width="2" height="1" fill="#bdc3c7"/>
    <!-- teeth -->
    <rect x="4" y="10" width="8" height="2" fill="#ecf0f1"/>
    <rect x="5" y="10" width="1" height="3" fill="#ecf0f1"/>
    <rect x="7" y="10" width="1" height="3" fill="#ecf0f1"/>
    <rect x="9" y="10" width="1" height="3" fill="#ecf0f1"/>
    <rect x="11" y="10" width="1" height="3" fill="#ecf0f1"/>
    <rect x="4" y="12" width="8" height="1" fill="#bdc3c7"/>
    <!-- aura -->
    <rect x="1" y="3" width="1" height="1" fill="#8e44ad"/>
    <rect x="14" y="3" width="1" height="1" fill="#8e44ad"/>
    <rect x="2" y="1" width="1" height="1" fill="#8e44ad"/>
    <rect x="13" y="1" width="1" height="1" fill="#8e44ad"/>
  </svg>`,

  // ── Generic monster ────────────────────────────────────────
  slime: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">
    <rect x="4" y="6" width="8" height="7" fill="#2ecc71"/>
    <rect x="3" y="7" width="1" height="5" fill="#2ecc71"/>
    <rect x="12" y="7" width="1" height="5" fill="#2ecc71"/>
    <rect x="5" y="5" width="6" height="1" fill="#2ecc71"/>
    <rect x="5" y="13" width="6" height="1" fill="#27ae60"/>
    <!-- eyes -->
    <rect x="5" y="8" width="2" height="2" fill="#1a5276"/>
    <rect x="9" y="8" width="2" height="2" fill="#1a5276"/>
    <rect x="5" y="8" width="1" height="1" fill="#85c1e9"/>
    <rect x="9" y="8" width="1" height="1" fill="#85c1e9"/>
    <!-- mouth -->
    <rect x="6" y="11" width="4" height="1" fill="#1e8449"/>
    <!-- drip -->
    <rect x="5" y="4" width="1" height="2" fill="#2ecc71"/>
    <rect x="10" y="3" width="1" height="3" fill="#2ecc71"/>
    <rect x="7" y="4" width="1" height="1" fill="#2ecc71"/>
  </svg>`,
}

/** Get sprite SVG string by class or monster id */
export function getSprite(id: string): string {
  return SPRITES[id] ?? SPRITES['slime']
}

/** Convert sprite to data URL for use in img src */
export function spriteToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
