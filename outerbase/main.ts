import { Hono } from "hono"
import { serveStatic } from "hono/deno"

const app = new Hono()

app.get("/api", async (c) => {
    const entries = await Array.fromAsync(Deno.readDir("./data"))
    return c.json(entries.map((entry) => entry.name))
})

app.get("*", serveStatic({ root: "./static" }))


export default app
