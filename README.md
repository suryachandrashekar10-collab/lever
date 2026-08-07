# Lever

Intake, scoring, and routing for AI and automation use cases at NavVis, so that one person owning three mandates always knows what to do next and why.

Built as a weekend artifact against a fixed PRD for the Associate AI Operations & Technology Specialist role, reporting to the newly created Head of AI, Data & Systems at NavVis.

**Live:** https://lever-fvm0.onrender.com (Render free tier; the first request after idle can take 30-60s to wake the instance)

## Run it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5184` (or whatever port Vite picks). Loads populated: no login, no seed button, no empty states.

To use the "Suggest scores with AI" button (F13), add a Groq API key:

```bash
# .env (gitignored, never committed)
GROQ_API_KEY=gsk_...
```

The key is only ever read server-side (a Vite dev middleware locally, a Vercel Edge Function at `api/score.ts` for deploy). It never reaches the client bundle.

## What this is

A single-page React + TypeScript app, all state in memory, seed data as a static module. No backend, no database, no auth, per the PRD's explicit non-goals. The one exception is a thin serverless proxy for the optional Groq-assisted scoring call, which exists solely to keep the API key off the client.

- **Core loop:** Submit, Score, Map, Route, Track, Escalate
- **Scoring:** `impact/effort` sub-scores (1 to 5, four dimensions each), then `leverage = (impact / effort) * 10`, then tier derived from fixed thresholds (impact at least 13, effort at most 11). Tier is never hand-set: disagreeing means changing a score, which is the point (PRD §8).
- **Duplicate detection:** rule-based (keyword Jaccard similarity plus shared systems plus same function), not an LLM call. Runs instantly at submission time.
- **Stall detection:** any item in Triaged/Scoped/In Build with no state change in 14+ days. No notifications in v0; the stalled view and a red badge in the nav are the entire mechanism.

## Seed data: what's real vs. invented

40 seed records span all 8 NavVis functions, dated April to August 2026, with 8 stalled, 3 duplicate clusters, and a full state distribution (see `src/data/useCases.ts` header comment for the exact spec this satisfies).

13 of the 40 carry `confidence: "Confirmed"`, traceable to a live NavVis Greenhouse job posting, Kununu review, or the Series D press release, each with a citation in its `evidence` field. A few more are `"Inferred"` (a reasonable deduction from confirmed facts). The rest are `"Speculative"`: plausible, typical backlog items for a company at NavVis's stage, invented to populate the tool, not asserted as real submissions. Filter the backlog by "Confirmed only" or "Confirmed + Inferred" to see just the evidenced ones.

**No record uses a real named NavVis employee as a submitter or owner.** Composite names only, consistent with the "Marie" persona in the PRD. Owners default to a role label ("Finance Lead"), not a person.

### Corrections made during research

Two items in the original PRD's system map turned out to be wrong on live verification against NavVis's actual job postings:

| Claimed (PRD draft) | Verified (Aug 2026) |
|---|---|
| DATEV or SAP (finance) | **Microsoft Dynamics** |
| PostgreSQL / PostGIS (data platform) | **Databricks** |

GitHub Actions and ArgoCD (named in the original candidate list) were not found in any live posting; only Terraform, Helm, and generic "GitOps" are confirmed. Prometheus/Grafana/Elastic remain unverified and are labelled `Speculative` in the system map rather than dropped or upgraded. See `src/data/systems.ts` for the full citation trail.

## Architecture

```
src/
  types/         UseCase, SystemRef, StateEvent: the data model (PRD §7)
  lib/            pure functions: scoring, stall detection, value/cost model,
                   related-item detection, cycle-time metrics, all unit-testable,
                   no UI dependency
  data/           systems.ts (system map), useCases.ts (40 seed records)
  store/          LeverStore: in-memory state and mutations (submit, triage, merge)
  components/     backlog, detail, submit, dashboard (stalled/portfolio/matrix), layout
  server/         groqScore.ts, the only code that touches an API key
api/score.ts       Vercel Edge Function for F13 (deploy target, not live yet)
```

Derived fields (tier, leverage score, functions required, stall status, net value) are **never stored**. They're always computed from source fields via `src/lib/derived.ts`. This matches the PRD's "tier is derived, never hand-set" rule and avoids stale-data bugs by construction.

## What's deliberately not built (v0)

Per the PRD's non-goals: no auth/SSO/roles, no live system integrations (the system map is metadata, not API connections), no notification service, no mobile layout, no multi-workspace. Lever tracks that work is moving; it stops where Jira or Linear begins.

## Validating the seed data

```bash
npx tsx scripts/validateSeed.ts
```

Checks state/function distribution against the PRD's §12 spec, relatedIds symmetry, stall count, and the §5A product metrics (intake volume, duplicate catch rate, verified value, net position).
