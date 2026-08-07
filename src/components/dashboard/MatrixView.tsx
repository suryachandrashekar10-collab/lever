import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeverStore } from "../../store/LeverStore";
import { deriveAll } from "../../lib/derived";
import { IMPACT_THRESHOLD, EFFORT_THRESHOLD } from "../../lib/constants";

const TIER_DOT: Record<string, string> = {
  "Do Now": "bg-emerald-500",
  Schedule: "bg-sky-500",
  Delegate: "bg-amber-500",
  Park: "bg-neutral-400",
};

const MIN = 4;
const MAX = 20;
const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100;

export function MatrixView() {
  const { useCases } = useLeverStore();
  const navigate = useNavigate();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const points = useMemo(
    () =>
      useCases
        .filter((uc) => !["Merged", "Rejected"].includes(uc.state))
        .map((uc) => ({ uc, d: deriveAll(uc) })),
    [useCases]
  );

  const hovered = points.find((p) => p.uc.id === hoverId);
  const thresholdXPct = pct(IMPACT_THRESHOLD);
  const thresholdYPct = 100 - pct(EFFORT_THRESHOLD);

  return (
    <div>
      <p className="mb-1 font-mono text-xs uppercase tracking-wider text-neutral-400">03 / Matrix</p>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Impact vs. effort</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Every active use case, positioned by its scored totals. Quadrant lines mark the tiering thresholds from the
        rubric (impact ≥ {IMPACT_THRESHOLD}, effort ≤ {EFFORT_THRESHOLD}).
      </p>

      <div className="flex gap-6">
        <div className="relative aspect-square w-full max-w-2xl shrink-0 rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          {/* quadrant background labels */}
          <QuadrantLabel style={{ right: 8, top: 8 }} text="Do Now" />
          <QuadrantLabel style={{ left: 8, top: 8 }} text="Schedule" />
          <QuadrantLabel style={{ right: 8, bottom: 8 }} text="Delegate" />
          <QuadrantLabel style={{ left: 8, bottom: 8 }} text="Park" />

          {/* threshold lines */}
          <div className="absolute inset-y-0 border-l border-dashed border-neutral-300 dark:border-neutral-700" style={{ left: `${thresholdXPct}%` }} />
          <div className="absolute inset-x-0 border-t border-dashed border-neutral-300 dark:border-neutral-700" style={{ top: `${thresholdYPct}%` }} />

          {points.map(({ uc, d }) => {
            const x = pct(d.impactTotal);
            const y = 100 - pct(d.effortTotal);
            return (
              <button
                key={uc.id}
                onMouseEnter={() => setHoverId(uc.id)}
                onMouseLeave={() => setHoverId((cur) => (cur === uc.id ? null : cur))}
                onClick={() => navigate(`/use-cases/${uc.id}`)}
                className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white transition-transform hover:scale-150 dark:ring-neutral-900 ${TIER_DOT[d.tier]}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                aria-label={uc.title}
              />
            );
          })}

          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-neutral-400">Impact →</span>
          <span className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-neutral-400">Effort (easy → hard) ↑</span>
        </div>

        <div className="hidden w-64 shrink-0 sm:block">
          {hovered ? (
            <div className="rounded-lg border border-neutral-200 bg-white p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p className="font-mono text-xs text-neutral-400">{hovered.uc.id}</p>
              <p className="font-medium">{hovered.uc.title}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {hovered.uc.submitterFunction} · impact {hovered.d.impactTotal} · effort {hovered.d.effortTotal}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-neutral-200 p-3 text-xs text-neutral-400 dark:border-neutral-800">
              Hover or click a point to see the use case.
            </div>
          )}
          <div className="mt-4 space-y-1.5 text-xs">
            {Object.entries(TIER_DOT).map(([tier, color]) => (
              <div key={tier} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                <span className="text-neutral-600 dark:text-neutral-400">{tier}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuadrantLabel({ style, text }: { style: React.CSSProperties; text: string }) {
  return (
    <span
      className="pointer-events-none absolute text-[10px] font-semibold uppercase tracking-wide text-neutral-300 dark:text-neutral-700"
      style={style}
    >
      {text}
    </span>
  );
}
