import { Codejar } from "@pomdtr/smallweb-codejar";
import { lastlogin } from "@pomdtr/lastlogin";

const codejar = new Codejar("..");
export default {
    fetch: lastlogin(codejar.fetch, {
        private: true,
        verifyEmail: (email) => {
            return email === Deno.env.get("EMAIL");
        },
    }),
};
