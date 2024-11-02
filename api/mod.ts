import { Hono } from "hono";
import { z } from 'zod';
import { extendZodWithOpenApi } from 'hono-zod-openapi';
import { createOpenApiDocument, openApi } from 'hono-zod-openapi';


extendZodWithOpenApi(z);

export type ApiOptions = {
    rootDir?: string;
}

function fetchApi(req: Request, options: ApiOptions = {}): Response | Promise<Response> {
    const {
        rootDir = Deno.env.get("SMALLWEB_DIR"),
    } = options;

    if (!rootDir) {
        throw new Error("SMALLWEB_DIR is not set");
    }

    const app = new Hono();
    app.get("/v0/apps", openApi({
        tags: ["apps"],
        responses: {
            200: z.array(z.object({
                name: z.string(),
                url: z.string(),
            }))
        }
    }), async (c) => {
        const entries = await Array.fromAsync(Deno.readDir(rootDir));
        return c.json(entries.filter(entry => entry.isDirectory || entry.name.startsWith(".")).map((entry) => ({
            name: entry.name,
            url: new URL(`https://${entry.name}.${Deno.env.get("SMALLWEB_DOMAIN")}/`).href,
        })))
    })

    app.post("/v0/apps")

    app.get("/v0/apps/{app}", openApi({
        tags: ["apps"],
        request: {
            param: z.object({
                app: z.string()
            })
        },
        responses: {
            200: z.object({
                name: z.string(),
                url: z.string(),
            })
        }
    }))

    app.put("/v0/apps/{app}")
    app.delete("/v0/apps/{app}")

    createOpenApiDocument(
        app,
        { info: { title: "Smallweb API", version: "0" }, },
        { routeName: "/openapi.json" }
    )
    return app.fetch(req);
}

type App = {
    fetch: (req: Request) => Response | Promise<Response>
}

export function api(options: ApiOptions = {}): App {
    return {
        fetch: (req: Request) => fetchApi(req, options)
    }
}
