import { webdav } from "./mod.ts";
import { bearerAuth } from "jsr:@pomdtr/bearer-auth@0.1.0";

const app = webdav({
    rootDir: Deno.env.get("SMALLWEB_DIR"),
});

export default {
    fetch: bearerAuth(app.fetch, {
        verifyToken: (token: string) => {
            return token === Deno.env.get("WEBDAV_TOKEN");
        },
    }),
};
