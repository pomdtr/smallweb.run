import { createOpenApiDocument, openApi } from 'hono-zod-openapi';
import { extendZodWithOpenApi } from 'hono-zod-openapi';
import { Hono } from "hono";
import { z } from 'zod';
import * as path from "@std/path"
import homepage from "./swagger.ts"

extendZodWithOpenApi(z);

export type ApiOptions = {
    dir: string;
    domain: string;
}

type App = {
    fetch: (req: Request) => Response | Promise<Response>
}

export function createApi(options: Partial<ApiOptions> = {}): App {
    const {
        dir = Deno.env.get("SMALLWEB_DIR"),
        domain = Deno.env.get("SMALLWEB_DOMAIN")
    } = options

    if (!dir) {
        throw new Error("no dir provided")
    }

    if (!domain) {
        throw new Error("no domain provided")
    }

    const app = new Hono().get("/v0/apps", openApi({
        tags: ["apps"],
        responses: {
            200: z.array(z.object({
                name: z.string(),
                url: z.string(),
            }))
        }
    }), async (c) => {
        const entries = await Array.fromAsync(Deno.readDir(dir));

        return c.json(entries.filter(entry => entry.isDirectory || entry.name.startsWith(".")).map((entry) => ({
            name: entry.name,
            url: `https://${entry.name}.${domain}/`
        })))
    }).get("/v0/apps/{app}", openApi({
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
            }),
            404: z.object({
                error: z.string()
            })
        }
    }), async (c) => {
        const params = c.req.valid("param")
        const appDir = path.join(dir, params.app);

        try {
            const stat = await Deno.stat(appDir);
            if (!stat.isDirectory) {
                return c.json({ error: "App not found" }, 404);
            }

            return c.json({
                name: params.app,
                url: `https://${params.app}.${domain}/`
            })
        } catch (_) {
            return c.json({ error: "App not found" }, 404);
        }
    }).get("/", (c) => {
        return c.html(homepage)
    })

    createOpenApiDocument(
        app,
        { info: { title: "Smallweb API", version: "0" }, },
        { routeName: "/openapi.json" }
    )

    return {
        fetch: app.fetch
    }
}
