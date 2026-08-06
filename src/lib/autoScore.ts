import type { EffortScores, Frequency, ImpactScores } from "../types";

const clamp15 = (n: number) => Math.min(5, Math.max(1, Math.round(n)));

// Non-LLM default scoring applied the moment a use case is submitted (F2).
// Deliberately simple and legible: reach/time are read off numbers the
// submitter already typed in, strategicPull/risk default to the middle since
// nobody's judged those yet, and effort defaults to "unknown, assume medium"
// across the board until someone at triage actually looks at it. This is what
// F13's Groq-assisted pass replaces or refines, not what it depends on.
export function autoImpact(peopleAffected: number, hoursSavedMonthly: number, frequency: Frequency): ImpactScores {
  const reach = peopleAffected >= 40 ? 5 : peopleAffected >= 20 ? 4 : peopleAffected >= 10 ? 3 : peopleAffected >= 4 ? 2 : 1;
  const time = hoursSavedMonthly >= 30 ? 5 : hoursSavedMonthly >= 15 ? 4 : hoursSavedMonthly >= 8 ? 3 : hoursSavedMonthly >= 3 ? 2 : 1;
  const frequencyBoost: Record<Frequency, number> = {
    Daily: 1,
    Weekly: 0.5,
    Monthly: 0,
    Quarterly: -0.5,
    "Ad hoc": 0,
  };
  return {
    reach: clamp15(reach),
    time: clamp15(time + frequencyBoost[frequency]),
    strategicPull: 3,
    risk: 2,
  };
}

export function autoEffort(): EffortScores {
  return { build: 3, systems: 3, dataAccess: 3, change: 3 };
}
