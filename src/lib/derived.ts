import type { UseCase } from "../types";
import { deriveFunctionsRequired, deriveTier, effortTotal, impactTotal, leverageScore } from "./scoring";
import { daysStalled, isStalled } from "./stall";
import { estimatedBuildDays, monthlyValueEur, netMonthlyEur, paybackMonths } from "./value";

export interface DerivedFields {
  impactTotal: number;
  effortTotal: number;
  leverageScore: number;
  tier: ReturnType<typeof deriveTier>;
  functionsRequired: ReturnType<typeof deriveFunctionsRequired>;
  isStalled: boolean;
  daysStalled: number;
  monthlyValueEur: number;
  netMonthlyEur: number;
  paybackMonths: number | null;
  estimatedBuildDays: number;
}

export function deriveAll(useCase: UseCase, now: Date = new Date()): DerivedFields {
  return {
    impactTotal: impactTotal(useCase.impact),
    effortTotal: effortTotal(useCase.effort),
    leverageScore: leverageScore(useCase.impact, useCase.effort),
    tier: deriveTier(useCase.impact, useCase.effort),
    functionsRequired: deriveFunctionsRequired(useCase.systemsTouched),
    isStalled: isStalled(useCase, now),
    daysStalled: daysStalled(useCase, now),
    monthlyValueEur: monthlyValueEur(useCase),
    netMonthlyEur: netMonthlyEur(useCase),
    paybackMonths: paybackMonths(useCase),
    estimatedBuildDays: estimatedBuildDays(useCase),
  };
}
