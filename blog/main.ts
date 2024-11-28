import { serveDir, serveFile } from "jsr:@std/http/file-server"

export default {
    fetch: async (req) => {
        const resp = await serveDir(req, {
            fsRoot: "./_site"
        })

        if (resp.status === 404) {
            return await serveFile(req, "./_site/404.html")
        }

        return resp
    }
} satisfies Deno.ServeDefaultExport
