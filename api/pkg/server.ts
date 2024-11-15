import { createOpenApiDocument, openApi } from "hono-zod-openapi";
import "zod-openapi/extend";

import { Hono } from "hono";
import { z } from "zod";
import * as path from "@std/path";
import homepage from "./swagger.ts";

export function createServer(params: {
    dir: string;
    domain: string;
}) {
    const app = new Hono();

    app.get(
        "/v0/apps",
        openApi({
            tags: ["apps"],
            security: [{ bearerAuth: [] }],
            responses: {
                200: z.array(z.object({
                    name: z.string(),
                    url: z.string(),
                })),
            },
        }),
        async (c) => {
            const entries = await Array.fromAsync(Deno.readDir(params.dir));
            return c.json(
                entries.filter((entry) =>
                    entry.isDirectory && !entry.name.startsWith(".")
                ).sort((a, b) => a.name.localeCompare(b.name)).map((entry) => ({
                    name: entry.name,
                    url: `https://${entry.name}.${params.domain}/`,
                })),
            );
        },
    );

    app.post(
        "/v0/apps",
        openApi({
            tags: ["apps"],
            security: [{ bearerAuth: [] }],
            request: {
                json: z.object({
                    name: z.string(),
                }),
            },
            responses: {
                201: z.object({
                    name: z.string(),
                    url: z.string(),
                }),
            },
        }),
        async (c) => {
            const body = await c.req.valid("json");
            const appDir = path.join(params.dir, body.name);

            try {
                await Deno.mkdir(appDir);
                await Deno.writeTextFile(
                    path.join(appDir, "main.ts"),
                    template,
                );
                return c.json({
                    name: body.name,
                    url: `https://${body.name}.${params.domain}/`,
                }, 201);
            } catch (_) {
                return c.json({ error: "App already exists" }, 400);
            }
        },
    );

    app.get(
        "/v0/apps/{app}",
        openApi({
            tags: ["apps"],
            security: [{ bearerAuth: [] }],
            request: {
                param: z.object({
                    app: z.string(),
                }),
            },
            responses: {
                200: z.object({
                    name: z.string(),
                    url: z.string(),
                }),
                404: z.object({
                    error: z.string(),
                }),
            },
        }),
        async (c) => {
            const { app } = c.req.valid("param");
            const appDir = path.join(params.dir, app);

            try {
                const stat = await Deno.stat(appDir);
                if (!stat.isDirectory) {
                    return c.json({ error: "App not found" }, 404);
                }

                return c.json({
                    name: app,
                    url: `https://${app}.${params.domain}/`,
                });
            } catch (_) {
                return c.json({ error: "App not found" }, 404);
            }
        },
    );

    app.put(
        "/v0/apps/{app}",
        openApi({
            tags: ["apps"],
            security: [{ bearerAuth: [] }],
            request: {
                param: z.object({
                    app: z.string(),
                }),
                json: z.object({
                    name: z.string(),
                }),
            },
            description: "Rename app",
            responses: {
                200: z.object({
                    name: z.string(),
                    url: z.string(),
                }),
                404: z.object({
                    error: z.string(),
                }),
            },
        }),
        async (c) => {
            const { app } = c.req.valid("param");
            const body = c.req.valid("json");
            try {
                await Deno.rename(
                    path.join(params.dir, app),
                    path.join(params.dir, body.name),
                );
                return c.json({
                    name: body.name,
                    url: `https://${body.name}.${params.domain}/`,
                });
            } catch (_) {
                return c.json({ error: "App not found" }, 404);
            }
        },
    );

    app.delete(
        "/v0/apps/{app}",
        openApi({
            tags: ["apps"],
            security: [{ bearerAuth: [] }],
            request: {
                param: z.object({
                    app: z.string(),
                }),
            },
            responses: {
                404: z.object({
                    error: z.string(),
                }),
            },
        }),
        async (c) => {
            const { app } = c.req.valid("param");
            try {
                await Deno.remove(path.join(params.dir, app), {
                    recursive: true,
                });
                return c.json({ message: "App deleted" }, 204);
            } catch (_) {
                return c.json({ error: "App not found" }, 404);
            }
        },
    );

    app.get("/", (c) => {
        return c.html(homepage);
    });

    createOpenApiDocument(
        app,
        {
            info: { title: "Smallweb API", version: "0" },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                    },
                },
            },
        },
        { routeName: "/openapi.json" },
    );

    return app;
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
