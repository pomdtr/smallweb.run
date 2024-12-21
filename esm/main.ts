import { contentType } from "jsr:@std/media-types"
import { extname } from "jsr:@std/path"

const repo = "pomdtr/smallweb.run"

const { GITHUB_TOKEN } = Deno.env.toObject()
const esmCache = await caches.open("esm")

export default {
    async fetch(req: Request) {
        const url = new URL(req.url)
        if (url.pathname === "/") {
            return new Response(`Usage: ${url.origin}/<sha>/<path>`)
        }

        const [version, ...parts] = url.pathname.slice(1).split("/")
        if (version == "latest") {
            if (!GITHUB_TOKEN) {
                return new Response("GITHUB_TOKEN is required for fetching 'latest' version", {
                    status: 500
                })
            }

            const resp = await fetch(`https://api.github.com/repos/${repo}/commits`, {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`
                }
            })

            if (!resp.ok) {
                return new Response(`Failed to fetch commits: ${resp.statusText}`, {
                    status: 500
                })
            }

            const commits = await resp.json()
            const version = commits[0].sha.slice(0, 7)
            return Response.redirect(new URL(`/${version}/${parts.join("/")}`, url.origin).toString(), 302)
        }

        const match = await esmCache.match(req)
        if (match) {
            return match
        }

        const resp = await fetch(`https://raw.githubusercontent.com/${repo}/${version}/${parts.join("/")}`)
        if (!resp.ok) {
            return new Response(`Failed to fetch file: ${resp.statusText}`, {
                status: 404
            })
        }

        const res = new Response(resp.body, {
            headers: {
                "Content-Type": contentType(extname(url.pathname)) || "text/plain",
                "Access-Control-Allow-Origin": "*"
            }
        })
        await esmCache.put(req, res.clone())
        return res
    }
}
