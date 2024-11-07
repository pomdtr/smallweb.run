import { createOpenApiDocument, openApi, extendZodWithOpenApi } from 'hono-zod-openapi';
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

    const app = new Hono().use("/v0/*", bearerAuth({
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

        return c.json(entries.filter(entry => entry.isDirectory && !entry.name.startsWith(".")).map((entry) => ({
            name: entry.name,
            url: `https://${entry.name}.${domain}/`
        })))
    }).post("/v0/apps", openApi({
        tags: ["apps"],
        security: [{ bearerAuth: [] }],
        request: {
            json: z.object({
                name: z.string()
            })
        },
        responses: {
            201: z.object({
                name: z.string(),
                url: z.string(),
            })
        }
    }), async (c) => {
        const body = await c.req.valid("json")
        const appDir = path.join(dir, body.name);

        try {
            await Deno.mkdir(appDir);
            await Deno.writeTextFile(path.join(appDir, "main.ts"), template);
            return c.json({
                name: body.name,
                url: `https://${body.name}.${domain}/`
            }, 201);
        } catch (_) {
            return c.json({ error: "App already exists" }, 400);
        }
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
    }).put("/v0/apps/{app}", openApi({
        tags: ["apps"],
        security: [{ bearerAuth: [] }],
        request: {
            param: z.object({
                app: z.string()
            }),
            json: z.object({
                name: z.string()
            })
        },
        description: "Rename app",
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
        const { app } = c.req.valid("param")
        const body = c.req.valid("json")
        await Deno.rename(path.join(dir, app), path.join(dir, body.name))
        return c.json({
            name: body.name,
            url: `https://${body.name}.${domain}/`
        })
    }).delete("/v0/apps/{app}", openApi({
        tags: ["apps"],
        security: [{ bearerAuth: [] }],
        request: {
            param: z.object({
                app: z.string()
            }),
        },
        responses: {
            204: z.null(),
            404: z.object({
                error: z.string()
            })
        }
    }), async (c) => {
        const { app } = c.req.valid("param")
        try {
            await Deno.remove(path.join(dir, app), { recursive: true })
            return c.json({ message: "App deleted" }, 204)
        } catch (_) {
            return c.json({ error: "App not found" }, 404)
        }
    }).get("/", (c) => {
        return c.html(homepage)
    })

    createOpenApiDocument(
        app,
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

    return app
}

const template = /* ts */ `export default {
    fetch: () => {
        return new Response("Hello from smallweb!");
    },
    run: () => {
        console.log("Hello from smallweb!");
    },
};
`;
