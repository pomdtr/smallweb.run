import { Hono } from "npm:hono"
import { HttpCli } from "jsr:@pomdtr/http-cli"
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

const cli = new HttpCli(app.fetch)
await cli.run()
