import {
    createOpenApiDocument,
    extendZodWithOpenApi,
    openApi,
} from "hono-zod-openapi";
import { Hono } from "hono";
import { z } from "zod";
import * as path from "@std/path";
import homepage from "./swagger.ts";
import * as cli from "@std/cli";

extendZodWithOpenApi(z);

export type ApiOptions = {
    dir?: string;
    domain?: string;
};

export class Api {
    private requestHandler;
    constructor(opts: ApiOptions = {}) {
        const {
            dir = Deno.env.get("SMALLWEB_DIR"),
            domain = Deno.env.get("SMALLWEB_DOMAIN"),
        } = opts;

        if (!dir) {
            throw new Error("dir is required");
        }

        if (!domain) {
            throw new Error("domain is required");
        }

        this.requestHandler = createRequestHandler(dir, domain);
    }

    fetch = (req: Request): Response | Promise<Response> => {
        return this.requestHandler.fetch(req);
    };

    run = async (args: string[]): Promise<void> => {
        const { _, ...flags } = await cli.parseArgs(args, {
            string: ["_", "headers", "method", "data"],
            boolean: ["help"],
            alias: {
                help: "h",
                data: "d",
                headers: "H",
                method: "X",
            },
            collect: ["headers"],
        });

        if (flags.help) {
            console.log(`Usage: cli [options] <url>

Options:
  -X, --method <method>       Specify the HTTP method to use (GET, POST, etc.)
  -d, --data <data>           Send specified data in the request body
  -H, --headers <header>      Add a header to the request (can be used multiple times)
  -h, --help                  Display this help message

Arguments:
  <url>                       The URL to send the request to

Examples:
  cli -X POST -d "name=value" -H "Content-Type: application/json" https://example.com
  cli -X GET -H "Accept: application/json" https://example.com
`);
            return;
        }

        if (_.length === 0) {
            console.error("No path provided");
            Deno.exit(1);
        }

        const path = _[0];
        const headers = new Headers();
        for (const header of flags.headers || []) {
            const [name, value] = header.split(":");
            headers.set(name, value);
        }

        const resp = await this.requestHandler.request(path, {
            method: flags.method,
            body: flags.data,
            headers,
        });
        console.log(await resp.text());
    };
}

function createRequestHandler(dir: string, domain: string) {
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
            const entries = await Array.fromAsync(Deno.readDir(dir));
            return c.json(
                entries.filter((entry) =>
                    entry.isDirectory && !entry.name.startsWith(".")
                ).map((entry) => ({
                    name: entry.name,
                    url: `https://${entry.name}.${domain}/`,
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
            const appDir = path.join(dir, body.name);

            try {
                await Deno.mkdir(appDir);
                await Deno.writeTextFile(
                    path.join(appDir, "main.ts"),
                    template,
                );
                return c.json({
                    name: body.name,
                    url: `https://${body.name}.${domain}/`,
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
            const params = c.req.valid("param");
            const appDir = path.join(dir, params.app);

            try {
                const stat = await Deno.stat(appDir);
                if (!stat.isDirectory) {
                    return c.json({ error: "App not found" }, 404);
                }

                return c.json({
                    name: params.app,
                    url: `https://${params.app}.${domain}/`,
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
                    path.join(dir, app),
                    path.join(dir, body.name),
                );
                return c.json({
                    name: body.name,
                    url: `https://${body.name}.${domain}/`,
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
                await Deno.remove(path.join(dir, app), { recursive: true });
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
