export type Function8 =
  | "R&D"
  | "Revenue"
  | "Customer Success"
  | "Finance"
  | "People"
  | "Marketing"
  | "IT & Security"
  | "Operations";

export const ALL_FUNCTIONS: Function8[] = [
  "R&D",
  "Revenue",
  "Customer Success",
  "Finance",
  "People",
  "Marketing",
  "IT & Security",
  "Operations",
];

export type Frequency = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Ad hoc";

export const ALL_FREQUENCIES: Frequency[] = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Ad hoc",
];

export type Tier = "Do Now" | "Schedule" | "Delegate" | "Park";

export type UseCaseState =
  | "Submitted"
  | "Triaged"
  | "Scoped"
  | "In Build"
  | "Shipped"
  | "Measured"
  | "Parked"
  | "Rejected"
  | "Merged";

export const ACTIVE_STATES: UseCaseState[] = [
  "Submitted",
  "Triaged",
  "Scoped",
  "In Build",
  "Shipped",
  "Measured",
];

export const STALL_ELIGIBLE_STATES: UseCaseState[] = ["Triaged", "Scoped", "In Build"];

export const TERMINAL_STATES: UseCaseState[] = ["Parked", "Rejected", "Merged"];

export type Confidence = "Confirmed" | "Inferred" | "Speculative";

export interface ImpactScores {
  reach: number; // 1-5: how many people the problem touches
  time: number; // 1-5: hours returned per month
  strategicPull: number; // 1-5: proximity to a stated leadership priority
  risk: number; // 1-5: compliance / security / single-point-of-failure reduction
}

export interface EffortScores {
  build: number; // 1-5: engineering days required (5 = hardest)
  systems: number; // 1-5: number and difficulty of systems touched
  dataAccess: number; // 1-5: is the data available, clean, permitted
  change: number; // 1-5: how much human behaviour has to change to stick
}

export interface SystemRef {
  id: string;
  name: string;
  category: string;
  owningFunction: Function8 | "Platform";
  confidence: Confidence;
  evidence?: string;
}

export interface StateEvent {
  id: string;
  useCaseId: string;
  fromState: UseCaseState | null;
  toState: UseCaseState;
  changedAt: string; // ISO date
  note?: string;
}

export interface UseCase {
  id: string; // LEV-001
  title: string; // <= 80 chars
  description: string; // submitter's own words, verbatim
  submitterName: string;
  submitterFunction: Function8;
  submittedAt: string; // ISO date

  problemFrequency: Frequency;
  peopleAffected: number;
  hoursSavedMonthly: number;

  impact: ImpactScores;
  effort: EffortScores;

  systemsTouched: string[]; // SystemRef ids

  owner: string | null;
  state: UseCaseState;
  stateChangedAt: string; // ISO date
  stateHistory: StateEvent[];

  relatedIds: string[];

  monthlyCostEur: number; // estimated tool + token cost, entered/estimated

  evidence: string | null;
  confidence: Confidence;
}
