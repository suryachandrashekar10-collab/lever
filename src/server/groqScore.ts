// Server-only. Never import this from client code: it reads GROQ_API_KEY
// from process.env and calls Groq directly, keeping the key off the client
// bundle. Used by both the Vite dev middleware (vite.config.ts) and the
// api/score.ts Vercel function so local dev and prod hit identical logic.

function resolveModel(): string {
  const configured = process.env.GROQ_MODEL;
  return configured && configured !== "undefined" ? configured : "llama-3.3-70b-versatile";
}

export interface ScoreRequest {
  title: string;
  description: string;
  problemFrequency: string;
  peopleAffected: number;
  hoursSavedMonthly: number;
}

export interface ScoreResponse {
  impact: { reach: number; time: number; strategicPull: number; risk: number };
  effort: { build: number; systems: number; dataAccess: number; change: number };
}

const SYSTEM_PROMPT = `You score internal AI/automation backlog items for NavVis on two 4-dimension rubrics, each dimension 1-5.

Impact (higher = more impact):
- reach: how many people the problem touches
- time: hours returned per month
- strategicPull: proximity to a stated leadership priority (US expansion, INTERGEO product launch, data foundation / AI adoption)
- risk: compliance, security, or single-point-of-failure reduction

Effort (higher = harder):
- build: engineering days required
- systems: number and difficulty of systems touched
- dataAccess: is the data available, clean, and permitted
- change: how much human behaviour has to change for it to stick

Respond with ONLY a JSON object, no prose, no markdown fences, in exactly this shape:
{"impact":{"reach":N,"time":N,"strategicPull":N,"risk":N},"effort":{"build":N,"systems":N,"dataAccess":N,"change":N}}
Every N must be an integer from 1 to 5.`;

function clamp15(n: unknown): number {
  const num = typeof n === "number" && Number.isFinite(n) ? n : 3;
  return Math.min(5, Math.max(1, Math.round(num)));
}

export async function scoreWithGroq(input: ScoreRequest): Promise<ScoreResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set on the server");
  }

  const userPrompt = `Title: ${input.title}
Description: ${input.description}
Frequency: ${input.problemFrequency}
People affected (submitter estimate): ${input.peopleAffected}
Hours saved per month (submitter estimate): ${input.hoursSavedMonthly}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: resolveModel(),
      temperature: 0.2,
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq request failed (${res.status}): ${text.slice(0, 300)}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content: string = data?.choices?.[0]?.message?.content ?? "{}";
  let parsed: { impact?: Record<string, unknown>; effort?: Record<string, unknown> };
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Groq returned non-JSON content");
  }

  return {
    impact: {
      reach: clamp15(parsed.impact?.reach),
      time: clamp15(parsed.impact?.time),
      strategicPull: clamp15(parsed.impact?.strategicPull),
      risk: clamp15(parsed.impact?.risk),
    },
    effort: {
      build: clamp15(parsed.effort?.build),
      systems: clamp15(parsed.effort?.systems),
      dataAccess: clamp15(parsed.effort?.dataAccess),
      change: clamp15(parsed.effort?.change),
    },
  };
}
