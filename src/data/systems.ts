import type { SystemRef } from "../types";

// Verified 7 Aug 2026 against live NavVis Greenhouse postings
// (job-boards.eu.greenhouse.io/navvis) and their public privacy policy.
// Two entries from the original candidate list turned out to be wrong on
// direct verification (DATEV/SAP, PostgreSQL/PostGIS) and are corrected here
// rather than shipped as false "Confirmed" claims.

export const SYSTEMS: SystemRef[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM and marketing",
    owningFunction: "Revenue",
    confidence: "Confirmed",
    evidence:
      "Named in NavVis's privacy policy; confirmed again by name in the AI-Enabled Revenue Operations Specialist and Marketing Operations job postings (Aug 2026).",
  },
  {
    id: "aws",
    name: "AWS (EKS, S3, Lambda)",
    category: "Cloud infrastructure",
    owningFunction: "Platform",
    confidence: "Confirmed",
    evidence:
      "Cloud Security Engineer posting names EKS clusters and AWS-native security tooling directly.",
  },
  {
    id: "cicd",
    name: "Terraform, Helm, GitOps pipelines",
    category: "CI/CD and IaC",
    owningFunction: "Platform",
    confidence: "Confirmed",
    evidence:
      "Cloud Security Engineer posting: 'integrate security controls into CI/CD pipelines (Terraform, Helm, GitOps).' GitHub Actions and ArgoCD specifically (in the original candidate list) were not found in any posting, so they are not asserted here.",
  },
  {
    id: "entra",
    name: "Microsoft Entra ID",
    category: "Identity",
    owningFunction: "IT & Security",
    confidence: "Confirmed",
    evidence:
      "Senior Security Engineer posting requires 'deep practical knowledge of Microsoft Defender, Entra ID, email security, identity-related incidents.'",
  },
  {
    id: "vanta",
    name: "Vanta",
    category: "Compliance and SOC2",
    owningFunction: "IT & Security",
    confidence: "Confirmed",
    evidence:
      "Senior Security Engineer posting requires ISO 27001 / SOC 2 audit leadership and names Vanta as the compliance platform.",
  },
  {
    id: "wiz",
    name: "Wiz",
    category: "Cloud security",
    owningFunction: "IT & Security",
    confidence: "Confirmed",
    evidence: "Cloud Security Engineer posting: 'own the security posture via Wiz and AWS native services.'",
  },
  {
    id: "observability",
    name: "Prometheus, Grafana, Elastic (unverified)",
    category: "Observability",
    owningFunction: "Platform",
    confidence: "Speculative",
    evidence:
      "Present in the original candidate system list but not independently found in any live NavVis job posting on re-verification. Kept as a labelled guess rather than dropped or upgraded.",
  },
  {
    id: "databricks",
    name: "Databricks",
    category: "Internal data platform",
    owningFunction: "R&D",
    confidence: "Confirmed",
    evidence:
      "Product Manager (Data Platform) posting: 'drive the ongoing Databricks migration from both a technical and product perspective.' No mention of PostgreSQL/PostGIS (the original candidate guess) was found anywhere in NavVis's public postings.",
  },
  {
    id: "finance-erp",
    name: "Microsoft Dynamics",
    category: "Finance and accounting",
    owningFunction: "Finance",
    confidence: "Confirmed",
    evidence:
      "Confirmed via Finance role postings (Aug 2026) describing invoice processing and payment-run workflows. Corrects the original candidate guess of DATEV or SAP.",
  },
  {
    id: "m365",
    name: "Microsoft 365",
    category: "Collaboration",
    owningFunction: "IT & Security",
    confidence: "Inferred",
    evidence: "Inferred from confirmed Entra ID usage; no posting names Teams/M365 directly.",
  },
  {
    id: "kb",
    name: "Knowledge base (Confluence, Notion, or similar)",
    category: "Documentation",
    owningFunction: "Platform",
    confidence: "Speculative",
    evidence:
      "No specific documentation tool confirmed. A Team Lead Assembly posting calls for better process documentation generally, and lists Jira/Odoo as nice-to-haves, but names no knowledge-base tool.",
  },
];

export function getSystem(id: string): SystemRef | undefined {
  return SYSTEMS.find((s) => s.id === id);
}
