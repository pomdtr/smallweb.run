import { createOpenApiDocument, openApi } from 'hono-zod-openapi';
import { extendZodWithOpenApi } from 'hono-zod-openapi';
import { Hono } from "hono";
import { z } from 'zod';
import * as path from "@std/path"
import homepage from "./swagger.ts"

extendZodWithOpenApi(z);

export type ApiOptions = {
    dir?: string;
    domain?: string;
}

export class Api {
    hono: Hono;

    constructor(public options: ApiOptions = {}) {
        this.hono = new Hono();

        this.hono.get("/v0/apps", openApi({
            tags: ["apps"],
            responses: {
                200: z.array(z.object({
                    name: z.string(),
                    url: z.string(),
                }))
            }
        }), async (c) => {
            const entries = await Array.fromAsync(Deno.readDir(this.#dir));

            return c.json(entries.filter(entry => entry.isDirectory || entry.name.startsWith(".")).map((entry) => ({
                name: entry.name,
                url: `https://${entry.name}.${this.#domain}/`
            })))
        })

        this.hono.get("/v0/apps/{app}", openApi({
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
            const appDir = path.join(this.#dir, params.app);

            try {
                const stat = await Deno.stat(appDir);
                if (!stat.isDirectory) {
                    return c.json({ error: "App not found" }, 404);
                }

                return c.json({
                    name: params.app,
                    url: `https://${params.app}.${this.#domain}/`
                })
            } catch (_) {
                return c.json({ error: "App not found" }, 404);
            }
        })

        this.hono.get("/", (c) => {
            return c.html(homepage)
        })


        createOpenApiDocument(
            this.hono,
            { info: { title: "Smallweb API", version: "0" }, },
            { routeName: "/openapi.json" }
        )
    }

    fetch = (req: Request): Response | Promise<Response> => {
        return this.hono.fetch(req);
    }

    get #dir() {
        const dir = this.options.dir || Deno.env.get("SMALLWEB_DIR");
        if (!dir) {
            throw new Error("SMALLWEB_DIR is not set");
        }
        return dir;
    }

    get #domain() {
        const domain = this.options.domain || Deno.env.get("SMALLWEB_DOMAIN");
        if (!domain) {
            throw new Error("SMALLWEB_DOMAIN is not set");
        }
        return domain;
    }
}

export function createApi(options: ApiOptions = {}): Api {
    return new Api(options);
}
