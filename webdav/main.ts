import { webdav } from "./mod.ts"

export default webdav({
    rootDir: Deno.env.get("SMALLWEB_DIR"),
    verifyToken: (token: string) => {
        return Deno.env.get("WEBDAV_TOKEN") === token
    }
})
