import { serveFile } from "jsr:@std/http@1.0.8"
export default {
    fetch: (req) => {
        return serveFile(req, "openapi.json")
    }
} satisfies Deno.ServeDefaultExport
