import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from '@/server'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!'
  })
})

app.use('/trpc/*', trpcServer({
  router: appRouter,
}))

export const GET = handle(app)
