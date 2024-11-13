import { Hono } from "jsr:@hono/hono@4.6.5";
import { cors } from "jsr:@hono/hono@4.6.5/cors";

const app = new Hono();

const cache = await caches.open("schemas");

app.use(cors());
app.get("/", (c) => {
    return c.json({
        config: new URL("/config", c.req.url),
        manifest: new URL(`/manifest`, c.req.url),
    });
});

app.get("/:schema", (c) => {
    return c.redirect(`/latest/${c.req.param("schema")}`);
});

app.get("/:version/:schema", async (c) => {
    const { version, schema } = c.req.param();

    const req = new Request(
        version === "latest"
            ? `https://raw.githubusercontent.com/pomdtr/smallweb/refs/heads/main/schemas/${schema}.schema.json`
            : `https://raw.githubusercontent.com/pomdtr/smallweb/refs/tags/v${version}/schemas/${schema}.schema.json`,
    );
    const cached = await cache.match(req);
    if (cached) {
        return new Response(cached.body, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const resp = await fetch(req);
    if (!resp.ok) {
        return new Response("Not Found", { status: 404 });
    }
    cache.put(req, resp.clone());

    return new Response(resp.body, {
        headers: {
            "Content-Type": "application/json",
        },
    });
});

export default app;
