import * as path from "@std/path";
import { Hono } from "hono";
import embeds from "./static/mod.ts";
import * as fs from "@std/fs"

export function createServer(rootDir: string) {
    const jsonPath = path.join(rootDir, "drawing.excalidraw.json");
    const svgPath = path.join(rootDir, "drawing.svg");
    return new Hono()
        .post("/", async (c) => {
            const { json, svg } = await c.req.json();

            await fs.ensureDir(rootDir);
            await Deno.writeTextFile(jsonPath, json);
            await Deno.writeTextFile(svgPath, svg);

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

            const svg = await Deno.readTextFile(svgPath);
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
            if (!fs.existsSync(jsonPath)) {
                return new Response(null, {
                    status: 404,
                });
            }

            const drawing = await Deno.readTextFile(jsonPath);
            return new Response(
                drawing,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        })
        .get("*", (c) => {
            return embeds.serve(c.req.raw)
        })
}


