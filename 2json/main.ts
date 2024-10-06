import { encodeBase64 } from "jsr:@std/encoding@0.224.3/base64";
import { gfm } from "https://esm.town/v/pomdtr/gfm?v=24";
import { Hono } from "jsr:@hono/hono@4.4.9";
import { serveStatic } from "jsr:@hono/hono@4.4.9/deno";

const app = new Hono();

app.get("/favicon.ico", () => new Response(null, { status: 204 }));

const readme = Deno.readTextFileSync("README.md");
app.get("/", async (c) => {
    const { hostname } = new URL(c.req.url);
    return new Response(
        await gfm(readme.replaceAll("{{hostname}}", hostname)),
        {
            headers: { "content-type": "text/html; charset=utf-8" },
        },
    );
});

app.use(
    "/src/*",
    serveStatic({
        rewriteRequestPath: (path) => path.replace(/^\/src/, ""),
        mimes: { "ts": "text/typescript" },
    }),
);

app.get("*", async (c) => {
    try {
        const target = "https://" + c.req.path.slice(1);
        const authorization = c.req.header("authorization");
        const resp = await fetch(target, {
            headers: authorization ? { authorization } : {},
        });
        if (!resp.ok) {
            return new Response(await resp.text(), { status: 500 });
        }

        return Response.json({
            status: resp.status,
            statusText: resp.statusText,
            headers: Object.fromEntries(resp.headers),
            body: encodeBase64(await resp.arrayBuffer()),
        });
    } catch (e: any) {
        return new Response(e.stack, { status: 500 });
    }
});

export default app;
