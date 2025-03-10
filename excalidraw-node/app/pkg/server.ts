import * as path from "node:path";
import * as fs from "node:fs/promises";
import { Hono } from "hono";
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/deno'


async function ensureDir(dir: string) {
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (e) {
        if ((e as any).code !== "EEXIST") {
            throw e;
        }
    }
}

async function exists(path: string) {
    try {
        await fs.access(path);
        return true;
    } catch (e) {
        return false;
    }
}


export function createServer(rootDir: string) {
    return new Hono()
        .use(logger())
        .get("/", (c) => {
            return c.redirect("/d/drawing")
        })
        .get("/d/:drawing", async (c) => {
            const contentType = c.req.header("Content-Type");
            const params = c.req.param()

            if (contentType === "application/json" || params.drawing.endsWith(".json")) {
                const filename = params.drawing.replace(/\.json$/, "");
                const filepath = path.join(rootDir, `${filename}.excalidraw.json`);
                if (!await exists(filepath)) {
                    return new Response(null, {
                        status: 404,
                    });
                }

                const json = await fs.readFile(filepath, { encoding: "utf8" });
                return new Response(
                    json,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    },
                );
            } else if (contentType === "image/svg+xml" || params.drawing.endsWith(".svg")) {
                const filename = params.drawing.replace(/\.svg$/, "");
                const filepath = path.join(rootDir, `${filename}.svg`);
                if (!await exists(filepath)) {
                    return new Response(null, {
                        status: 404,
                    });
                }

                const svg = await fs.readFile(filepath, { encoding: "utf8" });
                return new Response(
                    svg,
                    {
                        headers: {
                            "Content-Type": "image/svg+xml",
                        },
                    },
                );
            } else {
                const body = await fs.readFile(path.join(import.meta.dirname!, "static/index.html"), { encoding: "utf8" });
                return c.html(body);
            }
        })
        .post("/d/:drawing", async (c) => {
            const params = c.req.param();
            const { json, svg } = await c.req.json();

            await ensureDir(rootDir);
            await fs.writeFile(path.join(rootDir, `${params.drawing}.excalidraw.json`), json, { encoding: "utf8" });
            await fs.writeFile(path.join(rootDir, `${params.drawing}.svg`), svg, { encoding: "utf8" });

            return new Response(null, {
                status: 204,
            });
        })
        .get("*", serveStatic({
            root: path.join(import.meta.dirname!, "static")
        }))
}
