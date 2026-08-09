import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid3x3 } from "lucide-react";
import { useLeverStore } from "../../store/LeverStore";
import { deriveAll } from "../../lib/derived";
import { IMPACT_THRESHOLD, EFFORT_THRESHOLD } from "../../lib/constants";
import { PageHeader, HeaderBadge } from "../ui/PageHeader";

const TIER_COLOR: Record<string, string> = {
  "Do Now": "#10b981",
  Schedule: "#0ea5e9",
  Delegate: "#f59e0b",
  Park: "#a3a3a3",
};

const MIN = 4;
const MAX = 20;
const TICKS = [4, 8, 12, 16, 20];

// Plot area in SVG user units, leaving margin for axis labels
const PAD_LEFT = 34;
const PAD_BOTTOM = 26;
const PAD_TOP = 10;
const PAD_RIGHT = 10;
const W = 420;
const H = 360;
const plotW = W - PAD_LEFT - PAD_RIGHT;
const plotH = H - PAD_TOP - PAD_BOTTOM;

const xPix = (impact: number) => PAD_LEFT + ((impact - MIN) / (MAX - MIN)) * plotW;
const yPix = (effort: number) => PAD_TOP + plotH - ((effort - MIN) / (MAX - MIN)) * plotH;

export function MatrixView() {
  const { useCases } = useLeverStore();
  const navigate = useNavigate();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const points = useMemo(
    () => useCases.filter((uc) => !["Merged", "Rejected"].includes(uc.state)).map((uc) => ({ uc, d: deriveAll(uc) })),
    [useCases]
  );

  const tierCounts = useMemo(() => {
    const counts: Record<string, number> = { "Do Now": 0, Schedule: 0, Delegate: 0, Park: 0 };
    for (const { d } of points) counts[d.tier] = (counts[d.tier] ?? 0) + 1;
    return counts;
  }, [points]);

  const hovered = points.find((p) => p.uc.id === hoverId);
  const thresholdX = xPix(IMPACT_THRESHOLD);
  const thresholdY = yPix(EFFORT_THRESHOLD);

  return (
    <div>
      <PageHeader
        eyebrow="Priority Matrix"
        icon={<Grid3x3 className="h-5 w-5" strokeWidth={2} />}
        title="Impact vs. effort"
        description={
          <>
            Every active use case, positioned by its scored totals. Dashed lines mark the tiering thresholds
            (impact ≥ {IMPACT_THRESHOLD}, effort ≤ {EFFORT_THRESHOLD}).
          </>
        }
        badge={<HeaderBadge>{points.length} plotted</HeaderBadge>}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full max-w-xl rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Impact versus effort scatter plot">
            {/* quadrant tints */}
            <rect x={thresholdX} y={PAD_TOP} width={PAD_LEFT + plotW - thresholdX} height={thresholdY - PAD_TOP} fill="#10b981" opacity={0.06} />
            <rect x={PAD_LEFT} y={PAD_TOP} width={thresholdX - PAD_LEFT} height={thresholdY - PAD_TOP} fill="#0ea5e9" opacity={0.05} />
            <rect x={thresholdX} y={thresholdY} width={PAD_LEFT + plotW - thresholdX} height={PAD_TOP + plotH - thresholdY} fill="#f59e0b" opacity={0.05} />
            <rect x={PAD_LEFT} y={thresholdY} width={thresholdX - PAD_LEFT} height={PAD_TOP + plotH - thresholdY} fill="#a3a3a3" opacity={0.05} />

            {/* gridlines + ticks */}
            {TICKS.map((t) => (
              <g key={`x${t}`}>
                <line x1={xPix(t)} y1={PAD_TOP} x2={xPix(t)} y2={PAD_TOP + plotH} stroke="currentColor" strokeOpacity={0.08} />
                <text x={xPix(t)} y={PAD_TOP + plotH + 15} fontSize="9" textAnchor="middle" fill="currentColor" opacity={0.45}>
                  {t}
                </text>
              </g>
            ))}
            {TICKS.map((t) => (
              <g key={`y${t}`}>
                <line x1={PAD_LEFT} y1={yPix(t)} x2={PAD_LEFT + plotW} y2={yPix(t)} stroke="currentColor" strokeOpacity={0.08} />
                <text x={PAD_LEFT - 7} y={yPix(t) + 3} fontSize="9" textAnchor="end" fill="currentColor" opacity={0.45}>
                  {t}
                </text>
              </g>
            ))}

            {/* axis lines */}
            <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={PAD_TOP + plotH} stroke="currentColor" strokeOpacity={0.2} />
            <line x1={PAD_LEFT} y1={PAD_TOP + plotH} x2={PAD_LEFT + plotW} y2={PAD_TOP + plotH} stroke="currentColor" strokeOpacity={0.2} />

            {/* threshold lines */}
            <line x1={thresholdX} y1={PAD_TOP} x2={thresholdX} y2={PAD_TOP + plotH} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3,3" />
            <line x1={PAD_LEFT} y1={thresholdY} x2={PAD_LEFT + plotW} y2={thresholdY} stroke="currentColor" strokeOpacity={0.35} strokeDasharray="3,3" />

            {/* quadrant labels */}
            <text x={PAD_LEFT + plotW - 4} y={PAD_TOP + 12} fontSize="9" fontWeight={700} textAnchor="end" fill="#10b981">DO NOW</text>
            <text x={PAD_LEFT + 4} y={PAD_TOP + 12} fontSize="9" fontWeight={700} textAnchor="start" fill="#0ea5e9">SCHEDULE</text>
            <text x={PAD_LEFT + plotW - 4} y={PAD_TOP + plotH - 6} fontSize="9" fontWeight={700} textAnchor="end" fill="#d97706">DELEGATE</text>
            <text x={PAD_LEFT + 4} y={PAD_TOP + plotH - 6} fontSize="9" fontWeight={700} textAnchor="start" fill="#737373">PARK</text>

            {/* axis titles */}
            <text x={PAD_LEFT + plotW / 2} y={H - 2} fontSize="10" textAnchor="middle" fill="currentColor" opacity={0.6}>
              Impact score
            </text>
            <text x={10} y={PAD_TOP + plotH / 2} fontSize="10" textAnchor="middle" fill="currentColor" opacity={0.6} transform={`rotate(-90 10 ${PAD_TOP + plotH / 2})`}>
              Effort score (easier ↑)
            </text>

            {/* data points */}
            {points.map(({ uc, d }) => (
              <circle
                key={uc.id}
                cx={xPix(d.impactTotal)}
                cy={yPix(d.effortTotal)}
                r={hoverId === uc.id ? 7 : 5}
                fill={TIER_COLOR[d.tier]}
                stroke="white"
                strokeWidth={1.5}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoverId(uc.id)}
                onMouseLeave={() => setHoverId((cur) => (cur === uc.id ? null : cur))}
                onClick={() => navigate(`/use-cases/${uc.id}`)}
              >
                <title>{uc.title}</title>
              </circle>
            ))}
          </svg>
        </div>

        <div className="w-full lg:w-64 lg:shrink-0">
          {hovered ? (
            <div className="rounded-xl border border-neutral-200 bg-white p-3 text-sm shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <p className="font-mono text-xs text-neutral-400">{hovered.uc.id}</p>
              <p className="font-medium">{hovered.uc.title}</p>
              <p className="mt-1 text-xs text-neutral-500">
                {hovered.uc.submitterFunction} &middot; impact {hovered.d.impactTotal} &middot; effort {hovered.d.effortTotal}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-200 p-3 text-xs text-neutral-400 dark:border-neutral-800">
              Hover or click a point to see the use case.
            </div>
          )}
          <div className="mt-4 space-y-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            {Object.entries(TIER_COLOR).map(([tier, color]) => (
              <div key={tier} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-neutral-600 dark:text-neutral-400">{tier}</span>
                </span>
                <span className="font-mono text-neutral-400">{tierCounts[tier]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
