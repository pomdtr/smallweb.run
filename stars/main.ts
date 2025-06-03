import { ensureDir } from "jsr:@std/fs"
import { serveFile } from "jsr:@std/http"

export default {
    fetch: (req: Request) => {
        return serveFile(req, "data/star-history.svg")
    },
    run: async () => {
        const resp = await fetch("https://api.star-history.com/svg?repos=pomdtr/smallweb")
        if (!resp.ok) {
            throw new Error(`Failed to fetch: ${resp.statusText}`);
        }

        await ensureDir("data")
        await Deno.writeTextFile("data/star-history.svg", await resp.text())
    }
}
