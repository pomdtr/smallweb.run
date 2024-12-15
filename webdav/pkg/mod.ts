import { Hono } from "hono";
import * as path from "@std/path";
import * as http from "@std/http";
import * as xml from "@libs/xml";
import { contentType } from "@std/media-types"

export type WebdavConfig = {
    rootDir?: string;
};

export class Webdav {
    private server;

    constructor(config: WebdavConfig = {}) {
        const dir = config.rootDir || Deno.cwd();
        this.server = createServer(dir);
    }

    fetch: (req: Request) => Response | Promise<Response> = (req) => {
        return this.server.fetch(req);
    };
}

function createServer(rootDir: string) {
    const app = new Hono({});

    app.get("*", async (c) => {
        const filepath = path.join(rootDir, c.req.path);
        const stat = await Deno.stat(filepath);
        if (stat.isDirectory) {
            return c.newResponse(null, 400);
        }

        return http.serveFile(c.req.raw, filepath);
    });

    app.on("PROPINFO", "*", async (c) => {
        const filepath = path.join(rootDir, c.req.path);
        const depth = c.req.header("Depth") || "infinity";
        const stat = Deno.statSync(filepath);

        async function getProps(entryPath: string, entryName: string) {
            const lstat = await Deno.lstat(entryPath);
            const isSymlink = lstat.isSymlink;
            const stat = isSymlink ? await Deno.stat(entryPath) : lstat;

            if (isSymlink) {
                return {
                    "D:href": entryName,
                    "D:propstat": {
                        "D:prop": {
                            "D:resourcetype": {},
                            "D:getcontentlength": "0",
                            "D:getlastmodified": new Date(stat.mtime!).toUTCString(),
                            "D:creationdate": new Date(stat.birthtime!).toISOString(),
                            "D:getcontenttype": "application/x-symlink",
                        },
                    },
                };
            }

            return {
                "D:href": entryName,
                "D:propstat": {
                    "D:prop": stat.isDirectory ? {
                        "D:resourcetype": {
                            "D:collection": {},
                        },
                    } : {
                        "D:resourcetype": {},
                        "D:getcontentlength": stat.size.toString(),
                        "D:getlastmodified": new Date(stat.mtime!).toUTCString(),
                        "D:creationdate": new Date(stat.birthtime!).toISOString(),
                        "D:getcontenttype": contentType(path.extname(entryName)) || "application/octet-stream",
                    },
                },
            };
        }

        async function* walkDir(dir: string, currentDepth = 0): AsyncGenerator<any> {
            if (depth !== "infinity" && currentDepth >= parseInt(depth)) {
                return;
            }

            for await (const entry of Deno.readDir(dir)) {
                const fullPath = path.join(dir, entry.name);
                const relativePath = path.relative(filepath, fullPath);
                yield await getProps(fullPath, relativePath);

                const stat = await Deno.stat(fullPath);
                if (stat.isDirectory && depth === "infinity") {
                    yield* walkDir(fullPath, currentDepth + 1);
                }
            }
        }

        if (!stat.isDirectory) {
            return c.newResponse(xml.stringify({
                "D:multistatus": {
                    "D:response": await getProps(filepath, ""),
                },
            }));
        }

        const entries = [];
        // Add current directory properties for depth=0 or greater
        entries.push(await getProps(filepath, ""));

        if (depth !== "0") {
            for await (const entry of walkDir(filepath)) {
                entries.push(entry);
            }
        }

        return new Response(
            xml.stringify({
                "D:multistatus": {
                    "D:response": entries,
                },
            }),
            {
                headers: {
                    "Content-Type": "application/xml",
                },
            },
        );
    });

    app.delete("*", async (c) => {
        await Deno.remove(path.join(rootDir, c.req.path));
        return new Response(null, {
            status: 204,
        });
    });

    app.put("*", async (c) => {
        await Deno.writeFile(
            path.join(),
            new Uint8Array(await c.req.arrayBuffer()),
        );
        return new Response(null, { status: 204 });
    }).on("MOVE", "*", async (c) => {
        const dest = c.req.header("Destination");
        if (!dest) {
            return c.newResponse(null, 400);
        }

        await Deno.rename(
            path.join(rootDir, c.req.path),
            path.join(rootDir, dest),
        );

        return new Response(null, { status: 204 });
    });

    app.on("MKCOL", "*", async (c) => {
        await Deno.mkdir(path.join(rootDir, c.req.path));
        return new Response(null, { status: 204 });
    });

    app.on("COPY", "*", async (c) => {
        const dest = c.req.header("Destination");
        if (!dest) {
            return c.newResponse(null, 400);
        }

        await Deno.copyFile(
            path.join(rootDir, c.req.path),
            path.join(rootDir, dest),
        );

        return new Response(null, { status: 204 });
    });

    return app;
}
