import { serveDir } from "jsr:@std/http@1.0.11"

export default {
    fetch: async (req: Request) => {
        const resp = await serveDir(req, {
            fsRoot: "./_site",
        })

        if (resp.status === 404) {
            const body = await Deno.open("./_site/404.html")
            return new Response(body.readable, {
                status: 404,
                headers: {
                    "Content-Type": "text/html",
                },
            })
        }

        return resp
    },
}
