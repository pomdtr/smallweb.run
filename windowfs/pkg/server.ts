import { Hono } from "hono"

export function createServer(fsRoot: string) {
    const app = new Hono()
        .basePath("/_fs")
        .post("/readFile", async (c) => {
            const filepath = c.req.query("file")
            if (!filepath) {
                return new Response("file query parameter is required", { status: 400 })
            }

            return new Response(await Deno.readFile(filepath))
        })
        .post("/writeFile", async (c) => {
            const filepath = c.req.query("file")
            if (!filepath) {
                return new Response("file query parameter is required", { status: 400 })
            }

            if (!c.req.raw.body) {
                return new Response("request body is required", { status: 400 })
            }

            await Deno.writeFile(filepath, c.req.raw.body)
        })
        .post("/readDir", async (c) => {

        })
        .post("/rename", async (c) => {

        })

    return app
}

export type AppType = ReturnType<typeof createServer>
