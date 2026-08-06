import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { EffortScores, Function8, Frequency, ImpactScores, UseCase, UseCaseState } from "../types";
import { USE_CASES } from "../data/useCases";
import { autoEffort, autoImpact } from "../lib/autoScore";

export interface NewUseCaseInput {
  title: string;
  description: string;
  submitterName: string;
  submitterFunction: Function8;
  problemFrequency: Frequency;
  peopleAffected: number;
  hoursSavedMonthly: number;
  systemsTouched: string[];
}

interface LeverStoreValue {
  useCases: UseCase[];
  addUseCase: (input: NewUseCaseInput) => UseCase;
  updateScores: (id: string, impact: ImpactScores, effort: EffortScores) => void;
  changeState: (id: string, toState: UseCaseState, note?: string) => void;
  setOwner: (id: string, owner: string) => void;
  mergeInto: (sourceId: string, targetId: string) => void;
  linkRelated: (idA: string, idB: string) => void;
}

const LeverStoreContext = createContext<LeverStoreValue | null>(null);

let nextIdCounter = USE_CASES.length + 1;

function nextId(): string {
  const id = `LEV-${String(nextIdCounter).padStart(3, "0")}`;
  nextIdCounter += 1;
  return id;
}

export function LeverStoreProvider({ children }: { children: ReactNode }) {
  const [useCases, setUseCases] = useState<UseCase[]>(USE_CASES);

  const addUseCase = useCallback((input: NewUseCaseInput): UseCase => {
    const now = new Date().toISOString().slice(0, 10);
    const id = nextId();
    const impact = autoImpact(input.peopleAffected, input.hoursSavedMonthly, input.problemFrequency);
    const effort = autoEffort();
    const created: UseCase = {
      id,
      title: input.title,
      description: input.description,
      submitterName: input.submitterName,
      submitterFunction: input.submitterFunction,
      submittedAt: now,
      problemFrequency: input.problemFrequency,
      peopleAffected: input.peopleAffected,
      hoursSavedMonthly: input.hoursSavedMonthly,
      impact,
      effort,
      systemsTouched: input.systemsTouched,
      owner: null,
      state: "Submitted",
      stateChangedAt: now,
      stateHistory: [
        { id: `${id}-EVT1`, useCaseId: id, fromState: null, toState: "Submitted", changedAt: now },
      ],
      relatedIds: [],
      monthlyCostEur: 0,
      evidence: null,
      confidence: "Speculative",
    };
    setUseCases((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateScores = useCallback((id: string, impact: ImpactScores, effort: EffortScores) => {
    setUseCases((prev) => prev.map((uc) => (uc.id === id ? { ...uc, impact, effort } : uc)));
  }, []);

  const changeState = useCallback((id: string, toState: UseCaseState, note?: string) => {
    const now = new Date().toISOString().slice(0, 10);
    setUseCases((prev) =>
      prev.map((uc) => {
        if (uc.id !== id) return uc;
        return {
          ...uc,
          state: toState,
          stateChangedAt: now,
          stateHistory: [
            ...uc.stateHistory,
            {
              id: `${id}-EVT${uc.stateHistory.length + 1}`,
              useCaseId: id,
              fromState: uc.state,
              toState,
              changedAt: now,
              note,
            },
          ],
        };
      })
    );
  }, []);

  const setOwner = useCallback((id: string, owner: string) => {
    setUseCases((prev) => prev.map((uc) => (uc.id === id ? { ...uc, owner } : uc)));
  }, []);

  const mergeInto = useCallback((sourceId: string, targetId: string) => {
    const now = new Date().toISOString().slice(0, 10);
    setUseCases((prev) => {
      const source = prev.find((uc) => uc.id === sourceId);
      if (!source) return prev;
      return prev.map((uc) => {
        if (uc.id === sourceId) {
          return {
            ...uc,
            state: "Merged",
            stateChangedAt: now,
            relatedIds: uc.relatedIds.includes(targetId) ? uc.relatedIds : [...uc.relatedIds, targetId],
            stateHistory: [
              ...uc.stateHistory,
              {
                id: `${sourceId}-EVT${uc.stateHistory.length + 1}`,
                useCaseId: sourceId,
                fromState: uc.state,
                toState: "Merged",
                changedAt: now,
                note: `Merged into ${targetId}`,
              },
            ],
          };
        }
        if (uc.id === targetId) {
          return {
            ...uc,
            hoursSavedMonthly: uc.hoursSavedMonthly + source.hoursSavedMonthly,
            relatedIds: uc.relatedIds.includes(sourceId) ? uc.relatedIds : [...uc.relatedIds, sourceId],
          };
        }
        return uc;
      });
    });
  }, []);

  const linkRelated = useCallback((idA: string, idB: string) => {
    setUseCases((prev) =>
      prev.map((uc) => {
        if (uc.id === idA && !uc.relatedIds.includes(idB)) return { ...uc, relatedIds: [...uc.relatedIds, idB] };
        if (uc.id === idB && !uc.relatedIds.includes(idA)) return { ...uc, relatedIds: [...uc.relatedIds, idA] };
        return uc;
      })
    );
  }, []);

  const value = useMemo(
    () => ({ useCases, addUseCase, updateScores, changeState, setOwner, mergeInto, linkRelated }),
    [useCases, addUseCase, updateScores, changeState, setOwner, mergeInto, linkRelated]
  );

  return <LeverStoreContext.Provider value={value}>{children}</LeverStoreContext.Provider>;
}

export function useLeverStore(): LeverStoreValue {
  const ctx = useContext(LeverStoreContext);
  if (!ctx) throw new Error("useLeverStore must be used within LeverStoreProvider");
  return ctx;
}
