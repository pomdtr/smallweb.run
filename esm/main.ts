const repo = "pomdtr/smallweb.run"

export default {
    fetch(req: Request) {
        const url = new URL(req.url)
        if (url.pathname === "/") {
            return Response.redirect(new URL("/esm/main.ts", req.url))
        }

        return fetch(`https://raw.githubusercontent.com/${repo}/refs/heads/main${url.pathname}`)
    }
}
