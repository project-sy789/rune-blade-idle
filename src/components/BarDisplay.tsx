// ============================================================
// BarDisplay.tsx — HP / EXP bar reusable
// ============================================================
interface BarProps {
  label:    string
  current:  number
  max:      number
  colorBar: string
  colorBg:  string
  showNumbers?: boolean
}

export function BarDisplay({ label, current, max, colorBar, colorBg, showNumbers = true }: BarProps) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-semibold mb-0.5 px-0.5">
        <span className="text-gray-300">{label}</span>
        {showNumbers && (
          <span className="text-gray-400">
            {current.toLocaleString()} / {max.toLocaleString()}
          </span>
        )}
      </div>
      <div className={`w-full h-3 rounded-full ${colorBg} overflow-hidden`}>
        <div
          className={`h-full rounded-full bar-fill ${colorBar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
