import { lastlogin } from "jsr:@pomdtr/lastlogin@0.2.2";
import { Readme } from "./mod.ts";

const readme = new Readme({
    editorUrl: "https://editor.smallweb.run",
});

export default {
    fetch: lastlogin(readme.fetch, {
        public_routes: ["/cloud", "/todo"],
    }),
};
