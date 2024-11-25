import { serveDir, serveFile } from "jsr:@std/http@1.0.11"

export default {
    fetch: async (req: Request) => {
        const resp = await serveDir(req, {
            fsRoot: ".vitepress/dist",
        })

        if (resp.status === 404) {
            return serveFile(req, ".vitepress/dist/404.html")
        }

        return resp
    },
}
