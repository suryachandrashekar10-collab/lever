export function MiniBar({ value, max = 20, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-4 text-right font-mono text-xs tabular-nums">{value}</span>
      <div className="h-1.5 w-10 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
