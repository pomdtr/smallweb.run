import { Webdav } from "./pkg/mod.ts";

const webdav = new Webdav({
    rootDir: Deno.env.get("SMALLWEB_DIR"),
    verifyUser: () => true
});

export default webdav;
