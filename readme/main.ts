import { createReadme } from "./mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.2.2"

const app = createReadme({
    editorUrl: "https://editor.smallweb.run",
})

export default {
    fetch: lastlogin(app.fetch, {
        verifyEmail: (email) => {
            return email === Deno.env.get("EMAIL")
        },
        provider: "google",
        public_routes: ["/cloud"]
    })
}
