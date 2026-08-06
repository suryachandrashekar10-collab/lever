import { USE_CASES } from "../src/data/useCases";
import { deriveAll } from "../src/lib/derived";
import { ALL_FUNCTIONS } from "../src/types";
import { getSystem } from "../src/data/systems";

const now = new Date("2026-08-07T12:00:00Z");

console.log("Total records:", USE_CASES.length);

const stateCounts: Record<string, number> = {};
const fnCounts: Record<string, number> = {};
for (const uc of USE_CASES) {
  stateCounts[uc.state] = (stateCounts[uc.state] ?? 0) + 1;
  fnCounts[uc.submitterFunction] = (fnCounts[uc.submitterFunction] ?? 0) + 1;
}
console.log("State distribution:", stateCounts);
console.log("Function distribution:", fnCounts);
for (const fn of ALL_FUNCTIONS) {
  if ((fnCounts[fn] ?? 0) < 3) console.log("WARNING: under 3 for", fn);
}

let stalled = 0;
let netMeasured = 0;
let hoursMeasured = 0;
let totalNet = 0;
let totalSpend = 0;
const relatedPairsOk: string[] = [];

for (const uc of USE_CASES) {
  const d = deriveAll(uc, now);
  if (d.isStalled) stalled++;
  if (uc.state === "Measured") {
    hoursMeasured += uc.hoursSavedMonthly;
    netMeasured += d.netMonthlyEur;
  }
  if (uc.state === "Shipped" || uc.state === "Measured") {
    totalNet += d.netMonthlyEur;
    totalSpend += uc.monthlyCostEur;
  }
  for (const relId of uc.relatedIds) {
    const other = USE_CASES.find((u) => u.id === relId);
    if (!other) {
      console.log("BROKEN relatedId:", uc.id, "->", relId);
    } else if (!other.relatedIds.includes(uc.id)) {
      console.log("ASYMMETRIC relatedId:", uc.id, "->", relId, "(not reciprocated)");
    } else {
      relatedPairsOk.push(`${uc.id}<->${other.id}`);
    }
  }

  const impactTotal = d.impactTotal;
  const effortTotal = d.effortTotal;
  if (impactTotal < 4 || impactTotal > 20) console.log("BAD impact total", uc.id, impactTotal);
  if (effortTotal < 4 || effortTotal > 20) console.log("BAD effort total", uc.id, effortTotal);

  for (const sysId of uc.systemsTouched) {
    if (!getSystem(sysId)) console.log("UNKNOWN systemId referenced:", uc.id, "->", sysId);
  }
}

console.log("Stalled count:", stalled, "(target 6-8)");
console.log("Related pairs (deduped, each printed twice):", relatedPairsOk);
console.log("Measured hours/month total:", hoursMeasured, "(target >=120 by day 90, currently just 4 items)");
console.log("Measured net EUR/month:", netMeasured);
console.log("Shipped+Measured net EUR/month:", totalNet, "spend:", totalSpend, "portfolio net:", totalNet - totalSpend);

const ids = new Set(USE_CASES.map((u) => u.id));
console.log("Unique ids:", ids.size, "of", USE_CASES.length);

const tierCounts: Record<string, number> = {};
for (const uc of USE_CASES) {
  const d = deriveAll(uc, now);
  tierCounts[d.tier] = (tierCounts[d.tier] ?? 0) + 1;
}
console.log("Tier distribution:", tierCounts);
