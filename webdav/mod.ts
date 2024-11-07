import { Hono } from "hono"
import { bearerAuth } from "hono/bearer-auth"
import * as path from "jsr:@std/path"
import * as http from "jsr:@std/http"
import * as xml from "jsr:@libs/xml"

export type WebdavParams = {
    rootDir?: string,
    verifyToken: (token: string) => boolean | Promise<boolean>
}

export function webdav(params: WebdavParams) {
    const {
        rootDir = Deno.cwd()
    } = params

    const app = new Hono().use(
        "*",
        bearerAuth({
            verifyToken: params.verifyToken
        })
    ).get("*", async (c) => {
        const filepath = path.join(rootDir, c.req.path)
        const stat = await Deno.stat(filepath)
        if (stat.isDirectory) {
            return c.newResponse(null, 400)
        }

        return http.serveFile(c.req.raw, filepath)
    }).on("PROPINFO", "*", c => {
        const filepath = path.join(rootDir, c.req.path)
        const stat = Deno.statSync(filepath)
        if (!stat.isDirectory) {
            return c.newResponse(xml.stringify({
                "D:prop": {
                    "D:resourcetype": {}
                }
            }))
        }

        const entries = Deno.readDirSync(filepath)
        const children = []
        for (const entry of entries) {
            children.push({
                "D:href": {
                    _text: entry.name
                }
            })
        }

        return new Response(xml.stringify({
            "D:multistatus": {
                "D:response": {
                    "D:href": {
                        _text: c.req.path
                    },
                    "D:propstat": {
                        "D:prop": {
                            "D:resourcetype": {},
                            "D:children": {
                                "D:href": children
                            }
                        },
                        "D:status": {
                            _text: "HTTP/1.1 200 OK"
                        }
                    }
                }
            }
        }), {
            headers: {
                "Content-Type": "application/xml"
            }
        })
    }).delete("*", async (c) => {
        await Deno.remove(path.join(rootDir, c.req.path))
        return new Response(null, {
            status: 204
        })
    }).put("*", async (c) => {
        await Deno.writeFile(path.join(), new Uint8Array(await c.req.arrayBuffer()))
        return new Response(null, { status: 204 })
    }).on("MOVE", "*", async (c) => {
        const dest = c.req.header("Destination")
        if (!dest) {
            return c.newResponse(null, 400)
        }

        await Deno.rename(path.join(rootDir, c.req.path), path.join(rootDir, dest))

        return new Response(null, { status: 204 })
    }).on("MKCOL", "*", async (c) => {
        await Deno.mkdir(path.join(rootDir, c.req.path))
        return new Response(null, { status: 204 })
    }).on("COPY", "*", async (c) => {
        const dest = c.req.header("Destination")
        if (!dest) {
            return c.newResponse(null, 400)
        }

        await Deno.copyFile(path.join(rootDir, c.req.path), path.join(rootDir, dest))

        return new Response(null, { status: 204 })
    })

    return {
        fetch: app.fetch
    }
}
