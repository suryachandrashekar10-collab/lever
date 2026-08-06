import type { EffortScores, Frequency, Function8, ImpactScores, StateEvent, UseCase, UseCaseState, Confidence } from "../types";

export interface Transition {
  state: UseCaseState;
  date: string; // ISO date
  note?: string;
}

export interface UseCaseSpec {
  id: string;
  title: string;
  description: string;
  submitterName: string;
  submitterFunction: Function8;
  problemFrequency: Frequency;
  peopleAffected: number;
  hoursSavedMonthly: number;
  impact: ImpactScores;
  effort: EffortScores;
  systemsTouched: string[];
  transitions: Transition[];
  relatedIds?: string[];
  monthlyCostEur: number;
  evidence: string | null;
  confidence: Confidence;
  owner?: string | null;
}

export function buildUseCase(spec: UseCaseSpec): UseCase {
  const sorted = [...spec.transitions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const stateHistory: StateEvent[] = sorted.map((t, i) => ({
    id: `${spec.id}-EVT${i + 1}`,
    useCaseId: spec.id,
    fromState: i === 0 ? null : sorted[i - 1].state,
    toState: t.state,
    changedAt: t.date,
    note: t.note,
  }));

  const last = sorted[sorted.length - 1];
  const first = sorted[0];

  return {
    id: spec.id,
    title: spec.title,
    description: spec.description,
    submitterName: spec.submitterName,
    submitterFunction: spec.submitterFunction,
    submittedAt: first.date,
    problemFrequency: spec.problemFrequency,
    peopleAffected: spec.peopleAffected,
    hoursSavedMonthly: spec.hoursSavedMonthly,
    impact: spec.impact,
    effort: spec.effort,
    systemsTouched: spec.systemsTouched,
    owner: spec.owner ?? (last.state === "Submitted" ? null : ownerFromFunction(spec.submitterFunction)),
    state: last.state,
    stateChangedAt: last.date,
    stateHistory,
    relatedIds: spec.relatedIds ?? [],
    monthlyCostEur: spec.monthlyCostEur,
    evidence: spec.evidence,
    confidence: spec.confidence,
  };
}

function ownerFromFunction(fn: Function8): string {
  const owners: Record<Function8, string> = {
    "R&D": "R&D Lead",
    Revenue: "Revenue Ops Lead",
    "Customer Success": "Customer Success Lead",
    Finance: "Finance Lead",
    People: "People Lead",
    Marketing: "Marketing Lead",
    "IT & Security": "IT & Security Lead",
    Operations: "Ops Lead",
  };
  return owners[fn];
}
