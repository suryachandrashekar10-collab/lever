import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLeverStore } from "../../store/LeverStore";
import { deriveAll } from "../../lib/derived";
import { TierBadge, StateBadge, StalledBadge } from "../ui/Badges";
import { PageHeader, HeaderBadge } from "../ui/PageHeader";

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
      <PageHeader
        eyebrow="Stalled"
        icon={<AlertTriangle className="h-5 w-5" strokeWidth={2} />}
        iconColor="bg-red-500"
        title="Nothing goes quiet"
        description="Items sitting in Triaged, Scoped, or In Build with no state change in 14+ days. No notification service in v0: visibility is the mechanism."
        badge={<HeaderBadge>{stalled.length} stalled</HeaderBadge>}
      />

      {stalled.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-300 p-10 text-center text-neutral-400 dark:border-neutral-700">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" strokeWidth={1.75} />
          Nothing stalled right now.
        </div>
      ) : (
        <div className="space-y-2">
          {stalled.map(({ uc, d }) => (
            <button
              key={uc.id}
              onClick={() => navigate(`/use-cases/${uc.id}`)}
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-left shadow-sm hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:hover:bg-red-950/40"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-mono">{uc.id}</span>
                  <span>{uc.submitterFunction}</span>
                  <span>&middot; owner: {uc.owner ?? "unassigned"}</span>
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
