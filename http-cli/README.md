# Cli adapter for http framework

## Usage with Hono

Conventions:

- commands use the `RUN` method
- positional arguments are passed as path parameters
- flags are passed as query parameters
  - boolean flags are passed as `?flag`
  - flags with values are passed as `?flag=value`
  - repeated flags are passed as `?flag=value1&flag=value2`
- stdin is passed as body
- the response is printed to stdout if the request is successful, otherwise it is printed to stderr

Examples:

- `dump app --json` -> `RUN /dump/app?json`

```ts
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

// create a cli instance
const cli = new HttpCli(app.fetch)

// run the cli (args are optional, defaults to Deno.args)
await cli.run()
```

```console
$ deno run main.ts hello pomdtr
Hello, pomdtr!
```
