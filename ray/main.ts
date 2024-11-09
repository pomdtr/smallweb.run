import { ray } from "./mod.ts";
import { lastlogin } from "jsr:@pomdtr/lastlogin@0.2.6";

const rootDir = Deno.env.get("SMALLWEB_DIR")!;

const app = ray(rootDir);

export default {
    fetch: lastlogin(app.fetch, {
        private: true,
        verifyEmail: (email) => {
            return email === Deno.env.get("EMAIL");
        },
        provider: "google",
    }),
};
