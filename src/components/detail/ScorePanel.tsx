import { EFFORT_LABELS, IMPACT_LABELS } from "../../lib/constants";
import { effortTotal, impactTotal } from "../../lib/scoring";
import type { EffortScores, ImpactScores } from "../../types";

interface Props {
  impact: ImpactScores;
  effort: EffortScores;
  onChange: (impact: ImpactScores, effort: EffortScores) => void;
}

export function ScorePanel({ impact, effort, onChange }: Props) {
  const setImpact = (key: keyof ImpactScores, value: number) => onChange({ ...impact, [key]: value }, effort);
  const setEffort = (key: keyof EffortScores, value: number) => onChange(impact, { ...effort, [key]: value });

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Impact</h3>
          <span className="font-mono text-sm">{impactTotal(impact)}/20</span>
        </div>
        <div className="space-y-3">
          {(Object.keys(impact) as (keyof ImpactScores)[]).map((key) => (
            <ScoreRow key={key} label={IMPACT_LABELS[key]} value={impact[key]} onChange={(v) => setImpact(key, v)} />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Effort (5 = hardest)</h3>
          <span className="font-mono text-sm">{effortTotal(effort)}/20</span>
        </div>
        <div className="space-y-3">
          {(Object.keys(effort) as (keyof EffortScores)[]).map((key) => (
            <ScoreRow key={key} label={EFFORT_LABELS[key]} value={effort[key]} onChange={(v) => setEffort(key, v)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [name] = label.split(": ");
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-neutral-600 dark:text-neutral-400" title={label}>
          {name}
        </span>
        <span className="font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-neutral-900 dark:accent-white"
      />
    </div>
  );
}
