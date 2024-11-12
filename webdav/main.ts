import { Webdav } from "./mod.ts";
import { bearerAuth } from "jsr:@pomdtr/bearer-auth@0.1.0";

const webdav = new Webdav({
    rootDir: Deno.env.get("SMALLWEB_DIR"),
});

webdav.fetch = bearerAuth(webdav.fetch, {
    verifyToken: (token: string) => {
        return token === Deno.env.get("WEBDAV_TOKEN");
    },
});

export default webdav;
