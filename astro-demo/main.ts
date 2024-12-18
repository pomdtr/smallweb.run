import { handle } from "./dist/server/entry.mjs"
import { serveDir } from "jsr:@std/http@1.0.12/file-server"

export default {
    fetch: async (req: Request) => {
        const res = await serveDir(req, { fsRoot: "./dist/client" })
        if (res.ok) {
            return res
        }

        return handle(req)
    }
}
