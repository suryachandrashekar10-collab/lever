import { useState } from "react";
import type { EffortScores, ImpactScores, UseCase } from "../../types";

interface Props {
  useCase: Pick<UseCase, "title" | "description" | "problemFrequency" | "peopleAffected" | "hoursSavedMonthly">;
  onSuggested: (impact: ImpactScores, effort: EffortScores) => void;
}

export function SuggestScoresButton({ useCase, onSuggested }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: useCase.title,
          description: useCase.description,
          problemFrequency: useCase.problemFrequency,
          peopleAffected: useCase.peopleAffected,
          hoursSavedMonthly: useCase.hoursSavedMonthly,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const data = await res.json();
      onSuggested(data.impact, data.effort);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Suggestion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        {loading ? "Asking Groq…" : "Suggest scores with AI"}
      </button>
    </div>
  );
}
