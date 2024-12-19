const repo = "pomdtr/smallweb.run"

const esmCache = await caches.open("esm")

export default {
    async fetch(req: Request) {
        const url = new URL(req.url)
        if (url.pathname === "/") {
            return Response.redirect(new URL("/latest/esm/main.ts", req.url))
        }

        const [_, version, ...parts] = url.pathname.split("/")
        const match = await esmCache.match(req)
        if (match) {
            return match
        }

        const resp = await fetch(`https://raw.githubusercontent.com/${repo}/${version}/${parts.join("/")}`)
        if (resp.ok) {
            esmCache.put(req, resp.clone())
        }

        return resp
    }
}
