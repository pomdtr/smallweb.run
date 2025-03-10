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
    const jsonPath = path.join(rootDir, "drawing.excalidraw.json");
    const svgPath = path.join(rootDir, "drawing.svg");
    return new Hono()
        .use(logger())
        .post("/", async (c) => {
            const { json, svg } = await c.req.json();

            await ensureDir(rootDir);
            await fs.writeFile(jsonPath, json, { encoding: "utf8" });
            await fs.writeFile(svgPath, svg, { encoding: "utf8" });

            return new Response(null, {
                status: 204,
            });
        })
        .get("/svg", async () => {
            if (!svgPath) {
                return new Response(null, {
                    status: 404,
                });
            }

            const svg = await fs.readFile(svgPath);
            return new Response(
                svg,
                {
                    headers: {
                        "Content-Type": "image/svg+xml",
                    },
                },
            );
        })
        .get("/json", async () => {
            if (!await exists(jsonPath)) {
                return new Response(null, {
                    status: 404,
                });
            }

            const drawing = await fs.readFile(jsonPath);
            return new Response(
                drawing,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        })
        .get("*", serveStatic({
            root: path.join(import.meta.dirname!, "static")
        }))
}
