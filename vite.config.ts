import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev-only stand-in for the api/score.ts Vercel Edge Function: same
// scoreWithGroq() call, so local behavior matches the eventual deploy.
function groqScoreDevApi(): Plugin {
  return {
    name: 'groq-score-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/score', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const body = JSON.parse(Buffer.concat(chunks).toString('utf-8') || '{}')

          const { scoreWithGroq } = await server.ssrLoadModule('/src/server/groqScore.ts')
          const result = await scoreWithGroq(body)

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result))
        } catch (e) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isSet = (v: string | undefined) => !!v && v !== 'undefined'
  if (isSet(env.GROQ_API_KEY)) process.env.GROQ_API_KEY = env.GROQ_API_KEY
  if (isSet(env.GROQ_MODEL)) process.env.GROQ_MODEL = env.GROQ_MODEL

  return {
    plugins: [react(), tailwindcss(), groqScoreDevApi()],
  }
})
