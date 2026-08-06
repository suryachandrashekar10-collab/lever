import type { UseCase } from "../types";
import { BLENDED_HOURLY_RATE_EUR, DAILY_BUILD_RATE_EUR } from "./constants";
import { effortTotal } from "./scoring";

export function monthlyValueEur(
  useCase: UseCase,
  hourlyRate: number = BLENDED_HOURLY_RATE_EUR
): number {
  return useCase.hoursSavedMonthly * hourlyRate;
}

export function netMonthlyEur(
  useCase: UseCase,
  hourlyRate: number = BLENDED_HOURLY_RATE_EUR
): number {
  return monthlyValueEur(useCase, hourlyRate) - useCase.monthlyCostEur;
}

// Effort "build" sub-score (1-5) is mapped onto a rough day count so payback can be
// computed without a separate hours-estimate field the submitter would have to fill in.
const BUILD_SCORE_TO_DAYS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 15,
  5: 30,
};

export function estimatedBuildDays(useCase: UseCase): number {
  return BUILD_SCORE_TO_DAYS[useCase.effort.build] ?? 7;
}

export function paybackMonths(
  useCase: UseCase,
  dailyRate: number = DAILY_BUILD_RATE_EUR,
  hourlyRate: number = BLENDED_HOURLY_RATE_EUR
): number | null {
  const net = netMonthlyEur(useCase, hourlyRate);
  if (net <= 0) return null;
  const buildCost = estimatedBuildDays(useCase) * dailyRate;
  return Math.round((buildCost / net) * 10) / 10;
}

export function effortDaysLabel(useCase: UseCase): string {
  return `~${estimatedBuildDays(useCase)}d (effort ${effortTotal(useCase.effort)}/20)`;
}
