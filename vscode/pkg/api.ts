import { Hono } from "npm:hono@4.6.10";
import { extendZodWithOpenApi, openApi } from "npm:hono-zod-openapi@0.5.0";
import * as path from "@std/path";
import z from "npm:zod@3.23.8";
import { decodeBase64, encodeBase64 } from "@std/encoding/base64";
import * as fs from "@std/fs";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";

extendZodWithOpenApi(z);

const FileType = z.union([z.literal(1), z.literal(2), z.literal(64)]);
type FileType = z.infer<typeof FileType>;

const FileStat = z.object({
    type: FileType,
    ctime: z.number(),
    mtime: z.number(),
    size: z.number(),
});

function getFileType(stat: Deno.FileInfo | Deno.DirEntry): FileType {
    if (stat.isSymlink) {
        return 64;
    }
    if (stat.isDirectory) {
        return 2;
    }
    return 1;
}

export function createApi(params: {
    rootDir: string;
    token: string | string[];
}) {
    const rootDir = path.resolve(params.rootDir);
    const api = new Hono()
        .use("*", cors())
        .use("/fs/*", bearerAuth({ token: params.token }))
        .post(
            "/fs/stat",
            openApi({
                request: {
                    json: z.object({
                        path: z.string(),
                    }),
                },
                responses: {
                    200: FileStat,
                    400: z.object({
                        error: z.string(),
                    }),
                    404: z.object({
                        error: z.string(),
                    }),
                },
            }),
            async (c) => {
                const body = c.req.valid("json");
                const fullPath = path.resolve(path.join(rootDir, body.path));
                if (!fullPath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                if (!(await fs.exists(fullPath))) {
                    return c.json({ error: "Not Found" }, 404);
                }

                const stat = await Deno.stat(fullPath);
                return c.json({
                    type: getFileType(stat),
                    ctime: stat.birthtime?.getTime() || 0,
                    mtime: stat.mtime?.getTime() || 0,
                    size: stat.size,
                });
            },
        )
        .post(
            "/fs/readDirectory",
            openApi({
                request: {
                    json: z.object({
                        path: z.string(),
                    }),
                },
                responses: {
                    200: z.array(z.object({
                        name: z.string(),
                        type: FileType,
                    })),
                    400: z.object({
                        error: z.string(),
                    }),
                    404: z.object({
                        error: z.string(),
                    }),
                },
            }),
            async (c) => {
                const body = c.req.valid("json");
                const fullPath = path.resolve(path.join(rootDir, body.path));
                if (!fullPath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                const entries = await Array.fromAsync(
                    Deno.readDir(fullPath),
                );
                return c.json(
                    entries.map((entry) => ({
                        name: entry.name,
                        type: getFileType(entry),
                    })),
                );
            },
        )
        .post(
            "/fs/createDirectory",
            openApi({
                request: {
                    json: z.object({
                        path: z.string(),
                    }),
                },
                responses: {
                    200: z.object({
                        success: z.boolean(),
                    }),
                },
            }),
            async (c) => {
                const body = c.req.valid("json");
                const fullPath = path.resolve(path.join(rootDir, body.path));
                if (!fullPath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                await Deno.mkdir(fullPath, {
                    recursive: true,
                });
                return c.json({ success: true });
            },
        )
        .post(
            "/fs/readFile",
            openApi(
                {
                    request: {
                        json: z.object({
                            path: z.string(),
                        }),
                    },
                    responses: {
                        200: z.object({
                            success: z.boolean(),
                            b64: z.string(),
                        }),
                    },
                },
            ),
            async (c) => {
                const body = c.req.valid("json");
                const fullPath = path.resolve(path.join(rootDir, body.path));
                if (!fullPath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                if (!await fs.exists(fullPath)) {
                    return c.json({ error: "File not found" }, 404);
                }

                const content = await Deno.readFile(fullPath);
                return c.json({
                    success: true,
                    b64: encodeBase64(content),
                });
            },
        )
        .post(
            "/fs/writeFile",
            openApi({
                request: {
                    json: z.object({
                        path: z.string(),
                        b64: z.string(),
                        create: z.boolean(),
                        overwrite: z.boolean(),
                    }),
                },
                responses: {
                    200: z.object({
                        success: z.boolean(),
                    }),
                },
            }),
            async (c) => {
                const body = c.req.valid("json");
                const fullPath = path.resolve(path.join(rootDir, body.path));
                if (!fullPath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                if (!body.create && !await fs.exists(fullPath)) {
                    return c.json({ error: "File not found" }, 404);
                }

                if (!body.overwrite && await fs.exists(fullPath)) {
                    return c.json({ error: "File already exists" }, 400);
                }

                const content = decodeBase64(body.b64);
                await Deno.writeFile(
                    path.join(params.rootDir, body.path),
                    content,
                );

                return c.json({});
            },
        )
        .post(
            "fs/copy",
            openApi({
                request: {
                    json: z.object({
                        source: z.string(),
                        destination: z.string(),
                        overwrite: z.boolean(),
                    }),
                },
                responses: {
                    200: z.object({
                        success: z.boolean(),
                    }),
                },
            }),
            async (c) => {
                const body = c.req.valid("json");
                const fullSourcePath = path.resolve(
                    path.join(rootDir, body.source),
                );
                if (!fullSourcePath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                const destinationPath = path.resolve(
                    path.join(rootDir, body.destination),
                );
                if (!destinationPath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                if (!body.overwrite && await fs.exists(destinationPath)) {
                    return c.json({ error: "File already exists" }, 400);
                }

                await Deno.copyFile(
                    fullSourcePath,
                    destinationPath,
                );
                return c.json({ success: true });
            },
        )
        .post(
            "/fs/rename",
            openApi({
                request: {
                    json: z.object({
                        oldPath: z.string(),
                        newPath: z.string(),
                        overwrite: z.boolean(),
                    }),
                },
                responses: {
                    200: z.object({
                        success: z.boolean(),
                    }),
                },
            }),
            async (c) => {
                const body = c.req.valid("json");
                const fullOldPath = path.resolve(
                    path.join(rootDir, body.oldPath),
                );
                if (!fullOldPath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                const fullNewPath = path.resolve(
                    path.join(rootDir, body.newPath),
                );
                if (!fullNewPath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                if (!body.overwrite && await fs.exists(fullNewPath)) {
                    return c.json({ error: "File already exists" }, 400);
                }

                await Deno.rename(
                    fullOldPath,
                    fullNewPath,
                );
                return c.json({ success: true });
            },
        )
        .post(
            "/fs/delete",
            openApi({
                request: {
                    json: z.object({
                        path: z.string(),
                        recursive: z.boolean(),
                    }),
                },
                responses: {
                    200: z.object({
                        success: z.boolean(),
                    }),
                },
            }),
            async (c) => {
                const body = c.req.valid("json");
                const fullPath = path.resolve(path.join(rootDir, body.path));
                if (!fullPath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                if (!await fs.exists(fullPath)) {
                    return c.json({ error: "File not found" }, 404);
                }

                await Deno.remove(fullPath, { recursive: body.recursive });
                return c.json({ success: true });
            },
        )
        .post(
            "/fs/createDirectory",
            openApi({
                request: {
                    json: z.object({
                        path: z.string(),
                    }),
                },
                responses: {
                    200: z.object({
                        success: z.boolean(),
                    }),
                },
            }),
            async (c) => {
                const body = c.req.valid("json");
                const fullPath = path.resolve(path.join(rootDir, body.path));
                if (!fullPath.startsWith(rootDir)) {
                    return c.json({ error: "Bad Request" }, 404);
                }

                await Deno.mkdir(path.join(params.rootDir, body.path), {
                    recursive: true,
                });
                return c.json({ success: true });
            },
        );

    return api;
}
