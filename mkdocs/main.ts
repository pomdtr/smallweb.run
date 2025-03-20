import { join } from "jsr:@std/path"

const baseURL = new URL("https://raw.esm.sh/gh/mkdocs/mkdocs@gh-pages");
const cache = await caches.open("mkdocs")

export default {
    async fetch(req: Request) {
        const url = new URL(req.url)
        if (url.pathname.endsWith("/")) {
            url.pathname += "index.html"
        }

        const target = new URL(join(baseURL.pathname, url.pathname), baseURL)
        const request = new Request(target, req)

        const cached = await cache.match(request)
        if (cached) {
            return cached
        }

        const resp = await fetch(request)
        if (resp.ok) {
            cache.put(request, resp.clone())
        }

        return resp
    }
}
