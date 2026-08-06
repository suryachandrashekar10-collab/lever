import type { UseCase, UseCaseState } from "../types";
import { daysSince } from "./stall";
import { deriveTier } from "./scoring";

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10
    : sorted[mid];
}

function firstEventAt(useCase: UseCase, state: UseCaseState): string | null {
  const event = useCase.stateHistory.find((e) => e.toState === state);
  return event ? event.changedAt : null;
}

export function cycleTimeDays(
  useCase: UseCase,
  fromState: UseCaseState,
  toState: UseCaseState
): number | null {
  const from = fromState === "Submitted" ? useCase.submittedAt : firstEventAt(useCase, fromState);
  const to = firstEventAt(useCase, toState);
  if (!from || !to) return null;
  const diff = daysSince(from, new Date(to));
  return diff >= 0 ? diff : null;
}

export function medianTimeToTriage(useCases: UseCase[]): number | null {
  const values = useCases
    .map((uc) => cycleTimeDays(uc, "Submitted", "Triaged"))
    .filter((v): v is number => v !== null);
  return median(values);
}

export function medianTier1CycleTime(useCases: UseCase[]): number | null {
  const values = useCases
    .filter((uc) => deriveTier(uc.impact, uc.effort) === "Do Now")
    .map((uc) => cycleTimeDays(uc, "Submitted", "Shipped"))
    .filter((v): v is number => v !== null);
  return median(values);
}
