// Production server for Render (or any plain Node host): serves the built
// dist/ folder and handles POST /api/score using the same scoreWithGroq()
// as the Vite dev middleware, so local dev and prod hit identical logic.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scoreWithGroq, type ScoreRequest } from "./src/server/groqScore.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const port = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

app.post("/api/score", async (req, res) => {
  try {
    const result = await scoreWithGroq(req.body as ScoreRequest);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
  }
});

app.use(express.static(distDir));

// SPA fallback: any other GET route serves index.html so client-side routing works.
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Lever server listening on port ${port}`);
});
