import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeverStore } from "../../store/LeverStore";
import { deriveAll } from "../../lib/derived";
import { daysSince } from "../../lib/stall";
import { IMPACT_THRESHOLD, EFFORT_THRESHOLD } from "../../lib/constants";
import { ALL_FUNCTIONS, type Confidence, type Function8, type UseCaseState } from "../../types";
import { SYSTEMS } from "../../data/systems";
import { TierBadge, StateBadge, StalledBadge, ConfidenceBadge } from "../ui/Badges";
import { MiniBar } from "../ui/MiniBar";

type SortKey = "leverage" | "value" | "age" | "state";

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

export function BacklogView() {
  const { useCases } = useLeverStore();
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>("leverage");
  const [functionFilter, setFunctionFilter] = useState<Function8 | "all">("all");
  const [systemFilter, setSystemFilter] = useState<string>("all");
  const [confidenceFilter, setConfidenceFilter] = useState<Confidence | "all">("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    let filtered = useCases;
    if (functionFilter !== "all") filtered = filtered.filter((uc) => uc.submitterFunction === functionFilter);
    if (systemFilter !== "all") filtered = filtered.filter((uc) => uc.systemsTouched.includes(systemFilter));
    if (confidenceFilter === "Confirmed") filtered = filtered.filter((uc) => uc.confidence === "Confirmed");
    else if (confidenceFilter === "Inferred") filtered = filtered.filter((uc) => uc.confidence !== "Speculative");
    else if (confidenceFilter === "Speculative") filtered = filtered.filter((uc) => uc.confidence === "Speculative");
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (uc) => uc.title.toLowerCase().includes(q) || uc.description.toLowerCase().includes(q) || uc.id.toLowerCase().includes(q)
      );
    }

    const withDerived = filtered.map((uc) => ({ uc, d: deriveAll(uc) }));

    withDerived.sort((a, b) => {
      switch (sortKey) {
        case "leverage":
          return b.d.leverageScore - a.d.leverageScore;
        case "value":
          return b.d.netMonthlyEur - a.d.netMonthlyEur;
        case "age":
          return daysSince(b.uc.submittedAt) - daysSince(a.uc.submittedAt);
        case "state":
          return STATE_ORDER.indexOf(a.uc.state) - STATE_ORDER.indexOf(b.uc.state);
        default:
          return 0;
      }
    });

    return withDerived;
  }, [useCases, sortKey, functionFilter, systemFilter, confidenceFilter, query]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-wider text-neutral-400">01 / Backlog</p>
          <h1 className="text-2xl font-semibold tracking-tight">Ranked intake</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Leverage = (impact total ÷ effort total) × 10. Tier is derived live from impact ≥ {IMPACT_THRESHOLD}{" "}
            and effort ≤ {EFFORT_THRESHOLD}, never hand-set. {rows.length} of {useCases.length} use cases shown.
          </p>
        </div>
        <button
          onClick={() => navigate("/submit")}
          className="shrink-0 rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          + Submit use case
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, description, ID…"
            className="w-56 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          <select
            value={functionFilter}
            onChange={(e) => setFunctionFilter(e.target.value as Function8 | "all")}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="all">All functions</option>
            {ALL_FUNCTIONS.map((fn) => (
              <option key={fn} value={fn}>
                {fn}
              </option>
            ))}
          </select>
          <select
            value={systemFilter}
            onChange={(e) => setSystemFilter(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="all">All systems</option>
            {SYSTEMS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value as Confidence | "all")}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            title="Filter to items backed by real NavVis research"
          >
            <option value="all">All evidence</option>
            <option value="Confirmed">Confirmed only</option>
            <option value="Inferred">Confirmed + Inferred</option>
            <option value="Speculative">Speculative only</option>
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            <option value="leverage">Sort: Leverage</option>
            <option value="value">Sort: Net value</option>
            <option value="age">Sort: Age</option>
            <option value="state">Sort: State</option>
          </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-neutral-100 text-left text-xs uppercase tracking-wide text-neutral-500 dark:bg-neutral-900">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Function</th>
              <th className="px-3 py-2">Tier</th>
              <th className="px-3 py-2 text-right">Leverage</th>
              <th className="px-3 py-2">Impact</th>
              <th className="px-3 py-2">Effort</th>
              <th className="px-3 py-2 text-right">Net €/mo</th>
              <th className="px-3 py-2 text-right">Age</th>
              <th className="px-3 py-2">State</th>
              <th className="px-3 py-2">Evidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {rows.map(({ uc, d }) => (
              <tr
                key={uc.id}
                onClick={() => navigate(`/use-cases/${uc.id}`)}
                className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/60"
              >
                <td className="px-3 py-2 font-mono text-xs text-neutral-500">{uc.id}</td>
                <td className="max-w-xs px-3 py-2 font-medium">{uc.title}</td>
                <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">{uc.submitterFunction}</td>
                <td className="px-3 py-2">
                  <TierBadge tier={d.tier} />
                </td>
                <td className="px-3 py-2 text-right font-mono">{d.leverageScore.toFixed(1)}</td>
                <td className="px-3 py-2">
                  <MiniBar value={d.impactTotal} color="#3b82f6" />
                </td>
                <td className="px-3 py-2">
                  <MiniBar value={d.effortTotal} color="#f59e0b" />
                </td>
                <td className="px-3 py-2 text-right font-mono">
                  {d.netMonthlyEur >= 0 ? "+" : ""}
                  {Math.round(d.netMonthlyEur).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right text-neutral-500">{daysSince(uc.submittedAt)}d</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <StateBadge state={uc.state} />
                    {d.isStalled && <StalledBadge days={d.daysStalled} />}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <ConfidenceBadge confidence={uc.confidence} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-8 text-center text-neutral-400">
                  No use cases match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
