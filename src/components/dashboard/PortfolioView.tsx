import { useMemo } from "react";
import { useLeverStore } from "../../store/LeverStore";
import { deriveAll } from "../../lib/derived";
import { medianTimeToTriage, medianTier1CycleTime } from "../../lib/cycleTime";
import { ALL_FUNCTIONS, type UseCaseState } from "../../types";

const STATE_ORDER: UseCaseState[] = [
  "Submitted",
  "Triaged",
  "Scoped",
  "In Build",
  "Shipped",
  "Measured",
  "Parked",
  "Rejected",
  "Merged",
];

export function PortfolioView() {
  const { useCases } = useLeverStore();

  const stats = useMemo(() => {
    const derived = useCases.map((uc) => ({ uc, d: deriveAll(uc) }));

    const realized = derived.filter(({ uc }) => uc.state === "Shipped" || uc.state === "Measured");
    const totalNet = realized.reduce((sum, { d }) => sum + d.netMonthlyEur, 0);
    const totalSpend = realized.reduce((sum, { uc }) => sum + uc.monthlyCostEur, 0);
    const totalValue = realized.reduce((sum, { d }) => sum + d.monthlyValueEur, 0);

    const stateCounts = new Map<UseCaseState, number>();
    for (const { uc } of derived) stateCounts.set(uc.state, (stateCounts.get(uc.state) ?? 0) + 1);

    const stalledCount = derived.filter(({ d }) => d.isStalled).length;
    const activeCount = derived.filter((d) => d.uc.state !== "Merged" && d.uc.state !== "Rejected").length;

    const functionsSubmitting = new Set(useCases.map((uc) => uc.submitterFunction)).size;

    const duplicateFlagged = useCases.filter((uc) => uc.relatedIds.length > 0).length;

    const measuredHours = useCases
      .filter((uc) => uc.state === "Measured")
      .reduce((sum, uc) => sum + uc.hoursSavedMonthly, 0);

    return {
      totalNet,
      totalSpend,
      totalValue,
      stateCounts,
      stalledCount,
      activeCount,
      functionsSubmitting,
      duplicateFlagged,
      duplicateRate: useCases.length ? Math.round((duplicateFlagged / useCases.length) * 100) : 0,
      medianTriage: medianTimeToTriage(useCases),
      medianTier1: medianTier1CycleTime(useCases),
      measuredHours,
    };
  }, [useCases]);

  return (
    <div>
      <p className="mb-1 font-mono text-xs uppercase tracking-wider text-neutral-400">05 / Portfolio</p>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Portfolio</h1>
      <p className="mb-6 text-sm text-neutral-500">One number for the CEO, and the metrics behind it.</p>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <BigStat label="Net value / month" value={`€${Math.round(stats.totalNet).toLocaleString()}`} accent />
        <BigStat label="Gross value / month" value={`€${Math.round(stats.totalValue).toLocaleString()}`} />
        <BigStat label="AI tool + token spend" value={`€${Math.round(stats.totalSpend).toLocaleString()}`} />
        <BigStat label="Stalled" value={String(stats.stalledCount)} warn={stats.stalledCount > 0} />
      </div>

      <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 text-sm font-semibold text-neutral-500">By state</h2>
        <div className="flex flex-wrap gap-4">
          {STATE_ORDER.map((s) => (
            <div key={s} className="text-center">
              <p className="text-2xl font-semibold tabular-nums">{stats.stateCounts.get(s) ?? 0}</p>
              <p className="text-xs text-neutral-500">{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 text-sm font-semibold text-neutral-500">Product metrics (PRD §5A, live)</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-neutral-400">
            <tr>
              <th className="py-1">Metric</th>
              <th className="py-1">Target</th>
              <th className="py-1 text-right">Actual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            <MetricRow label="Intake volume" target="≥ 15" actual={String(useCases.length)} pass={useCases.length >= 15} />
            <MetricRow
              label="Functional coverage"
              target="≥ 6 of 8"
              actual={`${stats.functionsSubmitting} of ${ALL_FUNCTIONS.length}`}
              pass={stats.functionsSubmitting >= 6}
            />
            <MetricRow
              label="Median time to triage"
              target="< 3 working days"
              actual={stats.medianTriage !== null ? `${stats.medianTriage}d` : "n/a"}
              pass={stats.medianTriage !== null && stats.medianTriage < 3}
            />
            <MetricRow
              label="Duplicate catch rate"
              target="≥ 20%"
              actual={`${stats.duplicateRate}%`}
              pass={stats.duplicateRate >= 20}
            />
            <MetricRow
              label="Active stall rate"
              target="< 20%"
              actual={`${Math.round((stats.stalledCount / Math.max(stats.activeCount, 1)) * 100)}%`}
              pass={stats.stalledCount / Math.max(stats.activeCount, 1) < 0.2}
            />
            <MetricRow
              label="Tier 1 cycle time"
              target="< 21 days"
              actual={stats.medianTier1 !== null ? `${stats.medianTier1}d` : "n/a"}
              pass={stats.medianTier1 !== null && stats.medianTier1 < 21}
            />
            <MetricRow
              label="Verified value (Measured)"
              target="≥ 120 h/month by day 90"
              actual={`${stats.measuredHours}h/month`}
              pass={stats.measuredHours >= 120}
            />
            <MetricRow
              label="Net position"
              target="Positive by day 90"
              actual={`€${Math.round(stats.totalNet).toLocaleString()}`}
              pass={stats.totalNet > 0}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BigStat({ label, value, accent, warn }: { label: string; value: string; accent?: boolean; warn?: boolean }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs text-neutral-500">{label}</p>
      <p
        className={`text-2xl font-semibold tabular-nums ${
          warn ? "text-red-600 dark:text-red-400" : accent ? "text-emerald-600 dark:text-emerald-400" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function MetricRow({ label, target, actual, pass }: { label: string; target: string; actual: string; pass: boolean }) {
  return (
    <tr>
      <td className="py-1.5">{label}</td>
      <td className="py-1.5 text-neutral-500">{target}</td>
      <td className={`py-1.5 text-right font-medium ${pass ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
        {actual}
      </td>
    </tr>
  );
}
