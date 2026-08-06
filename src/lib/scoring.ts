import type { EffortScores, Function8, ImpactScores, Tier } from "../types";
import { EFFORT_THRESHOLD, IMPACT_THRESHOLD } from "./constants";
import { getSystem } from "../data/systems";

export function impactTotal(impact: ImpactScores): number {
  return impact.reach + impact.time + impact.strategicPull + impact.risk;
}

export function effortTotal(effort: EffortScores): number {
  return effort.build + effort.systems + effort.dataAccess + effort.change;
}

export function leverageScore(impact: ImpactScores, effort: EffortScores): number {
  const eff = effortTotal(effort);
  if (eff === 0) return 0;
  return Math.round(((impactTotal(impact) / eff) * 10 + Number.EPSILON) * 10) / 10;
}

export function deriveTier(impact: ImpactScores, effort: EffortScores): Tier {
  const highImpact = impactTotal(impact) >= IMPACT_THRESHOLD;
  const lowEffort = effortTotal(effort) <= EFFORT_THRESHOLD;
  if (highImpact && lowEffort) return "Do Now";
  if (highImpact && !lowEffort) return "Schedule";
  if (!highImpact && lowEffort) return "Delegate";
  return "Park";
}

// Platform-owned systems (cloud infra, CI/CD, observability, internal docs) have
// no owning business function in NavVis's 8-function list; at ~350 headcount that
// work sits inside R&D, so Platform folds into R&D for room-required derivation.
export function deriveFunctionsRequired(systemsTouched: string[]): Function8[] {
  const set = new Set<Function8>();
  for (const id of systemsTouched) {
    const system = getSystem(id);
    if (!system) continue;
    set.add(system.owningFunction === "Platform" ? "R&D" : system.owningFunction);
  }
  return Array.from(set);
}
