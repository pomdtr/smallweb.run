import { createOpenApiDocument, openApi } from 'hono-zod-openapi';
import { extendZodWithOpenApi } from 'hono-zod-openapi';
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth"
import { z } from 'zod';
import * as path from "@std/path"
import homepage from "./swagger.ts"

extendZodWithOpenApi(z);

type App = {
    fetch: (req: Request) => Response | Promise<Response>,
}


export type ApiParams = {
    dir?: string;
    domain?: string;
    verifyToken: (token: string) => boolean | Promise<boolean>;
}


export function api(params: ApiParams): App {
    const {
        dir = Deno.env.get("SMALLWEB_DIR"),
        domain = Deno.env.get("SMALLWEB_DOMAIN"),
        verifyToken
    } = params

    if (!dir) {
        throw new Error("no dir provided")
    }

    if (!domain) {
        throw new Error("no domain provided")
    }

    const server = new Hono().use("/v0/*", bearerAuth({
        verifyToken
    })).get("/v0/apps", openApi({
        tags: ["apps"],
        security: [{ bearerAuth: [] }],
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
        security: [{ bearerAuth: [] }],
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
        server,
        {
            info: { title: "Smallweb API", version: "0" }, components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer"
                    }
                }
            }
        },
        { routeName: "/openapi.json" }
    )

    return {
        fetch: server.fetch,
    }
}
