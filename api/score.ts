// Vercel Edge Function: deploy target for F13 (not wired to a live deploy
// yet). Local dev instead hits the equivalent middleware in vite.config.ts;
// both call the same scoreWithGroq() so behavior matches once this ships.
import { scoreWithGroq, type ScoreRequest } from "../src/server/groqScore";

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }
  try {
    const body = (await req.json()) as ScoreRequest;
    const result = await scoreWithGroq(body);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
