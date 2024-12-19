const repo = "pomdtr/smallweb.run"

const esmCache = await caches.open("esm")

export default {
    async fetch(req: Request) {
        const url = new URL(req.url)
        if (url.pathname === "/") {
            return new Response(`Usage: ${url.origin}/<sha>/<path>`)
        }

        const [version, ...parts] = url.pathname.slice(1).split("/")
        const match = await esmCache.match(req)
        if (match) {
            return match
        }

        const resp = await fetch(`https://raw.githubusercontent.com/${repo}/${version}/${parts.join("/")}`)
        if (resp.ok) {
            await esmCache.put(req, resp.clone())
        }

        return resp
    }
}
