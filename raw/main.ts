import { FileServer } from "jsr:@smallweb/file-server@0.3.3";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.5.2";

const fileserver = new FileServer({
    fsRoot: Deno.env.get("SMALLWEB_DIR"),
    showDirListing: true,
});
fileserver.fetch = lastlogin(fileserver.fetch);

export default fileserver;
