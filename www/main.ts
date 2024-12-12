import { serveDir } from "jsr:@std/http@1.0.11"

export default {
    fetch: async (req: Request) => {
        const options = {
            fsRoot: ".vitepress/dist",
        }

        let resp = await serveDir(req, options)
        if (resp.status !== 404) {
            return resp
        }

        resp = await serveDir(new Request(req.url + ".html", req), options)
        if (resp.status !== 404) {
            return resp
        }

        const body = await Deno.open(".vitepress/dist/404.html")
        return new Response(body.readable, {
            status: 404,
            headers: {
                "Content-Type": "text/html",
            },
        })
    }
}
