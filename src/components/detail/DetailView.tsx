import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLeverStore } from "../../store/LeverStore";
import { deriveAll } from "../../lib/derived";
import { getSystem } from "../../data/systems";
import { EFFORT_LABELS, IMPACT_LABELS } from "../../lib/constants";
import { findRelated } from "../../lib/related";
import { ACTIVE_STATES, TERMINAL_STATES, type EffortScores, type ImpactScores, type UseCaseState } from "../../types";
import { TierBadge, StateBadge, StalledBadge, ConfidenceBadge } from "../ui/Badges";
import { ScorePanel } from "./ScorePanel";
import { SuggestScoresButton } from "./SuggestScoresButton";

export function DetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useCases, updateScores, changeState, setOwner, mergeInto, linkRelated } = useLeverStore();
  const uc = useCases.find((u) => u.id === id);
  const [ownerDraft, setOwnerDraft] = useState(uc?.owner ?? "");
  const [note, setNote] = useState("");

  const related = useMemo(() => {
    if (!uc) return { direct: [], suggested: [] };
    const direct = uc.relatedIds
      .map((rid) => useCases.find((u) => u.id === rid))
      .filter((u): u is NonNullable<typeof u> => !!u);
    const suggested =
      uc.state === "Merged" ? [] : findRelated(uc, useCases, uc.id).filter((m) => !uc.relatedIds.includes(m.useCaseId));
    return { direct, suggested };
  }, [uc, useCases]);

  if (!uc) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500 dark:border-neutral-700">
        Use case {id} not found. <Link to="/backlog" className="underline">Back to backlog</Link>
      </div>
    );
  }

  const d = deriveAll(uc);
  const nextStates = ACTIVE_STATES.slice(ACTIVE_STATES.indexOf(uc.state) + 1, ACTIVE_STATES.indexOf(uc.state) + 2);

  const handleScoreChange = (impact: ImpactScores, effort: EffortScores) => {
    updateScores(uc.id, impact, effort);
  };

  const advance = (toState: UseCaseState) => {
    changeState(uc.id, toState, note || undefined);
    setNote("");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-neutral-500 hover:underline">
        ← Back
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs text-neutral-400">
            <span className="font-mono">{uc.id}</span>
            <span>·</span>
            <span>{uc.submitterFunction}</span>
          </div>
          <h1 className="text-2xl font-semibold">{uc.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <TierBadge tier={d.tier} />
          <StateBadge state={uc.state} />
          {d.isStalled && <StalledBadge days={d.daysStalled} />}
        </div>
      </div>

      <section className="mb-6 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-2 text-sm font-semibold text-neutral-500">Description</h2>
        <p className="whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">{uc.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-neutral-500">
          <span>Submitted by {uc.submitterName}</span>
          <span>{uc.problemFrequency}</span>
          <span>{uc.peopleAffected} people affected</span>
          <span>{uc.hoursSavedMonthly}h/month claimed</span>
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Leverage" value={d.leverageScore.toFixed(1)} />
        <Stat label="Net €/mo" value={`${d.netMonthlyEur >= 0 ? "+" : ""}${Math.round(d.netMonthlyEur).toLocaleString()}`} />
        <Stat label="Payback" value={d.paybackMonths !== null ? `${d.paybackMonths}mo` : "n/a"} />
        <Stat label="Est. build" value={`${d.estimatedBuildDays}d`} />
      </section>

      <section className="mb-6 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-500">Scoring rubric (editable)</h2>
          <SuggestScoresButton useCase={uc} onSuggested={handleScoreChange} />
        </div>
        <ScorePanel impact={uc.impact} effort={uc.effort} onChange={handleScoreChange} />
        <p className="mt-3 text-xs text-neutral-400">
          Tier is derived, never hand-set. Disagree with it? Change a score above and it recalculates immediately.
        </p>
      </section>

      <section className="mb-6 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-2 text-sm font-semibold text-neutral-500">Systems &amp; functions required</h2>
        <div className="flex flex-wrap gap-2">
          {uc.systemsTouched.map((sid) => {
            const sys = getSystem(sid);
            return (
              <span key={sid} className="rounded-md bg-neutral-100 px-2 py-1 text-xs dark:bg-neutral-800">
                {sys?.name ?? sid}
              </span>
            );
          })}
          {uc.systemsTouched.length === 0 && <span className="text-xs text-neutral-400">None tagged</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {d.functionsRequired.map((fn) => (
            <span key={fn} className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs text-white dark:bg-white dark:text-neutral-900">
              {fn}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-2 text-sm font-semibold text-neutral-500">Evidence</h2>
        <div className="mb-2">
          <ConfidenceBadge confidence={uc.confidence} />
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">{uc.evidence ?? "No external evidence attached. Plausible but unverified."}</p>
      </section>

      {(related.direct.length > 0 || related.suggested.length > 0) && (
        <section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <h2 className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-400">Related / possible duplicates</h2>
          <ul className="space-y-2">
            {related.direct.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 text-sm">
                <Link to={`/use-cases/${r.id}`} className="hover:underline">
                  <span className="font-mono text-xs text-neutral-500">{r.id}</span> {r.title}{" "}
                  <span className="text-neutral-400">({r.submitterFunction})</span>
                </Link>
                {uc.state !== "Merged" && r.state !== "Merged" && (
                  <button
                    onClick={() => mergeInto(r.id, uc.id)}
                    className="whitespace-nowrap rounded border border-amber-300 px-2 py-0.5 text-xs text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/40"
                  >
                    Merge into this
                  </button>
                )}
              </li>
            ))}
            {related.suggested.map((s) => {
              const other = useCases.find((u) => u.id === s.useCaseId);
              if (!other) return null;
              return (
                <li key={s.useCaseId} className="flex items-center justify-between gap-3 text-sm text-neutral-500">
                  <Link to={`/use-cases/${other.id}`} className="hover:underline">
                    <span className="font-mono text-xs">{other.id}</span> {other.title}{" "}
                    <span className="text-neutral-400">({s.reason})</span>
                  </Link>
                  <button
                    onClick={() => linkRelated(uc.id, other.id)}
                    className="whitespace-nowrap rounded border border-neutral-300 px-2 py-0.5 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    Confirm related
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mb-6 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 text-sm font-semibold text-neutral-500">State history</h2>
        <ol className="space-y-2">
          {uc.stateHistory.map((ev) => (
            <li key={ev.id} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 text-xs text-neutral-400">{ev.changedAt}</span>
              <span className="text-neutral-400">{ev.fromState ?? "New"} →</span>
              <StateBadge state={ev.toState} />
              {ev.note && <span className="text-xs text-neutral-500">{ev.note}</span>}
            </li>
          ))}
        </ol>

        {!TERMINAL_STATES.includes(uc.state) && uc.state !== "Measured" && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note for this transition…"
              className="min-w-[200px] flex-1 rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
            {nextStates.map((s) => (
              <button
                key={s}
                onClick={() => advance(s)}
                className="rounded-full bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
              >
                Advance to {s}
              </button>
            ))}
            <button
              onClick={() => advance("Parked")}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Park
            </button>
            <button
              onClick={() => advance("Rejected")}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-neutral-700 dark:hover:bg-red-950/30"
            >
              Reject
            </button>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-2 text-sm font-semibold text-neutral-500">Owner</h2>
        <div className="flex items-center gap-2">
          <input
            value={ownerDraft}
            onChange={(e) => setOwnerDraft(e.target.value)}
            placeholder="Unassigned"
            className="flex-1 rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            onClick={() => setOwner(uc.id, ownerDraft)}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Save
          </button>
        </div>
      </section>

      <details className="mt-6 text-xs text-neutral-400">
        <summary className="cursor-pointer">Rubric reference</summary>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 font-semibold text-neutral-500">Impact</p>
            <ul className="space-y-0.5">
              {Object.values(IMPACT_LABELS).map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-semibold text-neutral-500">Effort (5 = hardest)</p>
            <ul className="space-y-0.5">
              {Object.values(EFFORT_LABELS).map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
