import { createApi } from "./mod.ts"

const api = createApi()

await api.run(Deno.args)
