import { STALL_ELIGIBLE_STATES, type UseCase } from "../types";
import { STALL_THRESHOLD_DAYS } from "./constants";

export function daysSince(isoDate: string, now: Date = new Date()): number {
  const then = new Date(isoDate).getTime();
  const diffMs = now.getTime() - then;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function isStalled(useCase: UseCase, now: Date = new Date()): boolean {
  if (!STALL_ELIGIBLE_STATES.includes(useCase.state)) return false;
  return daysSince(useCase.stateChangedAt, now) > STALL_THRESHOLD_DAYS;
}

export function daysStalled(useCase: UseCase, now: Date = new Date()): number {
  if (!isStalled(useCase, now)) return 0;
  return daysSince(useCase.stateChangedAt, now);
}
