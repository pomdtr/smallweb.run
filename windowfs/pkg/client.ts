import { AppType } from './server.ts'
import { hc } from 'hono/client'

export const client = hc<AppType>(globalThis.location.origin)


