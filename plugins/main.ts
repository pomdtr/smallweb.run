import { serveDir } from "jsr:@std/http/file-server"

export default {
    fetch: (req: Request) => serveDir(req, {
        fsRoot: "./plugins",
        showDirListing: true,
    })
}
