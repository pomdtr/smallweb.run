import { codejar } from "./mod.ts";
import { lastlogin } from "@pomdtr/lastlogin";

const app = codejar();

export default {
    fetch: lastlogin(app.fetch, {
        private: true,
        verifyEmail: (email) => {
            return email === Deno.env.get("EMAIL");
        },
    }),
};
