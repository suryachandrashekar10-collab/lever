import type { Confidence, Tier, UseCaseState } from "../../types";

const TIER_STYLES: Record<Tier, string> = {
  "Do Now": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  Schedule: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  Delegate: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Park: "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_STYLES[tier]}`}>
      {tier}
    </span>
  );
}

const CONFIDENCE_STYLES: Record<Confidence, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-400",
  Inferred: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950/40 dark:text-blue-400",
  Speculative: "bg-neutral-100 text-neutral-500 ring-1 ring-neutral-400/20 dark:bg-neutral-900 dark:text-neutral-400",
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium ${CONFIDENCE_STYLES[confidence]}`}>
      {confidence}
    </span>
  );
}

const STATE_STYLES: Record<UseCaseState, string> = {
  Submitted: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  Triaged: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Scoped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "In Build": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Shipped: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Measured: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  Parked: "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  Merged: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

export function StateBadge({ state }: { state: UseCaseState }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATE_STYLES[state]}`}>
      {state}
    </span>
  );
}

export function StalledBadge({ days }: { days: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
      Stalled {days}d
    </span>
  );
}
