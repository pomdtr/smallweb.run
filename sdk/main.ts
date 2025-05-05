import { Smallweb } from "jsr:@smallweb/sdk"
import { Hono } from "npm:hono@4.7.8"

const smallweb = new Smallweb()

const app = new Hono()

app.get("/", async (c) => {
    return c.json(await smallweb.apps.list())
})

app.get("/:app", async (c) => {
    return c.json(await smallweb.apps.get(c.req.param("app")))
})

export default app
