import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLeverStore } from "../../store/LeverStore";
import { deriveAll } from "../../lib/derived";
import { TierBadge, StateBadge, StalledBadge } from "../ui/Badges";

export function StalledView() {
  const { useCases } = useLeverStore();
  const navigate = useNavigate();

  const stalled = useMemo(() => {
    return useCases
      .map((uc) => ({ uc, d: deriveAll(uc) }))
      .filter(({ d }) => d.isStalled)
      .sort((a, b) => b.d.daysStalled - a.d.daysStalled);
  }, [useCases]);

  return (
    <div>
      <p className="mb-1 font-mono text-xs uppercase tracking-wider text-neutral-400">04 / Stalled</p>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Stalled</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Items sitting in Triaged, Scoped, or In Build with no state change in 14+ days. No notifications in v0:
        visibility is the mechanism.
      </p>

      {stalled.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-400 dark:border-neutral-700">
          Nothing stalled right now.
        </div>
      ) : (
        <div className="space-y-2">
          {stalled.map(({ uc, d }) => (
            <button
              key={uc.id}
              onClick={() => navigate(`/use-cases/${uc.id}`)}
              className="flex w-full items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-3 text-left hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:hover:bg-red-950/40"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-mono">{uc.id}</span>
                  <span>{uc.submitterFunction}</span>
                  <span>· owner: {uc.owner ?? "unassigned"}</span>
                </div>
                <p className="truncate font-medium">{uc.title}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <TierBadge tier={d.tier} />
                <StateBadge state={uc.state} />
                <StalledBadge days={d.daysStalled} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
