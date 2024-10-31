import { Hono } from "npm:hono@4.6.8"
import { createCli } from "./mod.ts"
import { zValidator } from 'npm:@hono/zod-validator'
import { z } from 'npm:zod'

const app = new Hono()

app.on("RUN", "/hello/:name?", zValidator("query", z.object({
    help: z.string().optional().describe("Show help"),
})), (c) => {
    const flags = c.req.valid("query")
    if (flags.help) {
        return c.text("Usage: hello [name]")
    }

    const { name = "World" } = c.req.param()
    return c.text(`Hello, ${name}!`)
})

const cli = createCli(app.fetch)
await cli()

/* Usage:

  $ deno run main.ts hello pomdtr
  Hello, pomdtr!

*/
