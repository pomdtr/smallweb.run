import { Webdav } from "./pkg/mod.ts";

import { lastlogin, createToken } from "jsr:@pomdtr/lastlogin@0.5.13"

const webdav = new Webdav({
    rootDir: Deno.env.get("SMALLWEB_DIR"),
});

webdav.fetch = lastlogin(webdav.fetch);

export default {
    fetch: lastlogin(webdav.fetch),
    run: async (args: string[]) => {
        const { SMALLWEB_APP_NAME } = Deno.env.toObject()
        if (args.length !== 1) {
            console.error(`Usage: ${SMALLWEB_APP_NAME} <email>`)
            Deno.exitCode = 1
            return
        }

        const token = await createToken({
            email: args[0]
        })

        console.log(token)
    }
}
