import type { UseCase } from "../types";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "for", "to", "of", "in", "on", "at",
  "is", "are", "we", "our", "it", "this", "that", "with", "by", "from", "as",
  "be", "have", "has", "into", "each", "per", "than", "then", "so", "not",
  "we're", "i", "my", "me", "them", "their", "us", "when", "who", "what",
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const w of a) if (b.has(w)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export interface RelatedMatch {
  useCaseId: string;
  score: number; // 0-1
  reason: string;
}

/**
 * Rule-based candidate detection: keyword overlap in title+description,
 * shared systems, same submitting function. No LLM call: this runs at
 * submission time and must be instant.
 */
export function findRelated(
  candidate: Pick<UseCase, "title" | "description" | "systemsTouched" | "submitterFunction">,
  existing: UseCase[],
  excludeId?: string
): RelatedMatch[] {
  const candidateTokens = tokenize(`${candidate.title} ${candidate.description}`);

  const matches: RelatedMatch[] = [];

  for (const other of existing) {
    if (other.id === excludeId) continue;
    if (["Merged", "Rejected"].includes(other.state)) continue;

    const otherTokens = tokenize(`${other.title} ${other.description}`);
    const textScore = jaccard(candidateTokens, otherTokens);

    const sharedSystems = candidate.systemsTouched.filter((s) =>
      other.systemsTouched.includes(s)
    );
    const systemScore =
      candidate.systemsTouched.length > 0
        ? sharedSystems.length / candidate.systemsTouched.length
        : 0;

    const sameFunction = candidate.submitterFunction === other.submitterFunction ? 0.1 : 0;

    const score = textScore * 0.6 + systemScore * 0.3 + sameFunction;

    if (score >= 0.18) {
      const reasons: string[] = [];
      if (textScore > 0.15) reasons.push("similar description");
      if (sharedSystems.length > 0) reasons.push(`shares ${sharedSystems.length} system(s)`);
      if (sameFunction) reasons.push("same function");
      matches.push({
        useCaseId: other.id,
        score: Math.round(score * 100) / 100,
        reason: reasons.join(", ") || "weak overlap",
      });
    }
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, 5);
}
